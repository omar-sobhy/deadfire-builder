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
  sequelize,
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
import { KeywordParser } from './parsers/ability/keyword.js';
import { StatusEffectParser } from './parsers/ability/status-effect.js';
import { error, info, log } from './util.js';
import { ClassProgressionParser } from './parsers/progression/class-progression.js';
import { inspect } from 'node:util';

const allowedFilterChoices = [
  'ability',
  'keyword',
  'statuseffect',

  'basestats',
  'class',
  'culture',
  'race',
  'subclass',
  'subrace',

  'armor',
  'weapon',
  'itemmod',
  'equippable',

  'classprogression',
] as const;

// note: order here is important
// earlier parsers run first, and foreign key references need to be established
const parsers = {
  ability: [
    { name: 'keyword', parser: new KeywordParser() } as const,
    { name: 'statuseffect', parser: new StatusEffectParser() } as const,
    { name: 'ability', parser: new AbilityParser() } as const,
  ] as const,
  character: [
    { name: 'basestats', parser: new BaseStatsParser() } as const,
    { name: 'class', parser: new ClassParser() } as const,
    { name: 'culture', parser: new CultureParser() } as const,
    { name: 'subclass', parser: new SubclassParser() } as const,
    { name: 'race', parser: new RaceParser() } as const,
    { name: 'subrace', parser: new SubraceParser() } as const,
  ] as const,
  item: [
    { name: 'armor', parser: new ArmorParser() } as const,
    { name: 'weapon', parser: new WeaponParser() } as const,
    { name: 'itemmod', parser: new ItemModParser() } as const,
  ] as const,
  progression: [
    { name: 'classprogression', parser: new ClassProgressionParser() } as const,
  ] as const,
} as const;

type AllowedFilterChoices = (typeof allowedFilterChoices)[number];

interface ParsedStringTable {
  StringTableFile: {
    Entries: {
      Entry: { ID: number; DefaultText: string; FemaleText: string }[];
    };
  };
}

async function parseDirectoryStringTables(directory: string) {
  const stringTables = [
    ['abilities.stringtable', AbilityStringTableModel],
    ['cyclopedia.stringtable', CyclopediaStringTableModel],
    ['gui.stringtable', GuiStringTableModel],
    ['itemmods.stringtable', ItemModsStringTableModel],
    ['items.stringtable', ItemStringTableModel],
    ['statuseffects.stringtable', StatusEffectStringTableModel],
  ] as const;

  const parser = new XMLParser({
    isArray(tagName) {
      return tagName === 'Entry';
    },
  });

  const promises = stringTables.map(async ([name, model]) => {
    const inputFileName = path.join(
      directory,
      'localized',
      'en',
      'text',
      'game',
      name,
    );

    let data: string;
    try {
      data = await fs.readFile(inputFileName, { encoding: 'utf-8' });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        info(`${directory} has no ${name}`);
        return;
      }

      throw error;
    }

    const parsed: unknown = parser.parse(data);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error(`Malformed ${inputFileName}`);
    }

    const parsed_ = parsed as ParsedStringTable;

    const mapped = parsed_.StringTableFile.Entries.Entry.map((e) => {
      return {
        id: e.ID,
        defaultText: e.DefaultText,
      };
    });

    const t = await sequelize.transaction();

    await model.bulkCreate(mapped, { ignoreDuplicates: true });

    await t.commit();

    log(`Parsed ${inputFileName}`);
  });

  return Promise.all(promises);
}

async function parseStringTables(gamedataDir: string) {
  const directories = await fs.readdir(gamedataDir, { withFileTypes: true });

  for (const d of directories) {
    if (!d.isDirectory()) {
      info(`Skipping ${d.name} as it isn't a directory`);
      continue;
    }

    if (!d.name.includes('exported')) {
      info(`Skipping ${d.name}`);
      continue;
    }

    await parseDirectoryStringTables(path.join(d.parentPath, d.name));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseFile(filePath: string, parsers: Parser<any, any, any>[]) {
  let data: string;

  try {
    data = await fs.readFile(filePath, { encoding: 'utf-8' });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      info(`Skipping ${filePath} as it does not exist`);
      return;
    }

    throw error;
  }

  const parsed = JSON.parse(
    // hack to remove BOM and fix bad control chars
    data.replaceAll('\ufeff', '').replaceAll(/\n/g, '\\\\n'),
  );

  const { GameDataObjects } = parsed;

  GameDataObjects.forEach((o: { $type?: string; ID?: string }) => {
    if (!o.$type) {
      throw new Error(`Malformed ${filePath}`);
    }

    const matching = parsers.find((p) => p.matches(o));

    if (!matching) {
      info(`Skipping ${o.ID} (${o.$type}) as no parser matched`);
      return;
    }

    matching.parseAndPush(o);
  });
}

async function parseProgressionTables(
  gamedataDir: string,
  filter?: AllowedFilterChoices[],
) {
  const fileSuffix = 'progressiontables.gamedatabundle';

  const inputFileName = (await fs.readdir(gamedataDir)).find((f) =>
    f.endsWith(fileSuffix),
  );

  if (!inputFileName) {
    info(`${gamedataDir} has no ${fileSuffix}`);
    return;
  }

  const inputFilePath = path.join(gamedataDir, inputFileName);

  const filtered = filter
    ? parsers.progression.filter((p) => filter.includes(p.name))
    : parsers.progression;

  const mapped = filtered.map((p) => p.parser);

  return parseFile(inputFilePath, mapped);
}

async function parseCharacters(
  gamedataDir: string,
  filter?: AllowedFilterChoices[],
) {
  const fileSuffix = 'characters.gamedatabundle';

  const inputFileName = (await fs.readdir(gamedataDir)).find((f) =>
    f.endsWith(fileSuffix),
  );

  if (!inputFileName) {
    info(`${gamedataDir} has no ${fileSuffix}`);
    return;
  }

  const inputFilePath = path.join(gamedataDir, inputFileName);

  const filtered = filter
    ? parsers.character.filter((p) => filter.includes(p.name))
    : parsers.character;

  const mapped = filtered.map((p) => p.parser);

  return parseFile(inputFilePath, mapped);
}

async function parseItems(
  gamedataDir: string,
  filter?: AllowedFilterChoices[],
) {
  const fileSuffix = 'items.gamedatabundle';

  const inputFileName = (await fs.readdir(gamedataDir)).find((f) =>
    f.endsWith(fileSuffix),
  );

  if (!inputFileName) {
    info(`${gamedataDir} has no ${fileSuffix}`);
    return;
  }

  const inputFilePath = path.join(gamedataDir, inputFileName);

  const filtered = filter
    ? parsers.item.filter((p) => filter.includes(p.name))
    : parsers.item;

  const mapped = filtered.map((p) => p.parser);

  return parseFile(inputFilePath, mapped);
}

async function parseAbilities(
  gamedataDir: string,
  filter?: AllowedFilterChoices[],
) {
  if (filter && !filter.includes('ability')) {
    return;
  }

  const fileSuffix = 'abilities.gamedatabundle';

  const inputFileName = (await fs.readdir(gamedataDir)).find((f) =>
    f.endsWith(fileSuffix),
  );

  if (!inputFileName) {
    info(`${gamedataDir} has no ${fileSuffix}`);
    return;
  }

  const inputFilePath = path.join(gamedataDir, inputFileName);

  const filtered = filter
    ? parsers.ability.filter((p) => filter.includes(p.name))
    : parsers.ability;

  const mapped = filtered.map((p) => p.parser);

  return await parseFile(inputFilePath, mapped);
}

async function parseDirectoryGamedata(
  directory: string,
  filter?: AllowedFilterChoices[],
) {
  const root = path.join(directory, 'design', 'gamedata');

  await parseCharacters(root, filter);
  await parseItems(root, filter);
  await parseAbilities(root, filter);
  await parseProgressionTables(root, filter);
}

async function parseGamedata(
  gamedataDir: string,
  filter?: AllowedFilterChoices[],
) {
  const files = await fs.readdir(gamedataDir, { withFileTypes: true });

  const directories = [];

  for (const f of files) {
    if (!f.isDirectory()) {
      info(`Skipping ${f.name} as it isn't a directory`);
      continue;
    }

    if (!f.name.includes('exported')) {
      info(`Skipping ${f.name}`);
      continue;
    }

    directories.push(f);
  }

  for (const d of directories) {
    await parseDirectoryGamedata(path.join(d.parentPath, d.name), filter);
  }

  info('Done parsing. Trying to save data...');

  const allParsers = [
    parsers.character,
    parsers.ability,
    parsers.item,
    parsers.progression,
  ].flat();

  for (const p of allParsers) {
    log(`Saving ${p.name}`);

    await p.parser.bulkCreate();
    await p.parser.addReferences();

    log('Done.');
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      input: {
        type: 'string',
        alias: 'i',
        description:
          'path to the directory containing the other exported directories',
        demandOption: true,
      },
      filter: {
        type: 'array',
        alias: 'f',
        description:
          'which files to parse (you are responsible for ensuring foreign references can be resolved!)',
        choices: allowedFilterChoices,
      },
    })
    .parseSync();

  const { input, filter } = argv;

  await initDb('force');

  await parseStringTables(input);

  await parseGamedata(input, filter);
}

main().catch((e) => {
  error(inspect(e, { depth: Infinity }));
});
