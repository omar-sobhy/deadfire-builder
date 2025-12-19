import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class ProgressionTableManagerModel extends Model<
  InferAttributes<ProgressionTableManagerModel>,
  InferCreationAttributes<ProgressionTableManagerModel>
> {
  declare id: string;
  declare attributePoints: number;
  declare maxAttributeGulf: number;
  declare attributeMinimum: number;
  declare attributeMaximum: number;
  declare baseStat: number;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        attributePoints: { type: 'integer', allowNull: false },
        maxAttributeGulf: { type: 'integer', allowNull: false },
        attributeMaximum: { type: 'integer', allowNull: false },
        attributeMinimum: { type: 'integer', allowNull: false },
        baseStat: { type: 'integer', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'progression_table_manager' },
    );
  }
}
