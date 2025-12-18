import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import { GuiStringTableModel } from '../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../stringtables/cyclopedia.stringtable.model.js';
import { RaceModel } from './race.model.js';
import { AbilityModel } from './ability.model.js';

export class SubraceModel extends Model<
  InferAttributes<SubraceModel>,
  InferCreationAttributes<SubraceModel>
> {
  declare id: string;
  declare debugName: string;
  declare type: string;

  declare getRace: BelongsToGetAssociationMixin<RaceModel>;
  declare setRace: BelongsToSetAssociationMixin<RaceModel, string>;

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

  declare getAbilities: HasManyGetAssociationsMixin<AbilityModel>;

  public static initModel(sequelize: Sequelize) {
    return SubraceModel.init(
      {
        id: { primaryKey: true, type: 'string' },
        debugName: { type: 'string', allowNull: false },
        type: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true, tableName: 'subrace' },
    );
  }

  public static setAssociations() {
    this.belongsTo(RaceModel, {
      as: 'race',
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

    this.hasMany(AbilityModel, {
      as: 'abilities',
    });
  }
}
