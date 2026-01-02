import { DeadfireDbInstance } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const cultures = await db.cultures.getAll();

  return json(cultures.map((c) => c.data));
};
