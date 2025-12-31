import { DeadfireDb } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const cultures = await (await DeadfireDb()).cultures.getAll();

  return json(cultures.map((c) => c.data));
};
