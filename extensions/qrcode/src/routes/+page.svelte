<script lang="ts">
	import { base } from '$app/paths';
	import { Button, Input } from '@kksh/svelte';
	import QR from '$lib/components/QR.svelte';
	import QRCode from 'easyqrcodejs';
	import { onMount } from 'svelte';
	import { clipboard, fs, dialog, open, event } from '@kksh/api/ui/iframe';
	import * as v from 'valibot';
	import {
		ClipboardCopyIcon,
		LinkIcon,
		DownloadIcon,
		RefreshCcwIcon,
		SearchIcon
	} from 'lucide-svelte/icons';
	import { ModeWatcher } from 'mode-watcher';

	let url: string;
	let qrcode: QRCode | undefined;

	$: {
		if (url && qrcode) {
			qrcode.makeCode(url);
		}
	}

	async function loadFromClipboard() {
		const content = await clipboard.readText();
		url = v.parse(v.string(), content);
	}

	onMount(async () => {
		loadFromClipboard();
	});

	function getQRCodePngBase64(): Promise<string> {
		return new Promise((resolve, reject) => {
			const cvs = document.querySelector('canvas');
			if (cvs) {
				// extract png base64 from cvs
				const png = cvs.toDataURL('image/png');
				const base64 = png.replace(/^data:image\/(png|jpg);base64,/, '');
				resolve(base64);
			} else {
				reject('Canvas not found');
			}
		});
	}

	async function download() {
		const cvs = document.querySelector('canvas');
		if (cvs) {
			cvs.toBlob(async (blob) => {
				if (!blob) {
					return;
				}
				const filePath = await dialog.save({
					filters: [
						{
							name: 'Image',
							extensions: ['png']
						}
					]
				});
				if (!filePath) {
					return;
				}
				blob.arrayBuffer().then((buffer) => {
					const uint8Array = new Uint8Array(buffer);
					fs.writeFile(filePath, uint8Array);
				});
			});
		}
	}

	async function saveToClipboard() {
		const b64 = await getQRCodePngBase64();
		clipboard.writeImageBase64(b64);
	}
</script>

<ModeWatcher />
<div class="flex h-screen flex-col">
	<div class="h-8" data-tauri-drag-region />
	<div class="flex grow flex-col items-center justify-center space-y-4">
		<Input bind:value={url} type="text" placeholder="URL" class="max-w-xl" />
		<div class="flex w-96 justify-center space-x-2">
			<Button size="sm" on:click={download}>
				<DownloadIcon class="mr-1 h-4 w-4" />
				Download
			</Button>
			<Button size="sm" on:click={loadFromClipboard}>
				<RefreshCcwIcon class="mr-1 h-4 w-4" />
				Read from Clipboard
			</Button>
			<Button size="sm" on:click={saveToClipboard}>
				<ClipboardCopyIcon class="mr-1 h-4 w-4" />
				Save To Clipboard</Button
			>
		</div>
		<div class="w-60">
			<QR bind:url bind:qrcode />
		</div>
		{#if url}
			<div class="prose mt-3">
				<pre
					on:click={() => {
						if (url.startsWith('http')) {
							open.openUrl(url);
						}
					}}
					class="cursor-pointer text-wrap px-3">{url}</pre>
			</div>
		{/if}
		<a href="{base}/detect">
			<Button size="sm">
				<SearchIcon class="mr-1 h-4 w-4" />
				Detect QRCode From Screenshot <LinkIcon class="ml-2 w-4" /></Button
			>
		</a>
	</div>
</div>
