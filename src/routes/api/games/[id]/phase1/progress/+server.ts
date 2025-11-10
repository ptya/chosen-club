import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { playerGames } from '$lib/server/db/schema';
import { getPhase1Progress } from '$lib/server/utils/phase1';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
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

		const progress = await getPhase1Progress(playerGame.id);

		return json({ progress });
	} catch (err) {
		console.error('Error getting progress:', err);
		if (err instanceof Error) {
			if (err.message === 'Player game not found') {
				return error(404, { message: err.message });
			}
		}
		return error(500, { message: 'Internal server error' });
	}
};
