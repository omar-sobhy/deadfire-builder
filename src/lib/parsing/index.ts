import { BaseStatsParser } from '$lib/parsing/parsers/character/base-stats.parser.js';
import { ClassParser } from '$lib/parsing/parsers/character/class.parser.js';
import { CultureParser } from '$lib/parsing/parsers/character/culture.parser.js';
import { RaceParser } from '$lib/parsing/parsers/character/race.parser.js';
import { SubclassParser } from '$lib/parsing/parsers/character/subclass.parser.js';
import { SubraceParser } from '$lib/parsing/parsers/character/subrace.parser.js';
import { GenericAbilityParser } from './parsers/ability/generic-ability.parser.js';
import { PhraseParser } from './parsers/ability/phrase.parser.js';
import { StatusEffectParser } from './parsers/status-effect/status-effect.parser.js';
import { AfflictionParser } from './parsers/status-effect/affliction.parser.js';
import { IntervalRateParser } from './parsers/status-effect/interval-rate.parser.js';
import { ChangeFormEffectParser } from './parsers/status-effect/change-form-effect.parser.js';
import { StatusEffectManagerParser } from './parsers/status-effect/status-effect-game-manager.parser.js';
import { WeaponParser } from './parsers/item/weapon.js';
import { EquippableParser } from './parsers/item/equippable.js';
import { ItemModParser } from './parsers/item/item-mod.js';
import type { DeadfireDb } from '$lib/db/index.js';
import { UnlockParser } from './parsers/progression/index.js';
import { Parser } from './parsers/parser.js';
import { Logger } from '$lib/utils.js';

export type GameDataFile = {
  GameDataObjects: unknown[];
};

export async function parseAbilities(db: DeadfireDb, abilities: GameDataFile) {
  const parsers = [new PhraseParser(db), new GenericAbilityParser(db)];

  for (const o of abilities.GameDataObjects) {
    for (const p of parsers) {
      if (p.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.parseDtos();
  }

  Logger.getInstance().log('[Ability] Saving...');
  await db.abilities.put(Parser.packDtos(Parser.context.abilities));
}

export async function parseCharacters(db: DeadfireDb, characters: GameDataFile) {
  const parsers = [
    new BaseStatsParser(db),
    new ClassParser(db),
    new CultureParser(db),
    new RaceParser(db),
    new SubclassParser(db),
    new SubraceParser(db),
  ];

  for (const o of characters.GameDataObjects) {
    for (const p of parsers) {
      if (p.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.parseDtos();
  }

  const data = [
    {
      name: 'BaseStats',
      model: db.baseStats,
      data: Parser.context.baseStats,
    },
    {
      name: 'Culture',
      model: db.cultures,
      data: Parser.context.cultures,
    },
    {
      name: 'Class',
      model: db.classes,
      data: Parser.context.classes,
    },
    {
      name: 'Race',
      model: db.races,
      data: Parser.context.races,
    },
    {
      name: 'Subclass',
      model: db.subclasses,
      data: Parser.context.subclasses,
    },
    {
      name: 'Subrace',
      model: db.subraces,
      data: Parser.context.subraces,
    },
  ] as const;

  for (const { name, model, data: d } of data) {
    Logger.getInstance().log(`[${name}] Saving...`);
    // @ts-expect-error hack to generically use parser stuff
    await model.put(Parser.packDtos(d));
  }
}

export async function parseItems(db: DeadfireDb, items: GameDataFile) {
  const parsers = [new WeaponParser(db), new EquippableParser(db), new ItemModParser(db)];

  for (const o of items.GameDataObjects) {
    for (const p of parsers) {
      if (p.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.parseDtos();
  }

  Logger.getInstance().log(`[Item] Saving...`);
  await db.items.put(Parser.packDtos(Parser.context.items));

  Logger.getInstance().log(`[ItemMod] Saving...`);
  await db.itemMods.put(Parser.packDtos(Parser.context.itemMods));
}

export async function parseProgression(db: DeadfireDb, progressionTables: GameDataFile) {
  const parser = new UnlockParser(db);

  for (const o of progressionTables.GameDataObjects) {
    parser.parseAndPush(o);
  }

  await parser.parseDtos();

  Logger.getInstance().log(`[Progression] Saving...`);
  await db.classUnlocks.put(Parser.packDtos(Parser.context.classUnlocks));
  await db.raceUnlocks.put(Parser.packDtos(Parser.context.raceUnlocks));
  await db.subclassUnlocks.put(Parser.packDtos(Parser.context.subclassUnlocks));
  await db.subraceUnlocks.put(Parser.packDtos(Parser.context.subraceUnlocks));
}

export async function parseStatusEffects(db: DeadfireDb, statusEffects: GameDataFile) {
  const parsers = [
    new StatusEffectManagerParser(db),
    new IntervalRateParser(db),
    new StatusEffectParser(db),
    new AfflictionParser(db),
    new ChangeFormEffectParser(db),
  ];

  for (const o of statusEffects.GameDataObjects) {
    for (const parser of parsers) {
      if (parser.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.parseDtos();
  }

  Logger.getInstance().log(`[StatusEffectManager] Saving...`);
  await db.statusEffectManager.put(Parser.packDtos(Parser.context.statusEffectManager));

  Logger.getInstance().log(`[Interval] Saving...`);
  await db.intervals.put(Parser.packDtos(Parser.context.intervals));

  Logger.getInstance().log(`[StatusEffect] Saving...`);
  await db.statusEffects.put(Parser.packDtos(Parser.context.statusEffects));
}

// export async function parseStringTables(
//   db: DeadfireDb,
//   tables: { name: string; data: ParsedStringTable }[],
// ) {
//   const names = [
//     'gui.stringtable.json',
//     'abilities.stringtable.json',
//     'items.stringtable.json',
//     'itemmods.stringtable.json',
//     'statuseffects.stringtable.json',
//     'cyclopedia.stringtable.json',
//   ] as const;

//   const stores = [
//     db.guiStrings,
//     db.abilityStrings,
//     db.itemStrings,
//     db.itemModStrings,
//     db.statusEffectStrings,
//     db.cyclopediaStrings,
//   ];

//   for (let i = 0; i < tables.length; ++i) {
//     const table = tables.find((t) => t.name === names[i]);
//     if (!table) continue;

//     const store = stores[i];

//     for (const e of table.data.StringTableFile.Entries.Entry) {
//       await store.put({ id: e.ID, defaultText: e.DefaultText, femaleText: e.FemaleText });
//     }
//   }
// }
