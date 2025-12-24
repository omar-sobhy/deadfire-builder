import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AttackSpeedMultiplier extends Renderer {
  public readonly type = StatusEffectType.AttackSpeedMultiplier;

  protected _renderString(
    statusEffect: StatusEffectDto,
  ): Promise<string | undefined> | string | undefined {
    const duration = this.renderDuration(statusEffect);
    return `Multiply attack speed by ${statusEffect.baseValue} ${duration}`;
  }
}
