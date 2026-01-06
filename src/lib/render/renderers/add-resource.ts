import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AddResource extends Renderer {
  public override readonly type = StatusEffectType.AddResource;

  public override _renderString(statusEffect: StatusEffectDto): string {
    const direction = this.renderDirection(statusEffect);

    const extraValue = statusEffect.extraValue;

    const spellTierString = extraValue === 0 ? '' : `(maximum spells restored: ${extraValue})`;

    return `${direction} resources by ${statusEffect.baseValue} ${spellTierString}`;
  }
}
