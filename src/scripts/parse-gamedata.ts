import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { inspect } from 'node:util';
import { Logger, type LogLevelString } from '../lib/utils.js';
import type { ParsedStringTable } from '../types/gamedata/stringtable.js';

async function parseGamedata(root: string) {
  const gamedataDir = path.join(root, 'design', 'gamedata');

  const gameDataFiles = await fs.readdir(gamedataDir, {
    withFileTypes: true,
    recursive: true,
  });

  const promises = gameDataFiles
    .filter((f) => f.isFile())
    .map(async (f) => {
      const filePath = path.join(f.parentPath, f.name);

      const data = await fs.readFile(filePath, { encoding: 'utf-8' });

      // hack to remove BOM and fix bad control chars
      const cleaned = data.replaceAll('\ufeff', '').replaceAll(/\n/g, '\\\\n');

      const parsed = JSON.parse(cleaned);

      const startIndex = f.name.startsWith('lax') ? 4 : 0;
      const endIndex = f.name.indexOf('.gamedatabundle');

      const name = f.name.substring(startIndex, endIndex) + '.json';

      return { name, parsed };
    });

  const parsedGameData = await Promise.all(promises);

  const groupedGameData = Object.groupBy(parsedGameData, (data) => {
    return data.name;
  });

  const result = Object.entries(groupedGameData).map(async ([name, data]) => {
    if (!data) return;

    const merged: Record<string, unknown> = {};

    for (const { parsed } of data) {
      for (const o of parsed.GameDataObjects) {
        if (merged[o.ID]) {
          Logger.getInstance().warn(`[${name}] readding already-added ${o.ID}`);
        }

        merged[o.ID] = o;
      }
    }

    const outputFilePath = path.join('static', 'gamedata', name);

    await fs.writeFile(outputFilePath, JSON.stringify(merged, undefined, 2));
  });

  return result;
}

async function parseStringTables(root: string) {
  const stringTables = [
    'abilities.stringtable',
    'cyclopedia.stringtable',
    'gui.stringtable',
    'itemmods.stringtable',
    'items.stringtable',
    'statuseffects.stringtable',
  ];

  const localizedDir = path.join(root, 'localized', 'en', 'text', 'game');

  const files = await fs.readdir(localizedDir, {
    withFileTypes: true,
    recursive: true,
  });

  const promises = files
    .filter((f) => f.isFile() && stringTables.includes(f.name))
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

  const result = Object.entries(grouped).map(async ([name, data]) => {
    const merged: Record<string, unknown> = {};

    for (const { data: raw } of data!) {
      const parsed: ParsedStringTable = parser.parse(raw);

      parsed.StringTableFile.Entries.Entry.forEach((e) => {
        merged[e.ID] = e;
      });
    }

    const outputFilePath = path.join('static', 'stringtables', name);

    await fs.writeFile(outputFilePath, JSON.stringify(merged, undefined, 2));
  });

  return result;
}

async function main2() {
  const argv = await yargs(hideBin(process.argv))
    .options({
      input: {
        type: 'string',
        alias: 'i',
        description:
          'path to the directory containing the other exported directories',
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

  await parseGamedata(input);

  await parseStringTables(input);
}

main2().catch((e) =>
  Logger.getInstance().error(inspect(e, { depth: Infinity })),
);
