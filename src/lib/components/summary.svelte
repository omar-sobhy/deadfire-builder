<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';

  import { getDeadfireContext } from '$lib/context.svelte.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import AbilityIcon from './ability-icon.svelte';

  const context = getDeadfireContext()();

  const {
    attributes,
    selectedRace,
    selectedSubrace,
    selectedCulture,
    selectedClass,
    selectedSubclass,
    selectedMulticlass,
    selectedMultiSubclass,
    selectedAbilities,
  } = $derived(context);

  const abilitiesMap = $derived.by(() => {
    const map: Record<string, AbilityUnlockDto> = {};

    for (const a of selectedClass.abilities) {
      map[a.addedAbility!.id] = a;
    }

    if (selectedMulticlass) {
      for (const a of selectedMulticlass.abilities) {
        map[a.addedAbility!.id] = a;
      }
    }

    return map;
  });

  const sortedAbilities = $derived.by(() => {
    const chosenAbilities = [
      ...selectedAbilities.values().map((a) => {
        const unlock = abilitiesMap[a];
        return { level: unlock.minimumPowerLevel, unlock };
      }),
    ];

    const grouped = Object.groupBy(chosenAbilities, (item) => item.level);

    return Object.values(grouped);
  });
</script>

<div class="flex flex-row gap-2 mt-2">
  <Card.Root class="w-1/2">
    <Card.Header class="text-center font-bold">Initial Character Creation</Card.Header>
    <Card.Content>
      <div
        class="flex flex-row justify-between mx-10 *:border-x *:grow **:mx-auto **:px-2 **:text-center"
      >
        <div>
          <div class="font-bold">Race</div>
          <div>{selectedRace.displayName}</div>
          <hr class="my-3" />
          <div class="font-bold">Subrace</div>
          <div>{selectedSubrace.displayName}</div>
        </div>
        <div class="grid grid-cols-2 gap-x-3 w-auto">
          <div class="font-bold col-span-2 text-center">Attributes</div>
          {#each Object.entries(attributes) as entry}
            <div class="capitalize text-right">{entry[0]}</div>
            <div>{entry[1]}</div>
          {/each}
        </div>
        <div>
          <div class="font-bold">Class</div>
          <div>{selectedClass.displayName}</div>
          <hr class="my-3" />
          <div class="font-bold">Subclass</div>
          <div>{selectedSubclass?.displayName ?? 'N/A'}</div>
        </div>
        <div>
          <div class="font-bold">Multiclass</div>
          <div>{selectedMulticlass?.displayName ?? 'N/A'}</div>
          <hr class="my-3" />
          <div class="font-bold">Multisubclass</div>
          <div>{selectedMultiSubclass?.displayName ?? 'N/A'}</div>
        </div>
        <div class="">
          <div class="font-bold">Culture</div>
          <div>{selectedCulture.displayName}</div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-1/2">
    <Card.Header class="text-center font-bold">Abilities</Card.Header>
    <Card.Content>
      <div class="grid not-first:border-y">
        {#each sortedAbilities as level}
          {#each level as ability}
            <AbilityIcon ability={ability.unlock} />
          {/each}
        {/each}
      </div>
    </Card.Content>
  </Card.Root>
</div>
