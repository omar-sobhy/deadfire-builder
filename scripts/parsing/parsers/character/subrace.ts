import type { Transaction } from 'sequelize';
import { SubraceModel } from '../../../../src/lib/db/index.ts';
import {
  subraceGameDataSchema,
  type SubraceGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class SubraceParser extends Parser<
  SubraceGameData,
  SubraceModel,
  typeof SubraceModel
> {
  public readonly type = 'Game.GameData.SubraceGameData';

  public readonly model = SubraceModel;

  public parse(o: unknown) {
    const data = subraceGameDataSchema.parse(o);

    const component = data.Components[0];

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
        type: component.Type,
      },
    };
  }

  public async bulkCreate() {
    return SubraceModel.bulkCreate(this.parsed);
  }

  protected async _addReferences(m: SubraceModel, transaction: Transaction) {
    const data = this.raw[m.id];

    m.setRace(data.Components[0].RaceID, { save: false, transaction });
  }
}
