<script lang="ts">
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import Icon from '@iconify/svelte';
  import cytoscape from 'cytoscape';
  import cytoscapePopper, { type PopperOptions, type RefElement } from 'cytoscape-popper';
  import { computePosition, flip, limitShift, shift } from '@floating-ui/dom';
  import { DeadfireContext, setDeadfireContext } from '$lib/context.svelte.js';
  import { toast } from 'svelte-sonner';

  import AttributeSelector from '$lib/components/attribute-selector.svelte';
  import ClassSelector from '$lib/components/class-selector.svelte';
  import CultureSelector from '$lib/components/culture-selector.svelte';
  import RaceSelector from '$lib/components/race-selector.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';

  import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
  import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';

  import { Renderers } from '$lib/render/index.js';
  import Summary from '$lib/components/summary.svelte';

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

  const {
    classes,
    cultures,
    races,
    subclasses,
    subraces,
    statusEffectManager,
    savedBuild,
    buildLoadError,
  } = $derived(data);

  $effect(() => {
    if (buildLoadError !== undefined) {
      toast(buildLoadError);
    }
  });

  let renderers = new Renderers();

  const subclassMap: Record<string, SubclassDto[]> = $derived.by(() => {
    const map: Record<string, SubclassDto[]> = {};

    subclasses.forEach((s) => {
      map[s.classId] ??= [];
      map[s.classId].push(s);
    });

    return map;
  });

  const subraceMap: Record<string, SubraceDto[]> = $derived.by(() => {
    const map: Record<string, SubraceDto[]> = {};

    subraces.forEach((s) => {
      map[s.raceId] ??= [];
      map[s.raceId].push(s);
    });

    return map;
  });

  const deadfireContext = $derived(
    new DeadfireContext({
      classes,
      cultures,
      races,
      renderers,
      statusEffectManager,
      subclasses: subclassMap,
      subraces: subraceMap,
      savedBuild,
    }),
  );

  setDeadfireContext(() => deadfireContext);

  let page = $state(1);

  const pageNames = ['Initial attributes', 'Class', 'Summary'];
</script>

<svelte:head>
  <title>Deadfire Builder</title>
</svelte:head>
<div class="bg mx-auto mt-2 flex w-11/12 flex-col rounded-lg border-2 p-2">
  <SiteHeader />

  <Pagination.Root count={pageNames.length} bind:page perPage={1} class="flex flex-col mt-2 h-full">
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
          <RaceSelector />
          <AttributeSelector />
          <CultureSelector overflow />
        </div>
      {:else if currentPage === 2}
        <ClassSelector />
      {:else if currentPage === 3}
        <Summary />
      {/if}
    {/snippet}
  </Pagination.Root>
</div>
