import { describe, expect, test } from '@jest/globals';

function test2(input: string, data: Record<string, number | string>, expected: string) {
  const replaced = input.replaceAll(/\{[^}]+\}/g, (str) => {
    const split = str.substring(1, str.length - 1).split(':');
    if (split.length === 1) {
      return data['Value'].toString();
    }
    if (split.length === 2) {
      return data[split[1]].toString();
    }
    const display = split[2];
    if (display.toLowerCase().includes('percent')) {
      return `${data[split[1]]}%`;
    }
    return data[split[1]].toString();
  });

  expect(replaced).toBe(expected);
}

function testReplacer(input: string, data: Record<string, number | string>, expected: string) {
  const matches = input.matchAll(/\{(?<index>0(?<value>:\w+(?<display>:\w+)?)?)\}/g);

  const arr = [...matches];

  let intermediate = input;

  const replaced: { start: number; end: number; value: string }[] = [];

  for (const m of arr) {
    const { index, value, display } = m.groups!;

    const start = m.index;
    const end = start + m[0].length;

    let intermediateReplaced: string;

    if (!value) {
      intermediateReplaced = data['baseValue'].toString();
    } else if (!display) {
      intermediateReplaced = data[value.substring(1)].toString();
    } else if (display.toLowerCase().includes('percent')) {
      intermediateReplaced = data['baseValue'].toString() + '%';
    } else {
      intermediateReplaced = data['baseValue'].toString();
    }

    replaced.push({ start, end, value: intermediateReplaced });
  }

  for (const { start, end, value } of replaced.reverse()) {
    intermediate = intermediate.slice(0, start) + value + intermediate.slice(end);
  }

  expect(intermediate).toBe(expected);
}

describe('replacer', () => {
  test('value only', () => {
    const text = '{0} Action Speed';
    testReplacer(text, { baseValue: 10 }, '10 Action Speed');
  });

  test('multiple value only', () => {
    const text = '{0} Action Speed {0} Dexterity';
    testReplacer(text, { baseValue: 10 }, '10 Action Speed 10 Dexterity');
  });

  test('multiple', () => {
    const text = '{0:Value:DamageProc} Damage dealt as {0:DamageType}';
    const data = { Value: 10, DamageType: 'foo' };
    const expected = '10 Damage dealt as foo';
    test2(text, data, expected);
  });
});
