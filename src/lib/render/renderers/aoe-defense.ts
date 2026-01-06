import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AOEDefense extends Renderer {
  public override readonly type = StatusEffectType.AOEDefense;

  protected _renderString(statusEffect: StatusEffectDto): Promise<string> | string {
    const direction = this.renderDirection(statusEffect);

    const duration = this.renderDuration(statusEffect);

    return `${direction} defense against AoE attacks by ${statusEffect.baseValue} ${duration}`;
  }
}
