import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyGetAssociationsMixin,
  type BelongsToManySetAssociationsMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManySetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import type { StatusEffectType } from '../../../../../types/enums/status-effect-type.js';
import { StatusEffectStringTableModel } from '../../stringtables/status-effect.stringtable.model.js';
import { KeywordModel } from '../character/keyword.model.js';
import type { DurationType } from '../../../../../types/enums/duration-type.js';
import { StatusEffectChildModel } from './status-effect-child.model.js';
import type { StatusEffectValueType } from '../../../../../types/enums/status-effect-value-type.js';
import type { StatusEffectOperator } from '../../../../../types/enums/status-effect-operator.js';
import type { IntervalModel } from './interval.model.js';

export class StatusEffectModel extends Model<
  InferAttributes<StatusEffectModel>,
  InferCreationAttributes<StatusEffectModel>
> {
  declare id: string;
  declare debugName: string;
  declare type: StatusEffectType;
  declare baseValue: number;
  declare durationType: DurationType;
  declare duration: number;

  declare dynamicValueStat: StatusEffectValueType | null;
  declare dynamicValueModifier: number | null;
  declare dynamicValueOperator: StatusEffectOperator | null;

  declare overrideDescription?: NonAttribute<StatusEffectStringTableModel>;
  declare keywords?: NonAttribute<KeywordModel[]>;
  declare childStatusEffects?: NonAttribute<StatusEffectModel[]>;
  declare interval?: NonAttribute<IntervalModel>;

  declare getOverrideDescription: BelongsToGetAssociationMixin<StatusEffectStringTableModel | null>;
  declare setOverrideDescription: BelongsToSetAssociationMixin<
    StatusEffectStringTableModel,
    number
  >;

  declare getKeywords: HasManyGetAssociationsMixin<KeywordModel>;
  declare setKeywords: HasManySetAssociationsMixin<KeywordModel, string>;

  declare getChildStatusEffects: BelongsToManyGetAssociationsMixin<StatusEffectModel>;
  declare addChildStatusEffect: BelongsToManyAddAssociationMixin<
    StatusEffectModel,
    string
  >;
  declare setChildStatusEffects: BelongsToManySetAssociationsMixin<
    StatusEffectModel,
    string
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
        type: { type: 'string', allowNull: false },
        baseValue: { type: 'number', allowNull: false },
        durationType: { type: 'string', allowNull: false },
        duration: { type: 'number', allowNull: false },
        dynamicValueModifier: 'number',
        dynamicValueOperator: 'string',
        dynamicValueStat: 'string',
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

    this.belongsToMany(StatusEffectModel, {
      as: 'childStatusEffects',
      through: {
        model: StatusEffectChildModel,
        unique: false,
      },
      sourceKey: 'id',
      targetKey: 'id',
      foreignKey: 'parent_id',
      otherKey: 'child_id',
    });
  }
}
