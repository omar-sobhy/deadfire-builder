<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';
  import AbilityIcon from './ability-icon.svelte';
  import type { ConditionalType } from '$lib/dtos/progression/conditional.dto.js';
  import AbilitySelector from './ability-selector.svelte';
  import { Button } from './ui/button/index.js';
  import { getDeadfireContext } from '$lib/context.svelte.js';
  import { SvelteSet } from 'svelte/reactivity';

  const context = getDeadfireContext()();

  const {
    classes,
    selectedClass,
    subclasses,
    selectedSubclass,
    selectedMulticlass,
    selectedMultiSubclass,
  } = $derived(context);

  let selectedClassId = $derived(selectedClass.id);
  let classTriggerContent = $derived(selectedClass.displayName ?? 'Unknown class name');
  let currentSubclasses = $derived(subclasses[selectedClassId]);
  let selectedSubclassId = $derived(selectedSubclass?.id ?? 'None');

  let selectedMulticlassId = $derived(selectedMulticlass?.id);
  let multiSubclasses = $derived(
    selectedMulticlassId ? subclasses[selectedMulticlassId] : undefined,
  );
  let selectedMultiSubclassId = $derived(selectedMultiSubclass?.id ?? 'None');

  let subclassTriggerContent = $derived(selectedSubclass?.displayName ?? 'None');

  const allClassUnlocks = $derived.by(() => {
    const unlocks = selectedClass.abilities.concat(selectedSubclass?.abilities ?? []);
    $inspect(unlocks);

    return unlocksToPowerLevels(unlocks);
  });

  const splitClassLevels = $derived(allClassUnlocks.map((level) => split(level)));

  const autoClassUnlocks = $derived(
    allClassUnlocks
      .flat()
      .filter((a) => a.style === UnlockStyle.AutoGrant && a.visibilityConditionals.length === 0),
  );

  const allMulticlassUnlocks = $derived.by(() => {
    if (selectedMulticlass) {
      const unlocks = selectedMulticlass.abilities.concat(selectedMultiSubclass?.abilities ?? []);
      return unlocksToPowerLevels(unlocks);
    }
  });

  const splitMulticlassLevels = $derived(allMulticlassUnlocks?.map((level) => split(level)));

  const autoMulticlassUnlocks = $derived(
    allMulticlassUnlocks
      ?.flat()
      .filter((a) => a.style === UnlockStyle.AutoGrant && a.visibilityConditionals.length === 0),
  );

  function unlocksToPowerLevels(unlocks: AbilityUnlockDto[]) {
    const powerLevels: AbilityUnlockDto[][] = [];
    for (let i = 0; i < 10; ++i) {
      powerLevels[i] = [];
    }

    for (const u of unlocks) {
      if (!unlockIsFor(u, selectedClassId, 'class')) {
        continue;
      }

      if (!unlockIsFor(u, selectedSubclassId, 'subclass')) {
        continue;
      }

      powerLevels[u.minimumPowerLevel].push(u);
    }

    return powerLevels;
  }

  function unlockIsFor(unlock: AbilityUnlockDto, id: string, type: ConditionalType) {
    for (const c of unlock.visibilityConditionals) {
      if (c.type === type && c.parameter !== id && !c.not) {
        return false;
      }

      if (c.type === type && c.parameter === id && c.not) {
        return false;
      }
    }

    return true;
  }

  function split(unlocks: AbilityUnlockDto[]): {
    passive: AbilityUnlockDto[];
    active: AbilityUnlockDto[];
  } {
    const passive: AbilityUnlockDto[] = [];
    const active: AbilityUnlockDto[] = [];

    for (const u of unlocks) {
      if (!u.addedAbility) {
        continue;
      }

      if (u.addedAbility.isPassive) {
        passive.push(u);
      } else {
        active.push(u);
      }
    }

    return { passive, active };
  }

  /**
   * Removes the passed abilities from the currently selected abilities.
   *
   * @param remove The ability IDs to remove.
   */
  function removeAbilities(remove: AbilityUnlockDto[] | string[] = []) {
    const ids = remove.map((r) => (typeof r === 'string' ? r : r.addedAbility!.id));

    const toKeep = context.selectedAbilities.difference(new SvelteSet(ids));

    context.selectedAbilities = toKeep;
  }
</script>

<Card.Root class="m-2 h-auto">
  <Card.Header>
    <Card.Title class="flex justify-between">
      <span>Class</span>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="ghost" class="font-bold hover:cursor-pointer">Help</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Help</Dialog.Title>
          </Dialog.Header>
          <div class="flex">
            <ul class="list-disc">
              <li>Left-click or tap on an ability to select or deselect it</li>
              <li>
                Shift + left-click on an ability to see its description (note: ability descriptions
                are highly WIP)
              </li>
            </ul>
          </div>
          <Dialog.Footer>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Card.Title>
    <Card.Description>
      Your selected class affects which abilities you can unlock as the game progresses.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <Tooltip.Provider>
      <div class="flex flex-col">
        <div class="flex-none grid grid-cols-2">
          <div class="flex flex-col">
            <!-- Class -->
            <div class="flex flex-row gap-4 items-center">
              <Select.Root
                type="single"
                bind:value={selectedClassId}
                onValueChange={(v) => {
                  context.selectedClass = classes.find((c) => c.id === v)!;

                  if (context.selectedClass.requiresSubclass) {
                    const id = context.selectedClass.id;
                    const subclasses = context.subclasses[id];
                    context.selectedSubclass = subclasses[0];
                  } else {
                    context.selectedSubclass = undefined;
                  }

                  if (context.selectedClass.id === context.selectedMulticlass?.id) {
                    context.selectedMulticlass = undefined;
                    context.selectedMultiSubclass = undefined;
                  }

                  removeAbilities([...context.selectedAbilities]);
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {classTriggerContent}
                </Select.Trigger>
                <Select.Content>
                  {#each classes as clazz (clazz.id)}
                    <Select.Item value={clazz.id} label={clazz.displayName}>
                      {clazz.displayName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>

              <!-- Subclass -->
              <Select.Root
                type="single"
                bind:value={selectedSubclassId}
                onValueChange={(v) => {
                  removeAbilities(context.selectedSubclass?.abilities ?? []);

                  context.selectedSubclass = Object.values(subclasses)
                    .flat()
                    .find((s) => s.id === v);
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {subclassTriggerContent}
                </Select.Trigger>
                <Select.Content>
                  {#if !context.selectedClass.requiresSubclass}
                    <Select.Item value="None" label="None">None</Select.Item>
                  {/if}
                  {#each currentSubclasses as subclass (subclass.id)}
                    <Select.Item value={subclass.id} label={subclass.displayName}>
                      {subclass.displayName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>

            <!-- Multiclass -->
            <div class="flex flex-row gap-4 items-center">
              <Select.Root
                type="single"
                bind:value={selectedMulticlassId}
                onValueChange={(v) => {
                  removeAbilities(context.selectedMulticlass?.abilities);
                  removeAbilities(context.selectedMultiSubclass?.abilities);

                  context.selectedMulticlass = classes.find((c) => c.id === v);
                  context.selectedMultiSubclass = undefined;

                  if (context.selectedMulticlass!.requiresSubclass) {
                    const id = context.selectedMulticlass!.id;
                    const subclasses = context.subclasses[id];
                    context.selectedMultiSubclass = subclasses[0];
                  } else {
                    context.selectedMultiSubclass = undefined;
                  }
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {selectedMulticlass?.displayName ?? 'None'}
                </Select.Trigger>
                <Select.Content>
                  {#if context.selectedMulticlass && !context.selectedMulticlass.requiresSubclass}
                    <Select.Item value="None" label="None">None</Select.Item>
                  {/if}
                  {#each classes.filter((c) => c.id !== selectedClassId) as clazz (clazz.id)}
                    <Select.Item value={clazz.id} label={clazz.displayName}>
                      {clazz.displayName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>

              <!-- Multisubclass -->
              <Select.Root
                type="single"
                bind:value={selectedMultiSubclassId}
                onValueChange={(v) => {
                  removeAbilities(context.selectedMultiSubclass?.abilities);

                  context.selectedMultiSubclass = Object.values(subclasses)
                    .flat()
                    .find((s) => s.id === v);
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {selectedMultiSubclass?.displayName ?? 'None'}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="None" label="None">None</Select.Item>
                  {#each multiSubclasses as subclass (subclass.id)}
                    <Select.Item value={subclass.id} label={subclass.displayName}>
                      {subclass.displayName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <Card.Root class="w-1/2">
            <Card.Header class="w-125 absolute transform -translate-y-9">
              Auto-added abilities
            </Card.Header>
            <Card.Content>
              {#each autoClassUnlocks as ability}
                <AbilityIcon {ability} />
              {/each}
              {#if autoMulticlassUnlocks}
                {#each autoMulticlassUnlocks as ability}
                  <AbilityIcon {ability} />
                {/each}
              {/if}
            </Card.Content>
          </Card.Root>
        </div>

        <hr class="flex-none border my-3" />
        <div class="">
          <AbilitySelector
            mainPowerLevels={splitClassLevels}
            multiPowerLevels={splitMulticlassLevels}
          />
        </div>
      </div>
    </Tooltip.Provider>
  </Card.Content>
</Card.Root>
