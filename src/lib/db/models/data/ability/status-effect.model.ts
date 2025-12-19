import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { StatusEffectType } from '../../../../../types/enums/status-effect-type.js';
import { StatusEffectStringTableModel } from '../../stringtables/status-effect.stringtable.model.js';
import { KeywordModel } from '../character/keyword.model.js';
import type { DurationType } from '../../../../../types/enums/duration-type.js';

export class StatusEffectModel extends Model<
  InferAttributes<StatusEffectModel>,
  InferCreationAttributes<StatusEffectModel>
> {
  declare id: string;
  declare type: StatusEffectType;
  declare baseValue: number;
  declare durationType: DurationType;
  declare duration: number;

  declare getOverrideDescription: BelongsToGetAssociationMixin<StatusEffectStringTableModel>;
  declare setOverrideDescription: BelongsToSetAssociationMixin<
    StatusEffectStringTableModel,
    number
  >;

  declare getKeywords: HasManyGetAssociationsMixin<KeywordModel>;
  declare setKeywords: HasManySetAssociationsMixin<KeywordModel, string>;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        type: { type: 'string', allowNull: false },
        baseValue: { type: 'number', allowNull: false },
        durationType: { type: 'string', allowNull: false },
        duration: { type: 'number', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'status_effect' },
    );
  }

  public static setAssociations() {
    this.belongsTo(StatusEffectStringTableModel, {
      as: 'overrideDescription',
    });

    this.hasMany(KeywordModel, {
      as: 'keywords',
      foreignKey: 'status_effect_id',
    });
  }
}
