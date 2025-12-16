<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import type { CultureName, StatName } from '../../types/character-creation';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		cultures: {
			value: CultureName;
			statChanges: Partial<Record<StatName, number>>;
		}[];

		culture: {
			value: CultureName;
			statChanges: Partial<Record<StatName, number>>;
		};
	}

	let { cultures, culture = $bindable() }: Props = $props();
</script>

<Card.Root class="m-2 w-1/3">
	<Card.Header>
		<Card.Title>Culture and Background</Card.Title>
		<Card.Description>
			Your chosen culture modifies your attributes.
		</Card.Description>
		<Card.Content
			class="grid grid-cols-[auto_1fr_1fr] gap-2 rounded-md border p-2"
		>
			<p></p>
			<p>Culture</p>
			<p>Attribute bonus</p>
			{#each cultures as cultureOption (cultureOption.value)}
				<input
					type="radio"
					id={cultureOption.value}
					name="culture"
					value={cultureOption}
					bind:group={culture}
				/>
				<label for={cultureOption.value} class="capitalize"
					>{cultureOption.value}</label
				>
				<p class="capitalize">
					{Object.keys(cultureOption.statChanges)[0]} +1
				</p>
			{/each}
		</Card.Content>
	</Card.Header>
</Card.Root>
