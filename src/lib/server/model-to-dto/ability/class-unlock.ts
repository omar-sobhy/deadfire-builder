import { type AbilityUnlockClassModel } from '$lib/db/index.js';
import type { AbilityUnlockDto } from '$lib/dtos/ability-unlock.dto.js';
import { abilityModelToDto } from './ability.js';
import { dereference } from '$lib/utils.js';

export async function classAbilityUnlockModelToDto(
  model: AbilityUnlockClassModel,
): Promise<AbilityUnlockDto> {
  const abilityUnlock = await dereference(
    model,
    'abilityUnlock',
    model.getAbilityUnlock,
  );

  const {
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
    note,
    style,
  } = abilityUnlock!;

  const addedAbility = await dereference(
    abilityUnlock!,
    'addedAbility',
    abilityUnlock!.getAddedAbility,
  );

  const addedAbilityDto =
    addedAbility && (await abilityModelToDto(addedAbility));

  const removedAbility = await dereference(
    abilityUnlock!,
    'removedAbility',
    abilityUnlock!.getRemovedAbility,
  );

  const removedAbilityDto =
    removedAbility && (await abilityModelToDto(removedAbility));

  const clazz = await dereference(model, 'class', model.getClass);

  return {
    id: model.id,
    icon: addedAbility?.icon ?? '',
    addedAbility: addedAbilityDto ?? undefined,
    removedAbility: removedAbilityDto ?? undefined,
    category: abilityUnlock!.category,
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
    note,
    progressionDetails: {
      type: 'class',
      id: clazz!.id,
    },
    style,
  };
}
