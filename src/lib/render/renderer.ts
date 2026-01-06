import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { DurationType } from '../../types/enums/duration-type.js';
import type { StatusEffectType } from '../../types/enums/status-effect-type.js';

export abstract class Renderer {
  public abstract readonly type: StatusEffectType;

  protected constructor() {}

  public async renderString(
    statusEffect: StatusEffectDto,
    target: string,
  ): Promise<string | undefined> {
    if (statusEffect.type !== this.type) return undefined;

    return await this._renderString(statusEffect);
  }

  protected abstract _renderString(
    statusEffect: StatusEffectDto,
  ): Promise<string | undefined> | string | undefined;

  protected renderDuration(statusEffect: StatusEffectDto, prefix: 'for' | 'by' = 'for'): string {
    const { duration, durationType } = statusEffect;

    if (durationType === DurationType.Infinite) {
      return 'until combat ends';
    } else if (durationType === DurationType.OneHitUse) {
      return `${prefix} the next attack`;
    } else if (durationType === DurationType.UseDurationTime) {
      return `${prefix} ${duration} seconds (modified by int)`;
    } else if (durationType === DurationType.UseDurationTimeUnadjusted) {
      return `${prefix} ${duration} seconds`;
    } else {
      return `${prefix} an unknown duration`;
    }
  }

  protected renderDirection(statusEffect: StatusEffectDto): string {
    if (statusEffect.baseValue < 0) {
      return 'Decreases';
    }
    return 'Increases';
  }
}
