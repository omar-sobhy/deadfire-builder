<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';

  import { getDeadfireContext } from '$lib/context.svelte.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import AbilityIcon from './ability-icon.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { unlockIsFor } from '$lib/utils.js';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';

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
    autoAbilities,
  } = $derived(context);

  const abilitiesMap = $derived.by(() => {
    const map: Record<string, AbilityUnlockDto> = {};

    for (const a of context.allAbilities()) {
      if (!unlockIsFor(a, selectedClass.id, 'class')) {
        continue;
      }

      if (!unlockIsFor(a, selectedSubclass?.id ?? '', 'subclass')) {
        continue;
      }

      if (selectedMulticlass && !unlockIsFor(a, selectedMulticlass.id ?? '', 'class')) {
        continue;
      }

      if (selectedMultiSubclass && !unlockIsFor(a, selectedMultiSubclass.id ?? '', 'subclass')) {
        continue;
      }

      map[`${a.style}-${a.addedAbility!.id}`] = a;
    }

    return map;
  });

  function getFromMap(id: string, style: UnlockStyle) {
    return abilitiesMap[`${style}-${id}`];
  }

  const sortedAbilities = $derived.by(() => {
    const selected = selectedAbilities
      .values()
      .map((id) => getFromMap(id, UnlockStyle.Unlock))
      .filter((v) => !!v);

    const auto = autoAbilities
      .values()
      .map((id) => getFromMap(id, UnlockStyle.AutoGrant))
      .filter((v) => !!v);

    const allUnlocks = [...selected, ...auto].map((a) => {
      return { level: a.minimumPowerLevel, unlock: a };
    });

    const sorted = [...allUnlocks].sort((lhs, rhs) => {
      const lhsName = lhs.unlock.addedAbility!.displayName!;
      const rhsName = rhs.unlock.addedAbility!.displayName!;

      return lhsName.localeCompare(rhsName);
    });

    $inspect(auto);

    const grouped = Object.groupBy(sorted, (item) => item.level);
    $inspect(grouped);

    return grouped;
  });

  const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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
      <div class="grid">
        {#each indexes as level}
          <Tooltip.Provider>
            <Tooltip.Root>
              <div class="flex flex-row gap-2">
                <svg width="40" height="40" scale="0.5" viewBox="0 0 80 80">
                  <polygon points="0 40,40 80,80 40,40 0" class="bg-[#020618]" />
                  <text
                    x="50%"
                    y="50%"
                    dominant-baseline="middle"
                    text-anchor="middle"
                    fill="white"
                    class="text-3xl"
                  >
                    {level}
                  </text>
                </svg>
                {#each sortedAbilities[level] as ability}
                  <AbilityIcon ability={ability.unlock} />
                {/each}
              </div>
              <hr class="my-2" />
            </Tooltip.Root>
          </Tooltip.Provider>
        {/each}
      </div>
    </Card.Content>
  </Card.Root>
</div>
