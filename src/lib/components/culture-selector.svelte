<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { getDeadfireContext } from '$lib/context.svelte.js';
  import type { CultureDto } from '$lib/dtos/character/culture.dto.js';

  interface Props {
    overflow?: boolean;
  }

  let { overflow = false }: Props = $props();

  const context = getDeadfireContext();

  const { cultures, selectedCulture } = $derived(context);

  const stats = ['resolve', 'might', 'dexterity', 'constitution', 'intellect', 'perception'];

  let cultureStatChanges = $derived.by(() => {
    const mapped = cultures.map((culture) => {
      const stat = Object.entries(culture).find(
        ([k, v]) => stats.includes(k) && typeof v === 'number' && v > 0,
      )![0];

      return [culture.id, stat];
    });

    return Object.fromEntries(mapped);
  });
</script>

<Card.Root class={['m-2 w-1/3']}>
  <Card.Header>
    <Card.Title>Culture and Background</Card.Title>
    <Card.Description>Your chosen culture modifies your attributes.</Card.Description>
    <Card.Content
      class={[
        'grid grid-cols-[auto_1fr_1fr] gap-2 rounded-md border p-2 h-90',
        overflow && 'overflow-scroll',
      ]}
    >
      <p></p>
      <p>Culture</p>
      <p>Attribute bonus</p>
      {#each cultures as cultureOption (cultureOption.id)}
        <input
          type="radio"
          id={cultureOption.id}
          name="culture"
          value={cultureOption}
          bind:group={context.selectedCulture}
        />
        <label for={cultureOption.displayName} class="capitalize">{cultureOption.displayName}</label
        >
        <p class="capitalize">
          {cultureStatChanges[cultureOption.id]} +1
        </p>
      {/each}
    </Card.Content>
  </Card.Header>
</Card.Root>
