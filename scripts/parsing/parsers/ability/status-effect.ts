import type { Transaction } from 'sequelize';
import { StatusEffectModel } from '../../../../src/lib/db/models/data/ability/status-effect.model.ts';
import {
  statusEffectGameDataSchema,
  StatusEffectGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class StatusEffectParser extends Parser<
  StatusEffectGameData,
  StatusEffectModel,
  typeof StatusEffectModel
> {
  public readonly type = 'Game.GameData.StatusEffectGameData';

  public readonly model = StatusEffectModel;

  public parse(o: unknown) {
    const data = statusEffectGameDataSchema.parse(o);

    return {
      raw: data,
      parsed: {
        id: data.ID,
        type: data.Components[0].StatusEffectType,
        baseValue: data.Components[0].BaseValue,
        durationType: data.Components[0].DurationType,
        duration: data.Components[0].Duration,
      },
    };
  }

  public async bulkCreate() {
    return StatusEffectModel.bulkCreate(this.parsed);
  }

  protected async _addReferences(
    model: StatusEffectModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    if (data.Components[0].OverrideDescriptionString !== -1) {
      model.setOverrideDescription(
        data.Components[0].OverrideDescriptionString,
        { transaction },
      );
    }

    model.setKeywords(data.Components[0].KeywordsIDs, { transaction });
  }
}
