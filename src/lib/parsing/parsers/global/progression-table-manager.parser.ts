import {
  progressionTableManagerGameDataSchema,
  type ProgressionTableManagerGameData,
} from '$lib/parsing/schemas/global/gamedata/progression-table-manager.gamedata.js';
import { Parser } from '../parser.js';

export class ProgressionTableManagerParser extends Parser<ProgressionTableManagerGameData> {
  public override readonly parser = progressionTableManagerGameDataSchema;

  public async parseDtos(): Promise<void> {
    const manager = Object.values(this.parsed)[0];

    const component = manager.Components[0];

    for (const c of component.ClassTables) {
        
    }
  }
}
