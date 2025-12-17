import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class ItemStringTableModel extends Model<
  InferAttributes<ItemStringTableModel>,
  InferCreationAttributes<ItemStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return ItemStringTableModel.init(
      {
        id: { type: 'number', primaryKey: true },
        defaultText: { type: 'string', allowNull: false },
      },
      {
        sequelize,
        underscored: true,
      },
    );
  }
}
