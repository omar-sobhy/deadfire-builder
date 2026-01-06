import { DeadfireDbInstance } from '$lib/server/db-instance.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const subraces = await db.subraces.getAll();

  return json(subraces.map((s) => s.data));
};
