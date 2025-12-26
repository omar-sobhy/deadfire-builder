import 'fake-indexeddb/auto';

import { wrap, type IDBPDatabase } from 'idb';
import type { DbKeys, DeadfireDb } from '../src/types/indexed-db.js';
import {
  parseAbilities,
  parseCharacters,
  parseItems,
  parseProgression,
  parseStatusEffects,
  parseStringTables,
} from '$lib/parsing/index.js';

export async function initDb(): Promise<IDBPDatabase<DeadfireDb>> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('deadfire', 2);

    request.onupgradeneeded = async () => {
      const db = wrap(request.result) as IDBPDatabase<DeadfireDb>;

      const names: (DbKeys | { name: DbKeys; indexes: { name: string; key: string }[] })[] = [
        'guiStrings',
        'abilityStrings',
        'itemStrings',
        'itemModStrings',
        'statusEffectStrings',
        'characterStrings',
        'cyclopediaStrings',

        { name: 'abilities', indexes: [{ name: 'by-name', key: 'displayName' }] },
        'baseStats',
        { name: 'classes', indexes: [{ name: 'by-name', key: 'displayName' }] },
        { name: 'subclasses', indexes: [{ name: 'by-name', key: 'displayName' }] },
        { name: 'cultures', indexes: [{ name: 'by-name', key: 'displayName' }] },
        { name: 'items', indexes: [{ name: 'by-name', key: 'displayName' }] },
        'itemMods',
        { name: 'races', indexes: [{ name: 'by-name', key: 'displayName' }] },
        { name: 'subraces', indexes: [{ name: 'by-name', key: 'displayName' }] },
        'statusEffects',
        'classUnlocks',
        'subclassUnlocks',
        'raceUnlocks',
        'subraceUnlocks',
      ] as const;

      names.forEach((n) => {
        const name = typeof n === 'string' ? n : n.name;

        const store = db.objectStoreNames.contains(name)
          ? request.transaction!.objectStore(name)
          : request.result.createObjectStore(name);

        if (typeof n === 'object') {
          for (const i of n.indexes) store.createIndex(i.name, i.key);
        }
      });

      await parseStringTables(db);

      const fns = [
        ['abilities', parseAbilities],
        ['progression', parseProgression],
        ['characters', parseCharacters],
        ['items', parseItems],
        ['status-effects', parseStatusEffects],
      ] as const;

      for (const [, fn] of fns) {
        await fn(db);
      }

      resolve(db);
    };

    request.onerror = (e) => reject(e);
  });
}
