<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
  import type { RaceDto } from '$lib/dtos/race.dto.js';
  import type { CultureDto } from '$lib/dtos/culture.dto.js';

	interface Props {
		race: RaceDto;

		culture: CultureDto;

		stats: Record<string, number>;
	}

	const { race, culture, stats = $bindable() }: Props = $props();

	let points = $derived(
		78 - Object.values(stats).reduce((sum, v) => sum + v, 0),
	);
</script>

<Card.Root class="m-2 w-1/3">
	<Card.Header>
		<Card.Title>Attributes</Card.Title>
		<Card.Description>
			Your attributes are modified by your selected race and culture.
		</Card.Description>
		<Card.Content>
			{#each Object.entries(stats) as [stat, value] (stat)}
				<div class="mb-2 flex w-full flex-row items-center gap-2">
					<span class="grow capitalize">{stat}</span>
					<p>
						{value +
							((race as any)[stat] ?? 0) +
							((culture as any)[stat] ?? 0)}
					</p>
					<Button
						variant="outline"
						size="icon"
						class="rounded-full"
						disabled={value == 18 || points == 0}
						onclick={() => stats[stat]++}>+</Button
					>
					<Button
						variant="outline"
						size="icon"
						class="rounded-full"
						disabled={value == 3 || points == 60}
						onclick={() => stats[stat]--}>-</Button
					>
				</div>
			{/each}
			<div class="flex flex-row justify-between">
				<p>Available points</p>
				<p>{points}</p>
			</div>
		</Card.Content>
	</Card.Header>
</Card.Root>
