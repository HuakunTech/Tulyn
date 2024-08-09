<script>
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { ThemeWrapper, updateTheme } from '@kksh/svelte';
	import { onMount } from 'svelte';
	import { registerDragRegion, ui } from '@kksh/api/ui/iframe';

	onMount(() => {
		registerDragRegion();
		ui.getTheme().then((theme) => {
			updateTheme(theme);
		});
	});
</script>

<ModeWatcher />
<ThemeWrapper>
	<slot />
</ThemeWrapper>
