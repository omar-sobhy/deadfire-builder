import 'fake-indexeddb/auto';

import { type IDBPDatabase } from 'idb';

import { beforeAll, describe, test } from '@jest/globals';
import { initDb } from '../../index.js';
import type { DeadfireDb } from '../../../src/types/indexed-db.js';

let db: IDBPDatabase<DeadfireDb>;

beforeAll(async () => {
  db = await initDb();
});

describe('abilities', () => {
  test('all abilities', () => {});
});
