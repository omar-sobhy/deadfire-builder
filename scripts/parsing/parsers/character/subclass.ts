import { SubclassModel } from '../../../../src/lib/db/index.ts';
import {
  characterSubclassGameDataSchema,
  type CharacterSubclassGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class SubclassParser extends Parser<
  CharacterSubclassGameData,
  SubclassModel,
  typeof SubclassModel
> {
  public readonly type = 'Game.GameData.CharacterSubClassGameData';

  public readonly model = SubclassModel;

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

  protected async _addReferences(model: SubclassModel) {
    const data = this.raw[model.id];

    if (
      data.Components[0].ForClassID !== '00000000-0000-0000-0000-000000000000'
    ) {
      model.setClass(data.Components[0].ForClassID);
    }
  }
}
