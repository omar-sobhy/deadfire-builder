import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class StatusEffectStringTableModel extends Model<
  InferAttributes<StatusEffectStringTableModel>,
  InferCreationAttributes<StatusEffectStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'number', primaryKey: true },
        defaultText: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'item_stringtable' },
    );
  }
}
