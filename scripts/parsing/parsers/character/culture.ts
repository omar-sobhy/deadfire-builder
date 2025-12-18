import { CultureModel } from '../../../../src/lib/db/index.ts';
import {
  cultureGameDataSchema,
  type CultureGameData,
} from '../../schemas/culture/culture.gamedata.ts';
import { Parser } from '../parser.ts';

export class CultureParser extends Parser<
  CultureGameData,
  CultureModel,
  typeof CultureModel
> {
  public readonly type = 'Game.GameData.CultureGameData';

  public readonly model = CultureModel;

  public parse(o: unknown) {
    const data = cultureGameDataSchema.parse(o);

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,
        icon: data.Components[0].Icon,
        constitution: data.Components[0].Constitution,
        dexterity: data.Components[0].Dexterity,
        intellect: data.Components[0].Intellect,
        might: data.Components[0].Might,
        perception: data.Components[0].Perception,
        resolve: data.Components[0].Resolve,
      },
    };
  }

  public async bulkCreate() {
    return CultureModel.bulkCreate(this.parsed);
  }
}
