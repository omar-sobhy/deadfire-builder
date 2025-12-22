import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { StatusEffectModel } from './status-effect.model.js';

export class StatusEffectChildModel extends Model<
  InferAttributes<StatusEffectChildModel>,
  InferCreationAttributes<StatusEffectChildModel>
> {
  declare id: number;

  declare parent_id: ForeignKey<string>;
  declare child_id: ForeignKey<string>;

  declare getParent: BelongsToGetAssociationMixin<StatusEffectModel>;
  declare setParent: BelongsToSetAssociationMixin<
    StatusEffectChildModel,
    string
  >;

  declare getChild: BelongsToGetAssociationMixin<StatusEffectModel>;
  declare setChild: BelongsToSetAssociationMixin<
    StatusEffectChildModel,
    string
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', primaryKey: true, autoIncrement: true },
        parent_id: { type: 'string', unique: false },
        child_id: { type: 'string', unique: false },
      },
      { sequelize, underscored: true, tableName: 'status_effect_child' },
    );
  }

  public static setAssociations() {
    this.belongsTo(StatusEffectModel, {
      as: 'parent',
    });

    this.belongsTo(StatusEffectModel, {
      as: 'child',
    });
  }
}
