import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  AbilityStringTableModel,
  ArmorModel,
  BaseStatsModel,
  CultureModel,
  CyclopediaStringTableModel,
  GuiStringTableModel,
  initDb,
  ItemModModel,
  ItemModsStringTableModel,
  ItemStringTableModel,
  WeaponModel,
} from '../src/lib/db/index.js';

import { ClassModel, RaceModel, SubraceModel } from '../src/lib/db/index.js';
import {
  raceGameDataSchema,
  subraceGameDataSchema,
  baseStatsGameDataSchema,
  characterClassGameDataSchema,
  characterSubclassGameDataSchema,
} from './gamedata/index.js';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  itemModGameDataSchema,
  ItemModGameData,
} from './gamedata/items/item-mod.gamedata.js';
import {
  equippableGameDataSchema,
  type EquippableGameData,
} from './gamedata/items/equippable.gamedata.js';
import {
  weaponGameDataSchema,
  type WeaponGameData,
} from './gamedata/items/weapon.gamedata.js';
import { SubclassModel } from '../src/lib/db/models/data/subclass.model.js';
import { cultureGameDataSchema } from './gamedata/culture/culture.gamedata.js';

interface ParsedStringTable {
  StringTableFile: {
    Entries: {
      Entry: { ID: number; DefaultText: string; FemaleText: string }[];
    };
  };
}

async function parseStringTables(stringTableDir: string) {
  const stringTables = [
    ['abilities.stringtable', AbilityStringTableModel],
    ['cyclopedia.stringtable', CyclopediaStringTableModel],
    ['gui.stringtable', GuiStringTableModel],
    ['itemmods.stringtable', ItemModsStringTableModel],
    ['items.stringtable', ItemStringTableModel],
  ] as const;

  const parser = new XMLParser();

  const promises = stringTables.map(async ([name, model]) => {
    const inputFileName = path.join(stringTableDir, name);

    const data = await fs.readFile(inputFileName, { encoding: 'utf-8' });

    const parsed: unknown = parser.parse(data);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error(`Malformed ${name}`);
    }

    const parsed_ = parsed as ParsedStringTable;

    const mapped = parsed_.StringTableFile.Entries.Entry.map((e) => {
      return {
        id: e.ID,
        defaultText: e.DefaultText,
      };
    });

    return model.bulkCreate(mapped, { ignoreDuplicates: true });
  });

  return Promise.all(promises);
}

function parseRace(o: { $type: string }): InferAttributes<RaceModel> {
  const data = raceGameDataSchema.parse(o);

  const component = data.Components[0];

  return {
    debugName: data.DebugName,
    id: data.ID,
    icon: component.Icon,
    resolve: component.Resolve,
    might: component.Might,
    dexterity: component.Dexterity,
    intellect: component.Intellect,
    constitution: component.Constitution,
    perception: component.Perception,
  };
}

function parseSubrace(o: { $type: string }): InferAttributes<SubraceModel> {
  const data = subraceGameDataSchema.parse(o);

  const component = data.Components[0];

  return {
    id: data.ID,
    raceId: component.RaceID,
    debugName: data.DebugName,
    type: component.Type,
  };
}

function parseBaseStats(o: { $type: string }): InferAttributes<BaseStatsModel> {
  const data = baseStatsGameDataSchema.parse(o);

  const component = data.Components[0];

  return {
    id: data.ID,
    deflection: component.BaseDeflection,
    fortitude: component.BaseFortitude,
    healthPerLevel: component.HealthPerLevel,
    maxHealth: component.MaxHealth,
    meleeAccuracy: component.MeleeAccuracyBonus,
    rangedAccuary: component.RangedAccuracyBonus,
    reflexes: component.BaseReflexes,
    will: component.BaseWill,
  };
}

function parseClass(o: { $type: string }): InferCreationAttributes<ClassModel> {
  const data = characterClassGameDataSchema.parse(o);

  const component = data.Components[0];

  return {
    id: data.ID,
    isSpellcaster: component.IsSpellcaster,
    icon: component.Icon,
    requireSubclass: component.RequireSubclass,
    spellIdentifierStringId: component.SpellIdentifierString,
  };
}

function parseSubclass(o: {
  $type: string;
}): InferCreationAttributes<SubclassModel> {
  const data = characterSubclassGameDataSchema.parse(o);

  return {
    id: data.ID,
  };
}

function parseCulture(o: {
  $type: string;
}): InferCreationAttributes<CultureModel> {
  const data = cultureGameDataSchema.parse(o);

  return {
    id: data.ID,
    debugName: data.DebugName,
    icon: data.Components[0].Icon,
    constitution: data.Components[0].Constitution,
    dexterity: data.Components[0].Dexterity,
    intellect: data.Components[0].Intellect,
    might: data.Components[0].Might,
    perception: data.Components[0].Perception,
    resolve: data.Components[0].Resolve,
  };
}

async function parseCharacters(gamedataDir: string) {
  const inputFilePath = path.join(gamedataDir, 'characters.gamedatabundle');
  const data = await fs.readFile(inputFilePath, { encoding: 'utf-8' });
  const parsed = JSON.parse(data.replaceAll('\ufeff', '')); // remove BOM

  const { GameDataObjects } = parsed;

  const parsedRaces: {
    id: string;
    displayName: number;
  }[] = [];

  const parsedSubraces: {
    id: string;
    description: number;
    displayName: number;
    summary: number;
    race: string;
  }[] = [];

  const parsedClasses: {
    id: string;
    displayName: number;
    description: number;
    summary: number;
  }[] = [];

  const parsedSubclasses: {
    id: string;
    displayName: number;
    description: number;
    summary: number;
    classId: string;
  }[] = [];

  const parsedCultures: {
    id: string;
    displayName: number;
    description: number;
    summary: number;
  }[] = [];

  const races: InferAttributes<RaceModel>[] = [];
  const subraces: InferAttributes<SubraceModel>[] = [];
  const baseStats: InferAttributes<BaseStatsModel>[] = [];
  const classes: InferAttributes<ClassModel>[] = [];
  const subclasses: InferAttributes<SubclassModel>[] = [];
  const cultures: InferAttributes<CultureModel>[] = [];

  GameDataObjects.forEach((o: unknown) => {
    if (typeof o !== 'object' || o === null || !('$type' in o)) {
      throw new Error('Malformed characters.gamedatabundle');
    }

    const o_ = o as { $type: string };

    if (o_.$type.startsWith('Game.GameData.RaceGameData')) {
      const race = raceGameDataSchema.parse(o_);
      parsedRaces.push({
        id: race.ID,
        displayName: race.Components[0].DisplayName,
      });

      races.push(parseRace(o_));
    }

    if (o_.$type.startsWith('Game.GameData.SubraceGameData')) {
      const subrace = subraceGameDataSchema.parse(o_);
      parsedSubraces.push({
        id: subrace.ID,
        description: subrace.Components[0].DescriptionText,
        displayName: subrace.Components[0].DisplayName,
        summary: subrace.Components[0].SummaryText,
        race: subrace.Components[0].RaceID,
      });

      subraces.push(parseSubrace(o_));
    }

    if (o_.$type.startsWith('Game.GameData.BaseStatsGameData')) {
      baseStats.push(parseBaseStats(o_));
    }

    if (o_.$type.startsWith('Game.GameData.CharacterClassGameData')) {
      const clazz = characterClassGameDataSchema.parse(o_);
      parsedClasses.push({
        description: clazz.Components[0].DescriptionText,
        displayName: clazz.Components[0].DisplayName,
        id: clazz.ID,
        summary: clazz.Components[0].SummaryText,
      });

      classes.push(parseClass(o_));
    }

    if (o_.$type.startsWith('Game.GameData.CharacterSubClassGameData')) {
      const subclass = characterSubclassGameDataSchema.parse(o_);
      parsedSubclasses.push({
        classId: subclass.Components[0].ForClassID,
        description: subclass.Components[0].DescriptionText,
        displayName: subclass.Components[0].DisplayName,
        id: subclass.ID,
        summary: subclass.Components[0].SummaryText,
      });

      subclasses.push(parseSubclass(o_));
    }

    if (o_.$type.startsWith('Game.GameData.CultureGameData')) {
      const culture = cultureGameDataSchema.parse(o_);
      parsedCultures.push({
        id: culture.ID,
        description: culture.Components[0].DescriptionText,
        displayName: culture.Components[0].DisplayName,
        summary: culture.Components[0].SummaryText,
      });

      cultures.push(parseCulture(o_));
    }
  });

  const promises = [
    RaceModel.bulkCreate(races, { ignoreDuplicates: true }),
    SubraceModel.bulkCreate(subraces, { ignoreDuplicates: true }),
    BaseStatsModel.bulkCreate(baseStats, { ignoreDuplicates: true })
      .then(() => ClassModel.bulkCreate(classes, { ignoreDuplicates: true }))
      .then(() =>
        SubclassModel.bulkCreate(subclasses, { ignoreDuplicates: true }),
      ),
    CultureModel.bulkCreate(cultures, { ignoreDuplicates: true }),
  ];

  await Promise.all(promises);

  for (const r of parsedRaces) {
    const model = await RaceModel.findByPk(r.id);

    if (r.displayName !== -1) {
      model?.setDisplayName(r.displayName, { save: false });
    }

    await model?.save();
  }

  for (const s of parsedSubraces) {
    const model = await SubraceModel.findByPk(s.id);

    if (s.displayName !== -1) {
      model?.setDisplayName(s.displayName, { save: false });
    }

    if (s.description !== -1) {
      model?.setDescriptionText(s.description, { save: false });
    }

    model?.setRace(s.race, { save: false });

    await model?.save();
  }

  for (const c of parsedClasses) {
    const model = await ClassModel.findByPk(c.id);

    if (c.displayName !== -1) {
      model?.setDisplayName(c.displayName, { save: false });
    }

    if (c.description !== -1) {
      model?.setDescriptionText(c.description, { save: false });
    }

    if (c.summary !== -1) {
      model?.setSummaryText(c.summary, { save: false });
    }

    await model?.save();
  }

  for (const s of parsedSubclasses) {
    const model = await SubclassModel.findByPk(s.id);

    if (s.displayName !== -1) {
      model?.setDisplayName(s.displayName, { save: false });
    }

    if (s.description !== -1) {
      model?.setDescriptionText(s.description, { save: false });
    }

    if (s.summary !== -1) {
      model?.setSummaryText(s.summary, { save: false });
    }

    if (s.classId !== '00000000-0000-0000-0000-000000000000') {
      model?.setClass(s.classId, { save: false });
    }

    await model?.save();
  }

  for (const c of parsedCultures) {
    const model = await CultureModel.findByPk(c.id);

    if (c.displayName !== -1) {
      model?.setDisplayName(c.displayName, { save: false });
    }

    if (c.description !== -1) {
      model?.setDescriptionText(c.description, { save: false });
    }

    if (c.summary !== -1) {
      model?.setSummaryText(c.summary, { save: false });
    }

    await model?.save();
  }
}

function parseItemMod(
  itemMod: ItemModGameData,
): InferCreationAttributes<ItemModModel> {
  return {
    id: itemMod.ID,
    debugName: itemMod.DebugName,
  };
}

function parseWeapon(
  weapon: WeaponGameData,
): InferCreationAttributes<WeaponModel> {
  const components = weapon.Components;

  return {
    id: weapon.ID,
    equipmentSlot: components[1].EquipmentSlot,
    equipmentType: components[1].EquipmentType,
  };
}

function parseArmor(
  equippable: EquippableGameData,
): InferCreationAttributes<ArmorModel> {
  const component = equippable.Components[2];

  if (!component || component.$type !== 'ArmorComponent') {
    throw new Error('Malformed armor');
  }

  return {
    debugName: equippable.DebugName,
    id: equippable.ID,

    isUnique: equippable.Components[0].IsUnique,

    material: component.ArmorMaterial,
    category: component.ArmorCategory,

    baseLevel: component.LevelScaling.BaseLevel,
    levelAdjustment: component.LevelScaling.ArmorRatingAdjustment,
    levelIncrement: component.LevelScaling.LevelIncrement,
    maxLevel: component.LevelScaling.MaxLevel,

    burn: component.OverrideBurnRating,
    corrode: component.OverrideCorrodeRating,
    crush: component.OverrideCrushRating,
    freeze: component.OverrideFreezeRating,
    pierce: component.OverridePierceRating,
    shock: component.OverrideShockRating,
    slash: component.OverrideSlashRating,
  };
}

async function parseItems(gamedataDir: string) {
  const inputFilePath = path.join(gamedataDir, 'items.gamedatabundle');
  const data = await fs.readFile(inputFilePath, { encoding: 'utf-8' });
  const parsedRoot = JSON.parse(data.replaceAll('\ufeff', '')); // remove BOM

  const { GameDataObjects } = parsedRoot;

  const parsedArmor: EquippableGameData[] = [];
  const parsedWeapons: WeaponGameData[] = [];
  const parsedMods: ItemModGameData[] = [];

  const armor: InferCreationAttributes<ArmorModel>[] = [];
  const weapons: InferCreationAttributes<WeaponModel>[] = [];
  const mods: InferCreationAttributes<ItemModModel>[] = [];

  for (const o of GameDataObjects as unknown[]) {
    if (typeof o !== 'object' || o === null || !('$type' in o)) {
      throw new Error('Malformed items.gamedatabundle');
    }

    const o_ = o as { $type: string };

    if (o_.$type.startsWith('Game.GameData.ItemModGameData')) {
      const parsed = itemModGameDataSchema.parse(o_);
      parsedMods.push(parsed);

      const model = parseItemMod(parsed);
      mods.push(model);
    }

    if (o_.$type.startsWith('Game.GameData.WeaponGameData')) {
      const parsed = weaponGameDataSchema.parse(o_);
      parsedWeapons.push(parsed);

      const model = parseWeapon(parsed);
      weapons.push(model);
    }

    if (o_.$type.startsWith('Game.GameData.EquippableGameData')) {
      try {
        const parsed = equippableGameDataSchema.parse(o_);

        const component = parsed.Components[2];

        if (component?.$type === 'ArmorComponent') {
          parsedArmor.push(parsed);

          const model = parseArmor(parsed);
          armor.push(model);
        }
      } catch (error) {
        console.dir(o_, { depth: Infinity });
        throw error;
      }
    }
  }

  await ArmorModel.bulkCreate(armor);

  await WeaponModel.bulkCreate(weapons);

  await ItemModModel.bulkCreate(mods);

  for (const a of parsedArmor) {
    const { DescriptionText, DisplayName } = a.Components[0];

    const model = await ArmorModel.findByPk(a.ID);

    if (DescriptionText !== -1) {
      model?.setDescriptionText(DescriptionText, { save: false });
    }

    if (DisplayName !== -1) {
      model?.setDisplayName(DisplayName, { save: false });
    }

    await model?.save();
  }

  for (const w of parsedWeapons) {
    const { DescriptionText, DisplayName } = w.Components[0];

    const model = await WeaponModel.findByPk(w.ID);
    if (DescriptionText !== -1) {
      model?.setDescriptionText(DescriptionText, { save: false });
    }

    if (DisplayName !== -1) {
      model?.setDisplayName(DisplayName, { save: false });
    }

    return model?.save();
  }

  for (const m of parsedMods) {
    const { DisplayName } = m.Components[0];

    const model = await ItemModModel.findByPk(m.ID);
    model?.setDisplayName(DisplayName, { save: false });

    return model?.save();
  }
}

async function parseGamedata(gamedataDir: string) {
  await parseCharacters(gamedataDir);
  await parseItems(gamedataDir);
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      design: {
        type: 'string',
        demandOption: true,
        description:
          'Path to the design directory containing all the .gamedatabundle files',
        alias: 'd',
      },
      localized: {
        type: 'string',
        demandOption: true,
        description:
          'Path to the localized directory containing all the .stringtable files. Usually found at `<Pillars game root>/PillarsOfEternityII_Data/exported/localized/en/text/game',
        alias: 'l',
      },
      output: {
        type: 'string',
        default: './static/gamedata',
        description: 'Path to the output directory',
        alias: 'o',
      },
    })
    .parseSync();

  const { design, localized } = argv;

  await initDb('force');

  await parseStringTables(localized);

  await parseGamedata(design);
}

main().catch((e) => {
  console.error(e);
});
