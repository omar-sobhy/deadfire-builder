import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class BaseStatsModel extends Model<
  InferAttributes<BaseStatsModel>,
  InferCreationAttributes<BaseStatsModel>
> {
  declare id: string;
  declare deflection: number;
  declare fortitude: number;
  declare reflexes: number;
  declare will: number;
  declare meleeAccuracy: number;
  declare rangedAccuary: number;
  declare maxHealth: number;
  declare healthPerLevel: number;

  static initModel(sequelize: Sequelize) {
    return BaseStatsModel.init(
      {
        id: { primaryKey: true, type: 'string' },
        deflection: { type: 'number', allowNull: false },
        fortitude: { type: 'number', allowNull: false },
        reflexes: { type: 'number', allowNull: false },
        will: { type: 'number', allowNull: false },
        meleeAccuracy: { type: 'number', allowNull: false },
        rangedAccuary: { type: 'number', allowNull: false },
        maxHealth: { type: 'number', allowNull: false },
        healthPerLevel: { type: 'number', allowNull: false },
      },
      { sequelize, underscored: true },
    );
  }
}
