<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Race, RaceName } from '../../types/character-creation';
	import * as Card from '$lib/components/ui/card/index.js';

	interface Props {
		races: Race[];
		subraces: Record<
			RaceName,
			{ label: string; value: string; abilityDescription: string }[]
		>;
		race: Race;

		[key: string]: unknown;
	}

	let { races, subraces, race = $bindable() }: Props = $props();

	let raceValue: RaceName = $derived(races[0].value);

	const raceTriggerContent = $derived(
		races.find((r) => r.value === raceValue)?.label ?? 'Select a race',
	);

	let subraceOptions: Props['subraces'][RaceName] = $derived(
		subraces[raceValue],
	);

	let subraceValue: string = $derived(subraceOptions[0].value);

	const subraceTriggerContent = $derived(
		subraceOptions.find((s) => s.value === subraceValue)?.label ??
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
			onValueChange={(v) => (race = races.find((r) => r.value === v)!)}
		>
			<Select.Trigger class="w-[200px]">
				{raceTriggerContent}
			</Select.Trigger>
			<Select.Content>
				{#each races as race (race.value)}
					<Select.Item value={race.value} label={race.label}>
						{race.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Select.Root type="single" bind:value={subraceValue}>
			<Select.Trigger class="my-4 w-[200px]">
				{subraceTriggerContent}
			</Select.Trigger>
			<Select.Content>
				{#each subraceOptions as subrace (subrace.value)}
					<Select.Item value={subrace.value} label={subrace.label}>
						{subrace.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<p class="text-muted-foreground">
			{subraceOptions.find((s) => s.value == subraceValue)?.abilityDescription}
		</p>
	</Card.Content>
</Card.Root>
