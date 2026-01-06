import { DeadfireDbInstance } from '$lib/server/db-instance.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const subclasses = await db.subclasses.getAll();

  return json(subclasses.map((s) => s.data));
};
