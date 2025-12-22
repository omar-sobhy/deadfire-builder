import type { Transaction } from 'sequelize';
import { StatusEffectModel } from '../../../../src/lib/db/models/data/ability/status-effect.model.ts';
import {
  statusEffectGameDataSchema,
  StatusEffectGameData,
  type StatusEffectComponent,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';
import {
  afflictionGameDataSchema,
  type AfflictionGameData,
} from '../../schemas/abilities/gamedata/affliction.gamedata.ts';
import { Logger } from '../../../../src/lib/utils.ts';
import {
  changeFormEffectGameDataSchema,
  type ChangeFormEffectGameData,
} from '../../schemas/abilities/gamedata/change-form-effect.gamedata.ts';

export class StatusEffectParser extends Parser<
  StatusEffectGameData | AfflictionGameData | ChangeFormEffectGameData,
  StatusEffectModel,
  typeof StatusEffectModel
> {
  public readonly type =
    /Game.GameData.(StatusEffect|Affliction|ChangeFormEffect)GameData/g;

  public readonly model = StatusEffectModel;

  public parse(o: unknown) {
    const o_ = o as {
      $type: string;
      ID: string;
      DebugName?: string;
    };

    let data;
    if (o_.$type.includes('AfflictionGameData')) {
      data = afflictionGameDataSchema.parse(o);
    } else if (o_.$type.includes('StatusEffectGameData')) {
      data = statusEffectGameDataSchema.parse(o);
    } else if (o_.$type.includes('ChangeFormEffectGameData')) {
      data = changeFormEffectGameDataSchema.parse(o);
    } else {
      Logger.getInstance().warn(
        `[StatusEffect] No parser for ${o_.$type} (${o_.DebugName} ${o_.ID})`,
      );
      return;
    }

    const component = data.Components.find(
      (c) => c.$type === 'StatusEffectComponent',
    ) as StatusEffectComponent | undefined;

    if (!component) {
      Logger.getInstance().warn(
        `${data.$type} (${data.DebugName} ${data.ID}) has no StatusEffectComponent`,
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

  public async bulkCreate() {
    return StatusEffectModel.bulkCreate(this.parsed);
  }

  protected async _addReferences(
    model: StatusEffectModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    const component = data.Components.find(
      (c) => c.$type === 'StatusEffectComponent',
    ) as StatusEffectComponent;

    if (component.OverrideDescriptionString !== -1) {
      await model.setOverrideDescription(component.OverrideDescriptionString, {
        transaction,
      });
    }

    await model.setKeywords(component.KeywordsIDs, { transaction });

    const filtered = component.StatusEffectsValueIDs.filter((s) => {
      if (s === '00000000-0000-0000-0000-000000000000') {
        return false;
      }

      if (!this.raw[s]) {
        Logger.getInstance().warn(
          `[StatusEffect] ${model.debugName} (${model.id}) has reference to ${s} which was not parsed`,
        );
        return false;
      }

      return true;
    });

    await model.setChildStatusEffects(filtered, {
      transaction,
    });
  }
}
