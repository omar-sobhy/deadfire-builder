import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import type { GenericAttackDto } from '$lib/dtos/attack/base-attack.dto.js';
import type { RecoveryTimeDto } from '$lib/dtos/attack/recovery-time.dto.js';
import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';
import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import type { IntervalRateDto } from '$lib/dtos/status-effect/interval-rate.dto.js';
import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import type { StringTableEntry } from '../../../types/gamedata/stringtable.js';
import type { Model } from './model.js';

export interface DeadfireDb {
  abilities: Model<AbilityDto>;
  attacks: Model<GenericAttackDto>;
  cultures: Model<CultureDto>;
  classes: Model<ClassDto>;
  races: Model<RaceDto>;
  subclasses: Model<SubclassDto>;
  subraces: Model<SubraceDto>;
  statusEffects: Model<StatusEffectDto>;
  classUnlocks: Model<AbilityUnlockDto[]>;
  raceUnlocks: Model<AbilityUnlockDto[]>;
  subclassUnlocks: Model<AbilityUnlockDto[]>;
  subraceUnlocks: Model<AbilityUnlockDto[]>;
  recoveryTimes: Model<RecoveryTimeDto>;
  baseStats: Model<BaseStatsDto>;
  intervals: Model<IntervalRateDto>;
  statusEffectManager: Model<StatusEffectManagerEntryDto>;
  items: Model<ItemDto>;
  itemMods: Model<ItemModDto>;
  

  abilityStrings: Model<StringTableEntry>;
  cyclopediaStrings: Model<StringTableEntry>;
  guiStrings: Model<StringTableEntry>;
  statusEffectStrings: Model<StringTableEntry>;
  itemStrings: Model<StringTableEntry>;
  itemModStrings: Model<StringTableEntry>;
  characterStrings: Model<StringTableEntry>;

  [Symbol.asyncDispose](): Promise<void>;
}

export * from './model.js';
