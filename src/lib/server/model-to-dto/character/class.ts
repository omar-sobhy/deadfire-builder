import { type ClassModel } from '$lib/db/index.js';
import { ClassDto } from '$lib/dtos/character/class.dto.js';
import { classAbilityUnlockModelToDto } from '../ability/class-unlock.js';
import { genericAbilityUnlockModelToDto } from '../ability/generic-unlock.js';
import { dereference } from '$lib/utils.js';

export async function classModelToDto(model: ClassModel): Promise<ClassDto> {
  const { id } = model;

  const displayName = await dereference(model, 'displayName', model.getDisplayName);

  const description = await dereference(model, 'descriptionText', model.getDescriptionText);

  const progression = await dereference(model, 'progressionTable', model.getProgressionTable);

  const progressionAbilityUnlocks = await dereference(
    progression!,
    'abilityUnlocks',
    progression!.getAbilityUnlocks,
  );

  const progressionAbilityDtos = await Promise.all(
    progressionAbilityUnlocks!.map((a) => genericAbilityUnlockModelToDto(a, { class: model.id })),
  );

  const abilities = await dereference(model, 'abilityUnlocks', model.getAbilityUnlocks);

  const abilityDtos = await Promise.all(
    abilities!.map(async (a) => {
      return await classAbilityUnlockModelToDto(a);
    }),
  );

  const allAbilities = [progressionAbilityDtos, abilityDtos].flat();

  return {
    id,
    abilities: allAbilities,
    displayName: displayName?.defaultText,
    description: description?.defaultText,
  };
}
