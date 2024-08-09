<script lang="ts">
	import jsQR from 'jsqr';
	import { base } from '$app/paths';
	import { clipboard, open } from '@kksh/api/ui/iframe';
	import { Button } from '@kksh/svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { LinkIcon } from 'lucide-svelte/icons';

	let imgSrc = '';
	let detectedCode = '';

	async function readScreenshot() {
		try {
			const blobImg: Blob = (await clipboard.readImageBinary('Blob')) as Blob;
			imgSrc = URL.createObjectURL(blobImg);
			// turn blob to Uint8ClampedArray
			const img = new Image();
			img.src = imgSrc;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);
				const imageData = ctx?.getImageData(0, 0, img.width, img.height);
				if (!imageData) {
					throw new Error('Failed to get image data.');
				}
				const code = jsQR(imageData?.data, imageData?.width, imageData?.height);
				if (code) {
					detectedCode = code.data;
				} else {
					console.warn('No QR code found.');
				}
				canvas.remove();
				img.remove();
			};
		} catch (error) {
			console.error(error);
		}
	}

	onMount(async () => {
		readScreenshot();
	});
</script>

<ModeWatcher />
<main class="flex h-screen flex-col">
	<div class="h-8" data-tauri-drag-region />
	<div class=" flex grow flex-col items-center justify-center space-y-5">
		<div class="flex space-x-3">
			<Button on:click={readScreenshot}>Read QRCode Screenshot From Clipboard</Button>
			<a href={base}>
				<Button>Generate QRCode <LinkIcon class="ml-2 w-4" /></Button>
			</a>
		</div>
		<img width="300" src={imgSrc} alt="" />
		<a
			href={detectedCode}
			on:click={(e) => {
				e.preventDefault();
				if (detectedCode.startsWith('http')) {
					open.openUrl(detectedCode);
				}
			}}
		>
			{detectedCode}
		</a>
	</div>
</main>
