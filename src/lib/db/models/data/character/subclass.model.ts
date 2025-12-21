import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type ForeignKey,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { GuiStringTableModel } from '../../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../../stringtables/cyclopedia.stringtable.model.js';
import { ClassModel } from './class.model.js';
import { AbilityUnlockSubclassModel } from '../progression/ability-unlock-subclass.model.js';

export class SubclassModel extends Model<
  InferAttributes<SubclassModel>,
  InferCreationAttributes<SubclassModel>
> {
  declare id: string;

  declare descriptionText?: NonAttribute<GuiStringTableModel | null>;
  declare displayName?: NonAttribute<GuiStringTableModel | null>;
  declare summaryText?: NonAttribute<CyclopediaStringTableModel | null>;
  declare class?: NonAttribute<ClassModel>;
  declare abilityUnlocks?: NonAttribute<AbilityUnlockSubclassModel[]>;

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

  declare getClass: BelongsToGetAssociationMixin<ClassModel>;
  declare setClass: BelongsToSetAssociationMixin<ClassModel, string>;

  declare getAbilityUnlocks: HasManyGetAssociationsMixin<AbilityUnlockSubclassModel>;

  declare class_id: ForeignKey<string>;

  public static initModel(sequelize: Sequelize) {
    return SubclassModel.init(
      {
        id: { type: 'string', primaryKey: true },
      },
      { sequelize, underscored: true, tableName: 'subclass' },
    );
  }

  public static setAssociations() {
    this.belongsTo(GuiStringTableModel, {
      as: 'descriptionText',
    });

    this.belongsTo(GuiStringTableModel, {
      as: 'displayName',
    });

    this.belongsTo(CyclopediaStringTableModel, {
      as: 'summaryText',
    });

    this.belongsTo(ClassModel, {
      as: 'class',
    });

    this.hasMany(AbilityUnlockSubclassModel, {
      as: 'abilityUnlocks',
      foreignKey: 'subclass_id',
    });
  }
}
