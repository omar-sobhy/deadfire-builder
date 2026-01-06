import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AdjustDurationOfHostileEffects extends Renderer {
  public override readonly type = StatusEffectType.AdjustDurationOfHostileEffects;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    return `${direction} duration of negative effects by ${statusEffect.baseValue} seconds`;
  }
}
