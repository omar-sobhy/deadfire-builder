<script lang="ts">
  import SunIcon from '@lucide/svelte/icons/sun';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import SaveIcon from '@lucide/svelte/icons/save';

  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button/index.js';
  import { getDeadfireContext } from '$lib/context.svelte.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  const context = getDeadfireContext()();

  let savedBuildId: string | undefined = $state();

  let dialogOpen = $state(false);

  let savedBuildUrl = $derived.by(() => {
    if (savedBuildId) {
      const url = new URL(window.location.href);
      url.searchParams.set('build', savedBuildId);
      return url.toString();
    }
  });

  async function save(): Promise<{ id: string } | undefined> {
    const data = context.serialize();

    console.dir(data);

    const response = await (
      await fetch('/saved-build', { method: 'POST', body: JSON.stringify(data) })
    ).json();

    if ('id' in response) {
      savedBuildId = response.id;

      dialogOpen = true;

      return { id: response.id };
    }
  }
</script>

<Dialog.Root open={dialogOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Data saved</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>
      Link to build: <a href={savedBuildUrl} title="Saved build">{savedBuildUrl}</a>
    </Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
<header class="flex h-(--header-height) w-full shrink-0">
  <div class="flex w-full md:flex-row justify-between">
    <h1 class="text-2xl font-bold">Deadfire Builder</h1>
    <Tooltip.Provider delayDuration={0.2}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <Button {...props} variant="ghost" onclick={save} aria-label="Save URL" class="ml-auto">
              <SaveIcon />
            </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>
          <span>Generate URL</span>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <div class="flex">
      <Tooltip.Provider delayDuration={0.2}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="ghost"
                onclick={toggleMode}
                aria-label="Toggle dark mode"
                class="ml-auto"
              >
                <SunIcon
                  class="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
                />
                <MoonIcon
                  class="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
                />
                <span class="sr-only">Toggle dark mode</span>
              </Button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <span>Toggle dark mode</span>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  </div>
</header>
