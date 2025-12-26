import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class ArmorSpeedFactorAdj extends Renderer {
  public override readonly type = StatusEffectType.ArmorSpeedFactorAdj;

  protected async _renderString(
    statusEffect: StatusEffectDto,
  ): Promise<string | undefined> | string | undefined {
    
  }
}
