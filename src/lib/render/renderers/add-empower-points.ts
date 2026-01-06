import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AddEmpowerPoints extends Renderer {
  public override readonly type = StatusEffectType.AddEmpowerPoints;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    return `${direction} empower points by ${statusEffect.baseValue}`;
  }
}
