import { DeadfireDbInstance } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const db = await DeadfireDbInstance();

  const classes = await db.classes.getAll();

  return json(classes.map((c) => c.data));
};
