import type { AfflictionDto } from '$lib/dtos/status-effect/affliction.dto.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AfflictionTypeDurationMult extends Renderer {
  public override readonly type = StatusEffectType.AfflictionTypeDurationMult;

  public override async _renderString(statusEffect: StatusEffectDto): Promise<string> {
    const afflictions = await (
      await fetch('/status-effects', {
        body: JSON.stringify({
          ids: [statusEffect.afflictionTypeValueId],
        }),
      })
    ).json();

    return `Multiply duration of ${(afflictions[0] as AfflictionDto)?.displayName} by ${statusEffect.baseValue}`;
  }
}
