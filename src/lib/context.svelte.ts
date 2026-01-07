import { createContext } from 'svelte';
import type { RaceDto } from './dtos/character/race.dto.js';
import type { SubraceDto } from './dtos/character/subrace.dto.js';
import type { CultureDto } from './dtos/character/culture.dto.js';
import type { ClassDto } from './dtos/character/class.dto.js';
import type { SubclassDto } from './dtos/character/subclass.dto.js';
import type { StatusEffectManagerEntryDto } from './dtos/status-effect/status-effect-manager-entry.dto.js';
import type { Renderers } from './render/index.js';
import type { SavedBuild, Stats } from '../types/saved-build.js';
import { SvelteSet } from 'svelte/reactivity';

interface ContextOpts {
  classes: ClassDto[];
  subclasses: Record<string, SubclassDto[]>;
  races: RaceDto[];
  subraces: Record<string, SubraceDto[]>;
  renderers: Renderers;
  statusEffectManager: StatusEffectManagerEntryDto[];
  cultures: CultureDto[];
  savedBuild?: SavedBuild;
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

  selectedAbilities: Set<string>;

  public serialize(): { version: number; data: SavedBuild } {
    const data = {
      version: 1,
      data: {
        selectedRaceId: this.selectedRace.id,
        selectedSubraceId: this.selectedSubrace.id,
        attributes: this.attributes as unknown as Stats,
        selectedCultureId: this.selectedCulture.id,
        selectedClassId: this.selectedClass.id,
        selectedSubclassId: this.selectedSubclass?.id,
        selectedMulticlassId: this.selectedMulticlass?.id,
        selectedMultiSubclassId: this.selectedMultiSubclass?.id,
        abilities: [...this.selectedAbilities],
      },
    };

    return data;
  }

  constructor(opts: ContextOpts) {
    const {
      cultures,
      classes,
      subclasses,
      races,
      subraces,
      renderers,
      statusEffectManager,
      savedBuild,
    } = opts;

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

    this.selectedRace = $derived(
      savedBuild ? this.races.find((r) => r.id === savedBuild.selectedRaceId)! : this.races[0],
    );

    const selectedSubraces = this.subraces[this.selectedRace.id];

    this.selectedSubrace = $derived(
      savedBuild
        ? selectedSubraces.find((s) => s.id === savedBuild.selectedSubraceId)!
        : selectedSubraces[0],
    );

    this.selectedCulture = $derived(
      savedBuild
        ? this.cultures.find((c) => c.id === savedBuild.selectedCultureId)!
        : this.cultures[0],
    );

    this.selectedClass = $derived(
      savedBuild ? this.classes.find((c) => c.id === savedBuild.selectedClassId)! : this.classes[0],
    );

    this.selectedMulticlass = $state(
      savedBuild && savedBuild.selectedMulticlassId
        ? this.classes.find((c) => c.id === savedBuild.selectedMulticlassId)
        : undefined,
    );

    const selectedMultiSubclasses =
      this.selectedMulticlass && this.subclasses[this.selectedMulticlass.id];

    this.selectedMultiSubclass = $state(
      savedBuild && savedBuild.selectedMultiSubclassId
        ? selectedMultiSubclasses?.find((c) => c.id === savedBuild.selectedMultiSubclassId)
        : undefined,
    );

    this.attributes = $state(
      savedBuild
        ? savedBuild.attributes
        : {
            might: 10,
            dexterity: 10,
            constitution: 10,
            intellect: 10,
            perception: 10,
            resolve: 10,
          },
    );

    this.selectedAbilities = $state(new SvelteSet(savedBuild ? savedBuild.abilities : []));

    this.selectedSubclass = $state();
  }
}

export const [getDeadfireContext, setDeadfireContext] = createContext<() => DeadfireContext>();
