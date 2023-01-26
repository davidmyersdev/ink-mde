<script lang="ts">
	import InkMde from '$lib/InkMde.svelte';
	import type { Instance } from 'ink-mde';

	let editor: Instance;
	let value = '# Hello, world';
	let isDarkTheme = false;
</script>

<input type="checkbox" bind:checked={isDarkTheme} name="isDarkTheme" />

<InkMde
	bind:editor
	bind:value
	options={{
		interface: {
			appearance: isDarkTheme ? 'dark' : 'light'
		}
	}}
/>
