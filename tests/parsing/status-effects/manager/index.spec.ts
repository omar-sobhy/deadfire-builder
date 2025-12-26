import { describe, expect, test } from '@jest/globals';
import { statusEffectManagerGameDataSchema } from '$lib/parsing/schemas/status-effect/gamedata/status-effect-manager.gamedata.js';
import { readFile } from 'node:fs/promises';

const dir = __dirname;

describe('status manager parser', () => {
  test('parse succeeds', async () => {
    const data = await readFile(`${dir}/data.json`, { encoding: 'utf-8' });

    const obj = JSON.parse(data);

    expect(() => {
      statusEffectManagerGameDataSchema.parse(obj);
    }).not.toThrow();
  });
});
