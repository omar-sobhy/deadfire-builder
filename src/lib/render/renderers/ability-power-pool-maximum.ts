import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AbilityPowerPoolMaximum extends Renderer {
  public override readonly type = StatusEffectType.AbilityPowerPoolMaximum;

  public override _renderString(statusEffect: StatusEffectDto): string {
    if (statusEffect.baseValue < 0) {
      return `Decreases power pool points by ${statusEffect.baseValue}`;
    }

    return `Increases power pool points by ${statusEffect.baseValue}`;
  }
}
