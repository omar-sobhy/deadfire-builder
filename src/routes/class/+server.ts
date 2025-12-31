import { DeadfireDb } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const classes = await (await DeadfireDb()).classes.getAll();

  return json(classes.map((c) => c.data));
};
