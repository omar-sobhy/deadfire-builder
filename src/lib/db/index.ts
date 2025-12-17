import { Sequelize } from 'sequelize';
import { ClassModel } from './models/data/class.model.js';
import { RaceModel } from './models/data/race.model.js';
import { SubraceModel } from './models/data/subrace.model.js';
import { BaseStatsModel } from './models/data/base-stats.model.js';
import { AbilityStringTableModel } from './models/stringtables/ability.stringtable.model.js';
import { ItemStringTableModel } from './models/stringtables/item.stringtable.model.js';
import { ArmorModel } from './models/data/armor.model.js';
import { GuiStringTableModel } from './models/stringtables/gui.stringtable.model.js';
import { ItemModModel } from './models/data/item-mod.model.js';
import { WeaponModel } from './models/data/weapon.model.js';
import { ItemModsStringTableModel } from './models/stringtables/item-mods.stringtable.model.js';
import { CyclopediaStringTableModel } from './models/stringtables/cyclopedia.stringtable.model.js';
import { SubclassModel } from './models/data/subclass.model.js';
import { CultureModel } from './models/data/culture.model.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'deadfire.db',
  // logging: (...msg) => console.log(msg),
  logging: false,
  // logQueryParameters: true,
});

let initialized = false;

export async function initDb(sync?: 'force' | 'alter' | 'sync') {
  if (initialized) {
    return sequelize;
  }

  const models = [
    ArmorModel,
    BaseStatsModel,
    ClassModel,
    CultureModel,
    ItemModModel,
    RaceModel,
    SubclassModel,
    SubraceModel,
    WeaponModel,

    AbilityStringTableModel,
    ItemStringTableModel,
    GuiStringTableModel,
    ItemModsStringTableModel,
    CyclopediaStringTableModel,
  ];

  for (const model of models) {
    model.initModel(sequelize);
  }

  ArmorModel.belongsTo(ItemStringTableModel, {
    as: 'displayName',
  });

  ItemStringTableModel.hasOne(ArmorModel, {
    as: 'displayName',
  });

  ArmorModel.belongsTo(ItemStringTableModel, {
    as: 'descriptionText',
  });

  ItemStringTableModel.hasOne(ArmorModel, {
    as: 'descriptionText',
  });

  ClassModel.belongsTo(BaseStatsModel, {
    as: 'baseStats',
  });

  ClassModel.belongsTo(GuiStringTableModel, {
    as: 'descriptionText',
  });

  ClassModel.belongsTo(GuiStringTableModel, {
    as: 'displayName',
  });

  ClassModel.belongsTo(CyclopediaStringTableModel, {
    as: 'summaryText',
  });

  CultureModel.belongsTo(GuiStringTableModel, {
    as: 'descriptionText',
  });

  CultureModel.belongsTo(GuiStringTableModel, {
    as: 'displayName',
  });

  CultureModel.belongsTo(CyclopediaStringTableModel, {
    as: 'summaryText',
  });

  ItemModModel.belongsTo(ItemModsStringTableModel, {
    as: 'displayName',
  });

  RaceModel.hasMany(SubraceModel, {
    as: 'subrace',
  });

  RaceModel.belongsTo(GuiStringTableModel, {
    as: 'displayName',
  });

  SubclassModel.belongsTo(ClassModel, {
    as: 'class',
  });

  SubclassModel.belongsTo(GuiStringTableModel, {
    as: 'displayName',
  });

  SubclassModel.belongsTo(CyclopediaStringTableModel, {
    as: 'summaryText',
  });

  SubclassModel.belongsTo(GuiStringTableModel, {
    as: 'descriptionText',
  });

  SubraceModel.belongsTo(RaceModel, {
    as: 'race',
  });

  SubraceModel.belongsTo(GuiStringTableModel, {
    as: 'displayName',
  });

  SubraceModel.belongsTo(CyclopediaStringTableModel, {
    as: 'summaryText',
  });

  SubraceModel.belongsTo(GuiStringTableModel, {
    as: 'descriptionText',
  });

  WeaponModel.belongsTo(ItemStringTableModel, {
    as: 'displayName',
  });

  WeaponModel.belongsTo(ItemStringTableModel, {
    as: 'descriptionText',
  });

  WeaponModel.hasMany(ItemModModel, {
    as: 'itemMod',
  });

  WeaponModel.hasMany(ClassModel, {
    as: 'classRestriction',
  });

  if (sync) {
    const promises = models.map((m) => {
      switch (sync) {
        case 'force':
          return m.sync({ force: true });
        case 'alter':
          return m.sync({ alter: true });
        case 'sync':
          return m.sync();
      }
    });

    await Promise.all(promises);
  }

  initialized = true;

  return sequelize;
}

export { ClassModel } from './models/data/class.model.js';
export { CultureModel } from './models/data/culture.model.js';
export { RaceModel } from './models/data/race.model.js';
export { SubclassModel } from './models/data/subclass.model.js';
export { SubraceModel } from './models/data/subrace.model.js';
export { BaseStatsModel } from './models/data/base-stats.model.js';
export { WeaponModel } from './models/data/weapon.model.js';
export { ItemModModel } from './models/data/item-mod.model.js';
export { ArmorModel } from './models/data/armor.model.js';

export { AbilityStringTableModel } from './models/stringtables/ability.stringtable.model.js';
export { CyclopediaStringTableModel } from './models/stringtables/cyclopedia.stringtable.model.js';
export { GuiStringTableModel } from './models/stringtables/gui.stringtable.model.js';
export { ItemModsStringTableModel } from './models/stringtables/item-mods.stringtable.model.js';
export { ItemStringTableModel } from './models/stringtables/item.stringtable.model.js';
