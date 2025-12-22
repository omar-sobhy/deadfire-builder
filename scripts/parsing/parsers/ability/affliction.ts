import type { Transaction } from 'sequelize';
import { StatusEffectModel } from '../../../../src/lib/db/models/data/ability/status-effect.model.ts';
import { Logger } from '../../../../src/lib/utils.ts';
import {
  afflictionGameDataSchema,
  type AfflictionGameData,
} from '../../schemas/abilities/gamedata/affliction.gamedata.ts';
import { Parser } from '../parser.ts';

export class AfflictionParser extends Parser<
  AfflictionGameData,
  StatusEffectModel,
  typeof StatusEffectModel
> {
  public readonly type = 'Game.GameData.AfflictionGameData';

  public readonly model = StatusEffectModel;

  public override parse(o: unknown) {
    const data = afflictionGameDataSchema.parse(o);

    const component = data.Components.find(
      (c) => c.$type === 'StatusEffectComponent',
    );

    if (!component) {
      Logger.getInstance().warn(
        `Affliction ${data.ID} has no StatusEffectComponent`,
      );
      return;
    }

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
        type: component.StatusEffectType,
        baseValue: component.BaseValue,
        durationType: component.DurationType,
        duration: component.Duration,
      },
    };
  }

  public override async bulkCreate() {
    return StatusEffectModel.bulkCreate(this.parsed);
  }

  protected async _addReferences(
    model: StatusEffectModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    const component = data.Components.find(
      (c) => c.$type === 'StatusEffectComponent',
    )!;

    if (component.OverrideDescriptionString !== -1) {
      await model.setOverrideDescription(component.OverrideDescriptionString, {
        transaction,
      });
    }

    await model.setKeywords(component.KeywordsIDs, { transaction });

    return await model.setChildStatusEffects(component.StatusEffectsValueIDs, {
      transaction,
    });
  }
}
