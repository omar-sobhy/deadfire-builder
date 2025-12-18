import { raceGameDataSchema, type RaceGameData } from '../../schemas/index.ts';
import { RaceModel } from '../../../../src/lib/db/index.ts';
import { Parser } from '../parser.ts';

export class RaceParser extends Parser<
  RaceGameData,
  RaceModel,
  typeof RaceModel
> {
  public readonly type = 'Game.GameData.RaceGameData';

  public readonly model = RaceModel;

  public parse(o: unknown) {
    const data = raceGameDataSchema.parse(o);

    const component = data.Components[0];

    return {
      raw: data,
      parsed: {
        debugName: data.DebugName,
        id: data.ID,
        icon: component.Icon,
        resolve: component.Resolve,
        might: component.Might,
        dexterity: component.Dexterity,
        intellect: component.Intellect,
        constitution: component.Constitution,
        perception: component.Perception,
        isKith: component.IsKith,
      },
    };
  }

  public async bulkCreate() {
    return RaceModel.bulkCreate(this.parsed);
  }
}
