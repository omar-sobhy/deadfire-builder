import { DeadfireDbInstance } from '$lib/db/index.js';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const db = await DeadfireDbInstance();

  const body: unknown = await request.json();

  if (typeof body !== 'object' || body === null || !('ids' in body) || !Array.isArray(body.ids)) {
    error(400, 'Expected an array of IDs');
  }

  const statuses = await db.statusEffects.getAll({ ids: body.ids as string[] });

  return json(statuses.map((s) => s.data));
};
