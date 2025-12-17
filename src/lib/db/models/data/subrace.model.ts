import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from 'sequelize';
import type { GuiStringTableModel } from '../stringtables/gui.stringtable.model.js';
import type { CyclopediaStringTableModel } from '../stringtables/cyclopedia.stringtable.model.js';
import type { RaceModel } from './race.model.js';

export class SubraceModel extends Model<
  InferAttributes<SubraceModel>,
  InferCreationAttributes<SubraceModel>
> {
  declare id: string;
  declare debugName: string;
  declare type: string;
  declare raceId: string;

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

  static initModel(sequelize: Sequelize) {
    return SubraceModel.init(
      {
        id: { primaryKey: true, type: 'string' },
        debugName: { type: 'string', allowNull: false },
        type: { type: 'string', allowNull: false },
        raceId: { type: 'string', allowNull: false },
      },
      { sequelize, underscored: true },
    );
  }
}
