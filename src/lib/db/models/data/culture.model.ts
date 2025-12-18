import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { CyclopediaStringTableModel } from '../stringtables/cyclopedia.stringtable.model.js';
import { GuiStringTableModel } from '../stringtables/gui.stringtable.model.js';

export class CultureModel extends Model<
  InferAttributes<CultureModel>,
  InferCreationAttributes<CultureModel>
> {
  declare debugName: string;
  declare id: string;
  declare icon: string;

  declare resolve: number;
  declare might: number;
  declare dexterity: number;
  declare intellect: number;
  declare constitution: number;
  declare perception: number;

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

  static initModel(sequelize: Sequelize) {
    return CultureModel.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
        icon: { type: 'string', allowNull: false },
        resolve: { type: 'number', allowNull: false },
        might: { type: 'number', allowNull: false },
        dexterity: { type: 'number', allowNull: false },
        intellect: { type: 'number', allowNull: false },
        constitution: { type: 'number', allowNull: false },
        perception: { type: 'number', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'culture' },
    );
  }

  static setAssociations() {
    this.belongsTo(GuiStringTableModel, {
      as: 'descriptionText',
    });

    this.belongsTo(GuiStringTableModel, {
      as: 'displayName',
    });

    this.belongsTo(CyclopediaStringTableModel, {
      as: 'summaryText',
    });
  }
}
