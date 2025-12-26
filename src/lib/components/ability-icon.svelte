<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { AbilityDto } from '$lib/dtos/ability/ability.dto.js';
  import type { Renderers } from '$lib/render/index.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import type { StatusEffectDto } from '$lib/dtos/status-effect/status-effect.dto.js';
  import type { IDBPDatabase, IDBPTransaction } from 'idb';
  import type { DeadfireDb } from '../../types/indexed-db.js';
  import AbilityDescription from './ability-description.svelte';

  interface Props {
    db: IDBPDatabase<DeadfireDb>;
    renderers: Renderers;
    ability: AbilityUnlockDto;
  }

  const { db, renderers, ability }: Props = $props();

  let isOpen = $state(false);

  async function renderStatusEffect(
    statusEffect: StatusEffectDto,
    transaction: IDBPTransaction<DeadfireDb, ['statusEffects']>,
  ): Promise<string[]> {
    const rendered: string[] = [];

    const rootRenderer = renderers.rendererFor(statusEffect.type);
    if (!rootRenderer) {
      rendered.push('Unimplemented effect renderer');
    } else {
      const result = await rootRenderer.renderString(statusEffect, 'Self');
      rendered.push(result ?? 'Unimplemented effect renderer');
    }

    const statusEffects = transaction.objectStore('statusEffects');

    const childStatusEffects = await Promise.all(
      statusEffect.childStatusEffectIds.map((i) => statusEffects.get(i)),
    );

    const filtered = childStatusEffects.filter((s) => !!s);

    const children = await Promise.all(
      filtered.map((s) => renderStatusEffect(s.data, transaction)),
    );

    return rendered.concat(children.flat());
  }

  async function render(abilityUnlock: AbilityDto) {
    const { statusEffects } = abilityUnlock;

    const transaction = db.transaction('statusEffects');

    const promises = statusEffects.map((s) => {
      return renderStatusEffect(s, transaction);
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
        <AbilityDescription {db} {renderers} abilityUnlock={ability} />
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
