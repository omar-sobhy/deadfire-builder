import {
  Model,
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { ArmorCategory } from '../../../../../types/enums/armor-category.js';
import type { ArmorMaterial } from '../../../../../types/enums/armor-material.js';
import { ItemStringTableModel } from '../../stringtables/item.stringtable.model.js';

export class ArmorModel extends Model<
  InferAttributes<ArmorModel>,
  InferCreationAttributes<ArmorModel>
> {
  declare id: string;
  declare debugName: string;
  declare isUnique: boolean;
  declare category: ArmorCategory;
  declare material: ArmorMaterial;
  declare baseLevel: number;
  declare levelIncrement: number;
  declare maxLevel: number;
  declare levelAdjustment: number;
  declare pierce: number;
  declare slash: number;
  declare crush: number;
  declare burn: number;
  declare freeze: number;
  declare shock: number;
  declare corrode: number;

  declare getDisplayName: BelongsToGetAssociationMixin<ItemStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    ItemStringTableModel,
    number
  >;

  declare getDescriptionText: BelongsToGetAssociationMixin<ItemStringTableModel>;
  declare setDescriptionText: BelongsToSetAssociationMixin<
    ItemStringTableModel,
    number
  >;

  declare static associations: {
    displayName: Association<ArmorModel, ItemStringTableModel>;
    descriptionText: Association<ArmorModel, ItemStringTableModel>;
  };

  static initModel(sequelize: Sequelize) {
    return ArmorModel.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
        isUnique: { type: 'boolean', allowNull: false },
        category: { type: 'string', allowNull: false },
        material: { type: 'string', allowNull: false },
        baseLevel: { type: 'number', allowNull: false },
        levelIncrement: { type: 'number', allowNull: false },
        maxLevel: { type: 'number', allowNull: false },
        levelAdjustment: { type: 'number', allowNull: false },
        pierce: { type: 'number', allowNull: false },
        slash: { type: 'number', allowNull: false },
        crush: { type: 'number', allowNull: false },
        burn: { type: 'number', allowNull: false },
        freeze: { type: 'number', allowNull: false },
        shock: { type: 'number', allowNull: false },
        corrode: { type: 'number', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'armor' },
    );
  }

  static setAssociations() {
    this.belongsTo(ItemStringTableModel, {
      as: 'displayName',
    });

    this.belongsTo(ItemStringTableModel, {
      as: 'descriptionText',
    });
  }
}
