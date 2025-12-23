import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';
import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { DBSchema, IDBPTransaction, StoreNames } from 'idb';
import type { AfflictionDto } from '$lib/dtos/status-effect/affliction.dto.js';
import type { ChangeFormEffectDto } from '$lib/dtos/status-effect/change-form-effect.dto.js';

export type DbKeys = StoreNames<DeadfireDb>;

export type ReadWriteTransaction<Keys extends DbKeys> = IDBPTransaction<
  DeadfireDb,
  ArrayLike<Keys>,
  'readwrite'
>;

export interface DeadfireDb extends DBSchema {
  abilities: {
    key: string;
    value: AbilityDto;
    indexes: { 'by-name': string };
  };

  statusEffects: {
    key: string;
    value:
      | { type: 'generic'; data: StatusEffectDto }
      | { type: 'changeForm'; data: ChangeFormEffectDto }
      | { type: 'affliction'; data: AfflictionDto };
    indexes: { 'by-name': string };
  };

  classUnlocks: {
    key: string;
    value: AbilityUnlockDto[];
  };

  subclassUnlocks: {
    key: string;
    value: AbilityUnlockDto[];
  };

  raceUnlocks: {
    key: string;
    value: AbilityUnlockDto[];
  };

  subraceUnlocks: {
    key: string;
    value: AbilityUnlockDto[];
  };

  baseStats: {
    key: string;
    value: BaseStatsDto;
  };

  classes: {
    key: string;
    value: ClassDto;
    indexes: { 'by-name': string };
  };

  subclasses: {
    key: string;
    value: SubclassDto;
    indexes: { 'by-name': string };
  };

  cultures: {
    key: string;
    value: CultureDto;
    indexes: { 'by-name': string };
  };

  items: {
    key: string;
    value: ItemDto;
    indexes: { 'by-name': string };
  };

  itemMods: {
    key: string;
    value: ItemModDto;
  };

  races: {
    key: string;
    value: RaceDto;
    indexes: { 'by-name': string };
  };

  subraces: {
    key: string;
    value: SubraceDto;
    indexes: { 'by-name': string };
  };

  guiStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  cyclopediaStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  abilityStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  characterStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  itemStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  itemModStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };

  statusEffectStrings: {
    key: number;
    value: { id: number; defaultText: string; femaleText: string };
  };
}
