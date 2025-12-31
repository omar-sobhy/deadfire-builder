import {
  recoveryTimeGameDataSchema,
  type RecoveryTimeGameData,
} from '$lib/parsing/schemas/attack/gamedata/recovery-time.gamedata.js';
import { Parser } from '../parser.js';

export class RecoveryTimeParser extends Parser<RecoveryTimeGameData> {
  public readonly parser = recoveryTimeGameDataSchema;

  public async parseDtos(): Promise<void> {
    const { recoveryTimes, guiStrings } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];
      const display = guiStrings[component.DisplayName];
      recoveryTimes[data.ID] = {
        id: data.ID,
        duration: component.Duration,
        displayName: display?.defaultText,
      };
    }
  }
}
