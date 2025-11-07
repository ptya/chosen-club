import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNextPhase1Battle } from '$lib/server/utils/phase1';
import { db } from '$lib/server/db';
import { playerGames } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const gameId = parseInt(params.id);
		if (isNaN(gameId)) {
			return error(400, { message: 'Invalid game ID' });
		}

		// TODO: Get user email from authentication (locals.user?.email)
		// For now, we'll need to get playerGameId from the request or use a different approach
		// This is a placeholder - in production, you'd get this from the authenticated user
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

		const battle = await getNextPhase1Battle(playerGame.id);

		if (!battle) {
			return json({ battle: null, message: 'No more battles available' });
		}

		return json({ battle });
	} catch (err) {
		console.error('Error getting next battle:', err);
		if (err instanceof Error) {
			if (err.message === 'Player game not found') {
				return error(404, { message: err.message });
			}
			if (err.message === 'Not in Phase 1') {
				return error(400, { message: err.message });
			}
		}
		return error(500, { message: 'Internal server error' });
	}
};

