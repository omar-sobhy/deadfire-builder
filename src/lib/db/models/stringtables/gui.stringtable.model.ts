import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class GuiStringTableModel extends Model<
  InferAttributes<GuiStringTableModel>,
  InferCreationAttributes<GuiStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return GuiStringTableModel.init(
      {
        id: { type: 'number', primaryKey: true },
        defaultText: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'gui_stringtable' },
    );
  }
}
