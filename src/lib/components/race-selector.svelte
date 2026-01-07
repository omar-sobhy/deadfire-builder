<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { stripTags } from '$lib/utils.js';
  import type { RaceDto } from '$lib/dtos/character/race.dto.js';
  import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';
  import { UnlockStyle } from '../../types/enums/unlock-style.js';
  import { getDeadfireContext } from '$lib/context.svelte.js';

  const context = getDeadfireContext();

  const { races: allRaces, selectedRace, subraces, selectedSubrace } = $derived(context);

  const races = $derived(allRaces.filter((r) => r.isKith));

  let raceId: string = $derived(races[0].id);

  const raceTriggerContent = $derived(selectedRace.displayName ?? 'Select a race');

  let subraceOptions: SubraceDto[] = $derived(subraces[context.selectedRace.id]);

  let subraceId: string = $derived(selectedSubrace.id);

  const subraceTriggerContent = $derived(selectedSubrace.displayName ?? 'Select a subrace');

  const subraceAbilityUnlocks = $derived.by(() => {
    return selectedSubrace.abilities.filter((a) => {
      const addedAbility = a.addedAbility;
      if (!addedAbility) {
        return false;
      }

      if (addedAbility.debugName.includes('NPC')) {
        return false;
      }

      if (addedAbility.debugName.includes('VFX')) {
        return false;
      }

      if (a.style !== UnlockStyle.AutoGrant) {
        return false;
      }

      return true;
    });
  });

  const raceAbilityUnlocks = $derived.by(() => {
    return selectedRace.abilities.filter(
      (a) =>
        a.style === UnlockStyle.AutoGrant &&
        // exception for unarmed proficiency
        a.addedAbility?.id !== 'b10b5003-f194-41e8-97ec-614aac8fb350',
    );
  });

  const allAbilities = $derived(raceAbilityUnlocks.concat(subraceAbilityUnlocks));
</script>

<Card.Root class="m-2 w-1/3">
  <Card.Header>
    <Card.Title>Race</Card.Title>
    <Card.Description
      >Your selected race affects your attribute values. Each race gets a bonus or penalty to
      specific attributes. You will be able to select a subrace after selecting your race.</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <Select.Root
      type="single"
      bind:value={raceId}
      onValueChange={(v) => (context.selectedRace = races.find((r) => r.id === v)!)}
    >
      <Select.Trigger class="w-50">
        {raceTriggerContent}
      </Select.Trigger>
      <Select.Content>
        {#each races as race (race.id)}
          <Select.Item value={race.id} label={race.displayName}>
            {race.displayName}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>

    <Select.Root
      type="single"
      bind:value={subraceId}
      onValueChange={(v) => {
        context.selectedSubrace = Object.values(subraces)
          .flat()
          .find((r) => r.id === subraceId)!;
      }}
    >
      <Select.Trigger class="my-4 w-50">
        {subraceTriggerContent}
      </Select.Trigger>
      <Select.Content>
        {#each subraceOptions as subrace (subrace.id)}
          <Select.Item value={subrace.id} label={subrace.displayName}>
            {subrace.displayName}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <h1>Abilities gained</h1>
    {#each allAbilities as unlock}
      <p class="text-muted-foreground">
        {#if unlock.addedAbility}
          <span class="italic">
            {stripTags(unlock.addedAbility.displayName!)} -
          </span>
          {#if unlock.addedAbility.description}
            <span>{stripTags(unlock.addedAbility.description!)}</span>
          {/if}
        {/if}
      </p>
    {/each}
    <!-- {subraceOptions.find((s) => s.id === subraceId)?.summary} -->
  </Card.Content>
</Card.Root>
