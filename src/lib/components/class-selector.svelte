<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { IDBPDatabase } from 'idb';
  import type { DeadfireDb } from '../../types/index-db.js';
  import type { ClassDto } from '$lib/dtos/character/class.dto.js';
  import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
  import type { AbilityUnlockDto } from '$lib/dtos/progression/ability-unlock.dto.js';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';

  interface Props {
    db: IDBPDatabase<DeadfireDb>;

    classes: ClassDto[];

    subclasses: SubclassDto[];

    selectedClass: ClassDto;

    selectedSubclass: SubclassDto;
  }

  let {
    db,
    classes,
    subclasses,
    selectedSubclass = $bindable(),
    selectedClass = $bindable(),
  }: Props = $props();

  let selectedClassId = $derived(selectedClass.id);

  let classTriggerContent = $derived(selectedClass.displayName ?? 'Unknown class name');

  let currentSubclasses = $derived(subclasses.filter((s) => s.classId === selectedClassId));

  let selectedSubclassId = $derived(selectedSubclass.id);

  let subclassAbilities = $derived.by(() => {
    const abilities: Record<string, AbilityUnlockDto> = {};

    for (const a of selectedSubclass.abilities) {
      if (a.addedAbility) {
        abilities[a.addedAbility.id] = a;
      }
    }

    return abilities;
  });

  let classAbilities = $derived.by(() => {
    const abilities: Record<string, AbilityUnlockDto> = {};

    for (const a of selectedClass.abilities) {
      if (a.addedAbility) {
        abilities[a.addedAbility.id] = a;
      }
    }

    return abilities;
  });

  const allAbilities = $derived({ ...subclassAbilities, ...classAbilities });

  const autoUnlocks = $derived(
    Object.values(allAbilities).filter((a) => a.style === UnlockStyle.AutoGrant),
  );

  $inspect(allAbilities);
  $inspect(autoUnlocks);

  let subclassTriggerContent = $derived(selectedSubclass.displayName ?? 'Unknown subclass name');
</script>

<Card.Root class="m-2 w-full">
  <Card.Header>
    <Card.Title>Class</Card.Title>
    <Card.Description>
      Your selected class affects which abilities you can unlock as the game progresses.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <Tooltip.Provider>
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
            {#each currentSubclasses as subclass (subclass.id)}
              <Select.Item value={subclass.id} label={subclass.displayName}>
                {subclass.displayName}
              </Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        <Card.Root class="w-1/2">
          <Card.Header class="w-full absolute transform -translate-y-9">
            Auto-added abilities
          </Card.Header>
          <Card.Content>
            {#each autoUnlocks as ability (ability.addedAbility!.id)}
              <Dialog.Root>
                <Tooltip.Root delayDuration={0.2}>
                  <Tooltip.Trigger>
                    <Dialog.Trigger>
                      <img
                        src="/icons/{ability.icon.split('/').toReversed()[0]}"
                        alt={ability.addedAbility?.displayName ?? 'Unknown ability name'}
                        class=""
                      />
                    </Dialog.Trigger>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>
                          {ability.addedAbility?.displayName ?? 'Unknown ability name'}
                        </Dialog.Title>
                      </Dialog.Header>
                      {ability.addedAbility?.description ?? 'Unknown ability description'}
                      <Dialog.Footer>
                        <Dialog.Close>Ok</Dialog.Close>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    {ability.addedAbility?.displayName ?? 'Unknown ability name'}
                  </Tooltip.Content>
                </Tooltip.Root>
              </Dialog.Root>
            {/each}
          </Card.Content>
        </Card.Root>
      </div>

      <hr class="border my-3" />
      <span>
        {JSON.stringify(selectedClass.abilities, undefined, 2)}
      </span>
    </Tooltip.Provider>
  </Card.Content>
</Card.Root>
