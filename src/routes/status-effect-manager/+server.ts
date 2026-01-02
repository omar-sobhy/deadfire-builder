import { DeadfireDbInstance } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const entries = await db.statusEffectManager.getAll();

  return json(entries.map((e) => e.data));
};
