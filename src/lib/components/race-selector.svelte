<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
  import type { RaceDto } from '$lib/dtos/race.dto.js';
  import type { SubraceDto } from '$lib/dtos/subrace.dto.js';

	interface Props {
		races: RaceDto[];

		subraces: SubraceDto[];

		race: RaceDto;

		[key: string]: unknown;
	}

	let { races, subraces, race = $bindable() }: Props = $props();

	let raceValue: string = $derived(races[0].id);

	const raceTriggerContent = $derived(
		races.find((r) => r.id === raceValue)?.displayName ?? 'Select a race',
	);

	let subraceOptions: SubraceDto[] = $derived(
		subraces.filter(s => s.raceId === raceValue)
	);

	let subraceValue: string = $derived(subraceOptions[0].id);

	const subraceTriggerContent = $derived(
		subraceOptions.find((s) => s.id === subraceValue)?.displayName ??
			'Select a subrace',
	);
</script>

<Card.Root class="m-2 w-1/3">
	<Card.Header>
		<Card.Title>Race</Card.Title>
		<Card.Description
			>Your selected race affects your attribute values. Each race gets a bonus
			or penalty to specific attributes. You will be able to select a subrace
			after selecting your race.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<Select.Root
			type="single"
			bind:value={raceValue}
			onValueChange={(v) => (race = races.find((r) => r.id === v)!)}
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

		<Select.Root type="single" bind:value={subraceValue}>
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
		<p class="text-muted-foreground">
			{subraceOptions.find((s) => s.id == subraceValue)?.description}
		</p>
	</Card.Content>
</Card.Root>
