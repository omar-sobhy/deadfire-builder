<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<header class="flex h-(--header-height) w-full shrink-0">
	<div class="flex w-full md:flex-row">
		<h1 class="text-2xl font-bold">PoE Builder</h1>
		<Button
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
	</div>
</header>
