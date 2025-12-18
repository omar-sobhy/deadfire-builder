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
import { AbilityModel } from './models/data/ability.model.js';
import { StatusEffectStringTableModel } from './models/stringtables/status-effect.stringtable.model.js';
import { KeywordModel } from './models/data/keyword.model.js';
import { StatusEffectModel } from './models/data/status-effect.model.js';

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
    AbilityModel,
    ArmorModel,
    BaseStatsModel,
    ClassModel,
    CultureModel,
    ItemModModel,
    KeywordModel,
    RaceModel,
    StatusEffectModel,
    SubclassModel,
    SubraceModel,
    WeaponModel,

    AbilityStringTableModel,
    CyclopediaStringTableModel,
    GuiStringTableModel,
    ItemStringTableModel,
    ItemModsStringTableModel,
    StatusEffectStringTableModel,
  ];

  for (const model of models) {
    model.initModel(sequelize);
  }

  for (const model of models) {
    if ('setAssociations' in model) {
      model.setAssociations();
    }
  }

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
