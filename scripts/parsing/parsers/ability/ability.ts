import { AbilityModel } from '../../../../src/lib/db/models/data/ability/ability.model.ts';
import { AbilityType } from '../../../../src/types/enums/ability-type.ts';
import {
  genericAbilityGameDataSchema,
  type GenericAbilityComponent,
  type GenericAbilityGameData,
} from '../../schemas/index.ts';
import { Logger } from '../../../../src/lib/utils.js';

import { Parser } from '../parser.ts';

export class AbilityParser extends Parser<
  GenericAbilityGameData,
  AbilityModel,
  typeof AbilityModel
> {
  public readonly type = '<unused>';

  public model = AbilityModel;

  public matches(o: unknown): boolean {
    if (
      typeof o !== 'object' ||
      o === null ||
      !('$type' in o) ||
      typeof o.$type !== 'string'
    ) {
      return false;
    }

    const type = o.$type;

    const validKeys = Object.keys(AbilityType).filter(
      (k) => k !== AbilityType.Generic,
    );

    for (const k of validKeys) {
      // seperate === check because `Generic` is used in many types
      if (type.includes(k) || type.includes('GenericAbilityGameData')) {
        return true;
      }
    }

    return false;
  }

  public parse(o: unknown) {
    const data = genericAbilityGameDataSchema.parse(o);

    const phraseComponent = data.Components.find(
      (c) => c.$type === AbilityType.Phrase,
    );

    if (phraseComponent) {
      return {
        raw: data,
        parsed: {
          id: data.ID,
          debugName: data.DebugName,
          isPassive: true,
          type: AbilityType.Phrase,
          icon: phraseComponent.Icon ?? '',
        },
      };
    }

    const abilityComponent = data.Components.find(
      (c) => c?.$type === 'GenericAbilityComponent',
    ) as GenericAbilityComponent | undefined;

    if (!abilityComponent) {
      Logger.getInstance().warn(
        `Can't parse ${data.ID} (couldn't find GenericAbilityComponent)`,
      );

      return;
    }

    const index = data.$type.lastIndexOf('GameData');
    const first = data.$type.substring(0, index);

    const parts = first.split('.');
    const componentName = parts[parts.length - 1];

    const type = componentName
      .replaceAll(/Ability/g, '')
      .replaceAll(/GameData/g, '');

    if (!(type in AbilityType)) {
      throw new Error(type);
    }

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
        isPassive: abilityComponent.IsPassive,
        type: type as AbilityType,
        icon: abilityComponent.Icon ?? '',
      },
    };
  }

  public async bulkCreate() {
    return AbilityModel.bulkCreate(this.parsed);
  }
}
