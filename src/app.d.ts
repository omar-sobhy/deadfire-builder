// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
import type { GenericAttackDto } from '$lib/dtos/attack/base-attack.dto.js';
import type { RecoveryTimeDto } from '$lib/dtos/attack/recovery-time.dto.js';
import type { BaseStatsDto } from '$lib/dtos/character/base-stats.dto.js';
import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { ItemDto } from '$lib/dtos/items/item.dto.js';
import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
import type { IntervalRateDto } from '$lib/dtos/status-effect/interval-rate.dto.js';
import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import type { StringTableEntry } from './types/gamedata/stringtable.js';

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      data?: {
        type: 'invalid-build';
        data: unknown;
      };
    }
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module 'knex/types/tables.js' {
  interface Tables {
    races: { id: string; data: RaceDto };
    subraces: { id: string; data: SubraceDto };
    classes: { id: string; data: ClassDto };
    subclasses: { id: string; data: SubclassDto };
    cultures: { id: string; data: CultureDto };
    baseStats: { id: string; data: BaseStatsDto };
    abilities: { id: string; data: AbilityDto };
    attacks: { id: string; data: GenericAttackDto };
    items: { id: string; data: ItemDto };
    item_mods: { id: string; data: ItemModDto };
    status_effects: { id: string; data: StatusEffectDto };
    class_unlocks: { id: string; data: AbilityUnlockDto[] };
    race_unlocks: { id: string; data: AbilityUnlockDto[] };
    subclass_unlocks: { id: string; data: AbilityUnlockDto[] };
    subrace_unlocks: { id: string; data: AbilityUnlockDto[] };
    recovery_times: { id: string; data: RecoveryTimeDto };
    intervals: { id: string; data: IntervalRateDto };
    status_effect_manager: { id: string; data: StatusEffectManagerEntryDto };

    ability_strings: { id: string; data: StringTableEntry };
    cyclopedia_strings: { id: string; data: StringTableEntry };
    gui_strings: { id: string; data: StringTableEntry };
    status_effect_strings: { id: string; data: StringTableEntry };
    item_strings: { id: string; data: StringTableEntry };
    item_mod_strings: { id: string; data: StringTableEntry };
    character_strings: { id: string; data: StringTableEntry };
  }
}

import { ComputePositionConfig } from '@floating-ui/dom';

declare module 'cytoscape-popper' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PopperOptions extends ComputePositionConfig {}
  interface PopperInstance {
    update(): void;
  }
}

export {};
