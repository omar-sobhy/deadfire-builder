import { createContext } from 'svelte';
import type { RaceDto } from './dtos/character/race.dto.js';
import type { SubraceDto } from './dtos/character/subrace.dto.js';
import type { CultureDto } from './dtos/character/culture.dto.js';
import type { ClassDto } from './dtos/character/class.dto.js';
import type { SubclassDto } from './dtos/character/subclass.dto.js';
import type { StatusEffectManagerEntryDto } from './dtos/status-effect/status-effect-manager-entry.dto.js';
import type { Renderers } from './render/index.js';

interface ContextOpts {
  classes: ClassDto[];
  subclasses: Record<string, SubclassDto[]>;
  races: RaceDto[];
  subraces: Record<string, SubraceDto[]>;
  renderers: Renderers;
  statusEffectManager: StatusEffectManagerEntryDto[];
  cultures: CultureDto[];
}

export class DeadfireContext {
  classes: ClassDto[];
  subclasses: Record<string, SubclassDto[]>;
  races: RaceDto[];
  subraces: Record<string, SubraceDto[]>;
  renderers: Renderers;
  statusEffectManager: StatusEffectManagerEntryDto[];
  cultures: CultureDto[];

  selectedRace: RaceDto;
  selectedSubrace: SubraceDto;
  attributes: Record<string, number>;
  selectedCulture: CultureDto;
  selectedClass: ClassDto;
  selectedSubclass: SubclassDto | undefined;
  selectedMulticlass: ClassDto | undefined;
  selectedMultiSubclass: SubclassDto | undefined;

  constructor(opts: ContextOpts) {
    const { cultures, classes, subclasses, races, subraces, renderers, statusEffectManager } = opts;

    this.classes = $state(
      classes.sort((lhs, rhs) => {
        if (lhs.displayName && rhs.displayName) {
          return lhs.displayName.localeCompare(rhs.displayName);
        }

        return 0;
      }),
    );

    this.subclasses = $state(subclasses);

    this.races = $state(
      races.sort((lhs, rhs) => {
        if (lhs.displayName && rhs.displayName) {
          return lhs.displayName.localeCompare(rhs.displayName);
        }

        return 0;
      }),
    );

    this.subraces = $state(subraces);

    this.cultures = $state(
      cultures.sort((lhs, rhs) => {
        if (lhs.displayName && rhs.displayName) {
          return lhs.displayName.localeCompare(rhs.displayName);
        }

        return 0;
      }),
    );

    this.renderers = $state(renderers);
    this.statusEffectManager = $state(statusEffectManager);

    this.selectedRace = $derived(this.races[0]);
    this.selectedSubrace = $derived(this.subraces[this.selectedRace.id][0]);
    this.selectedCulture = $derived(this.cultures[0]);
    this.selectedClass = $derived(this.classes[0]);
    this.selectedMulticlass = $state();
    this.selectedMultiSubclass = $state();

    this.attributes = $state({
      might: 10,
      dexterity: 10,
      constitution: 10,
      intellect: 10,
      perception: 10,
      resolve: 10,
    });

    this.selectedSubclass = $state();
  }
}

export const [getDeadfireContext, setDeadfireContext] = createContext<DeadfireContext>();
