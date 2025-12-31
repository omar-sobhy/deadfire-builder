import {
  intervalRateGameDataSchema,
  type IntervalRateGameData,
} from '$lib/parsing/schemas/status-effect/gamedata/interval-rate.gamedata.js';
import { Parser } from '../parser.js';

export class IntervalRateParser extends Parser<IntervalRateGameData> {
  public override readonly parser = intervalRateGameDataSchema;

  public override async parseDtos() {
    const { intervals } = Parser.context;

    for (const data of Object.values(this.parsed)) {
      const component = data.Components[0];

      intervals[data.ID] = {
        id: data.ID,
        debugName: data.DebugName,
        interval: component.Interval,
        onlyWhileMoving: component.OnlyWhileMoving,
      };
    }
  }
}
