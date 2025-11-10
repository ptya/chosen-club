import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { playerGames } from '$lib/server/db/schema';
import { submitPhase1Battle } from '$lib/server/utils/phase1';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const gameId = parseInt(params.id);
		if (isNaN(gameId)) {
			return error(400, { message: 'Invalid game ID' });
		}

		// TODO: Get user email from authentication (locals.user?.email)
		const userEmail = locals.user?.email || '';

		if (!userEmail) {
			return error(401, { message: 'Unauthorized' });
		}

		// Get player game for this user and game
		const [playerGame] = await db
			.select()
			.from(playerGames)
			.where(and(eq(playerGames.gameId, gameId), eq(playerGames.userEmail, userEmail)))
			.limit(1);

		if (!playerGame) {
			return error(404, { message: 'Player game not found' });
		}

		const body = await request.json();
		const { name1Id, name2Id, winnerId, doomSelected } = body;

		// Validate input
		if (typeof name1Id !== 'number' || typeof name2Id !== 'number') {
			return error(400, { message: 'Invalid name IDs' });
		}

		if (name1Id === name2Id) {
			return error(400, { message: 'Name IDs must be different' });
		}

		if (doomSelected && winnerId !== null) {
			return error(400, { message: 'Cannot have both winner and DOOM selected' });
		}

		if (!doomSelected && winnerId === null) {
			return error(400, { message: 'Must select either winner or DOOM' });
		}

		if (winnerId !== null && winnerId !== name1Id && winnerId !== name2Id) {
			return error(400, { message: 'Winner must be one of the battle names' });
		}

		const battle = await submitPhase1Battle(playerGame.id, name1Id, name2Id, winnerId, doomSelected);

		return json({ battle, message: 'Battle submitted successfully' });
	} catch (err) {
		console.error('Error submitting battle:', err);
		if (err instanceof Error) {
			if (err.message === 'Player game not found') {
				return error(404, { message: err.message });
			}
			if (err.message === 'Not in Phase 1') {
				return error(400, { message: err.message });
			}
			if (
				err.message.includes('Cannot have both') ||
				err.message.includes('Must select') ||
				err.message.includes('Winner must be')
			) {
				return error(400, { message: err.message });
			}
		}
		return error(500, { message: 'Internal server error' });
	}
};
