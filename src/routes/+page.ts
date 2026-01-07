import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const cultures: CultureDto[] = await (await fetch('/culture')).json();
  const classes: ClassDto[] = await (await fetch('/class')).json();
  const races: RaceDto[] = await (await fetch('/race')).json();
  const subclasses: SubclassDto[] = await (await fetch('/subclass')).json();
  const subraces: SubraceDto[] = await (await fetch('/subrace')).json();
  const statusEffectManager: StatusEffectManagerEntryDto[] = await (
    await fetch('status-effect-manager')
  ).json();

  const subclassMap: Record<string, SubclassDto[]> = {};
  subclasses.forEach((s) => {
    subclassMap[s.classId] ??= [];
    subclassMap[s.classId].push(s);
  });

  const subraceMap: Record<string, SubraceDto[]> = {};
  subraces.forEach((s) => {
    subraceMap[s.raceId] ??= [];
    subraceMap[s.raceId].push(s);
  });

  return {
    cultures,
    classes,
    races,
    subclasses,
    subraces,
    statusEffectManager,
  };
};
