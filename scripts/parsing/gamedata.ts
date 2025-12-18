import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  AbilityStringTableModel,
  CyclopediaStringTableModel,
  GuiStringTableModel,
  initDb,
  ItemModsStringTableModel,
  ItemStringTableModel,
} from '../../src/lib/db/index.js';

import { BaseStatsParser } from './parsers/character/basestats.js';
import {
  ClassParser,
  CultureParser,
  ItemModParser,
  RaceParser,
  SubclassParser,
  SubraceParser,
} from './parsers/index.js';
import { StatusEffectStringTableModel } from '../../src/lib/db/models/stringtables/status-effect.stringtable.model.js';
import { AbilityParser } from './parsers/ability/ability.js';
import type { Parser } from './parsers/parser.js';
import { WeaponParser } from './parsers/item/weapon.js';
import { ArmorParser } from './parsers/item/armor.js';

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
    ['statuseffects.stringtable', StatusEffectStringTableModel],
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

    await model.bulkCreate(mapped, { ignoreDuplicates: true });

    console.log(`Parsed ${name}`);
  });

  return Promise.all(promises);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseFile(filePath: string, parsers: Parser<any, any, any>[]) {
  const data = await fs.readFile(filePath, { encoding: 'utf-8' });
  const parsed = JSON.parse(data.replaceAll('\ufeff', '')); // remove BOM

  const { GameDataObjects } = parsed;

  GameDataObjects.forEach((o: { $type?: string; ID?: string }) => {
    if (!o.$type) {
      throw new Error('Malformed characters.gamedatabundle');
    }

    const matching = parsers.find((p) => p.matches(o));

    if (!matching) {
      console.info(`Skipping ${o.ID} (${o.$type}) as no parser matched`);
      return;
    }

    matching?.parseAndPush(o);
  });

  for (const p of parsers) {
    await p.bulkCreate();
    console.log(`${p.model.tableName} created`);
  }

  for (const p of parsers) {
    await p.addReferences();
    console.log(`${p.model.tableName} references set`);
  }
}

async function parseCharacters(gamedataDir: string) {
  // NOTE: order is important here so that foreign key references work properly
  const parsers = [
    new BaseStatsParser(),
    new ClassParser(),
    new CultureParser(),
    new RaceParser(),
    new SubclassParser(),
    new SubraceParser(),
  ];

  return parseFile(
    path.join(gamedataDir, 'characters.gamedatabundle'),
    parsers,
  );
}

async function parseItems(gamedataDir: string) {
  const inputFilePath = path.join(gamedataDir, 'items.gamedatabundle');

  const parsers = [new ItemModParser(), new WeaponParser(), new ArmorParser()];

  return parseFile(inputFilePath, parsers);
}

async function parseAbilities(gamedataDir: string) {
  const inputFilePath = path.join(gamedataDir, 'abilities.gamedatabundle');

  const parser = new AbilityParser();

  return parseFile(inputFilePath, [parser]);
}

async function parseGamedata(gamedataDir: string) {
  await parseCharacters(gamedataDir);
  await parseItems(gamedataDir);
  await parseAbilities(gamedataDir);
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
