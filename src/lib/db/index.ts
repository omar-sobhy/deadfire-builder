import { Sequelize } from 'sequelize';
import { ClassModel } from './models/data/character/class.model.js';
import { RaceModel } from './models/data/character/race.model.js';
import { SubraceModel } from './models/data/character/subrace.model.js';
import { BaseStatsModel } from './models/data/character/base-stats.model.js';
import { AbilityStringTableModel } from './models/stringtables/ability.stringtable.model.js';
import { ItemStringTableModel } from './models/stringtables/item.stringtable.model.js';
import { ArmorModel } from './models/data/item/armor.model.js';
import { GuiStringTableModel } from './models/stringtables/gui.stringtable.model.js';
import { ItemModModel } from './models/data/item/item-mod.model.js';
import { WeaponModel } from './models/data/item/weapon.model.js';
import { ItemModsStringTableModel } from './models/stringtables/item-mods.stringtable.model.js';
import { CyclopediaStringTableModel } from './models/stringtables/cyclopedia.stringtable.model.js';
import { SubclassModel } from './models/data/character/subclass.model.js';
import { CultureModel } from './models/data/character/culture.model.js';
import { AbilityModel } from './models/data/ability/ability.model.js';
import { StatusEffectStringTableModel } from './models/stringtables/status-effect.stringtable.model.js';
import { KeywordModel } from './models/data/character/keyword.model.js';
import { StatusEffectModel } from './models/data/ability/status-effect.model.js';
import { ClassProgressionModel } from './models/data/progression/class-progression.model.js';
import { AbilityUnlockModel } from './models/data/progression/ability-unlock.model.js';
import { WeaponAttackAbilityModel } from './models/data/ability/weapon-attack-ability.model.js';
import { ProgressionTableManagerModel } from './models/data/global/progression-table-manager.model.js';
import { AbilityUnlockClassModel } from './models/data/progression/ability-unlock-class.model.js';
import { AbilityUnlockRaceModel } from './models/data/progression/ability-unlock-race.model.js';
import { AbilityUnlockSubraceModel } from './models/data/progression/ability-unlock-subrace.model.js';
import { AbilityUnlockSubclassModel } from './models/data/progression/ability-unlock-subclass.model.js';
import { Logger } from '$lib/utils.js';
import { StatusEffectChildModel } from './models/data/ability/status-effect-child.model.js';
import { AbilityStatusEffectModel } from './models/data/ability/ability-status-effect.model.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'deadfire.db',
  logging: (...msg) => Logger.getInstance().trace(msg[0]),
  // logging: true,
  // logQueryParameters: true,
});

let initialized = false;

export async function initDb(sync?: 'force' | 'alter' | 'sync') {
  if (initialized) {
    return sequelize;
  }

  const models = [
    AbilityStatusEffectModel,
    StatusEffectModel,
    StatusEffectChildModel,

    AbilityModel,
    ArmorModel,
    BaseStatsModel,
    ClassProgressionModel,
    ClassModel,
    CultureModel,
    ItemModModel,
    KeywordModel,
    RaceModel,
    SubclassModel,
    SubraceModel,
    WeaponAttackAbilityModel,
    WeaponModel,

    AbilityStringTableModel,
    CyclopediaStringTableModel,
    GuiStringTableModel,
    ItemStringTableModel,
    ItemModsStringTableModel,
    StatusEffectStringTableModel,

    AbilityUnlockClassModel,
    AbilityUnlockRaceModel,
    AbilityUnlockSubclassModel,
    AbilityUnlockSubraceModel,
    AbilityUnlockModel,
    ProgressionTableManagerModel,
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

export {
  AbilityUnlockClassModel,
  AbilityUnlockSubclassModel,
  AbilityUnlockSubraceModel,
  AbilityUnlockRaceModel,
};

export { AbilityUnlockModel } from './models/data/progression/ability-unlock.model.js';
export { ClassProgressionModel } from './models/data/progression/class-progression.model.js';
export { ClassModel } from './models/data/character/class.model.js';
export { CultureModel } from './models/data/character/culture.model.js';
export { RaceModel } from './models/data/character/race.model.js';
export { SubclassModel } from './models/data/character/subclass.model.js';
export { SubraceModel } from './models/data/character/subrace.model.js';
export { BaseStatsModel } from './models/data/character/base-stats.model.js';
export { WeaponModel } from './models/data/item/weapon.model.js';
export { ItemModModel } from './models/data/item/item-mod.model.js';
export { ArmorModel } from './models/data/item/armor.model.js';
export { ProgressionTableManagerModel } from './models/data/global/progression-table-manager.model.js';

export { AbilityStringTableModel } from './models/stringtables/ability.stringtable.model.js';
export { CyclopediaStringTableModel } from './models/stringtables/cyclopedia.stringtable.model.js';
export { GuiStringTableModel } from './models/stringtables/gui.stringtable.model.js';
export { ItemModsStringTableModel } from './models/stringtables/item-mods.stringtable.model.js';
export { ItemStringTableModel } from './models/stringtables/item.stringtable.model.js';
