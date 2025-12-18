import type { ClassDto } from '$lib/dtos/class.dto.js';
import { CultureDto } from '$lib/dtos/culture.dto.js';
import { RaceDto } from '$lib/dtos/race.dto.js';
import { SubraceDto } from '$lib/dtos/subrace.dto.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async (event) => {
  const classes: ClassDto[] = await (await event.fetch('/classes')).json();

  const races: RaceDto[] = await (await event.fetch('/races')).json();

  const subraces: SubraceDto[] = await (await event.fetch('/subraces')).json();

  const cultures: CultureDto[] = await (await event.fetch('/cultures')).json();

  return {
    // classes,
    races,
    subraces,
    cultures,
  };
};
