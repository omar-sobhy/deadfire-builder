import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { AbilityStringTableModel } from '../stringtables/ability.stringtable.model.js';

export class AbilityModel extends Model<
  InferAttributes<AbilityModel>,
  InferCreationAttributes<AbilityModel>
> {
  declare id: string;
  declare debugName: string;

  declare isPassive: boolean;

  declare getDisplayName: BelongsToGetAssociationMixin<AbilityStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    AbilityStringTableModel,
    number
  >;

  declare getDescriptionText: BelongsToGetAssociationMixin<AbilityStringTableModel>;
  declare setDescriptionText: BelongsToSetAssociationMixin<
    AbilityStringTableModel,
    number
  >;

  static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: { type: 'string', primaryKey: true },
        debugName: { type: 'string', allowNull: false },
        isPassive: { type: 'boolean', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'ability' },
    );
  }

  static setAssociations() {
    this.belongsTo(AbilityStringTableModel, {
      as: 'displayName',
    });

    this.belongsTo(AbilityStringTableModel, {
      as: 'descriptionText',
    });
  }
}
