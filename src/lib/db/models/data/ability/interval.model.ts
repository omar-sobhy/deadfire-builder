import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';

export class IntervalModel extends Model<
  InferAttributes<IntervalModel>,
  InferCreationAttributes<IntervalModel>
> {
  declare id: string;
  declare debugName: string;
  declare interval: number;
  declare onlyWhileMoving: boolean;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
        interval: { type: 'number', allowNull: false },
        onlyWhileMoving: { type: 'boolean', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'interval' },
    );
  }
}
