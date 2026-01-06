import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AoEMult extends Renderer {
  public override readonly type = StatusEffectType.AoEMult;

  protected _renderString(statusEffect: StatusEffectDto): Promise<string> | string {
    const duration = this.renderDuration(statusEffect);

    return `Multiply area of AoE effects by ${statusEffect.baseValue} ${duration}`;
  }
}
