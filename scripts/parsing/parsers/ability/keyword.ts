import { Parser } from '../parser.ts';
import { KeywordModel } from '../../../../src/lib/db/models/data/character/keyword.model.ts';
import {
  type KeywordGameData,
  keywordGameDataSchema,
} from '../../schemas/index.ts';

export class KeywordParser extends Parser<
  KeywordGameData,
  KeywordModel,
  typeof KeywordModel
> {
  public readonly type = 'Game.GameData.KeywordGameData';

  public readonly model = KeywordModel;

  public parse(o: unknown) {
    const data = keywordGameDataSchema.parse(o);

    return {
      raw: data,
      parsed: {
        id: data.ID,
        icon: data.Components[0].Icon,
      },
    };
  }

  public async bulkCreate() {
    return KeywordModel.bulkCreate(this.parsed);
  }
}
