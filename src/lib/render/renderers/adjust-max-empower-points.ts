import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AdjustMaxEmpowerPoints extends Renderer {
  public override readonly type = StatusEffectType.AdjustMaxEmpowerPoints;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    return `${direction} maximum empower points by ${statusEffect.baseValue}`;
  }
}
