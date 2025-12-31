<script lang="ts">
  import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
  import type { Renderers } from '$lib/render/index.js';
  import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
  import { StatusEffectOperator } from '../../types/enums/status-effect-operator.js';

  interface Props {
    renderers: Renderers;
    abilityUnlock: AbilityUnlockDto;
    statusEffectManager: StatusEffectManagerEntryDto[];
  }

  let { renderers, abilityUnlock, statusEffectManager }: Props = $props();

  async function interpolate(
    input: string,
    statusEffect: StatusEffectDto,
    statusEffectManagerEntry: StatusEffectManagerEntryDto,
  ) {
    let replacedValue;
    if (statusEffectManagerEntry.OperatorType === StatusEffectOperator.Add) {
      if (statusEffect.baseValue < 0) {
        replacedValue = statusEffect.baseValue.toString();
      } else {
        replacedValue = `+${statusEffect.baseValue}`;
      }
    } else {
      replacedValue = `${statusEffect.baseValue}`;
    }

    const replacers: Record<string, string | number> = {
      Value: replacedValue,
      ExtraValue: statusEffect.extraValue,
      DamageType: statusEffect.damageTypeValue,
      Class: statusEffect.classValueId,
    };

    const replaced = input.replaceAll(/\{[^}]+\}/g, (str) => {
      const split = str.substring(1, str.length - 1).split(':');

      let replacer: string;
      if (split.length === 1) {
        replacer = replacers.Value.toString();
      } else if (split.length === 2) {
        replacer = replacers[split[1]].toString();
      } else {
        replacer = replacers[split[1]].toString();

        const display = split[2];
        if (display.toLowerCase().includes('percent')) {
          replacer += `%`;
        }
      }

      if (statusEffectManagerEntry.OperatorType === StatusEffectOperator.Multiply) {
        replacer = `${replacer} increased`;
      }

      return replacer;
    });

    return replaced;
  }

  async function renderChildren(statusEffect: StatusEffectDto) {
    const childIds = statusEffect.childStatusEffectIds;

    const childStatusEffects: StatusEffectDto[] = await (
      await fetch('/status-effects', {
        body: JSON.stringify({ ids: childIds }),
        method: 'POST',
      })
    ).json();

    const children = await Promise.all(childStatusEffects.map((s) => renderStatusEffect(s)));

    return children.flat();
  }

  async function renderStatusEffect(statusEffect: StatusEffectDto): Promise<string[]> {
    if (!statusEffect.description) {
      const description = statusEffectManager.find((s) => s.statusEffectType === statusEffect.type);

      if (description && description.display) {
        const root = await interpolate(description.display, statusEffect, description);
        const rendered: string[] = [root];
        return rendered.concat(await renderChildren(statusEffect));
      }
    }

    const rendered: string[] = [];
    const rootRenderer = renderers.rendererFor(statusEffect.type);
    if (!rootRenderer) {
      rendered.push('Unimplemented effect renderer');
    } else {
      const result = await rootRenderer.renderString(statusEffect, 'Self');
      rendered.push(result ?? 'Unimplemented effect renderer');
    }

    return rendered.concat(await renderChildren(statusEffect));
  }

  async function render(abilityUnlock: AbilityDto) {
    const { statusEffects } = abilityUnlock;

    const promises = statusEffects.map((s) => {
      return renderStatusEffect(s);
    });

    return (await Promise.all(promises)).flat();
  }
</script>

<div>
  {#if abilityUnlock.addedAbility}
    {#await render(abilityUnlock.addedAbility)}
      Loading...
    {:then rendered}
      <p>{abilityUnlock.addedAbility.description}</p>
      <hr class="my-4 border-foreground" />
      {#each rendered as effect}
        <p>{effect}</p>
      {/each}
    {/await}
  {/if}
</div>
