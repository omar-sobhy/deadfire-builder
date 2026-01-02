import type { ClassDto } from '$lib/dtos/character/class.dto.js';
import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
import type { RaceDto } from '$lib/dtos/character/race.dto.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const cultures: { id: string; data: CultureDto }[] = await (await fetch('/culture')).json();
  const classes: { id: string; data: ClassDto }[] = await (await fetch('/class')).json();
  const races: { id: string; data: RaceDto }[] = await (await fetch('/race')).json();
  const subclasses: { id: string; data: SubclassDto }[] = await (await fetch('/subclass')).json();
  const subraces: { id: string; data: SubraceDto }[] = await (await fetch('/subrace')).json();
  const statusEffectManager: { id: string; data: StatusEffectManagerEntryDto }[] = await (
    await fetch('status-effect-manager')
  ).json();

  return {
    cultures: cultures.map((c) => c.data),
    classes: classes.map((c) => c.data),
    races: races.map((r) => r.data),
    subclasses: subclasses.map((s) => s.data),
    subraces: subraces.map((s) => s.data),
    statusEffectManager: statusEffectManager.map((s) => s.data),
  };
};
