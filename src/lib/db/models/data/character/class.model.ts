import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { BaseStatsModel } from './base-stats.model.js';
import { GuiStringTableModel } from '../../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../../stringtables/cyclopedia.stringtable.model.js';
import { ClassProgressionModel } from '../progression/class-progression.model.js';
import { AbilityUnlockClassModel } from '../progression/ability-unlock-class.model.js';

export class ClassModel extends Model<
  InferAttributes<ClassModel>,
  InferCreationAttributes<ClassModel>
> {
  declare id: string;
  declare requireSubclass: boolean;
  declare icon: string;
  declare isSpellcaster: boolean;
  declare spellIdentifierStringId: number;

  declare baseStats?: NonAttribute<BaseStatsModel>;
  declare descriptionText?: NonAttribute<GuiStringTableModel | null>;
  declare displayName?: NonAttribute<GuiStringTableModel | null>;
  declare summaryText?: NonAttribute<CyclopediaStringTableModel | null>;
  declare progressionTable?: NonAttribute<ClassProgressionModel | null>;
  declare abilityUnlocks?: NonAttribute<AbilityUnlockClassModel[]>;

  declare getBaseStats: BelongsToGetAssociationMixin<BaseStatsModel>;
  declare setBaseStats: BelongsToSetAssociationMixin<BaseStatsModel, string>;

  declare getDescriptionText: BelongsToGetAssociationMixin<GuiStringTableModel | null>;
  declare setDescriptionText: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getDisplayName: BelongsToGetAssociationMixin<GuiStringTableModel | null>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getSummaryText: BelongsToGetAssociationMixin<CyclopediaStringTableModel | null>;
  declare setSummaryText: BelongsToSetAssociationMixin<
    CyclopediaStringTableModel,
    number
  >;

  declare getProgressionTable: HasOneGetAssociationMixin<ClassProgressionModel>;
  declare setProgressionTable: HasOneSetAssociationMixin<
    ClassProgressionModel,
    string
  >;

  declare getAbilityUnlocks: HasManyGetAssociationsMixin<AbilityUnlockClassModel>;

  static initModel(sequelize: Sequelize) {
    return ClassModel.init(
      {
        id: { primaryKey: true, type: 'string' },
        requireSubclass: { type: 'boolean', allowNull: false },
        icon: { type: 'string', allowNull: false },
        isSpellcaster: { type: 'boolean', allowNull: false },
        spellIdentifierStringId: { type: 'number', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'class' },
    );
  }

  static setAssociations() {
    this.belongsTo(BaseStatsModel, {
      as: 'baseStats',
    });

    this.belongsTo(GuiStringTableModel, {
      as: 'descriptionText',
    });

    this.belongsTo(GuiStringTableModel, {
      as: 'displayName',
    });

    this.belongsTo(CyclopediaStringTableModel, {
      as: 'summaryText',
    });

    this.hasOne(ClassProgressionModel, {
      as: 'progressionTable',
      foreignKey: 'class_id',
    });

    this.hasMany(AbilityUnlockClassModel, {
      as: 'abilityUnlocks',
      foreignKey: 'class_id',
    });
  }
}
