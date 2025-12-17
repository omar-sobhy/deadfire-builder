import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class AbilityStringTableModel extends Model<
  InferAttributes<AbilityStringTableModel>,
  InferCreationAttributes<AbilityStringTableModel>
> {
  declare id: number;
  declare defaultText: string;

  static initModel(sequelize: Sequelize) {
    return AbilityStringTableModel.init(
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
