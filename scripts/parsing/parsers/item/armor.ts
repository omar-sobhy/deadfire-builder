import { ArmorModel } from '../../../../src/lib/db/index.ts';
import {
  equippableGameDataSchema,
  type EquippableGameData,
} from '../../schemas/items/equippable.gamedata.ts';
import { Parser } from '../parser.ts';

export class ArmorParser extends Parser<
  EquippableGameData,
  ArmorModel,
  typeof ArmorModel
> {
  public readonly type = 'Game.GameData.EquippableGameData';

  public readonly model = ArmorModel;

  public parse(o: unknown) {
    const data = equippableGameDataSchema.parse(o);

    const component = data.Components[2];

    if (!component || component?.$type !== 'ArmorComponent') {
      return;
    }

    return {
      raw: data,
      parsed: {
        id: data.ID,
        debugName: data.DebugName,

        isUnique: data.Components[0].IsUnique,

        material: component.ArmorMaterial,
        category: component.ArmorCategory,

        baseLevel: component.LevelScaling.BaseLevel,
        levelAdjustment: component.LevelScaling.ArmorRatingAdjustment,
        levelIncrement: component.LevelScaling.LevelIncrement,
        maxLevel: component.LevelScaling.MaxLevel,

        burn: component.OverrideBurnRating,
        corrode: component.OverrideCorrodeRating,
        crush: component.OverrideCrushRating,
        freeze: component.OverrideFreezeRating,
        pierce: component.OverridePierceRating,
        shock: component.OverrideShockRating,
        slash: component.OverrideSlashRating,
      },
    };
  }

  public async bulkCreate() {
    return ArmorModel.bulkCreate(this.parsed);
  }
}
