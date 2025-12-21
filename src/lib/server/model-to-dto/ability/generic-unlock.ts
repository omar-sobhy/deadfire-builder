import {
  type AbilityUnlockClassModel,
  type AbilityUnlockModel,
  type AbilityUnlockRaceModel,
  type AbilityUnlockSubclassModel,
  type AbilityUnlockSubraceModel,
} from '$lib/db/index.js';
import type { AbilityUnlockDto } from '$lib/dtos/ability-unlock.dto.js';
import { abilityModelToDto } from './ability.js';
import { dereference } from '$lib/utils.js';

type ProgressionTypeResult = (
  | {
      type: 'class';
      data: AbilityUnlockClassModel;
    }
  | {
      type: 'race';
      data: AbilityUnlockRaceModel;
    }
  | {
      type: 'subclass';
      data: AbilityUnlockSubclassModel;
    }
  | {
      type: 'subrace';
      data: AbilityUnlockSubraceModel;
    }
) & { referenceId: string };

async function progressionType(
  model: AbilityUnlockModel,
): Promise<ProgressionTypeResult | undefined> {
  const classUnlock = await dereference(
    model,
    'classAbilityUnlock',
    model.getClassAbilityUnlock,
  );

  if (classUnlock) {
    const clazz = await dereference(classUnlock, 'class', classUnlock.getClass);

    return { type: 'class', data: classUnlock, referenceId: clazz!.id };
  }

  const raceUnlock = await dereference(
    model,
    'raceAbilityUnlock',
    model.getRaceAbilityUnlock,
  );

  if (raceUnlock) {
    const race = await dereference(raceUnlock, 'race', raceUnlock.getRace);

    return { type: 'race', data: raceUnlock, referenceId: race!.id };
  }

  const subclassUnlock = await dereference(
    model,
    'subclassAbilityUnlock',
    model.getSubclassAbilityUnlock,
  );

  if (subclassUnlock) {
    const subclass = await dereference(
      subclassUnlock,
      'subclass',
      subclassUnlock.getSubclass,
    );

    return {
      type: 'subclass',
      data: subclassUnlock,
      referenceId: subclass!.id,
    };
  }

  const subraceUnlock = await dereference(
    model,
    'subraceAbilityUnlock',
    model.getSubraceAbilityUnlock,
  );

  if (subraceUnlock) {
    const subrace = await dereference(
      subraceUnlock,
      'subrace',
      subraceUnlock.getSubrace,
    );

    return {
      type: 'subrace',
      data: subraceUnlock,
      referenceId: subrace!.id,
    };
  }

  return undefined;
}

export async function genericAbilityUnlockModelToDto(
  model: AbilityUnlockModel,
  type?:
    | { class: string }
    | { race: string }
    | { subclass: string }
    | { subrace: string },
): Promise<AbilityUnlockDto> {
  const {
    id,
    note,
    category,
    style,
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
  } = model;

  const addedAbility = await dereference(
    model,
    'addedAbility',
    model.getAddedAbility,
  );

  const addedAbilityDto = await abilityModelToDto(addedAbility!);

  const removedAbility = await dereference(
    model,
    'removedAbility',
    model.getRemovedAbility,
  );

  const removedAbilityDto =
    removedAbility && (await abilityModelToDto(removedAbility));

  const icon = addedAbility?.icon ?? '';

  let progressionDetails;
  if (type) {
    if ('class' in type)
      progressionDetails = { type: 'class' as const, id: type.class };

    if ('race' in type)
      progressionDetails = { type: 'race' as const, id: type.race };

    if ('subclass' in type)
      progressionDetails = { type: 'subclass' as const, id: type.subclass };

    if ('subrace' in type)
      progressionDetails = { type: 'subrace' as const, id: type.subrace };
  } else {
    const progression = await progressionType(model);

    progressionDetails = progression
      ? {
          type: progression.type,
          id: progression.referenceId,
        }
      : undefined;
  }

  return {
    id,
    note,
    category,
    style,
    icon,
    minimumCharacterLevel,
    minimumPowerLevel,
    mutuallyExclusive,
    addedAbility: addedAbilityDto,
    removedAbility: removedAbilityDto ?? undefined,
    progressionDetails: progressionDetails ?? { type: 'unknown' },
  };
}
