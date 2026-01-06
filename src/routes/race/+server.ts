import { DeadfireDbInstance } from '$lib/server/db-instance.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const races = await db.races.getAll();

  return json(races.map((r) => r.data));
};
