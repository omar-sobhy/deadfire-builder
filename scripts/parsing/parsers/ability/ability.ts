import { AbilityModel } from '../../../../src/lib/db/models/data/ability.model.ts';
import {
  genericAbilityGameDataSchema,
  type GenericAbilityComponent,
  type GenericAbilityGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class AbilityParser extends Parser<
  GenericAbilityGameData,
  AbilityModel,
  typeof AbilityModel
> {
  public readonly type = 'Game.GameData.GenericAbilityGameData';

  public model = AbilityModel;

  public parse(o: unknown) {
    const data = genericAbilityGameDataSchema.parse(o);

    const abilityComponent = data.Components.find((c) =>
      c?.$type.startsWith('Game.GameData.GenericAbilityComponent'),
    ) as GenericAbilityComponent | undefined;

    if (!abilityComponent) {
      console.warn(
        `Can't parse ${data.ID} (couldn't find GenericAbilityComponent)`,
      );

      return;
    }

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
        isPassive: abilityComponent.IsPassive,
      },
    };
  }

  public async bulkCreate() {
    return AbilityModel.bulkCreate(this.parsed);
  }
}
