import { WeaponModel } from '../../../../src/lib/db/index.ts';
import {
  weaponGameDataSchema,
  type WeaponGameData,
} from '../../schemas/items/weapon.gamedata.ts';

import { Parser } from '../parser.ts';

export class WeaponParser extends Parser<
  WeaponGameData,
  WeaponModel,
  typeof WeaponModel
> {
  public readonly type = 'Game.GameData.WeaponGameData';

  public readonly model = WeaponModel;

  private readonly skipIds = ['b3a16aa0-a55d-48af-abcd-af1b72f000cc'];

  public parse(o: unknown) {
    const data = weaponGameDataSchema.parse(o);

    if (this.skipIds.includes(data.ID)) {
      return;
    }

    const components = data.Components;

    return {
      raw: data,
      parsed: {
        id: data.ID,
        equipmentSlot: components[1].EquipmentSlot,
        equipmentType: components[1].EquipmentType,
      },
    };
  }

  public async bulkCreate() {
    return WeaponModel.bulkCreate(this.parsed);
  }
}
