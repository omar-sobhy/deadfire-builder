import { type IDBPDatabase } from 'idb';
import type { DeadfireDb } from '../../types/index-db.js';
import z from 'zod';
import {
  weaponGameDataSchema,
  type WeaponGameData,
} from '$lib/parsing/schemas/items/weapon.gamedata.js';
import {
  equippableGameDataSchema,
  type EquippableGameData,
} from '$lib/parsing/schemas/items/equippable.gamedata.js';
import {
  itemModGameDataSchema,
  type ItemModGameData,
} from '$lib/parsing/schemas/items/item-mod.gamedata.js';
import { classProgressionGameDataSchema } from '$lib/parsing/schemas/progression/gamedata/class-progression.gamedata.js';
import type { DataScriptEventComponent } from '$lib/parsing/schemas/items/components/data-script-event.component.js';
import type { EquippableComponent } from '$lib/parsing/schemas/items/components/equippable.component.js';
import type { ItemComponent } from '$lib/parsing/schemas/items/components/item-component.js';
import { Logger } from '$lib/utils.js';
import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';
import { conditionalCallSchema } from '$lib/parsing/schemas/progression/components/base-progression.component.js';
import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import type { ParsedStringTable } from '../../types/gamedata/stringtable.js';
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

export async function parseAbilities(db: IDBPDatabase<DeadfireDb>) {
  const abilities = await (await fetch('/gamedata/data/abilities.json')).json();

  const transaction = db.transaction(
    ['abilities', 'guiStrings', 'statusEffects', 'abilityStrings'],
    'readwrite',
  );

  const parsers = [new PhraseParser(transaction), new GenericAbilityParser(transaction)];

  for (const o of abilities.GameDataObjects) {
    for (const p of parsers) {
      if (p.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.toDto();
  }

  await transaction.done;
}

export async function parseCharacters(db: IDBPDatabase<DeadfireDb>) {
  const characters = await (await fetch('/gamedata/data/characters.json')).json();

  const transaction = db.transaction(
    [
      'baseStats',
      'classes',
      'cultures',
      'races',
      'subclasses',
      'subraces',
      'classUnlocks',
      'subraceUnlocks',
      'raceUnlocks',
      'subclassUnlocks',
      'cyclopediaStrings',
      'guiStrings',
    ],
    'readwrite',
  );

  const parsers = [
    new BaseStatsParser(transaction),
    new ClassParser(transaction),
    new CultureParser(transaction),
    new RaceParser(transaction),
    new SubclassParser(transaction),
    new SubraceParser(transaction),
  ];

  for (const o of characters.GameDataObjects) {
    for (const p of parsers) {
      if (p.parseAndPush(o)) break;
    }
  }

  for (const p of parsers) {
    await p.toDto();
  }

  await transaction.done;
}

export async function parseItems(db: IDBPDatabase<DeadfireDb>) {
  const items = await (await fetch('/gamedata/data/items.json')).json();

  const transaction = db.transaction(
    ['items', 'itemMods', 'itemModStrings', 'classes'],
    'readwrite',
  );

  const itemsStore = transaction.objectStore('items');
  const itemModsStore = transaction.objectStore('itemMods');
  const itemModsStrings = transaction.objectStore('itemModStrings');
  const classesStore = transaction.objectStore('classes');

  const weapons: Record<string, WeaponGameData> = {};

  const equippables: Record<
    string,
    {
      type: 'armor' | 'grimoire' | 'shield' | 'soulbind' | 'equippable';
      data: EquippableGameData;
    }
  > = {};

  const itemMods: Record<string, ItemModGameData> = {};

  for (const o of items.GameDataObjects) {
    const weaponParseResult = weaponGameDataSchema.safeParse(o);
    if (weaponParseResult.success) {
      weapons[weaponParseResult.data.ID] = weaponParseResult.data;
      break;
    }

    const equippableParseResult = equippableGameDataSchema.safeParse(o);
    if (equippableParseResult.success) {
      const data = equippableParseResult.data;
      const components = data.Components;
      if (components.length < 2) {
        equippables[data.ID] = { type: 'equippable', data };
        break;
      }

      const component = components.slice(2).find((c) => c?.$type !== 'DataScriptEventComponent');

      if (component) {
        const c = component as Exclude<
          typeof component,
          DataScriptEventComponent | EquippableComponent | ItemComponent
        >;

        switch (c.$type) {
          case 'ArmorComponent':
            equippables[data.ID] = { type: 'armor', data };
            break;
          case 'GrimoireComponent':
            equippables[data.ID] = { type: 'grimoire', data };
            break;
          case 'ShieldComponent':
            equippables[data.ID] = { type: 'shield', data };
            break;
          case 'SoulbindComponent':
            equippables[data.ID] = { type: 'soulbind', data };
            break;
        }
      }
      break;
    }

    const itemModParseResult = itemModGameDataSchema.safeParse(o);
    if (itemModParseResult.success) {
      itemMods[itemModParseResult.data.ID] = itemModParseResult.data;
      break;
    }
  }

  const promises = [];

  for (const m of Object.values(itemMods)) {
    const component = m.Components[0];

    const displayName = await itemModsStrings.get(component.DisplayName);

    const dto: ItemModDto = {
      id: m.ID,
      debugName: m.DebugName,
      displayName: displayName?.defaultText,
    };

    promises.push(await itemModsStore.put(dto, dto.id));
  }

  for (const w of Object.values(weapons)) {
    const component = w.Components[1];

    const classPromises = component.RestrictedToClassIDs.map((c) => classesStore.get(c));
    const classes = await Promise.all(classPromises);
    const classRestrictions = classes.filter((c) => !!c);

    const itemModPromises = component.ItemModsIDs.map((c) => itemModsStore.get(c));
    const itemMods = await Promise.all(itemModPromises);
    const filteredItemMods = itemMods.filter((i) => !!i);

    const dto: ItemDto = {
      type: 'weapon',
      equipmentSlot: component.EquipmentSlot,
      equipmentType: component.EquipmentType,
      itemMods: filteredItemMods,
      classRestrictions,
    };

    promises.push(itemsStore.put(dto, w.ID));
  }

  for (const [, item] of Object.entries(equippables)) {
    const e = item.data;
    const component = e.Components[1];

    const classPromises = component.RestrictedToClassIDs.map((c) => classesStore.get(c));
    const classes = await Promise.all(classPromises);
    const classRestrictions = classes.filter((c) => !!c);

    const itemModPromises = component.ItemModsIDs.map((c) => itemModsStore.get(c));
    const itemMods = await Promise.all(itemModPromises);
    const filteredItemMods = itemMods.filter((i) => !!i);

    const dto: ItemDto = {
      type: item.type,
      equipmentSlot: component.EquipmentSlot,
      equipmentType: component.EquipmentType,
      itemMods: filteredItemMods,
      classRestrictions,
    };

    promises.push(itemsStore.put(dto, e.ID));
  }

  await Promise.all(promises);
  await transaction.done;
}

interface Condition {
  type: 'race' | 'subrace' | 'class' | 'subclass';
  id: string;
}
function parseConditionalCall(
  conditional: z.infer<typeof conditionalCallSchema>,
): Condition | undefined {
  if (conditional.Not) {
    return;
  }

  const name = conditional.Data.FullName;

  const id = conditional.Data.Parameters[0];

  if (name.includes('IsRace')) {
    return { type: 'race', id } as const;
  }

  if (name.includes('IsSubrace')) {
    return { type: 'subrace', id } as const;
  }

  if (name.includes('IsClass')) {
    return { type: 'class', id } as const;
  }

  if (name.includes('IsSubclass')) {
    return { type: 'subclass', id } as const;
  }
}

function pushUnlocks(
  intermediateDto: Omit<AbilityUnlockDto, 'progressionDetails'>,
  conditional: z.infer<typeof conditionalCallSchema>,
  raceUnlocks: Record<string, AbilityUnlockDto[]>,
  subraceUnlocks: Record<string, AbilityUnlockDto[]>,
  classUnlocks: Record<string, AbilityUnlockDto[]>,
  subclassUnlocks: Record<string, AbilityUnlockDto[]>,
) {
  const result = parseConditionalCall(conditional);

  if (!result) {
    if (!classUnlocks[intermediateDto.baseClassId]) classUnlocks[intermediateDto.baseClassId] = [];
    classUnlocks[intermediateDto.baseClassId].push({
      ...intermediateDto,
      progressionDetails: { type: 'class', id: intermediateDto.baseClassId },
    });
    return;
  }

  if (result.type === 'race') {
    if (!raceUnlocks[result.id]) raceUnlocks[result.id] = [];
    raceUnlocks[result.id].push({ ...intermediateDto, progressionDetails: result });
  }

  if (result.type === 'subrace') {
    if (!subraceUnlocks[result.id]) subraceUnlocks[result.id] = [];
    subraceUnlocks[result.id].push({ ...intermediateDto, progressionDetails: result });
  }

  if (result.type === 'class') {
    if (!classUnlocks[result.id]) classUnlocks[result.id] = [];
    classUnlocks[result.id].push({ ...intermediateDto, progressionDetails: result });
  }

  if (result.type === 'subclass') {
    if (!subclassUnlocks[result.id]) subclassUnlocks[result.id] = [];
    subclassUnlocks[result.id].push({ ...intermediateDto, progressionDetails: result });
  }
}

export async function parseProgression(db: IDBPDatabase<DeadfireDb>) {
  const progressionTables = await (await fetch('/gamedata/data/progressiontables.json')).json();

  const transaction = db.transaction(
    ['raceUnlocks', 'subraceUnlocks', 'classUnlocks', 'subclassUnlocks', 'abilities'],
    'readwrite',
  );

  const raceUnlocksStore = transaction.objectStore('raceUnlocks');
  const subraceUnlocksStore = transaction.objectStore('subraceUnlocks');
  const classUnlocksStore = transaction.objectStore('classUnlocks');
  const subclassUnlocksStore = transaction.objectStore('subclassUnlocks');
  const abilitiesStore = transaction.objectStore('abilities');

  const raceUnlocks: Record<string, AbilityUnlockDto[]> = {};
  const subraceUnlocks: Record<string, AbilityUnlockDto[]> = {};
  const classUnlocks: Record<string, AbilityUnlockDto[]> = {};
  const subclassUnlocks: Record<string, AbilityUnlockDto[]> = {};

  for (const o of progressionTables.GameDataObjects) {
    const parsed = classProgressionGameDataSchema.safeParse(o);
    if (!parsed.success) {
      continue;
    }
    const data = parsed.data;

    const component = data.Components.find((c) => c.$type === 'BaseProgressionTableComponent');

    if (!component) {
      Logger.getInstance().warn(`[Progression] ${data.ID} has no BaseProgressionTableComponent`);
      continue;
    }

    for (const a of component.AbilityUnlocks) {
      const conditionals = a.Prerequisites.Conditional.Components;

      const requiredAbility = await abilitiesStore.get(a.Prerequisites.RequiresAbilityID);
      const addedAbility = await abilitiesStore.get(a.AddAbilityID);
      const removedAbility = await abilitiesStore.get(a.RemoveAbilityID);

      const intermediateDto = {
        note: a.Note,
        icon: addedAbility?.icon ?? '',
        category: a.Category,
        style: a.UnlockStyle,
        baseClassId: a.Prerequisites.PowerLevelRequirement.ClassID,
        minimumCharacterLevel: a.Prerequisites.MinimumCharacterLevel,
        mutuallyExclusive: a.Prerequisites.IsMutuallyExclusiveUpgrade,
        minimumPowerLevel: a.Prerequisites.PowerLevelRequirement.MinimumPowerLevel,
        addedAbility,
        requiredAbility,
        removedAbility,
      };

      for (const c of conditionals) {
        if (c.$type === 'ConditionalCall') {
          pushUnlocks(
            intermediateDto,
            c,
            raceUnlocks,
            subraceUnlocks,
            classUnlocks,
            subclassUnlocks,
          );
        } else if (c.$type === 'ConditionalExpression') {
          for (const subconditional of c.Components) {
            pushUnlocks(
              intermediateDto,
              subconditional,
              raceUnlocks,
              subraceUnlocks,
              classUnlocks,
              subclassUnlocks,
            );
          }
        }
      }
    }
  }

  for (const [k, v] of Object.entries(classUnlocks)) {
    await classUnlocksStore.put(v, k);
  }

  for (const [k, v] of Object.entries(subclassUnlocks)) {
    await subclassUnlocksStore.put(v, k);
  }

  for (const [k, v] of Object.entries(raceUnlocks)) {
    await raceUnlocksStore.put(v, k);
  }

  for (const [k, v] of Object.entries(subraceUnlocks)) {
    await subraceUnlocksStore.put(v, k);
  }

  await transaction.done;
}

export async function parseStatusEffects(db: IDBPDatabase<DeadfireDb>) {
  const statusEffects = await (await fetch('/gamedata/data/statuseffects.json')).json();

  const transaction = db.transaction(
    ['statusEffects', 'statusEffectStrings', 'guiStrings', 'intervals'],
    'readwrite',
  );

  const parsers = [
    new IntervalRateParser(transaction),
    new StatusEffectParser(transaction),
    new AfflictionParser(transaction),
    new ChangeFormEffectParser(transaction),
  ];

  for (const o of statusEffects.GameDataObjects) {
    for (const parser of parsers) {
      if (parser.parseAndPush(o)) break;
    }
  }

  for (const parser of parsers) {
    await parser.toDto();
  }

  await transaction.done;
}

export async function parseStringTables(db: IDBPDatabase<DeadfireDb>) {
  const names = [
    'gui.stringtable.json',
    'abilities.stringtable.json',
    'items.stringtable.json',
    'itemmods.stringtable.json',
    'statuseffects.stringtable.json',
    'characters.stringtable.json',
    'cyclopedia.stringtable.json',
  ] as const;

  const tables = await Promise.all(
    names.map(async (name) => {
      const raw = await fetch(`/gamedata/stringtables/${name}`);
      const table: ParsedStringTable = await raw.json();
      return table;
    }),
  );

  const transaction = db.transaction(
    [
      'guiStrings',
      'abilityStrings',
      'itemStrings',
      'itemModStrings',
      'statusEffectStrings',
      'characterStrings',
      'cyclopediaStrings',
    ],
    'readwrite',
  );

  const stores = [
    transaction.objectStore('guiStrings'),
    transaction.objectStore('abilityStrings'),
    transaction.objectStore('itemStrings'),
    transaction.objectStore('itemModStrings'),
    transaction.objectStore('statusEffectStrings'),
    transaction.objectStore('characterStrings'),
    transaction.objectStore('cyclopediaStrings'),
  ];

  for (let i = 0; i < tables.length; ++i) {
    const table = tables[i];
    const store = stores[i];

    for (const e of table.StringTableFile.Entries.Entry) {
      await store.put({ id: e.ID, defaultText: e.DefaultText, femaleText: e.FemaleText }, e.ID);
    }
  }

  return await transaction.done;
}
