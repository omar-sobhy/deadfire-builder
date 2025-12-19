import {
  Model,
  type Association,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { ItemModsStringTableModel } from '../../stringtables/item-mods.stringtable.model.js';

export class ItemModModel extends Model<
  InferAttributes<ItemModModel>,
  InferCreationAttributes<ItemModModel>
> {
  declare id: string;
  declare debugName: string;

  declare getDisplayName: BelongsToGetAssociationMixin<ItemModsStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    ItemModsStringTableModel,
    number
  >;

  declare static associations: {
    displayName: Association<ItemModModel, ItemModsStringTableModel>;
  };

  static initModel(sequelize: Sequelize) {
    ItemModModel.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'item_mod' },
    );
  }

  public static setAssociations() {
    this.belongsTo(ItemModsStringTableModel, {
      as: 'displayName',
    });
  }
}
