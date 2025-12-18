import { ClassModel } from '../../../../src/lib/db/index.ts';
import {
  characterClassGameDataSchema,
  type CharacterClassGameData,
} from '../../schemas/index.ts';
import { Parser } from '../parser.ts';

export class ClassParser extends Parser<
  CharacterClassGameData,
  ClassModel,
  typeof ClassModel
> {
  public readonly type = 'Game.GameData.CharacterClassGameData';

  public readonly model = ClassModel;

  public parse(o: unknown) {
    const data = characterClassGameDataSchema.parse(o);

    const component = data.Components[0];

    return {
      raw: data,
      parsed: {
        id: data.ID,
        isSpellcaster: component.IsSpellcaster,
        icon: component.Icon,
        requireSubclass: component.RequireSubclass,
        spellIdentifierStringId: component.SpellIdentifierString,
      },
    };
  }

  public async bulkCreate() {
    return ClassModel.bulkCreate(this.parsed);
  }
}
