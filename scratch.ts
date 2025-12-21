import fs from 'fs';
import { genericAbilityGameDataSchema } from './scripts/parsing/schemas/index.ts';

const data = fs
  .readFileSync(
    './raw/data/exported/design/gamedata/abilities.gamedatabundle',
    { encoding: 'utf-8' },
  )
  .replaceAll('\ufeff', '')
  .replaceAll('\n', '\\\\n');

const data_ = JSON.parse(data);

const allParsed = [];

for (let i = 0; i < data_.GameDataObjects.length; ++i) {
  const o = data_.GameDataObjects[i];
  try {
    if (!o.$type.match(/AbilityGameData|Chant|Wounds|Focus/g)) {
      continue;
    }

    const parsed = genericAbilityGameDataSchema.parse(o);

    allParsed.push(parsed);
  } catch (error) {
    console.error(error);
    debugger;
  }
}

if (true) {
  debugger;
}
