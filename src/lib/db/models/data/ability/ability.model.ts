import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { AbilityStringTableModel } from '../../stringtables/ability.stringtable.model.js';
import type { AbilityType } from '../../../../../types/enums/ability-type.js';

export class AbilityModel extends Model<
  InferAttributes<AbilityModel>,
  InferCreationAttributes<AbilityModel>
> {
  declare id: string;
  declare debugName: string;

  declare isPassive: boolean;
  declare icon: string;

  declare type: AbilityType;

  declare displayName?: NonAttribute<AbilityStringTableModel | null>;
  declare descriptionText?: NonAttribute<AbilityStringTableModel | null>;

  declare getDisplayName: BelongsToGetAssociationMixin<AbilityStringTableModel | null>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    AbilityStringTableModel,
    number
  >;

  declare getDescriptionText: BelongsToGetAssociationMixin<AbilityStringTableModel | null>;
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
        icon: 'string',
        type: { type: 'string', allowNull: false },
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
