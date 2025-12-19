import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { BaseStatsModel } from './base-stats.model.js';
import { GuiStringTableModel } from '../../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../../stringtables/cyclopedia.stringtable.model.js';
import { ClassProgressionModel } from '../progression/class-progression.model.js';

export class ClassModel extends Model<
  InferAttributes<ClassModel>,
  InferCreationAttributes<ClassModel>
> {
  declare id: string;
  declare requireSubclass: boolean;
  declare icon: string;
  declare isSpellcaster: boolean;
  declare spellIdentifierStringId: number;

  declare getBaseStats: BelongsToGetAssociationMixin<BaseStatsModel>;
  declare setBaseStats: BelongsToSetAssociationMixin<BaseStatsModel, string>;

  declare getDescriptionText: BelongsToGetAssociationMixin<GuiStringTableModel>;
  declare setDescriptionText: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getDisplayName: BelongsToGetAssociationMixin<GuiStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getSummaryText: BelongsToGetAssociationMixin<CyclopediaStringTableModel>;
  declare setSummaryText: BelongsToSetAssociationMixin<
    CyclopediaStringTableModel,
    number
  >;

  declare getProgressionTable: HasOneGetAssociationMixin<ClassProgressionModel>;
  declare setProgressionTable: HasOneSetAssociationMixin<
    ClassProgressionModel,
    string
  >;

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
  }
}
