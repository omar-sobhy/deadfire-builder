import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class CyclopediaStringTableModel extends Model<
  InferAttributes<CyclopediaStringTableModel>,
  InferCreationAttributes<CyclopediaStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return CyclopediaStringTableModel.init(
      {
        id: { type: 'number', primaryKey: true },
        defaultText: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'cyclopedia_stringable' },
    );
  }
}
