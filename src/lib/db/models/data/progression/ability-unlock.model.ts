import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type CreationOptional,
  type HasOneGetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import type { ProgressionCategory } from '../../../../../types/enums/progression-category.js';
import type { UnlockStyle } from '../../../../../types/enums/unlock-style.js';
import { AbilityModel } from '../ability/ability.model.js';
import { ClassProgressionModel } from './class-progression.model.js';
import { AbilityUnlockClassModel } from './ability-unlock-class.model.js';
import { AbilityUnlockRaceModel } from './ability-unlock-race.model.js';
import { AbilityUnlockSubclassModel } from './ability-unlock-subclass.model.js';
import { AbilityUnlockSubraceModel } from './ability-unlock-subrace.model.js';

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

  declare requiredAbility?: NonAttribute<AbilityModel | null>;
  declare addedAbility?: NonAttribute<AbilityModel>;
  declare removedAbility?: NonAttribute<AbilityModel | null>;
  declare classProgression?: NonAttribute<ClassProgressionModel>;
  declare classAbilityUnlock?: NonAttribute<AbilityUnlockClassModel | null>;
  declare raceAbilityUnlock?: NonAttribute<AbilityUnlockRaceModel | null>;
  declare subclassAbilityUnlock?: NonAttribute<AbilityUnlockSubclassModel | null>;
  declare subraceAbilityUnlock?: NonAttribute<AbilityUnlockSubraceModel | null>;

  declare getRequiredAbility: BelongsToGetAssociationMixin<AbilityModel>;
  declare setRequiredAbility: BelongsToSetAssociationMixin<
    AbilityModel,
    string
  >;

  declare getAddedAbility: BelongsToGetAssociationMixin<AbilityModel>;
  declare setAddedAbility: BelongsToSetAssociationMixin<AbilityModel, string>;

  declare getRemovedAbility: BelongsToGetAssociationMixin<AbilityModel | null>;
  declare setRemovedAbility: BelongsToSetAssociationMixin<AbilityModel, string>;

  declare getClassProgression: BelongsToGetAssociationMixin<ClassProgressionModel>;
  declare setClassProgression: BelongsToSetAssociationMixin<
    ClassProgressionModel,
    string
  >;

  declare getClassAbilityUnlock: HasOneGetAssociationMixin<AbilityUnlockClassModel | null>;
  declare getRaceAbilityUnlock: HasOneGetAssociationMixin<AbilityUnlockRaceModel | null>;
  declare getSubclassAbilityUnlock: HasOneGetAssociationMixin<AbilityUnlockSubclassModel | null>;
  declare getSubraceAbilityUnlock: HasOneGetAssociationMixin<AbilityUnlockSubraceModel | null>;

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

  public static includes() {
    return [
      { model: AbilityUnlockClassModel, as: 'classAbilityUnlock' },
      { model: AbilityUnlockRaceModel, as: 'raceAbilityUnlock' },
      { model: AbilityUnlockSubclassModel, as: 'subclassAbilityUnlock' },
      { model: AbilityUnlockSubraceModel, as: 'subraceAbilityUnlock' },
      { model: AbilityModel, as: 'requiredAbility' },
      { model: AbilityModel, as: 'addedAbility' },
      { model: AbilityModel, as: 'removedAbility' },
      { model: ClassProgressionModel, as: 'classProgression' },
    ];
  }

  public static setAssociations() {
    this.belongsTo(AbilityModel, {
      as: 'requiredAbility',
    });

    this.hasOne(AbilityUnlockClassModel, {
      as: 'classAbilityUnlock',
      foreignKey: 'ability_unlock_id',
    });

    this.hasOne(AbilityUnlockRaceModel, {
      as: 'raceAbilityUnlock',
      foreignKey: 'ability_unlock_id',
    });

    this.hasOne(AbilityUnlockSubclassModel, {
      as: 'subclassAbilityUnlock',
      foreignKey: 'ability_unlock_id',
    });

    this.hasOne(AbilityUnlockSubraceModel, {
      as: 'subraceAbilityUnlock',
      foreignKey: 'ability_unlock_id',
    });

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
