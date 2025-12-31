import { DeadfireDb } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const subraces = await (await DeadfireDb()).subraces.getAll();

  return json(subraces.map((s) => s.data));
};
