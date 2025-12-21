import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { GuiStringTableModel } from '../../stringtables/gui.stringtable.model.js';
import type { AbilityStringTableModel } from '../../stringtables/ability.stringtable.model.js';
import { CyclopediaStringTableModel } from '../../stringtables/cyclopedia.stringtable.model.js';

export class KeywordModel extends Model<
  InferAttributes<KeywordModel>,
  InferCreationAttributes<KeywordModel>
> {
  declare id: string;
  declare icon: string;

  declare descriptionText?: NonAttribute<GuiStringTableModel | null>;
  declare displayName?: NonAttribute<AbilityStringTableModel | null>;
  declare summaryText?: NonAttribute<AbilityStringTableModel | null>;

  declare getGuiDisplayText: BelongsToGetAssociationMixin<GuiStringTableModel>;
  declare setGuiDisplayText: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getAbilityDisplayText: BelongsToGetAssociationMixin<AbilityStringTableModel>;
  declare setAbilityDisplayText: BelongsToSetAssociationMixin<
    AbilityStringTableModel,
    number
  >;

  declare getDescription: BelongsToGetAssociationMixin<AbilityStringTableModel | null>;
  declare setDescription: BelongsToSetAssociationMixin<
    AbilityStringTableModel,
    number
  >;

  public static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        icon: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'keyword' },
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
  }
}
