import { type InferSelectModel, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, serial, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
	email: varchar('email', { length: 255 }).primaryKey().notNull(),
	name: varchar('name', { length: 255 }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Games table
export const games = pgTable(
	'games',
	{
		id: serial('id').primaryKey(),
		nameType: varchar('name_type', { length: 10 }).notNull(),
		createdBy: varchar('created_by', { length: 255 })
			.notNull()
			.references(() => users.email),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
		status: varchar('status', { length: 20 }).notNull().default('active'),
	},
	(table) => [
		check('name_type_check', sql`${table.nameType} IN ('boy', 'girl')`),
		check('status_check', sql`${table.status} IN ('active', 'completed', 'abandoned')`),
		index('idx_games_created_by').on(table.createdBy),
		index('idx_games_status').on(table.status),
	],
);

// Pairs table
export const pairs = pgTable(
	'pairs',
	{
		id: serial('id').primaryKey(),
		user1Email: varchar('user1_email', { length: 255 })
			.notNull()
			.references(() => users.email),
		user2Email: varchar('user2_email', { length: 255 })
			.notNull()
			.references(() => users.email),
		gameId: integer('game_id')
			.notNull()
			.references(() => games.id),
		status: varchar('status', { length: 20 }).notNull().default('pending'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [
		check('status_check', sql`${table.status} IN ('pending', 'active', 'dissolved')`),
		check('different_users', sql`${table.user1Email} != ${table.user2Email}`),
		unique('unique_pair_game').on(table.user1Email, table.user2Email, table.gameId),
		index('idx_pairs_user1').on(table.user1Email),
		index('idx_pairs_user2').on(table.user2Email),
		index('idx_pairs_game').on(table.gameId),
	],
);

// Pair invitations table
export const pairInvitations = pgTable(
	'pair_invitations',
	{
		id: serial('id').primaryKey(),
		inviterEmail: varchar('inviter_email', { length: 255 })
			.notNull()
			.references(() => users.email),
		inviteeEmail: varchar('invitee_email', { length: 255 }).notNull(),
		gameId: integer('game_id')
			.notNull()
			.references(() => games.id),
		token: varchar('token', { length: 255 }).notNull().unique(),
		status: varchar('status', { length: 20 }).notNull().default('pending'),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		acceptedAt: timestamp('accepted_at'),
	},
	(table) => [
		check('status_check', sql`${table.status} IN ('pending', 'accepted', 'rejected', 'expired')`),
		index('idx_invitations_token').on(table.token),
		index('idx_invitations_inviter').on(table.inviterEmail),
		index('idx_invitations_email').on(table.inviteeEmail),
	],
);

// Names table
export const names = pgTable(
	'names',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		nameType: varchar('name_type', { length: 10 }).notNull(),
		nationality: varchar('nationality', { length: 2 }).notNull().default('unknown'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		check('name_type_check', sql`${table.nameType} IN ('boy', 'girl')`),
		index('idx_names_type').on(table.nameType),
		index('idx_names_nationality').on(table.nationality),
		unique('idx_names_name_type').on(table.name, table.nameType),
	],
);

// Player games table
export const playerGames = pgTable(
	'player_games',
	{
		id: serial('id').primaryKey(),
		userEmail: varchar('user_email', { length: 255 })
			.notNull()
			.references(() => users.email),
		gameId: integer('game_id')
			.notNull()
			.references(() => games.id),
		pairId: integer('pair_id').references(() => pairs.id),
		currentPhase: integer('current_phase').notNull().default(1),
		phase2ApprovalStatus: varchar('phase2_approval_status', { length: 20 }),
		phase2ApprovalRequestedByEmail: varchar('phase2_approval_requested_by_email', {
			length: 255,
		}).references(() => users.email),
		battleOfChosenActivated: boolean('battle_of_chosen_activated').notNull().default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [
		check(
			'phase2_approval_status_check',
			sql`${table.phase2ApprovalStatus} IS NULL OR ${table.phase2ApprovalStatus} IN ('requested', 'approved', 'denied')`,
		),
		unique('unique_user_game').on(table.userEmail, table.gameId),
		index('idx_player_games_user').on(table.userEmail),
		index('idx_player_games_game').on(table.gameId),
		index('idx_player_games_pair').on(table.pairId),
	],
);

// Name battles table
export const nameBattles = pgTable(
	'name_battles',
	{
		id: serial('id').primaryKey(),
		playerGameId: integer('player_game_id')
			.notNull()
			.references(() => playerGames.id),
		name1Id: integer('name1_id')
			.notNull()
			.references(() => names.id),
		name2Id: integer('name2_id')
			.notNull()
			.references(() => names.id),
		phase: integer('phase').notNull(),
		winnerId: integer('winner_id').references(() => names.id),
		doomSelected: boolean('doom_selected').notNull().default(false),
		battleRound: integer('battle_round').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		check('different_names', sql`${table.name1Id} != ${table.name2Id}`),
		check(
			'winner_or_doom',
			sql`(${table.winnerId} IS NOT NULL AND ${table.doomSelected} = false) OR (${table.winnerId} IS NULL AND ${table.doomSelected} = true)`,
		),
		index('idx_battles_player_game').on(table.playerGameId),
		index('idx_battles_phase').on(table.phase),
		index('idx_battles_winner').on(table.winnerId),
	],
);

// Name appearances table
export const nameAppearances = pgTable(
	'name_appearances',
	{
		id: serial('id').primaryKey(),
		playerGameId: integer('player_game_id')
			.notNull()
			.references(() => playerGames.id),
		nameId: integer('name_id')
			.notNull()
			.references(() => names.id),
		appearanceCount: integer('appearance_count').notNull().default(0),
		hasWon: boolean('has_won').notNull().default(false),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [
		unique('unique_player_game_name').on(table.playerGameId, table.nameId),
		index('idx_appearances_player_game').on(table.playerGameId),
		index('idx_appearances_name').on(table.nameId),
	],
);

// Excluded names table
export const excludedNames = pgTable(
	'excluded_names',
	{
		id: serial('id').primaryKey(),
		playerGameId: integer('player_game_id')
			.notNull()
			.references(() => playerGames.id),
		nameId: integer('name_id')
			.notNull()
			.references(() => names.id),
		excludedAt: timestamp('excluded_at').notNull().defaultNow(),
		battleId: integer('battle_id').references(() => nameBattles.id),
	},
	(table) => [
		unique('unique_player_game_excluded_name').on(table.playerGameId, table.nameId),
		index('idx_excluded_player_game').on(table.playerGameId),
		index('idx_excluded_name').on(table.nameId),
	],
);

// Chosen ones table
export const chosenOnes = pgTable(
	'chosen_ones',
	{
		id: serial('id').primaryKey(),
		pairId: integer('pair_id')
			.notNull()
			.references(() => pairs.id),
		nameId: integer('name_id')
			.notNull()
			.references(() => names.id),
		phase: integer('phase').notNull(),
		markedAt: timestamp('marked_at').notNull().defaultNow(),
	},
	(table) => [
		unique('unique_pair_chosen_name').on(table.pairId, table.nameId),
		index('idx_chosen_pair').on(table.pairId),
		index('idx_chosen_name').on(table.nameId),
	],
);

// Tournament brackets table
// @ts-expect-error - Self-reference in parentBracketId causes TypeScript inference issue, but works at runtime
export const tournamentBrackets = pgTable(
	'tournament_brackets',
	{
		id: serial('id').primaryKey(),
		playerGameId: integer('player_game_id')
			.notNull()
			.references(() => playerGames.id),
		phase: integer('phase').notNull(),
		round: integer('round').notNull(),
		nameId: integer('name_id')
			.notNull()
			.references(() => names.id),
		position: integer('position').notNull(),
		status: varchar('status', { length: 20 }).notNull().default('active'),
		// Self-reference for parent bracket (loser's bracket)
		parentBracketId: integer('parent_bracket_id').references(
			// @ts-expect-error - Self-reference causes TypeScript inference issue
			() => tournamentBrackets.id,
		),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		check('status_check', sql`${table.status} IN ('active', 'winner', 'loser', 'eliminated')`),
		index('idx_brackets_player_game').on(table.playerGameId),
		index('idx_brackets_phase_round').on(table.phase, table.round),
		index('idx_brackets_name').on(table.nameId),
	],
);

// Game config table
export const gameConfig = pgTable(
	'game_config',
	{
		id: serial('id').primaryKey(),
		gameId: integer('game_id')
			.notNull()
			.references(() => games.id)
			.unique(),
		maxPhase1Appearances: integer('max_phase1_appearances').notNull().default(3),
		chosenOneThreshold: integer('chosen_one_threshold').notNull().default(6),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [index('idx_config_game').on(table.gameId)],
);

// League stats table
export const leagueStats = pgTable(
	'league_stats',
	{
		id: serial('id').primaryKey(),
		userEmail: varchar('user_email', { length: 255 })
			.notNull()
			.references(() => users.email),
		gameId: integer('game_id')
			.notNull()
			.references(() => games.id),
		totalBattles: integer('total_battles').notNull().default(0),
		namesEliminated: integer('names_eliminated').notNull().default(0),
		chosenOnesCount: integer('chosen_ones_count').notNull().default(0),
		currentRank: integer('current_rank'),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => [
		index('idx_league_user_game').on(table.userEmail, table.gameId),
		index('idx_league_rank').on(table.currentRank),
	],
);

// Type exports
export type User = InferSelectModel<typeof users>;
export type Game = InferSelectModel<typeof games>;
export type Pair = InferSelectModel<typeof pairs>;
export type PairInvitation = InferSelectModel<typeof pairInvitations>;
export type Name = InferSelectModel<typeof names>;
export type PlayerGame = InferSelectModel<typeof playerGames>;
export type NameBattle = InferSelectModel<typeof nameBattles>;
export type NameAppearance = InferSelectModel<typeof nameAppearances>;
export type ExcludedName = InferSelectModel<typeof excludedNames>;
export type ChosenOne = InferSelectModel<typeof chosenOnes>;
export type TournamentBracket = InferSelectModel<typeof tournamentBrackets>;
export type GameConfig = InferSelectModel<typeof gameConfig>;
export type LeagueStat = InferSelectModel<typeof leagueStats>;
