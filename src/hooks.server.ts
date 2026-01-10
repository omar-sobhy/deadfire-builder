import { DeadfireDbInstance } from '$lib/server/db-instance.js';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
  await DeadfireDbInstance();
};
