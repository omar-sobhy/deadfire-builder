<script lang="ts">
  import { StatusEffectChildUsageType } from '../../types/enums/status-effect-child-usage-type.js';

  import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
  import type { Renderers } from '$lib/render/index.js';
  import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
  import { StatusEffectOperator } from '../../types/enums/status-effect-operator.js';
  import { StatusEffectType } from '../../types/enums/status-effect-type.js';

  interface Props {
    renderers: Renderers;
    abilityUnlock: AbilityUnlockDto;
    statusEffectManager: StatusEffectManagerEntryDto[];
  }

  let { renderers, abilityUnlock, statusEffectManager }: Props = $props();

  async function statusEffectReplacer(statusEffect: StatusEffectDto) {
    const response = await fetch('/status-effects', {
      method: 'POST',
      body: JSON.stringify({
        ids: statusEffect.childStatusEffectIds,
      }),
    });

    const json: StatusEffectDto[] = await response.json();

    const mapped = (await Promise.all(json.map((j) => renderStatusEffect(j)))).flat();

    switch (statusEffect.useStatusEffectValueAs) {
      case StatusEffectChildUsageType.None:
        return 'Unimplemented "none" status effect child usage type';
      case StatusEffectChildUsageType.Transfer:
      case StatusEffectChildUsageType.Child:
      case StatusEffectChildUsageType.TriggeredChild:
        return mapped.map((m) => `${m} (Removed when parent effect ends)`);
    }
  }

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

    const replacerIndexMap: Record<number, string | string[]> = {
      0: statusEffect.baseValue.toString(),
      1: statusEffect.extraValue.toString(),
      2: statusEffect.damageTypeValue,
      3: 'Unimplemented keyword renderer',
      4: statusEffect.raceName,
      5: statusEffect.statusEffectTypeValue,
      7: statusEffect.afflictionTypeValueId,
      8: await statusEffectReplacer(statusEffect),
      11: statusEffect.classValueId,
      13: statusEffect.weaponTypeValue,
      14: statusEffect.dynamicSkillId,
      15: statusEffect.attackHitType,
    };

    const values: (typeof replacerIndexMap)[number][] = [];

    for (let i = 0; i < 15; ++i) {
      const mask = 1 << i;
      if ((statusEffectManagerEntry.dataType & mask) >> i === 1) {
        values.push(replacerIndexMap[i]);
      }
    }

    const replaced = input.replaceAll(/\{[^}]+\}/g, (str) => {
      const split = str.substring(1, str.length - 1).split(':');

      let replacer: string | string[];

      const index = Number.parseInt(split[0]);

      replacer = values[index];

      if (statusEffectManagerEntry.OperatorType === StatusEffectOperator.Multiply) {
        replacer = `${replacer} increased`;
      }

      if (Array.isArray(replacer)) {
        return replacer.join('\n');
      }

      return replacer;
    });

    return replaced;
  }

  async function renderChildren(statusEffect: StatusEffectDto) {
    const childIds = statusEffect.childStatusEffectIds;

    if (childIds.length === 0) {
      return [];
    }

    const childStatusEffects: unknown = await (
      await fetch('/status-effects', {
        body: JSON.stringify({ ids: childIds }),
        method: 'POST',
      })
    ).json();

    if (!Array.isArray(childStatusEffects)) {
      throw childStatusEffects;
    }

    const children = await Promise.all(
      (childStatusEffects as StatusEffectDto[]).map((s) => renderStatusEffect(s)),
    );

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
    if (statusEffect.type !== StatusEffectType.None) {
      const rootRenderer = renderers.rendererFor(statusEffect.type);
      if (!rootRenderer) {
        rendered.push(`Unimplemented effect renderer ${statusEffect.type}`);
      } else {
        const result = await rootRenderer.renderString(statusEffect, 'Self');
        rendered.push(result ?? `Unimplemented effect renderer ${statusEffect.type}`);
      }
    }

    return rendered.concat(await renderChildren(statusEffect));
  }

  async function render(abilityUnlock: AbilityDto) {
    const { statusEffects } = abilityUnlock;

    const promises = statusEffects.map((s) => {
      return renderStatusEffect(s);
    });

    const rendered = await Promise.all(promises);

    return rendered.flat();
  }
</script>

<div>
  {#if abilityUnlock.addedAbility}
    {#await render(abilityUnlock.addedAbility)}
      Loading...
    {:then rendered}
      {#if abilityUnlock.addedAbility.description}
        <p>{abilityUnlock.addedAbility.description}</p>
      {:else}
        <p class="italic">No ability description</p>
      {/if}
      {#each abilityUnlock.addedAbility.upgradeDescriptions as upgrade}
        {#each upgrade.replaceAll(/(\n+)/g, '\n').split('\n') as part}
          <p>{@html part}</p>
        {/each}
      {/each}
      <hr class="my-4 border-foreground" />
      {#each rendered as effect}
        <p>{effect}</p>
      {/each}
    {:catch e}
      <p>{e.toString()}</p>
    {/await}
  {/if}
</div>
