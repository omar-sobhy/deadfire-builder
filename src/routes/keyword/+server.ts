import { DeadfireDb } from '$lib/db/sqlite/index.js';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
  const body = await request.json();

  if (typeof body !== 'object' || body === null || !('ids' in body) || !Array.isArray(body.ids)) {
    error(400, 'Expected an array of IDs');
  }

  const db = await DeadfireDb();
};
