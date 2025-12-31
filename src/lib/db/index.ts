import knex, { type Knex } from 'knex';
import { Ability } from './ability/index.js';
import { Attack } from './attack/index.js';
import { Class } from './character/class.js';
import { Culture } from './character/culture.js';
import { Race } from './character/race.js';
import { Subclass } from './character/subclass.js';
import { Subrace } from './character/subrace.js';
import { StatusEffect } from './status-effect/index.js';
import { GenericStringTable } from './stringtable/index.js';
import { ClassUnlock } from './progression/class.js';
import { RaceUnlock } from './progression/race.js';
import { SubclassUnlock } from './progression/subclass.js';
import { SubraceUnlock } from './progression/subrace.js';
import { RecoveryTime } from './ability/recovery-time.js';
import { BaseStats } from './character/base-stats.js';
import { StatusEffectManager } from './status-effect/manager.js';
import { Interval } from './status-effect/interval.js';
import { Item, ItemMod } from './items/index.js';
import type { Tables } from 'knex/types/tables.js';

export interface DeadfireDb {
  abilities: Ability;
  attacks: Attack;
  cultures: Culture;
  classes: Class;
  races: Race;
  subclasses: Subclass;
  subraces: Subrace;
  statusEffects: StatusEffect;
  classUnlocks: ClassUnlock;
  raceUnlocks: RaceUnlock;
  subclassUnlocks: SubclassUnlock;
  subraceUnlocks: SubraceUnlock;
  recoveryTimes: RecoveryTime;
  baseStats: BaseStats;
  intervals: Interval;
  statusEffectManager: StatusEffectManager;
  items: Item;
  itemMods: ItemMod;

  abilityStrings: GenericStringTable;
  cyclopediaStrings: GenericStringTable;
  guiStrings: GenericStringTable;
  statusEffectStrings: GenericStringTable;
  itemStrings: GenericStringTable;
  itemModStrings: GenericStringTable;
  characterStrings: GenericStringTable;

  [Symbol.asyncDispose](): Promise<void>;
}

let dbWrapper: { knex: Knex; db: DeadfireDb } | undefined;

async function createTables(knex: Knex) {
  const names: Record<keyof Tables, true> = {
    races: true,
    subraces: true,
    classes: true,
    subclasses: true,
    cultures: true,
    baseStats: true,
    abilities: true,
    attacks: true,
    items: true,
    item_mods: true,
    status_effects: true,
    class_unlocks: true,
    race_unlocks: true,
    subclass_unlocks: true,
    subrace_unlocks: true,
    recovery_times: true,
    intervals: true,
    status_effect_manager: true,
    ability_strings: true,
    cyclopedia_strings: true,
    gui_strings: true,
    status_effect_strings: true,
    item_strings: true,
    item_mod_strings: true,
    character_strings: true,
  };

  for (const name of Object.keys(names)) {
    await knex.schema.createTable(name, (table) => {
      table.string('id').primary();
      table.jsonb('data').notNullable();
    });
  }
}

export async function DeadfireDb(opts?: { init?: boolean }): Promise<DeadfireDb> {
  if (dbWrapper) {
    return dbWrapper.db;
  }

  const knex_ = knex({
    client: 'better-sqlite3',
    connection: {
      filename: 'deadfire.db',
    },
    useNullAsDefault: true,
    postProcessResponse(result) {
      if (Array.isArray(result)) {
        return result.map((row) => parseJsonFields(row));
      }

      if (result && typeof result === 'object') {
        return parseJsonFields(result);
      }

      return result;
    },
  });

  if (opts?.init) {
    await createTables(knex_);
  }

  const db: DeadfireDb = {
    abilities: new Ability(knex_),
    attacks: new Attack(knex_),
    cultures: new Culture(knex_),
    classes: new Class(knex_),
    races: new Race(knex_),
    subclasses: new Subclass(knex_),
    subraces: new Subrace(knex_),
    statusEffects: new StatusEffect(knex_),
    classUnlocks: new ClassUnlock(knex_),
    raceUnlocks: new RaceUnlock(knex_),
    subclassUnlocks: new SubclassUnlock(knex_),
    baseStats: new BaseStats(knex_),
    recoveryTimes: new RecoveryTime(knex_),
    intervals: new Interval(knex_),
    itemMods: new ItemMod(knex_),
    items: new Item(knex_),
    statusEffectManager: new StatusEffectManager(knex_),
    subraceUnlocks: new SubraceUnlock(knex_),

    characterStrings: new GenericStringTable(knex_, 'character_strings'),
    itemStrings: new GenericStringTable(knex_, 'item_strings'),
    itemModStrings: new GenericStringTable(knex_, 'item_mod_strings'),
    abilityStrings: new GenericStringTable(knex_, 'ability_strings'),
    cyclopediaStrings: new GenericStringTable(knex_, 'cyclopedia_strings'),
    guiStrings: new GenericStringTable(knex_, 'gui_strings'),
    statusEffectStrings: new GenericStringTable(knex_, 'status_effect_strings'),

    async [Symbol.asyncDispose]() {
      knex_.destroy();
    },
  };

  dbWrapper = { knex: knex_, db };

  return db;
}

function parseJsonFields(row: object) {
  if (!row) return row;

  const parsed: Record<string, unknown> = { ...row };

  // List your JSON columns here
  const jsonColumns = ['data'];

  for (const col of jsonColumns) {
    if (parsed[col] && typeof parsed[col] === 'string') {
      parsed[col] = JSON.parse(parsed[col]);
    }
  }

  return parsed;
}
