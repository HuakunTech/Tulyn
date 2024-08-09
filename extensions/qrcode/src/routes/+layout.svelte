<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { registerDragRegion, ui } from '@kksh/api/ui/iframe';
	import { updateTheme } from '@kksh/svelte';
	import { onMount } from 'svelte';
	import { ThemeWrapper } from '@kksh/svelte';

	onMount(() => {
		registerDragRegion();
		ui.getTheme().then((theme) => {
			updateTheme(theme);
		});
	});
</script>

<ModeWatcher />
<ThemeWrapper>
	<slot></slot>
</ThemeWrapper>
