import { db } from '$lib/server/db';
import {
	excludedNames,
	gameConfig,
	nameAppearances,
	nameBattles,
	names,
	playerGames,
} from '$lib/server/db/schema';
import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';

/**
 * Get the next battle for Phase 1
 * Selects two names that:
 * - Match the game's name type
 * - Haven't been excluded by this player
 * - Haven't reached the appearance limit (if they haven't won)
 * - Are different from each other
 */
export async function getNextPhase1Battle(playerGameId: number) {
	// Get player game
	const [playerGame] = await db
		.select()
		.from(playerGames)
		.where(eq(playerGames.id, playerGameId))
		.limit(1);

	if (!playerGame) {
		throw new Error('Player game not found');
	}

	if (playerGame.currentPhase !== 1) {
		throw new Error('Not in Phase 1');
	}

	// Get game
	const [game] = await db
		.select()
		.from(games)
		.where(eq(games.id, playerGame.gameId))
		.limit(1);

	if (!game) {
		throw new Error('Game not found');
	}

	// Get game config
	const [config] = await db
		.select()
		.from(gameConfig)
		.where(eq(gameConfig.gameId, game.id))
		.limit(1);

	const maxAppearances = config?.maxPhase1Appearances ?? 3;

	// Get excluded name IDs for this player
	const excluded = await db
		.select({ nameId: excludedNames.nameId })
		.from(excludedNames)
		.where(eq(excludedNames.playerGameId, playerGameId));

	const excludedIds = excluded.map((e) => e.nameId);

	// Get all names that match the game type and aren't excluded
	const whereConditions = [eq(names.nameType, game.nameType)];
	if (excludedIds.length > 0) {
		whereConditions.push(notInArray(names.id, excludedIds));
	}
	const availableNames = await db
		.select()
		.from(names)
		.where(and(...whereConditions));

	if (availableNames.length < 2) {
		return null; // Not enough names for a battle
	}

	// Get appearance counts for all available names
	const appearances = await db
		.select()
		.from(nameAppearances)
		.where(
			and(
				eq(nameAppearances.playerGameId, playerGameId),
				inArray(
					nameAppearances.nameId,
					availableNames.map((n) => n.id),
				),
			),
		);

	const appearanceMap = new Map(
		appearances.map((a) => [a.nameId, { count: a.appearanceCount, hasWon: a.hasWon }]),
	);

	// Filter names that can still appear
	// A name can appear if:
	// - It has won at least once (hasWon = true), OR
	// - It hasn't reached the max appearance limit
	const eligibleNames = availableNames.filter((name) => {
		const appearance = appearanceMap.get(name.id);
		if (!appearance) return true; // Never appeared, can appear
		if (appearance.hasWon) return true; // Has won, can appear unlimited times
		return appearance.count < maxAppearances; // Hasn't won but under limit
	});

	if (eligibleNames.length < 2) {
		return null; // Not enough eligible names
	}

	// Select two random names
	const shuffled = [...eligibleNames].sort(() => Math.random() - 0.5);
	const name1 = shuffled[0];
	const name2 = shuffled[1];

	return {
		name1: { id: name1.id, name: name1.name },
		name2: { id: name2.id, name: name2.name },
	};
}

/**
 * Submit a Phase 1 battle result
 */
export async function submitPhase1Battle(
	playerGameId: number,
	name1Id: number,
	name2Id: number,
	winnerId: number | null,
	doomSelected: boolean,
) {
	// Validate input
	if (doomSelected && winnerId !== null) {
		throw new Error('Cannot have both winner and DOOM selected');
	}
	if (!doomSelected && winnerId === null) {
		throw new Error('Must select either winner or DOOM');
	}
	if (winnerId !== null && winnerId !== name1Id && winnerId !== name2Id) {
		throw new Error('Winner must be one of the battle names');
	}

	// Get player game
	const [playerGame] = await db
		.select()
		.from(playerGames)
		.where(eq(playerGames.id, playerGameId))
		.limit(1);

	if (!playerGame) {
		throw new Error('Player game not found');
	}

	if (playerGame.currentPhase !== 1) {
		throw new Error('Not in Phase 1');
	}

	// Get the current battle round (count existing battles in phase 1)
	const battleCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(nameBattles)
		.where(and(eq(nameBattles.playerGameId, playerGameId), eq(nameBattles.phase, 1)));

	const battleRound = Number(battleCount[0]?.count ?? 0) + 1;

	// Create battle record
	const [battle] = await db
		.insert(nameBattles)
		.values({
			playerGameId,
			name1Id,
			name2Id,
			phase: 1,
			winnerId: doomSelected ? null : winnerId,
			doomSelected,
			battleRound,
		})
		.returning();

	// Update name appearances
	await updateNameAppearances(playerGameId, name1Id, winnerId === name1Id);
	await updateNameAppearances(playerGameId, name2Id, winnerId === name2Id);

	// If DOOM selected, exclude both names
	if (doomSelected) {
		await db.insert(excludedNames).values({
			playerGameId,
			nameId: name1Id,
			battleId: battle.id,
		});
		await db.insert(excludedNames).values({
			playerGameId,
			nameId: name2Id,
			battleId: battle.id,
		});
	}

	return battle;
}

/**
 * Update name appearance tracking
 */
async function updateNameAppearances(
	playerGameId: number,
	nameId: number,
	isWinner: boolean,
) {
	const [existing] = await db
		.select()
		.from(nameAppearances)
		.where(
			and(
				eq(nameAppearances.playerGameId, playerGameId),
				eq(nameAppearances.nameId, nameId),
			),
		)
		.limit(1);

	if (existing) {
		await db
			.update(nameAppearances)
			.set({
				appearanceCount: existing.appearanceCount + 1,
				hasWon: existing.hasWon || isWinner,
				updatedAt: new Date(),
			})
			.where(eq(nameAppearances.id, existing.id));
	} else {
		await db.insert(nameAppearances).values({
			playerGameId,
			nameId,
			appearanceCount: 1,
			hasWon: isWinner,
		});
	}
}

/**
 * Get Phase 1 progress for a player
 */
export async function getPhase1Progress(playerGameId: number) {
	const [playerGame] = await db
		.select()
		.from(playerGames)
		.where(eq(playerGames.id, playerGameId))
		.limit(1);

	if (!playerGame) {
		throw new Error('Player game not found');
	}

	// Get game config
	const [config] = await db
		.select()
		.from(gameConfig)
		.where(eq(gameConfig.gameId, playerGame.gameId))
		.limit(1);

	const maxAppearances = config?.maxPhase1Appearances ?? 3;

	// Count total battles
	const battles = await db
		.select({ count: sql<number>`count(*)` })
		.from(nameBattles)
		.where(and(eq(nameBattles.playerGameId, playerGameId), eq(nameBattles.phase, 1)));

	const totalBattles = Number(battles[0]?.count ?? 0);

	// Count names that have won (eligible for Phase 2)
	const winners = await db
		.select({ count: sql<number>`count(distinct ${nameBattles.winnerId})` })
		.from(nameBattles)
		.where(
			and(
				eq(nameBattles.playerGameId, playerGameId),
				eq(nameBattles.phase, 1),
				sql`${nameBattles.winnerId} IS NOT NULL`,
			),
		);

	const namesWithWins = Number(winners[0]?.count ?? 0);

	// Count excluded names
	const excluded = await db
		.select({ count: sql<number>`count(*)` })
		.from(excludedNames)
		.where(eq(excludedNames.playerGameId, playerGameId));

	const excludedCount = Number(excluded[0]?.count ?? 0);

	return {
		totalBattles,
		namesWithWins,
		excludedCount,
		maxAppearances,
	};
}

