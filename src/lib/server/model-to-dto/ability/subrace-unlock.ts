import { type AbilityUnlockSubraceModel } from '$lib/db/index.js';
import type { AbilityUnlockDto } from '$lib/dtos/ability-unlock.dto.js';
import { dereference } from '$lib/utils.js';
import { abilityModelToDto } from './ability.js';

export async function subraceAbilityUnlockModelToDto(
  model: AbilityUnlockSubraceModel,
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

  const subrace = await dereference(model, 'subrace', model.getSubrace);

  return {
    id: model.id,
    icon: addedAbility?.icon ?? '',
    addedAbility: addedAbilityDto,
    removedAbility: removedAbilityDto || undefined,
    category: abilityUnlock!.category,
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
    note,
    progressionDetails: {
      type: 'subrace',
      id: subrace!.id,
    },
    style,
  };
}
