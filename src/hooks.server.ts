import { initDb } from '$lib/db/index.js';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
  await initDb();
};
