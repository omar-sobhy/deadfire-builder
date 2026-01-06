import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { inspect } from 'node:util';
import { Logger, type LogLevelString } from '../lib/utils.js';
import type { ParsedStringTable, StringTableEntry } from '../types/gamedata/stringtable.js';
import * as Parsing from '$lib/parsing/index.js';
import { Parser } from '$lib/parsing/parsers/parser.js';
import { CouchdbDeadfireDb } from '$lib/db/couchdb/index.js';
import { type DeadfireDb } from '$lib/db/index.js';
import Nano from 'nano';

async function parseGamedata(root: string, db: DeadfireDb) {
  const gamedataDir = path.join(root);

  const gameDataFiles = await fs.readdir(gamedataDir, {
    withFileTypes: true,
    recursive: true,
  });

  const promises = gameDataFiles
    .filter((f) => f.isFile() && f.name.endsWith('.gamedatabundle'))
    .map(async (f) => {
      const filePath = path.join(f.parentPath, f.name);

      const data = await fs.readFile(filePath, { encoding: 'utf-8' });

      // hack to remove BOM and fix bad control chars
      const cleaned = data.replaceAll('\ufeff', '').replaceAll(/\n/g, '\\\\n');

      const parsed = JSON.parse(cleaned);

      const startIndex = f.name.startsWith('lax') ? 5 : 0;
      const endIndex = f.name.indexOf('.gamedatabundle');

      const name = f.name.substring(startIndex, endIndex);

      return { name, parsed };
    });

  const mergedGameData = await Promise.all(promises);

  const groupedGameData = Object.groupBy(mergedGameData, (data) => {
    return data.name;
  });

  const result = Object.entries(groupedGameData).map(([name, data]) => {
    const merged: Record<string, unknown> = {};

    for (const { parsed } of data!) {
      for (const o of parsed.GameDataObjects) {
        if (merged[o.ID]) {
          Logger.getInstance().warn(`[${name}] readding already-added ${o.ID}`);
        }

        merged[o.ID] = o;
      }
    }

    return { name, data: Object.values(merged) };
  });

  const statusEffects = result.find((r) => r.name === 'statuseffects');
  const abilities = result.find((r) => r.name === 'abilities');
  const progressionTables = result.find((r) => r.name === 'progressiontables');
  const global = result.find((r) => r.name === 'global');
  const characters = result.find((r) => r.name === 'characters');
  const items = result.find((r) => r.name === 'items');

  await Parsing.parseStatusEffects(db, { GameDataObjects: statusEffects!.data });
  await Parsing.parseAbilities(db, { GameDataObjects: abilities!.data });
  await Parsing.parseProgression(db, { GameDataObjects: progressionTables!.data });
  await Parsing.parseGlobal(db, { GameDataObjects: global!.data });
  await Parsing.parseCharacters(db, { GameDataObjects: characters!.data });
  await Parsing.parseItems(db, { GameDataObjects: items!.data });

  return result;
}

async function parseStringTables(root: string, db: DeadfireDb) {
  const names = [
    'abilities.stringtable',
    'cyclopedia.stringtable',
    'gui.stringtable',
    'itemmods.stringtable',
    'items.stringtable',
    'statuseffects.stringtable',
  ];

  const tables = [
    db.abilityStrings,
    db.cyclopediaStrings,
    db.guiStrings,
    db.itemModStrings,
    db.itemStrings,
    db.statusEffectStrings,
  ];

  const localizedDir = path.join(root);

  const files = await fs.readdir(localizedDir, {
    withFileTypes: true,
    recursive: true,
  });

  const promises = files
    .filter((f) => f.isFile() && f.parentPath.includes('en') && names.includes(f.name))
    .map(async (f) => {
      const filePath = path.join(f.parentPath, f.name);

      const data = await fs.readFile(filePath, { encoding: 'utf-8' });

      return { name: f.name, data };
    });

  const stringTableFiles = await Promise.all(promises);

  const grouped = Object.groupBy(stringTableFiles, (f) => {
    return f.name;
  });

  const parser = new XMLParser({
    isArray(tagName) {
      return tagName === 'Entry';
    },
  });

  const result = Object.entries(grouped).map(async ([name, data], i) => {
    const entries: Record<number, StringTableEntry> = {};

    for (const { data: raw } of data!) {
      const parsed: ParsedStringTable = parser.parse(raw);

      parsed.StringTableFile.Entries.Entry.forEach((e) => {
        if (entries[e.ID]) {
          Logger.getInstance().warn(
            `[${tables[i].constructor.name}] readding already-added string table entry ID ${e.ID}`,
          );
        }

        entries[e.ID] = { id: e.ID, defaultText: e.DefaultText, femaleText: e.FemaleText };
      });
    }

    await tables[i].put({ rows: Object.values(entries).map((e) => ({ id: e.id, data: e })) });

    return { name, table: entries };
  });

  return Promise.all(result);
}

async function main2() {
  const argv = await yargs(hideBin(process.argv))
    .options({
      input: {
        type: 'string',
        alias: 'i',
        description: 'path to the directory containing the other exported directories',
        demandOption: true,
      },
      level: {
        type: 'string',
        alias: 'l',
        description: 'log level',
        choices: ['trace', 'info', 'log', 'warn', 'error'] as LogLevelString[],
      },
    })
    .parse();

  const { input, level } = argv;

  Logger.getInstance(level && { level });

  await fs.rm('deadfire.db', { force: true });

  const user = process.env.COUCHDB_USER;
  const password = process.env.COUCHDB_PASSWORD;
  const url = process.env.COUCHDB_URL;

  const nano = Nano({
    url: `http://${user}:${password}@${url}`,
  });

  await using db = await CouchdbDeadfireDb.create({ nano, init: true });

  const tables = await parseStringTables(input, db);

  const abilityStrings = tables.find((t) => t.name.startsWith('abilities'))!.table;
  const cyclopediaStrings = tables.find((t) => t.name.startsWith('cyclopedia'))!.table;
  const guiStrings = tables.find((t) => t.name.startsWith('gui'))!.table;
  const statusEffectStrings = tables.find((t) => t.name.startsWith('statuseffects'))!.table;

  Parser.context.abilityStrings = abilityStrings;
  Parser.context.cyclopediaStrings = cyclopediaStrings;
  Parser.context.guiStrings = guiStrings;
  Parser.context.statusEffectStrings = statusEffectStrings;

  await parseGamedata(input, db);
}

main2().catch((e) => Logger.getInstance().error(inspect(e, { depth: Infinity })));
