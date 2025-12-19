import type { Transaction } from 'sequelize';
import {
  ClassModel,
  ProgressionTableManagerModel,
} from '../../../../src/lib/db/index.ts';
import {
  progressionTableManagerGameDataSchema,
  type ProgressionTableManagerGameData,
} from '../../schemas/global/gamedata/progression-table-manager.gamedata.ts';
import { Parser } from '../parser.ts';

export class ProgressionTableManagerParser extends Parser<
  ProgressionTableManagerGameData,
  ProgressionTableManagerModel,
  typeof ProgressionTableManagerModel
> {
  public readonly type = 'Game.GameData.ProgressionTableManagerGameData';

  public readonly model = ProgressionTableManagerModel;

  public override parse(o: unknown) {
    const data = progressionTableManagerGameDataSchema.parse(o);

    const component = data.Components[0];

    return {
      raw: data,
      parsed: {
        id: data.ID,
        attributePoints: component.CharacterCreationAttributePoints,
        maxAttributeGulf: component.CharacterCreationMaxAttributeGulf,
        attributeMinimum: component.CharacterCreationAttributeMinimum,
        attributeMaximum: component.CharacterCreationAttributeMaximum,
        baseStat: component.CharacterCreationBaseStat,
      },
    };
  }

  public override bulkCreate() {
    return ProgressionTableManagerModel.bulkCreate(this.parsed);
  }

  public override async _addReferences(
    model: ProgressionTableManagerModel,
    transaction: Transaction,
  ) {
    const data = this.raw[model.id];

    const component = data.Components[0];

    for (const t of component.ClassTables) {
      const clazz = await ClassModel.findByPk(t.CharacterClassID, {
        transaction,
      });

      if (!clazz) {
        throw new Error(`Class ${t.CharacterClassID} not found`);
      }

      await clazz.setProgressionTable(t.TableID, { save: false, transaction });
    }
  }
}
