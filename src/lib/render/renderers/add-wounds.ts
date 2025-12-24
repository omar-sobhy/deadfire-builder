import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AddWounds extends Renderer {
  public override readonly type = StatusEffectType.AddWounds;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    return `${direction} wounds by ${statusEffect.baseValue}`;
  }
}
