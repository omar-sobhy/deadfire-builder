import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { ProgressionCategory } from '../../../../types/enums/progression-category.js';
import type { UnlockStyle } from '../../../../types/enums/unlock-style.js';
import { AbilityModel } from './ability/ability.model.js';
import { ClassProgressionModel } from './class-progression.model.js';

export class AbilityUnlockModel extends Model<
  InferAttributes<AbilityUnlockModel>,
  InferCreationAttributes<AbilityUnlockModel>
> {
  declare id: CreationOptional<number>;
  declare note: string;
  declare category: ProgressionCategory;
  declare style: UnlockStyle;
  declare minimumCharacterLevel: number | null;
  declare mutuallyExclusive: boolean;
  declare minimumPowerLevel: number;

  declare getAddedAbility: BelongsToGetAssociationMixin<AbilityModel>;
  declare setAddedAbility: BelongsToSetAssociationMixin<AbilityModel, string>;

  declare getRemovedAbility: BelongsToGetAssociationMixin<AbilityModel>;
  declare setRemovedAbility: BelongsToSetAssociationMixin<AbilityModel, string>;

  declare getClassProgression: BelongsToGetAssociationMixin<ClassProgressionModel>;
  declare setClassProgression: BelongsToSetAssociationMixin<
    ClassProgressionModel,
    string
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'integer', primaryKey: true, autoIncrement: true },
        note: { type: 'string', allowNull: false },
        category: { type: 'string', allowNull: false },
        style: { type: 'string', allowNull: false },
        minimumCharacterLevel: 'integer',
        mutuallyExclusive: { type: 'boolean', allowNull: false },
        minimumPowerLevel: { type: 'integer', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'ability_unlock' },
    );
  }

  public static setAssociations() {
    this.belongsTo(AbilityModel, {
      as: 'addedAbility',
    });

    this.belongsTo(AbilityModel, {
      as: 'removedAbility',
    });

    this.belongsTo(ClassProgressionModel, {
      as: 'classProgression',
      foreignKey: 'class_progression_id',
    });
  }
}
