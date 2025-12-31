import { DeadfireDb } from '$lib/db/index.js';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const subclasses = await (await DeadfireDb()).subclasses.getAll();

  return json(subclasses.map((s) => s.data));
};
