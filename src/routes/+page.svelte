<script lang="ts">
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import Icon from '@iconify/svelte';

  import AttributeSelector from '$lib/components/attribute-selector.svelte';
  import ClassSelector from '$lib/components/class-selector.svelte';
  import CultureSelector from '$lib/components/culture-selector.svelte';
  import RaceSelector from '$lib/components/race-selector.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';

  import { Renderers } from '$lib/render/index.js';

  import cytoscape from 'cytoscape';
  import cytoscapePopper, { type PopperOptions, type RefElement } from 'cytoscape-popper';
  import { computePosition, flip, limitShift, shift } from '@floating-ui/dom';

  cytoscape.use(cytoscapePopper(popperFactory));

  function popperFactory(ref: RefElement, content: HTMLElement, opts?: PopperOptions) {
    const popperOptions = {
      middleware: [flip(), shift({ limiter: limitShift() })],
      ...opts,
    };

    function update() {
      computePosition(ref, content, popperOptions).then(({ x, y }) => {
        Object.assign(content.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }

    update();

    return { update };
  }

  const { data } = $props();

  const { classes, cultures, races, subclasses, subraces, statusEffectManager } = $derived(data);

  const filteredRaces = $derived(races.filter((r) => r.isKith));

  let selectedRace = $derived(filteredRaces[0]);

  let selectedClass = $derived(classes[0]);

  // let selectedSubclass = $derived(subclasses.filter((s) => s.classId === selectedClass.id)[0]);

  let selectedCulture = $derived(cultures[0]);

  let renderers = new Renderers();

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

  <Pagination.Root count={2} bind:page perPage={1} class="flex flex-col mt-2 h-full">
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
              <Pagination.Link {page} isActive={currentPage === page.value} class="w-full px-2">
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
          <RaceSelector races={filteredRaces} {subraces} bind:race={selectedRace} />
          <AttributeSelector race={selectedRace} culture={selectedCulture} bind:stats />
          <CultureSelector overflow {cultures} bind:culture={selectedCulture} />
        </div>
      {:else if currentPage === 2}
        <ClassSelector
          {statusEffectManager}
          {classes}
          {subclasses}
          {renderers}
          bind:selectedClass
        />
      {/if}
    {/snippet}
  </Pagination.Root>
</div>
