import { DeadfireDb } from '$lib/db/index.js';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body: unknown = await request.json();

  if (typeof body !== 'object' || body === null || !('ids' in body) || !Array.isArray(body.ids)) {
    error(400, 'Expected an array of IDs');
  }

  const statuses = await (await DeadfireDb()).statusEffects.get({ ids: body.ids as string[] });

  return json(statuses.map((s) => s.data));
};
