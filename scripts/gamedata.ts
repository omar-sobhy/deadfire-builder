import fs from 'node:fs/promises';
import { type PathLike } from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function mkdirIfNotExists(path: PathLike) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (error) {
    if (
      !(
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'EEXIST'
      )
    ) {
      throw error;
    }
  }
}

async function formatStringtableDir(stringtable: string, output: string) {
  const files = await fs.readdir(stringtable, {
    withFileTypes: true,
  });

  await mkdirIfNotExists(path.join(output, 'stringtables'));

  const parser = new XMLParser();

  const promises = files.map(async (file) => {
    if (!file.name.endsWith('.stringtable')) {
      console.log(`Skipping ${stringtable}/${file.name}`);
      return;
    }

    const name = file.name.split('.')[0] + '.stringtable.json';

    const inputFilePath = path.join(file.parentPath, file.name);

    const data = await fs.readFile(inputFilePath, { encoding: 'utf-8' });
    const parsed = parser.parse(data);
    const formatted = JSON.stringify(parsed, undefined, 2);

    const outputFilePath = path.join(output, 'stringtables', name);

    return fs.writeFile(outputFilePath, formatted, { encoding: 'utf-8' });
  });

  return Promise.all(promises);
}

async function formatGamedataDir(gamedata: string, output: string) {
  const files = await fs.readdir(gamedata, {
    withFileTypes: true,
  });

  await mkdirIfNotExists(path.join(output, 'data'));

  const promises = files.map(async (file) => {
    if (!file.name.endsWith('.gamedatabundle')) {
      console.log(`Skipping ${gamedata}/${file.name}`);
      return;
    }

    const name = file.name.split('.')[0] + '.json';

    const inputFilePath = path.join(file.parentPath, file.name);

    const data = await fs.readFile(inputFilePath, { encoding: 'utf-8' });
    const parsed = JSON.parse(data.replaceAll('\ufeff', '')); // remove BOM
    const formatted = JSON.stringify(parsed, undefined, 2);

    const outputFilePath = path.join(output, 'data', name);

    return fs.writeFile(outputFilePath, formatted, { encoding: 'utf-8' });
  });

  return Promise.all(promises);
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

  const { design, localized, output } = argv;

  const promises = [
    formatGamedataDir(design, output),
    formatStringtableDir(localized, output),
  ];

  return await Promise.all(promises);
}

main().catch((e) => {
  console.error(e);
});
