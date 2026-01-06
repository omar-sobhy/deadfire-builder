import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { Renderer } from '$lib/render/renderer.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';

export default class EnemiesNeededToFlankAdj extends Renderer {
  public type = StatusEffectType.EnemiesNeededToFlankAdj;

  protected _renderString(
    statusEffect: StatusEffectDto,
  ): Promise<string | undefined> | string | undefined {
    const direction = this.renderDirection(statusEffect);

    return `${direction} enemies required to flank by ${statusEffect.baseValue}`;
  }
}
