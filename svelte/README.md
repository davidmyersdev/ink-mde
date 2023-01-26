# ink-mde/svelte

## Usage

### Minimal

```svelte
<script lang="ts">
	import InkMde from 'ink-mde/svelte';

	// doc
	let value = '# Hello, world';
</script>

<InkMde
	bind:value
	options={{
		interface: {
			appearance: 'dark'
		}
	}}
/>
```

### Reactive options and the editor instance

```svelte
<script lang="ts">
	import InkMde from 'ink-mde/svelte';
	import type { Instance } from 'ink-mde';

	// doc
	let value = '# Hello, world';
	// the ink-mde instance
	let editor: Instance;
	// reactive option, if this change, the editor will be reconfigured.
	let isDarkTheme = false;
</script>

<input type="checkbox" bind:checked={isDarkTheme} name="isDarkTheme" />

<InkMde
	bind:value
	options={{
		interface: {
			appearance: isDarkTheme ? 'dark' : 'light'
		}
	}}
/>
```

## Events

The `afterUpdate(doc: string)` and the `beforeUpdate(doc: string)` events are forwarded from `ink-mde`.

Please, be aware of the order in which the events occur:

```ts
const hooks = {
	afterUpdate: (doc) => {
		// the `value` prop is update.
		value = doc;
		// your `afterUpdate` hook, if provided
		options?.hooks?.afterUpdate?.(doc);
		// svelte event
		dispatch('afterUpdate', doc);
	},
	beforeUpdate: (doc) => {
		// your `beforeUpdate` hook, if provided
		options?.hooks?.beforeUpdate?.(doc);
		// svelte event
		dispatch('beforeUpdate', doc);
	}
};
```

You are probably all good with just binding to the `value` prop.
