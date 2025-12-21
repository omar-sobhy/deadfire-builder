import { type AbilityUnlockSubclassModel } from '$lib/db/index.js';
import type { AbilityUnlockDto } from '$lib/dtos/ability-unlock.dto.js';
import { abilityModelToDto } from './ability.js';
import { dereference } from '$lib/utils.js';

export async function subclassAbilityUnlockModelToDto(
  model: AbilityUnlockSubclassModel,
): Promise<AbilityUnlockDto> {
  const abilityUnlock = await dereference(
    model,
    'abilityUnlock',
    model.getAbilityUnlock,
  )!;

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

  const addedAbilityDto = addedAbility
    ? await abilityModelToDto(addedAbility)
    : undefined;

  const removedAbility = await dereference(
    abilityUnlock!,
    'removedAbility',
    abilityUnlock!.getRemovedAbility,
  );

  const removedAbilityDto = removedAbility
    ? await abilityModelToDto(removedAbility)
    : undefined;

  const subclass = await dereference(model, 'subclass', model.getSubclass)!;

  return {
    id: model.id,
    icon: addedAbility?.icon ?? '',
    addedAbility: addedAbilityDto,
    removedAbility: removedAbilityDto,
    category: abilityUnlock!.category,
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
    note,
    progressionDetails: {
      type: 'subclass',
      id: subclass!.id,
    },
    style,
  };
}
