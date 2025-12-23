<script lang="ts">
  import AttributeSelector from '$lib/components/attribute-selector.svelte';
  import ClassSelector from '$lib/components/class-selector.svelte';
  import CultureSelector from '$lib/components/culture-selector.svelte';
  import RaceSelector from '$lib/components/race-selector.svelte';
  import SiteHeader from '$lib/components/site-header.svelte';

  import { Spinner } from '$lib/components/ui/spinner/index.js';
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import Icon from '@iconify/svelte';
  import { deleteDB, wrap, type IDBPDatabase, type IDBPObjectStore } from 'idb';

  import type { RaceDto } from '$lib/dtos/character/race.dto.js';
  import type { CultureDto } from '$lib/dtos/character/culture.dto.js';
  import type { ClassDto } from '$lib/dtos/character/class.dto.js';
  import type { SubclassDto } from '$lib/dtos/character/subclass.dto.js';
  import type { DbKeys, DeadfireDb } from '../types/index-db.js';
  import type { SubraceDto } from '$lib/dtos/character/subrace.dto.js';

  import {
    parseStringTables,
    parseAbilities,
    parseCharacters,
    parseItems,
    parseProgression,
    parseStatusEffects,
  } from '$lib/parsing/index.js';

  class Context {
    db: IDBPDatabase<DeadfireDb>;

    races: RaceDto[];
    filteredRaces: RaceDto[];
    selectedRace: RaceDto;

    subraces: SubraceDto[];
    filteredSubraces: SubraceDto[];
    selectedSubrace: SubraceDto;

    cultures: CultureDto[];
    selectedCulture: CultureDto;

    classes: ClassDto[];
    selectedClass: ClassDto;

    subclasses: SubclassDto[];
    filteredSubclasses: SubclassDto[];
    selectedSubclass: SubclassDto;

    constructor(
      db: IDBPDatabase<DeadfireDb>,
      races: RaceDto[],
      subraces: SubraceDto[],
      cultures: CultureDto[],
      classes: ClassDto[],
      subclasses: SubclassDto[],
    ) {
      this.db = $state(db);

      this.races = $state(races);
      this.filteredRaces = $derived(this.races.filter((r) => r.isKith));
      this.selectedRace = $derived(this.filteredRaces[0]);

      this.subraces = $state(subraces);
      this.filteredSubraces = $derived(
        this.subraces.filter((s) => s.raceId === this.selectedRace.id),
      );
      this.selectedSubrace = $derived(this.filteredSubraces[0]);

      this.cultures = $state(cultures);
      this.selectedCulture = $derived(this.cultures[0]);

      this.classes = $state(classes);
      this.selectedClass = $derived(classes[0]);

      this.subclasses = $state(subclasses);
      this.filteredSubclasses = $derived(
        this.subclasses.filter((s) => s.classId === this.selectedClass.id),
      );
      this.selectedSubclass = $derived(this.filteredSubclasses[0]);
    }
  }

  type InitState =
    | 'initial'
    | 'creating-stores'
    | 'strings'
    | 'abilities'
    | 'characters'
    | 'items'
    | 'progression'
    | 'status-effects'
    | 'loading';

  let initState: InitState = $state('initial');

  let context: Context | undefined = $state();

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

  async function loadData(db: IDBPDatabase<DeadfireDb>) {
    const races = await db.getAllFromIndex('races', 'by-name');
    const subraces = await db.getAllFromIndex('subraces', 'by-name');
    const cultures = await db.getAllFromIndex('cultures', 'by-name');
    const classes = await db.getAllFromIndex('classes', 'by-name');
    const subclasses = await db.getAllFromIndex('subclasses', 'by-name');

    context = new Context(db, races, subraces, cultures, classes, subclasses);

    if (!validateContext(context)) {
      throw new Error('Initialization error');
    }

    return context;
  }

  function stateToString() {
    switch (initState) {
      case 'initial':
        return 'Initializing page...';
      case 'creating-stores':
        return 'Initializing database...';
      case 'strings':
        return 'Parsing stringtables...';
      case 'abilities':
        return 'Parsing abilities...';
      case 'characters':
        return 'Parsing character data...';
      case 'items':
        return 'Parsing item data...';
      case 'progression':
        return 'Parsing progression data...';
      case 'status-effects':
        return 'Parsing status effects...';
      case 'loading':
        return 'Loading data...';
    }
  }

  $effect(() => {
    console.log(stateToString());
  });

  const names: (DbKeys | { name: DbKeys; indexes: { name: string; key: string }[] })[] = [
    'guiStrings',
    'abilityStrings',
    'itemStrings',
    'itemModStrings',
    'statusEffectStrings',
    'characterStrings',
    'cyclopediaStrings',

    { name: 'abilities', indexes: [{ name: 'by-name', key: 'displayName' }] },
    'baseStats',
    { name: 'classes', indexes: [{ name: 'by-name', key: 'displayName' }] },
    { name: 'subclasses', indexes: [{ name: 'by-name', key: 'displayName' }] },
    { name: 'cultures', indexes: [{ name: 'by-name', key: 'displayName' }] },
    { name: 'items', indexes: [{ name: 'by-name', key: 'displayName' }] },
    'itemMods',
    { name: 'races', indexes: [{ name: 'by-name', key: 'displayName' }] },
    { name: 'subraces', indexes: [{ name: 'by-name', key: 'displayName' }] },
    'statusEffects',
    'classUnlocks',
    'subclassUnlocks',
    'raceUnlocks',
    'subraceUnlocks',
  ] as const;

  async function init(): Promise<Context> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('deadfire', 2);

      let upgrading = false;

      request.onupgradeneeded = async ({ oldVersion, newVersion }) => {
        try {
          upgrading = true;

          const db = wrap(request.result) as IDBPDatabase<DeadfireDb>;

          if (oldVersion === 0) {
            initState = 'creating-stores';

            names.forEach((n) => {
              let name = typeof n === 'string' ? n : n.name;
              if (!db.objectStoreNames.contains(name)) {
                request.result.createObjectStore(name);
              }
            });
          }

          if (oldVersion < 2) {
            names.forEach((n) => {
              const name = typeof n === 'string' ? n : n.name;

              const store = db.objectStoreNames.contains(name)
                ? request.transaction!.objectStore(name)
                : request.result.createObjectStore(name);

              if (typeof n === 'object') {
                for (const i of n.indexes) store.createIndex(i.name, i.key);
              }
            });
          }

          if (oldVersion === 0) {
            initState = 'strings';

            await parseStringTables(db);

            const fns = [
              ['abilities', parseAbilities],
              ['progression', parseProgression],
              ['characters', parseCharacters],
              ['items', parseItems],
              ['status-effects', parseStatusEffects],
            ] as const;

            for (const [name, fn] of fns) {
              initState = name;
              await fn(db);
            }
          }

          const context = await loadData(db);
          resolve(context);
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = (e) => reject(e);

      request.onsuccess = async () => {
        if (upgrading) return;

        const db = wrap(request.result) as IDBPDatabase<DeadfireDb>;

        try {
          const context = await loadData(db);

          resolve(context);
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  function validateContext(context?: Context): boolean {
    if (!context) return false;

    for (const o of Object.values(context)) {
      if (!o) return false;
    }

    return true;
  }

  async function resetData() {
    context?.db.close();

    await deleteDB('deadfire');

    window.location.reload();
  }
</script>

<div class="bg mx-auto mt-2 flex w-11/12 flex-col rounded-lg border-2 p-2 h-[90dvh]">
  <SiteHeader />
  {#await init()}
    <div class="w-full h-full flex items-center justify-center">
      <Spinner class="" />
      <h1 class="mx-2">{stateToString()}</h1>
    </div>
  {:then}
    {#if !validateContext(context)}
      <div class="flex flex-col h-full items-center justify-center">
        <div>
          <Button variant="destructive" onclick={resetData}>
            Data is corrupted. Click to reset data and reload page.
          </Button>
        </div>
      </div>
    {/if}
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
            <RaceSelector
              races={context!.filteredRaces}
              subraces={context!.subraces}
              bind:race={context!.selectedRace}
            />
            <AttributeSelector
              db={context!.db}
              race={context!.selectedRace}
              culture={context!.selectedCulture}
              bind:stats
            />
            <CultureSelector
              overflow
              cultures={context!.cultures}
              bind:culture={context!.selectedCulture}
            />
          </div>
        {:else if currentPage === 2}
          <div class="flex flex-row">
            <ClassSelector
              db={context!.db}
              classes={context!.classes}
              subclasses={context!.subclasses}
              bind:selectedClass={context!.selectedClass}
              bind:selectedSubclass={context!.selectedSubclass}
            />
          </div>
        {/if}
      {/snippet}
    </Pagination.Root>
  {:catch e}
    {console.log(e)}
    <div class="flex flex-col h-full items-center justify-center">
      <div>
        <Button variant="destructive" onclick={resetData}>
          Data is corrupted. Click to reset data and reload page.
        </Button>
      </div>
    </div>
  {/await}
</div>
