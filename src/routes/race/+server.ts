import { DeadfireDb } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const races = await (await DeadfireDb()).races.getAll();

  return json(races.map((r) => r.data));
};
