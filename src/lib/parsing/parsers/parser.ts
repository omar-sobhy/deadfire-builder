import type { DeadfireDb } from '$lib/db/index.js';
import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import type z from 'zod';
import type { StringTableEntry } from '../../../types/gamedata/stringtable.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import type { RecoveryTimeDto } from '$lib/dtos/attack/recovery-time.dto.js';
import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { IntervalRateDto } from '$lib/dtos/status-effect/interval-rate.dto.js';
import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import type { ItemModDto } from '$lib/dtos/items/item-mod.dto.js';

export interface Context {
  abilities: Record<string, AbilityDto>;
  baseStats: Record<string, BaseStatsDto>;
  classes: Record<string, ClassDto>;
  cultures: Record<string, CultureDto>;
  races: Record<string, RaceDto>;
  subclasses: Record<string, SubclassDto>;
  subraces: Record<string, SubraceDto>;
  statusEffects: Record<string, StatusEffectDto>;
  recoveryTimes: Record<string, RecoveryTimeDto>;
  classUnlocks: Record<string, AbilityUnlockDto[]>;
  subclassUnlocks: Record<string, AbilityUnlockDto[]>;
  raceUnlocks: Record<string, AbilityUnlockDto[]>;
  subraceUnlocks: Record<string, AbilityUnlockDto[]>;
  intervals: Record<string, IntervalRateDto>;
  statusEffectManager: Record<string, StatusEffectManagerEntryDto>;
  items: Record<string, ItemDto>;
  itemMods: Record<string, ItemModDto>;

  abilityStrings: Record<string, StringTableEntry>;
  cyclopediaStrings: Record<string, StringTableEntry>;
  guiStrings: Record<string, StringTableEntry>;
  statusEffectStrings: Record<string, StringTableEntry>;
}

export abstract class Parser<Parsed extends { ID: string }> {
  public readonly parsed: Record<string, Parsed> = {};

  public static readonly context: Context = {
    abilities: {},
    baseStats: {},
    classes: {},
    cultures: {},
    races: {},
    subclasses: {},
    subraces: {},
    statusEffects: {},
    recoveryTimes: {},
    classUnlocks: {},
    subclassUnlocks: {},
    raceUnlocks: {},
    subraceUnlocks: {},
    intervals: {},
    statusEffectManager: {},
    items: {},
    itemMods: {},

    abilityStrings: {},
    cyclopediaStrings: {},
    guiStrings: {},
    statusEffectStrings: {},
  };

  public abstract parser: z.ZodType<Parsed>;

  public parseAndPush(o: unknown): boolean {
    const result = this.parser.safeParse(o);
    if (!result.success) {
      return false;
    }

    this.parsed[result.data.ID] = result.data;
    return true;
  }

  public constructor(public readonly db: DeadfireDb) {}

  public abstract parseDtos(): Promise<void>;

  public static packDtos<D>(store: Record<string, D>): { id: string; data: D }[] {
    return Object.entries(store).map(([k, v]) => ({ id: k, data: v }));
  }
}
