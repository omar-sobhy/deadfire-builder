<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  import type { ClassDto } from '$lib/dtos/character/class.dto.js';
  import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';
  import type { Renderers } from '$lib/render/index.js';
  import AbilityIcon from './ability-icon.svelte';
  import type { StatusEffectManagerEntryDto } from '$lib/dtos/status-effect/status-effect-manager-entry.dto.js';
  import type { ConditionalType } from '$lib/dtos/progression/conditional.dto.js';
  import AbilitySelector from './ability-selector.svelte';
  import { Button } from './ui/button/index.js';

  interface Props {
    classes: ClassDto[];
    subclasses: SubclassDto[];
    selectedClass: ClassDto;
    selectedSubclass?: SubclassDto;
    renderers: Renderers;
    statusEffectManager: StatusEffectManagerEntryDto[];
  }

  let {
    renderers,
    classes,
    subclasses,
    statusEffectManager,
    selectedSubclass = $bindable(),
    selectedClass = $bindable(),
  }: Props = $props();

  let selectedClassId = $derived(selectedClass.id);
  let classTriggerContent = $derived(selectedClass.displayName ?? 'Unknown class name');
  let currentSubclasses = $derived(subclasses.filter((s) => s.classId === selectedClassId));
  let selectedSubclassId = $derived(selectedSubclass?.id ?? 'None');

  let selectedMulticlass: ClassDto | undefined = $state();
  let selectedMulticlassId = $derived(selectedMulticlass?.id);
  let multiSubclasses = $derived(subclasses.filter((s) => s.classId === selectedMulticlass?.id));
  let selectedMultiSubclass: SubclassDto | undefined = $state();
  let selectedMultiSubclassId = $derived(selectedMultiSubclass?.id ?? 'None');

  const allUnlocks = $derived.by(() => {
    const unlocks = Object.values(selectedClass.abilities).filter((a) => !!a.addedAbility);

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
  });

  const splitLevels = $derived(allUnlocks.map((level) => split(level)));

  const autoUnlocks = $derived(allUnlocks.flat().filter((a) => a.style === UnlockStyle.AutoGrant));

  let subclassTriggerContent = $derived(selectedSubclass?.displayName ?? 'None');

  function unlockIsFor(unlock: AbilityUnlockDto, id: string, type: ConditionalType) {
    for (const c of unlock.visibilityConditionals) {
      if (c.type === type && c.parameter !== id) {
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
              <li>Shift + left-click on an ability to see its description</li>
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
                  selectedClass = classes.find((c) => c.id === v)!;
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

              <Select.Root
                type="single"
                bind:value={selectedSubclassId}
                onValueChange={(v) => {
                  selectedSubclass = subclasses.find((s) => s.id === v)!;
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {subclassTriggerContent}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="None" label="None">None</Select.Item>
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
                  selectedMulticlass = classes.find((c) => c.id === v);
                }}
              >
                <Select.Trigger class="w-50 mb-4">
                  {selectedMulticlass?.displayName ?? 'None'}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="None" label="None">None</Select.Item>
                  {#each classes.filter((c) => c.id !== selectedClassId) as clazz (clazz.id)}
                    <Select.Item value={clazz.id} label={clazz.displayName}>
                      {clazz.displayName}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>

              <Select.Root
                type="single"
                bind:value={selectedMultiSubclassId}
                onValueChange={(v) => {
                  selectedMultiSubclass = subclasses.find((s) => s.id === v)!;
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
              {#each autoUnlocks as ability}
                <AbilityIcon {ability} {renderers} {statusEffectManager} />
              {/each}
            </Card.Content>
          </Card.Root>
        </div>

        <hr class="flex-none border my-3" />
        <div class="">
          <AbilitySelector powerLevels={splitLevels} {renderers} {statusEffectManager} />
        </div>
      </div>
    </Tooltip.Provider>
  </Card.Content>
</Card.Root>
