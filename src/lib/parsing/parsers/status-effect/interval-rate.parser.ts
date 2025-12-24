import {
  intervalRateGameDataSchema,
  type IntervalRateGameData,
} from '$lib/parsing/schemas/abilities/gamedata/interval-rate.gamedata.js';
import { Parser } from '../parser.js';

export class IntervalRateParser extends Parser<IntervalRateGameData> {
  public override readonly parser = intervalRateGameDataSchema;

  public override async toDto() {
    const intervals = this.transaction.objectStore('intervals');

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      await intervals.put(
        {
          id: data.ID,
          debugName: data.DebugName,
          interval: component.Interval,
          onlyWhileMoving: component.OnlyWhileMoving,
        },
        data.ID,
      );
    }
  }
}
