import { baseStatsGameDataSchema, type BaseStatsGameData } from '$lib/parsing/schemas/index.js';
import { Parser } from '../parser.js';

export class BaseStatsParser extends Parser<BaseStatsGameData> {
  public override parser = baseStatsGameDataSchema;

  public override async parseDtos(): Promise<void> {
    const { baseStats } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      baseStats[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        deflection: component.BaseDeflection,
        fortitude: component.BaseFortitude,
        reflex: component.BaseReflexes,
        will: component.BaseWill,
        isPlayerClass: component.IsPlayerClass,
        health: component.MaxHealth,
        healthPerLevel: component.HealthPerLevel,
        meleeAccuracyBonus: component.MeleeAccuracyBonus,
        rangedAccuracyBonus: component.RangedAccuracyBonus,
      };
    }
  }
}
