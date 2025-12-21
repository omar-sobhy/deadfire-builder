import {
  Model,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  type Sequelize,
} from 'sequelize';
import { GuiStringTableModel } from '../../stringtables/gui.stringtable.model.js';
import { CyclopediaStringTableModel } from '../../stringtables/cyclopedia.stringtable.model.js';
import { RaceModel } from './race.model.js';
import { AbilityUnlockSubraceModel } from '../progression/ability-unlock-subrace.model.js';

export class SubraceModel extends Model<
  InferAttributes<SubraceModel>,
  InferCreationAttributes<SubraceModel>
> {
  declare id: string;
  declare debugName: string;
  declare type: string;

  declare race?: NonAttribute<RaceModel>;
  declare descriptionText?: NonAttribute<GuiStringTableModel | null>;
  declare displayName?: NonAttribute<GuiStringTableModel | null>;
  declare summaryText?: NonAttribute<CyclopediaStringTableModel | null>;
  declare abilityUnlocks?: NonAttribute<AbilityUnlockSubraceModel[]>;

  declare getRace: BelongsToGetAssociationMixin<RaceModel>;
  declare setRace: BelongsToSetAssociationMixin<RaceModel, string>;

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

  declare getAbilityUnlocks: HasManyGetAssociationsMixin<AbilityUnlockSubraceModel>;

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

    this.hasMany(AbilityUnlockSubraceModel, {
      as: 'abilityUnlocks',
      foreignKey: 'subrace_id',
    });
  }
}
