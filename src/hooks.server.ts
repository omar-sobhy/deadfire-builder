import { initDb } from '$lib/db/index.js';
import { Logger } from '$lib/utils.js';
import { building } from '$app/environment';

if (!building) {
  Logger.getInstance().log('Initializing db...');

  await initDb();

  Logger.getInstance().log('Done initializing.');
}
