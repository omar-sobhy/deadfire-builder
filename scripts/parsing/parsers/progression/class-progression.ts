import type { Transaction } from 'sequelize';
import {
  AbilityUnlockModel,
  ClassProgressionModel,
} from '../../../../src/lib/db/index.ts';
import {
  classProgressionGameDataSchema,
  type ClassProgressionGameData,
} from '../../schemas/progression/gamedata/class-progression.gamedata.ts';
import { warn } from '../../util.ts';
import { Parser } from '../parser.ts';

export class ClassProgressionParser extends Parser<
  ClassProgressionGameData,
  ClassProgressionModel,
  typeof ClassProgressionModel
> {
  public readonly type = 'Game.GameData.ClassProgressionTableGameData';

  public readonly model = ClassProgressionModel;

  public parse(o: unknown) {
    const data = classProgressionGameDataSchema.parse(o);

    const component = data.Components.find(
      (c) => c.$type === 'BaseProgressionTableComponent',
    );

    if (!component) {
      warn(
        `Skipping class progression table ${data.ID} (no base progression table component found)`,
      );
      return;
    }

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
      },
    };
  }

  public override async bulkCreate() {
    return await ClassProgressionModel.bulkCreate(this.parsed);
  }

  protected override async _addReferences(
    model: ClassProgressionModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    const component = data.Components.find(
      (c) => c.$type === 'BaseProgressionTableComponent',
    )!;

    for (const a of component.AbilityUnlocks) {
      const newModel = await AbilityUnlockModel.create(
        {
          category: a.Category,
          note: a.Note,
          style: a.UnlockStyle,
          mutuallyExclusive: a.Prerequisites.IsMutuallyExclusiveUpgrade,
          minimumCharacterLevel: a.Prerequisites.MinimumCharacterLevel,
          minimumPowerLevel:
            a.Prerequisites.PowerLevelRequirement.MinimumPowerLevel,
        },
        { transaction },
      );

      if (a.AddAbilityID !== '00000000-0000-0000-0000-000000000000') {
        await newModel.setAddedAbility(a.AddAbilityID, {
          save: false,
          transaction,
        });
      }

      if (a.RemoveAbilityID !== '00000000-0000-0000-0000-000000000000') {
        await newModel.setRemovedAbility(a.RemoveAbilityID, {
          save: false,
          transaction,
        });
      }

      await newModel.setClassProgression(model.id, {
        save: false,
        transaction,
      });

      await newModel.save({ transaction });
    }
  }
}
