<script>
	import { base } from '$app/paths';
	import { ModeToggle, Button } from '@kksh/svelte';
	import { clipboard, notification, ui } from '@kksh/api/ui/iframe';
	import { onMount } from 'svelte';

	let clipboardText = '';

	onMount(async () => {
		// ui.goHome()
		console.log('on mounted');
		console.log(await clipboard.readText());
		await notification.sendNotification('Hello from SvelteKit Extension Template');
		await clipboard.writeText('Hello from SvelteKit Extension Template');
		clipboardText = await clipboard.readText();
	});
</script>

<ModeToggle />
<h1>Home Page</h1>
<a href="{base}/about">About</a>
<span>Clipboard Text: {clipboardText}</span>
<div>
	<Button>Hello</Button>
</div>
