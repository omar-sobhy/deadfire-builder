<script lang="ts">
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import Icon from '@iconify/svelte';

  import AttributeSelector from '$lib/components/attribute-selector.svelte';
  import ClassSelector from '$lib/components/class-selector.svelte';
  import CultureSelector from '$lib/components/culture-selector.svelte';
  import RaceSelector from '$lib/components/race-selector.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const { classes, races, subclasses, subraces, cultures } = $derived(data);

  const filteredRaces = $derived(races.filter((r) => r.isKith));

  let race = $derived(filteredRaces[0]);

  let culture = $derived(cultures[0]);

  let selectedClass = $derived(classes[0]);

  let selectedSubclass = $derived(
    subclasses.filter((s) => s.classId === selectedClass.id)[0],
  );

  let stats: Record<string, number> = $state({
    might: 10,
    dexterity: 10,
    constitution: 10,
    intellect: 10,
    perception: 10,
    resolve: 10,
  });

  let page = $state(1);

  const pageNames = ['Initial attributes', 'Class'];
</script>

<div class="bg mx-auto mt-2 flex w-11/12 flex-col rounded-lg border-2 p-2">
  <SiteHeader />
  <Pagination.Root count={2} bind:page perPage={1} class="flex flex-col mt-2">
    {#snippet children({ pages, currentPage })}
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.PrevButton>
            <Icon icon="cuida:caret-left-outline" />
          </Pagination.PrevButton>
        </Pagination.Item>
        {#each pages as page (page.key)}
          {#if page.type === 'ellipsis'}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link
                {page}
                isActive={currentPage === page.value}
                class="w-full px-2"
              >
                {pageNames[page.value - 1]}
              </Pagination.Link>
            </Pagination.Item>
          {/if}
        {/each}
        <Pagination.Item>
          <Pagination.NextButton>
            <Icon icon="cuida:caret-right-outline" />
          </Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
      {#if currentPage === 1}
        <div class="flex flex-row h-[50vh]">
          <RaceSelector races={filteredRaces} {subraces} bind:race />
          <AttributeSelector {race} {culture} bind:stats />
          <CultureSelector overflow {cultures} bind:culture />
        </div>
      {:else if currentPage === 2}
        <div class="flex flex-row">
          <ClassSelector
            {classes}
            {subclasses}
            bind:selectedClass
            bind:selectedSubclass
          />
        </div>
      {/if}
    {/snippet}
  </Pagination.Root>
</div>
