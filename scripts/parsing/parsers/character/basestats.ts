import { BaseStatsModel } from '../../../../src/lib/db/index.ts';
import {
  baseStatsGameDataSchema,
  type BaseStatsGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class BaseStatsParser extends Parser<
  BaseStatsGameData,
  BaseStatsModel,
  typeof BaseStatsModel
> {
  public readonly type = 'Game.GameData.BaseStatsGameData';

  public model = BaseStatsModel;

  public parse(o: unknown) {
    const data = baseStatsGameDataSchema.parse(o);

    const component = data.Components[0];

    return {
      raw: data,
      parsed: {
        id: data.ID,
        deflection: component.BaseDeflection,
        fortitude: component.BaseFortitude,
        healthPerLevel: component.HealthPerLevel,
        maxHealth: component.MaxHealth,
        meleeAccuracy: component.MeleeAccuracyBonus,
        rangedAccuary: component.RangedAccuracyBonus,
        reflexes: component.BaseReflexes,
        will: component.BaseWill,
      },
    };
  }

  public async bulkCreate() {
    return BaseStatsModel.bulkCreate(this.parsed);
  }
}
