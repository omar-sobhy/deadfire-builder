import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class ItemModsStringTableModel extends Model<
  InferAttributes<ItemModsStringTableModel>,
  InferCreationAttributes<ItemModsStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return ItemModsStringTableModel.init(
      {
        id: { type: 'number', primaryKey: true },
        defaultText: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'item_mods_stringtable' },
    );
  }
}
