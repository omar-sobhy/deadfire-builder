import type { Transaction } from 'sequelize';
import { SubclassModel } from '../../../../src/lib/db/index.ts';
import {
  characterSubclassGameDataSchema,
  type CharacterSubclassGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';
import type { CharacterSubclassComponent } from '../../schemas/classes/components/character-subclass.component.ts';
import { warn } from 'console';

export class SubclassParser extends Parser<
  CharacterSubclassGameData,
  SubclassModel,
  typeof SubclassModel
> {
  public readonly type = 'Game.GameData.CharacterSubClassGameData';

  public readonly model = SubclassModel;

  public override matches(o: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const o_ = o as any;

    const allowed = [
      'CharacterSubClassGameData',
      'PriestSubClassGameData',
      'PaladinSubClassGameData',
    ];

    for (const a of allowed) {
      if (o_.$type?.includes(a)) {
        return true;
      }
    }

    return false;
  }

  public parse(o: unknown) {
    const data = characterSubclassGameDataSchema.parse(o);

    return {
      raw: data,
      parsed: {
        id: data.ID,
      },
    };
  }

  public async bulkCreate() {
    return SubclassModel.bulkCreate(this.parsed);
  }

  protected override async _addReferences(
    model: SubclassModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    const component = data.Components.find(
      (c) => c.$type === 'CharacterSubClassComponent',
    );

    if (!component) {
      warn(`Could not find CharacterSubClassComponent for ${model.id}`);
      return;
    }

    const classId = (component as CharacterSubclassComponent).ForClassID;

    if (classId !== '00000000-0000-0000-0000-000000000000') {
      model.setClass(classId, { transaction });
    }
  }
}
