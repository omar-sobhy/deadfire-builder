import { Op, type Transaction } from 'sequelize';
import {
  AbilityUnlockSubraceModel,
  AbilityUnlockModel,
  ClassProgressionModel,
  SubraceModel,
  RaceModel,
  AbilityUnlockRaceModel,
  ClassModel,
  AbilityUnlockClassModel,
  SubclassModel,
  AbilityUnlockSubclassModel,
} from '../../../../src/lib/db/index.ts';
import {
  classProgressionGameDataSchema,
  type ClassProgressionGameData,
} from '../../schemas/progression/gamedata/class-progression.gamedata.ts';
import { Parser } from '../parser.ts';
import { ConditionalOperator } from '../../../../src/types/enums/conditional-operator.ts';
import type {
  BaseProgressionComponent,
  conditionalCallSchema,
  conditionalExpressionSchema,
} from '../../schemas/progression/components/base-progression.component.ts';
import type z from 'zod';
import { Logger } from '../../../../src/lib/utils.js';

type Conditional =
  BaseProgressionComponent['AbilityUnlocks'][number]['Prerequisites']['Conditional'];

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
      Logger.getInstance().warn(
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

  private async parseConditional(
    abilityUnlock: AbilityUnlockModel,
    conditional: Conditional,
    transaction: Transaction,
  ) {
    const conditionalComponents = conditional.Components;

    for (const c of conditionalComponents) {
      if (c.$type === 'ConditionalCall') {
        await this.parseConditionalCall(abilityUnlock, c, transaction);
      } else {
        await this.parseConditionalExpression(abilityUnlock, c, transaction);
      }

      if (c.Operator === ConditionalOperator.And) {
        break;
      }
    }
  }

  private async parseConditionalCall(
    abilityUnlock: AbilityUnlockModel,
    conditional: z.infer<typeof conditionalCallSchema>,
    transaction: Transaction,
  ) {
    // todo: refactor...
    if (conditional.Data.FullName.includes('IsRace')) {
      const race = await RaceModel.findByPk(conditional.Data.Parameters[0], {
        transaction,
      });

      if (!race) {
        throw new Error(`Race ${conditional.Data.Parameters[0]} not found`);
      }

      const abilityUnlockRace = await AbilityUnlockRaceModel.create(
        {},
        { transaction },
      );

      await abilityUnlockRace.setAbilityUnlock(abilityUnlock.id, {
        transaction,
      });

      await abilityUnlockRace.setRace(race.id, { transaction });
    }

    if (conditional.Data.FullName.includes('IsSubrace')) {
      const subrace = await SubraceModel.findOne({
        where: { type: { [Op.like]: conditional.Data.Parameters[0] } },
        transaction,
      });

      if (!subrace) {
        throw new Error(`Subrace ${conditional.Data.Parameters[0]} not found`);
      }

      const abilityUnlockSubrace = await AbilityUnlockSubraceModel.create(
        {},
        { transaction },
      );

      await abilityUnlockSubrace.setAbilityUnlock(abilityUnlock.id, {
        transaction,
      });

      await abilityUnlockSubrace.setSubrace(subrace.id, { transaction });
    }

    if (conditional.Data.FullName.includes('IsClass')) {
      const clazz = await ClassModel.findByPk(conditional.Data.Parameters[0], {
        transaction,
      });

      if (!clazz) {
        throw new Error(`Class ${conditional.Data.Parameters[0]} not found`);
      }

      const abilityUnlockClass = await AbilityUnlockClassModel.create(
        {},
        { transaction },
      );

      await abilityUnlockClass.setAbilityUnlock(abilityUnlock.id, {
        transaction,
      });

      await abilityUnlockClass.setClass(clazz.id, { transaction });
    }

    if (conditional.Data.FullName.includes('IsSubclass')) {
      const subclass = await SubclassModel.findByPk(
        conditional.Data.Parameters[0],
        {
          transaction,
        },
      );

      if (!subclass) {
        throw new Error(`Subclass ${conditional.Data.Parameters[0]} not found`);
      }

      const abilityUnlockSubrace = await AbilityUnlockSubclassModel.create(
        {},
        { transaction },
      );

      await abilityUnlockSubrace.setAbilityUnlock(abilityUnlock.id, {
        transaction,
      });

      await abilityUnlockSubrace.setSubclass(subclass.id, {
        transaction,
      });
    }
  }

  private async parseConditionalExpression(
    abilityUnlock: AbilityUnlockModel,
    conditional: z.infer<typeof conditionalExpressionSchema>,
    transaction: Transaction,
  ) {
    for (const c of conditional.Components) {
      await this.parseConditionalCall(abilityUnlock, c, transaction);

      if (c.Operator === ConditionalOperator.And) {
        break;
      }
    }
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
      const abilityUnlock = await AbilityUnlockModel.create(
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
        await abilityUnlock.setAddedAbility(a.AddAbilityID, {
          save: false,
          transaction,
        });
      }

      if (a.RemoveAbilityID !== '00000000-0000-0000-0000-000000000000') {
        await abilityUnlock.setRemovedAbility(a.RemoveAbilityID, {
          save: false,
          transaction,
        });
      }

      await abilityUnlock.setClassProgression(model.id, {
        save: false,
        transaction,
      });

      if (
        a.Prerequisites.RequiresAbilityID !==
        '00000000-0000-0000-0000-000000000000'
      ) {
        await abilityUnlock.setRequiredAbility(
          a.Prerequisites.RequiresAbilityID,
          { save: false, transaction },
        );
      }

      const newAbilityUnlock = await abilityUnlock.save({ transaction });

      const conditional = a.Prerequisites.Conditional;

      await this.parseConditional(newAbilityUnlock, conditional, transaction);
    }
  }
}
