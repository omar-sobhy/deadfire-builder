<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { getDeadfireContext } from '$lib/context.svelte.js';

  const statNames = [
    'might',
    'constitution',
    'dexterity',
    'perception',
    'intellect',
    'resolve',
  ] as const;

  const context = getDeadfireContext()();

  const { attributes: baseAttributes } = $derived(context);

  const modifiedAttributes = $derived(context.modifiedAttributes());

  let points = $derived(78 - Object.values(modifiedAttributes).reduce((sum, v) => sum + v, 0));
</script>

<Card.Root class="m-2 w-1/3">
  <Card.Header>
    <Card.Title>Attributes</Card.Title>
    <Card.Description>
      Your attributes are modified by your selected race and culture.
    </Card.Description>
    <Card.Content>
      {#each statNames as stat}
        <div class="mb-2 flex w-full flex-row items-center gap-2">
          <span class="grow capitalize">{stat}</span>
          <p>
            {modifiedAttributes[stat]}
          </p>
          <Button
            variant="outline"
            size="icon"
            class="rounded-full"
            disabled={baseAttributes[stat] === 18 || points === 0}
            onclick={() => baseAttributes[stat as keyof typeof modifiedAttributes]++}
          >
            +
          </Button>
          <Button
            variant="outline"
            size="icon"
            class="rounded-full"
            disabled={baseAttributes[stat] === 3 || points === 60}
            onclick={() => baseAttributes[stat as keyof typeof modifiedAttributes]--}
          >
            -
          </Button>
        </div>
      {/each}
      <div class="flex flex-row justify-between">
        <p>Available points</p>
        <p>{points}</p>
      </div>
    </Card.Content>
  </Card.Header>
</Card.Root>
