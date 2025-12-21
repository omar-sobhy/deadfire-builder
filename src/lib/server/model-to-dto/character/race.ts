import { type RaceModel } from '$lib/db/index.js';
import { RaceDto } from '$lib/dtos/race.dto.js';
import { dereference } from '$lib/utils.js';

export async function raceModelToDto(model: RaceModel) {
  const {
    id,
    resolve,
    might,
    dexterity,
    constitution,
    intellect,
    perception,
    isKith,
  } = model;

  const displayName = await dereference(
    model,
    'displayName',
    model.getDisplayName,
  );

  const subraces = await model.getSubraces();
  const subraceIds = subraces.map((s) => s.id);

  return new RaceDto(
    id,
    subraceIds,
    resolve,
    might,
    dexterity,
    constitution,
    intellect,
    perception,
    isKith,
    displayName?.defaultText,
  );
}
