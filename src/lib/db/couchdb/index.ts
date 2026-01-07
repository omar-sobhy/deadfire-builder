import type { ServerScope } from 'nano';
import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import type { BaseAttackDto } from '$lib/dtos/attack/base-attack.dto.js';
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
import type { DeadfireDb, Model } from '../interfaces/index.js';
import { Ability } from './ability/ability.js';
import { Culture } from './character/culture.js';
import { Attack } from './attack/index.js';
import { Class } from './character/class.js';
import { Race } from './character/race.js';
import { Subclass } from './character/subclass.js';
import { Subrace } from './character/subrace.js';
import { StatusEffect } from './status-effect/effect.js';
import { RaceUnlock } from './progression/race.js';
import { ClassUnlock } from './progression/class.js';
import { SubclassUnlock } from './progression/subclass.js';
import { SubraceUnlock } from './progression/subrace.js';
import { RecoveryTime } from './ability/recovery-time.js';
import { BaseStats } from './character/base-stats.js';
import { Interval } from './status-effect/interval.js';
import { StatusEffectManager } from './status-effect/manager.js';
import { Item } from './items/item.js';
import { ItemMod } from './items/item-mod.js';
import { GenericStringTable } from './stringtable/index.js';
import type { CouchdbModel } from './model.js';
import type { SavedBuild } from '../../../types/saved-build.js';
import { SavedBuildModel } from './saved-build/index.js';

export type CreateOpts = { nano: ServerScope } & Partial<{ init: boolean }>;

export class CouchdbDeadfireDb implements DeadfireDb {
  public abilities: Model<AbilityDto>;
  public attacks: Model<BaseAttackDto>;
  public cultures: Model<CultureDto>;
  public classes: Model<ClassDto>;
  public races: Model<RaceDto>;
  public subclasses: Model<SubclassDto>;
  public subraces: Model<SubraceDto>;
  public statusEffects: Model<StatusEffectDto>;
  public classUnlocks: Model<AbilityUnlockDto[]>;
  public raceUnlocks: Model<AbilityUnlockDto[]>;
  public subclassUnlocks: Model<AbilityUnlockDto[]>;
  public subraceUnlocks: Model<AbilityUnlockDto[]>;
  public recoveryTimes: Model<RecoveryTimeDto>;
  public baseStats: Model<BaseStatsDto>;
  public intervals: Model<IntervalRateDto>;
  public statusEffectManager: Model<StatusEffectManagerEntryDto>;
  public items: Model<ItemDto>;
  public itemMods: Model<ItemModDto>;

  public abilityStrings: Model<StringTableEntry>;
  public cyclopediaStrings: Model<StringTableEntry>;
  public guiStrings: Model<StringTableEntry>;
  public statusEffectStrings: Model<StringTableEntry>;
  public itemStrings: Model<StringTableEntry>;
  public itemModStrings: Model<StringTableEntry>;
  public characterStrings: Model<StringTableEntry>;

  public savedBuilds: Model<{ version: number; data: SavedBuild }>;

  [Symbol.asyncDispose](): Promise<void> {
    return Promise.resolve();
  }

  private constructor(opts: CreateOpts) {
    this.abilities = new Ability(opts);
    this.attacks = new Attack(opts);
    this.cultures = new Culture(opts);
    this.classes = new Class(opts);
    this.races = new Race(opts);
    this.subclasses = new Subclass(opts);
    this.subraces = new Subrace(opts);
    this.statusEffects = new StatusEffect(opts);
    this.classUnlocks = new ClassUnlock(opts);
    this.raceUnlocks = new RaceUnlock(opts);
    this.subclassUnlocks = new SubclassUnlock(opts);
    this.subraceUnlocks = new SubraceUnlock(opts);
    this.recoveryTimes = new RecoveryTime(opts);
    this.baseStats = new BaseStats(opts);
    this.intervals = new Interval(opts);
    this.statusEffectManager = new StatusEffectManager(opts);
    this.items = new Item(opts);
    this.itemMods = new ItemMod(opts);

    this.abilityStrings = new GenericStringTable(opts, 'ability_strings');
    this.cyclopediaStrings = new GenericStringTable(opts, 'cyclopedia_strings');
    this.guiStrings = new GenericStringTable(opts, 'gui_strings');
    this.statusEffectStrings = new GenericStringTable(opts, 'status_effect_strings');
    this.itemStrings = new GenericStringTable(opts, 'item_strings');
    this.itemModStrings = new GenericStringTable(opts, 'item_mod_strings');
    this.characterStrings = new GenericStringTable(opts, 'character_strings');

    this.savedBuilds = new SavedBuildModel(opts);
  }

  public static async create(opts: CreateOpts): Promise<CouchdbDeadfireDb> {
    const instance = new this(opts);

    const models = [
      instance.abilities,
      instance.attacks,
      instance.cultures,
      instance.classes,
      instance.races,
      instance.subclasses,
      instance.subraces,
      instance.statusEffects,
      instance.classUnlocks,
      instance.raceUnlocks,
      instance.subclassUnlocks,
      instance.subraceUnlocks,
      instance.recoveryTimes,
      instance.baseStats,
      instance.intervals,
      instance.statusEffectManager,
      instance.items,
      instance.itemMods,
      instance.abilityStrings,
      instance.cyclopediaStrings,
      instance.guiStrings,
      instance.statusEffectStrings,
      instance.itemStrings,
      instance.itemModStrings,
      instance.characterStrings,
    ] as CouchdbModel<never>[];

    for (const m of models) {
      await m.init();
    }

    await (instance.savedBuilds as CouchdbModel<never>).create();

    return instance;
  }
}
