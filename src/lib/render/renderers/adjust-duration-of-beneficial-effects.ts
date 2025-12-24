import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AdjustDurationOfBeneficialEffects extends Renderer {
  public override readonly type = StatusEffectType.AdjustDurationOfBeneficialEffects;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    return `${direction} duration of positive effects by ${statusEffect.baseValue} seconds`;
  }
}
