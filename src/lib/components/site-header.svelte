<script lang="ts">
  import SunIcon from '@lucide/svelte/icons/sun';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button/index.js';
</script>

<header class="flex h-(--header-height) w-full shrink-0">
  <div class="flex w-full md:flex-row justify-between">
    <h1 class="text-2xl font-bold">Deadfire Builder</h1>
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
