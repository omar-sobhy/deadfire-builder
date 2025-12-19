import {
  Model,
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { WeaponType } from '../../../../../types/enums/weapon-type.js';
import type { PermittedEquipmentSlot } from '../../../../../types/enums/permitted-equipment-slot.js';
import { ItemModModel } from './item-mod.model.js';
import { ClassModel } from '../character/class.model.js';
import { ItemStringTableModel } from '../../stringtables/item.stringtable.model.js';

export class WeaponModel extends Model<
  InferAttributes<WeaponModel>,
  InferCreationAttributes<WeaponModel>
> {
  declare id: string;

  declare equipmentType: WeaponType;
  declare equipmentSlot: PermittedEquipmentSlot;

  declare getDescriptionText: BelongsToGetAssociationMixin<ItemStringTableModel>;
  declare setDescriptionText: BelongsToSetAssociationMixin<
    ItemStringTableModel,
    number
  >;

  declare getDisplayName: BelongsToGetAssociationMixin<ItemStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    ItemStringTableModel,
    number
  >;

  declare getItemMods: HasManyGetAssociationsMixin<ItemModModel>;
  declare addItemMod: HasManyAddAssociationMixin<ItemModModel, string>;
  declare addItemMods: HasManyAddAssociationsMixin<ItemModModel, string>;

  declare classRestriction: HasManyGetAssociationsMixin<ClassModel>;
  declare addClassRestriction: HasManyAddAssociationMixin<ClassModel, string>;
  declare addClassRestrictions: HasManyAddAssociationsMixin<ClassModel, string>;

  declare static associations: {
    displayName: Association<WeaponModel, ItemStringTableModel>;
    descriptionText: Association<WeaponModel, ItemStringTableModel>;
    itemMod: Association<WeaponModel, ItemModModel>;
    classRestriction: Association<WeaponModel, ClassModel>;
  };

  public static initModel(sequelize: Sequelize) {
    return WeaponModel.init(
      {
        id: { type: 'string', primaryKey: true },
        equipmentType: { type: 'string', allowNull: false },
        equipmentSlot: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'weapon' },
    );
  }

  public static setAssociations() {
    this.belongsTo(ItemStringTableModel, {
      as: 'descriptionText',
    });

    this.belongsTo(ItemStringTableModel, {
      as: 'displayName',
    });

    this.hasMany(ItemModModel, {
      as: 'itemMods',
      foreignKey: 'weapon_id',
    });

    this.hasMany(ClassModel, {
      as: 'classRestrictions',
      foreignKey: 'weapon_id',
    });
  }
}
