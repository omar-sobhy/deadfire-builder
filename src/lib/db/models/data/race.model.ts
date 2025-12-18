import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { SubraceModel } from './subrace.model.js';
import { GuiStringTableModel } from '../stringtables/gui.stringtable.model.js';

export class RaceModel extends Model<
  InferAttributes<RaceModel>,
  InferCreationAttributes<RaceModel>
> {
  declare id: string;
  declare debugName: string;
  declare icon: string;
  declare resolve: number;
  declare might: number;
  declare dexterity: number;
  declare intellect: number;
  declare constitution: number;
  declare perception: number;
  declare isKith: boolean;

  declare getDisplayName: BelongsToGetAssociationMixin<GuiStringTableModel>;
  declare setDisplayName: BelongsToSetAssociationMixin<
    GuiStringTableModel,
    number
  >;

  declare getSubraces: HasManyGetAssociationsMixin<SubraceModel>;

  public static initModel(sequelize: Sequelize) {
    return RaceModel.init(
      {
        id: { primaryKey: true, type: 'string' },
        debugName: { type: 'string', allowNull: false },
        icon: { type: 'string', allowNull: false },
        resolve: { type: 'number', allowNull: false },
        might: { type: 'number', allowNull: false },
        dexterity: { type: 'number', allowNull: false },
        intellect: { type: 'number', allowNull: false },
        constitution: { type: 'number', allowNull: false },
        perception: { type: 'number', allowNull: false },
        isKith: { type: 'boolean', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'race' },
    );
  }

  public static setAssociations() {
    this.belongsTo(GuiStringTableModel, {
      as: 'displayName',
    });

    this.hasMany(SubraceModel, {
      as: 'subraces',
    });
  }
}
