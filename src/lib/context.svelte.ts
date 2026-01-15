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
import { UnlockStyle } from '../types/enums/unlock-style.js';

interface ContextOpts {
  classes: ClassDto[];
  subclasses: Record<string, SubclassDto[]>;
  races: RaceDto[];
  subraces: Record<string, SubraceDto[]>;
  renderers: Renderers;
  statusEffectManager: StatusEffectManagerEntryDto[];
  cultures: CultureDto[];
  savedBuild?: {
    version: string;
    build: SavedBuild;
  };
}

function byDisplayName(lhs: { displayName?: string }, rhs: { displayName?: string }) {
  if (lhs.displayName && rhs.displayName) {
    return lhs.displayName.localeCompare(rhs.displayName);
  }

  return 0;
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

  selectedAbilities: { level: number; id: string }[];

  autoAbilities: Set<string>;

  currentLevel: number;

  usedPoints: number;

  public serialize(): { version: string; data: SavedBuild } {
    const data = {
      version: '1.1.0',
      data: {
        selectedRaceId: this.selectedRace.id,
        selectedSubraceId: this.selectedSubrace.id,
        attributes: this.attributes as unknown as Stats,
        selectedCultureId: this.selectedCulture.id,
        selectedClassId: this.selectedClass.id,
        selectedSubclassId: this.selectedSubclass?.id,
        selectedMulticlassId: this.selectedMulticlass?.id,
        selectedMultiSubclassId: this.selectedMultiSubclass?.id,
        abilities: this.selectedAbilities,
        autoAbilities: [...this.autoAbilities],
        currentLevel: this.currentLevel,
        usedPoints: this.usedPoints,
      },
    };

    return data;
  }

  public allAbilities() {
    return [
      this.selectedRace.abilities,
      this.selectedSubrace.abilities,
      this.selectedClass.abilities,
      this.selectedSubclass?.abilities,
      this.selectedMulticlass?.abilities,
      this.selectedMultiSubclass?.abilities,
    ]
      .filter((a) => !!a)
      .flat();
  }

  public modifiedAttributes() {
    const statNames = [
      'might',
      'constitution',
      'dexterity',
      'perception',
      'intellect',
      'resolve',
    ] as const;

    const object: Partial<Record<(typeof statNames)[number], number>> = {};

    for (const n of statNames) {
      object[n] = this.attributes[n];
      object[n] += this.selectedRace[n];
      object[n] += this.selectedCulture[n];
    }

    return object as Record<(typeof statNames)[number], number>;
  }

  private defaultBuild(): Omit<SavedBuild, 'autoAbilities'> {
    const race = this.races[0];

    const selectedSubraces = this.subraces[race.id];
    const selectedSubrace = selectedSubraces[0];

    const selectedCulture = this.cultures[0];

    const selectedClass = this.classes[0];

    const subclasses = selectedClass.requiresSubclass
      ? this.subclasses[selectedClass.id]
      : undefined;

    const selectedSubclass = subclasses ? subclasses[0] : undefined;

    const attributes = {
      might: 10,
      dexterity: 10,
      constitution: 10,
      intellect: 10,
      perception: 10,
      resolve: 10,
    };

    return {
      attributes,
      selectedRaceId: race.id,
      selectedSubraceId: selectedSubrace.id,
      selectedCultureId: selectedCulture.id,
      selectedClassId: selectedClass.id,
      selectedSubclassId: selectedSubclass?.id,
      abilities: [],

      selectedMulticlassId: undefined,
      selectedMultiSubclassId: undefined,

      currentLevel: 1,
      usedPoints: 0,
    };
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

    this.classes = classes.sort(byDisplayName);

    this.subclasses = $state(subclasses);

    this.races = races.sort(byDisplayName);

    this.subraces = $state(subraces);

    this.cultures = cultures.sort(byDisplayName);

    this.renderers = $state(renderers);

    this.statusEffectManager = $state(statusEffectManager);

    const { build = this.defaultBuild(), version } = savedBuild ?? {};

    const {
      abilities,
      attributes,
      selectedClassId,
      selectedCultureId,
      selectedRaceId,
      selectedSubraceId,
      selectedMultiSubclassId,
      selectedMulticlassId,
      selectedSubclassId,
      currentLevel,
      usedPoints,
    } = build;

    this.currentLevel = $state(currentLevel);

    this.usedPoints = $state(usedPoints);

    this.selectedAbilities = $state(abilities);

    this.attributes = $state(attributes);

    this.selectedRace = $state(this.races.find((r) => r.id === selectedRaceId)!);

    const selectedSubraces = this.subraces[selectedRaceId];

    this.selectedSubrace = $state(selectedSubraces.find((s) => s.id === selectedSubraceId)!);

    this.selectedCulture = $state(this.cultures.find((c) => c.id === selectedCultureId)!);

    this.selectedClass = $state(this.classes.find((c) => c.id === selectedClassId)!);

    const selectedSubclasses = this.subclasses[selectedClassId];

    this.selectedSubclass = $state(selectedSubclasses.find((s) => s.id === selectedSubclassId));

    this.selectedMulticlass = $state(this.classes.find((c) => c.id === selectedMulticlassId));

    const multiSubclasses = selectedMulticlassId && this.subclasses[selectedMulticlassId];

    this.selectedMultiSubclass = $state(
      multiSubclasses ? multiSubclasses.find((s) => s.id === selectedMultiSubclassId) : undefined,
    );

    const autoAbilitiesToAdd = $derived(
      this.allAbilities()
        .filter((a) => a.style === UnlockStyle.AutoGrant)
        .map((a) => a.addedAbility!.id),
    );

    this.autoAbilities = $derived(new SvelteSet(autoAbilitiesToAdd));

    if (version?.toString() === '1') {
      const attributeToFix = Object.keys(this.attributes).reduce((acc, next) => {
        if (this.attributes[next] > this.attributes[acc]) return next;
        return acc;
      });

      attributes[attributeToFix as keyof typeof attributes] -= 3;
    }
  }
}

export const [getDeadfireContext, setDeadfireContext] = createContext<() => DeadfireContext>();
