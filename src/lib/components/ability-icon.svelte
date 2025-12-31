<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
  import type { Renderers } from '$lib/render/index.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
  import AbilityDescription from './ability-description.svelte';
  import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';

  interface Props {
    renderers: Renderers;
    ability: AbilityUnlockDto;
    statusEffectManager: StatusEffectManagerEntryDto[];
  }

  const { renderers, ability, statusEffectManager }: Props = $props();

  let isOpen = $state(false);

  async function renderStatusEffect(statusEffect: StatusEffectDto): Promise<string[]> {
    const rendered: string[] = [];

    const rootRenderer = renderers.rendererFor(statusEffect.type);
    if (!rootRenderer) {
      rendered.push('Unimplemented effect renderer');
    } else {
      const result = await rootRenderer.renderString(statusEffect, 'Self');
      rendered.push(result ?? 'Unimplemented effect renderer');
    }

    const childIds = statusEffect.childStatusEffectIds;

    const childStatusEffects: StatusEffectDto[] = await (
      await fetch('/status-effects', {
        body: JSON.stringify({ ids: childIds }),
        method: 'POST',
      })
    ).json();

    const children = await Promise.all(childStatusEffects.map((s) => renderStatusEffect(s)));

    return rendered.concat(children.flat());
  }

  async function render(abilityUnlock: AbilityDto) {
    const { statusEffects } = abilityUnlock;

    const promises = statusEffects.map((s) => {
      return renderStatusEffect(s);
    });

    return (await Promise.all(promises)).flat();
  }

  async function handleClick(e: MouseEvent) {
    if (e.button !== 2) return;
    isOpen = true;
  }
</script>

<Tooltip.Root delayDuration={0.2}>
  <Tooltip.Trigger>
    <Dialog.Root bind:open={isOpen}>
      <Dialog.Trigger>
        <button onclick={handleClick}>
          <img
            src="/icons/{ability.icon.split('/').toReversed()[0]}"
            alt={ability.addedAbility?.displayName ?? 'Unknown ability name'}
            class="hover:cursor-pointer"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            {ability.addedAbility?.displayName ?? 'Unknown ability name'}
          </Dialog.Title>
        </Dialog.Header>
        <AbilityDescription {renderers} {statusEffectManager} abilityUnlock={ability} />
        <Dialog.Footer>
          <Dialog.Close>Ok</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </Tooltip.Trigger>
  <Tooltip.Content>
    {ability.addedAbility?.displayName ?? 'Unknown ability name'}
  </Tooltip.Content>
</Tooltip.Root>
