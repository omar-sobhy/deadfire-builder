<script lang="ts">
	import AttributeSelector from '$lib/components/attribute-selector.svelte';
	import ClassSelector from '$lib/components/class-selector.svelte';
	import CultureSelector from '$lib/components/culture-selector.svelte';
	import RaceSelector from '$lib/components/race-selector.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { races, subraces, cultures } = data;

	let race = $state(races[0]);

	let culture = $state(cultures[0]);

	let stats: Record<string, number> = $state({
		might: 10,
		dexterity: 10,
		constitution: 10,
		intellect: 10,
		perception: 10,
		resolve: 10,
	});
</script>

<div class="bg mx-auto mt-2 flex w-11/12 flex-col rounded-lg border-2 p-2">
	<SiteHeader />
	<div class="flex flex-row">
		<RaceSelector {races} {subraces} bind:race />
		<AttributeSelector {race} {culture} bind:stats />
		<CultureSelector {cultures} bind:culture />
	</div>
	<div class="flex flex-row">
		<ClassSelector />
	</div>
</div>
