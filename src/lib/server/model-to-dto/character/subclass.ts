import { type SubclassModel } from '$lib/db/index.js';
import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
import { subclassAbilityUnlockModelToDto } from '../ability/subclass-unlock.js';
import { dereference } from '$lib/utils.js';

export async function subclassModelToDto(model: SubclassModel): Promise<SubclassDto> {
  const { id } = model;

  const clazz = await dereference(model, 'class', model.getClass)!;

  const classId = clazz!.id;

  const displayName = await dereference(model, 'displayName', model.getDisplayName);

  const abilities = await dereference(model, 'abilityUnlocks', model.getAbilityUnlocks)!;

  const abilityUnlockDtos = await Promise.all(
    abilities!.map(async (a) => {
      return await subclassAbilityUnlockModelToDto(a);
    }),
  );

  return {
    id,
    abilities: abilityUnlockDtos,
    classId,
    displayName: displayName?.defaultText,
  };
}
