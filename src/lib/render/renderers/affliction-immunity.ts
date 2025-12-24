import type { AfflictionDto } from '$lib/dtos/status-effect/affliction.dto.js';
import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
import { StatusEffectType } from '../../../types/enums/status-effect-type.js';
import { Renderer } from '../renderer.js';

export default class AfflictionImmunity extends Renderer {
  public override readonly type = StatusEffectType.AfflictionImmunity;

  public override async _renderString(statusEffect: StatusEffectDto): Promise<string> {
    const durationString = this.renderDuration(statusEffect);

    const transaction = this.db.transaction('statusEffects');
    const store = transaction.objectStore('statusEffects');
    const affliction = await store.get(statusEffect.afflictionTypeValueId);

    await transaction.done;

    return `Immune to ${(affliction?.data as AfflictionDto).displayName} ${durationString}`;
  }
}
