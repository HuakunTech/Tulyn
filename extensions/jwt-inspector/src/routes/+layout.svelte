<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { registerDragRegion, ui } from '@kksh/api/ui/iframe';
	import { updateTheme } from '@kksh/svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		registerDragRegion();
		ui.getTheme().then((theme) => {
			updateTheme(theme);
		});
	});
</script>

<ModeWatcher />
<slot></slot>
