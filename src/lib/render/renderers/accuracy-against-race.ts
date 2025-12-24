import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AccuracyAgainstRace extends Renderer {
  public override readonly type = StatusEffectType.AccuracyAgainstRace;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const { raceName, baseValue } = statusEffect;

    const direction = baseValue < 0 ? 'Decreases' : 'Increases';

    const durationString = this.renderDuration(statusEffect);

    return `${direction} accuracy against ${raceName} ${durationString}`;
  }
}
