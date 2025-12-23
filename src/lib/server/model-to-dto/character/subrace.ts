import { type SubraceModel } from '$lib/db/index.js';
import { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
import { dereference } from '$lib/utils.js';
import { subraceAbilityUnlockModelToDto } from '../ability/subrace-unlock.js';

export async function subraceModeltoDto(model: SubraceModel) {
  const { id } = model;

  const race = await dereference(model, 'race', model.getRace);

  const raceId = race!.id;

  const summary = await dereference(model, 'summaryText', model.getSummaryText);

  const displayName = await dereference(model, 'displayName', model.getDisplayName);

  const description = await dereference(model, 'descriptionText', model.getDescriptionText);

  const abilities = await dereference(model, 'abilityUnlocks', model.getAbilityUnlocks);

  const abilityUnlockDtos = await Promise.all(
    abilities!.map(async (a) => {
      return await subraceAbilityUnlockModelToDto(a);
    }),
  );

  return new SubraceDto(
    id,
    raceId,
    abilityUnlockDtos,
    displayName?.defaultText,
    summary?.defaultText,
    description?.defaultText,
  );
}
