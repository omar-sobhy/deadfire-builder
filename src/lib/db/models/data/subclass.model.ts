import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { GuiStringTableModel } from '../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../stringtables/cyclopedia.stringtable.model.js';
import { ClassModel } from './class.model.js';

export class SubclassModel extends Model<
  InferAttributes<SubclassModel>,
  InferCreationAttributes<SubclassModel>
> {
  declare id: string;

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

  declare getClass: BelongsToGetAssociationMixin<ClassModel>;
  declare setClass: BelongsToSetAssociationMixin<ClassModel, string>;

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
  }
}
