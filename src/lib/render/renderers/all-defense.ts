import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AllDefense extends Renderer {
  public override readonly type = StatusEffectType.AllDefense;

  public override async _renderString(statusEffect: StatusEffectDto): Promise<string> {
    const direction = this.renderDirection(statusEffect);

    const duration = this.renderDuration(statusEffect);

    return `${direction} all defenses by ${statusEffect.baseValue} ${duration}`;
  }
}
