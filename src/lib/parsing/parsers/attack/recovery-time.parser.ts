import {
  recoveryTimeGameDataSchema,
  type RecoveryTimeGameData,
} from '$lib/parsing/schemas/attack/gamedata/recovery-time.gamedata.js';
import { Parser } from '../parser.js';

export class RecoveryTimeParser extends Parser<RecoveryTimeGameData> {
  public readonly parser = recoveryTimeGameDataSchema;

  public async toDto(): Promise<void> {
    const recoveryTimes = this.transaction.objectStore('recoveryTimes');
    const guiStrings = this.transaction.objectStore('guiStrings');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];
      const display = await guiStrings.get(component.DisplayName);
      await recoveryTimes.put({
        id: data.ID,
        duration: component.Duration,
        displayName: display?.defaultText,
      });
    }
  }
}
