<script lang="ts">
	import { Button, Resizable, Textarea, Label, Toaster, ThemeWrapper } from '@kksh/svelte';
	import { onMount } from 'svelte';
	import * as jose from 'jose';
	import { JwtToken, jwtIsValid, splitJwt } from '$lib/jwt';
	import { parse, flatten, safeParse } from 'valibot';
	import { ModeWatcher } from 'mode-watcher';
	import { clipboard, toast, ui } from '@kksh/api/ui/iframe';

	let jwtToken: JwtToken = {
		header: '',
		payload: '',
		signature: ''
	};
	let fullJwtTokenStr = '';
	$: {
		if (jwtToken && jwtToken.header && jwtToken.payload && jwtToken.signature) {
			fullJwtTokenStr = `${jwtToken.header}.${jwtToken.payload}.${jwtToken.signature}`;
		}
	}
	let payload = {};
	let header = {};

	$: {
		if (jwtIsValid(fullJwtTokenStr)) {
			payload = jose.decodeJwt(fullJwtTokenStr);
			header = jose.decodeProtectedHeader(fullJwtTokenStr);
		}
	}
	onMount(async () => {
		pasteJwt();
		ui.showBackButton('bottom-right');
		document.addEventListener('keydown', () => {
			ui.goBack();
		});
	});

	function pasteJwt() {
		clipboard.readText().then((text) => {
			console.log('pasteJwt', text);
			if (jwtIsValid(text)) {
				const parseResult = safeParse(JwtToken, splitJwt(text));
				console.log('parseResult', parseResult);

				if (parseResult.success) {
					jwtToken = parseResult.output;
				} else {
					console.error(flatten<typeof JwtToken>(parseResult.issues));
					toast.error('Invalid JWT Token from clipboard');
				}
			} else {
				toast.error('Invalid JWT Token from clipboard');
			}
		});
	}
</script>

<Toaster />
<ModeWatcher />
<ThemeWrapper>
	<div class="flex h-screen flex-col border px-1">
		<div class="kunkun-drag-region h-8" />
		<Resizable.PaneGroup direction="horizontal" class="h-full w-full rounded-lg pb-2">
			<Resizable.Pane defaultSize={50}>
				<div class="flex h-full w-full flex-col gap-1.5 px-3">
					<Label for="message" class="text-lg">JWT Token</Label>
					<div class="grow">
						<span class="box-border whitespace-pre-wrap text-wrap break-words text-red-400"
							>{jwtToken.header}</span
						>
						<span>.</span>
						<span class="box-border whitespace-pre-wrap text-wrap break-words text-purple-400"
							>{jwtToken.payload}</span
						>
						<span>.</span>
						<span class=" box-border whitespace-pre-wrap text-wrap break-words text-cyan-400"
							>{jwtToken.signature}</span
						>
					</div>
					<Button class="" on:click={pasteJwt}>Paste JWT</Button>
				</div>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={50} class="px-4">
				<Label for="message"
					>HEADER: <span class="text-muted-foreground">Algorithm & Token Type</span></Label
				>
				<pre class="text-red-400">{JSON.stringify(header, null, 2)}</pre>
				<Label for="message">PAYLOAD: <span class="text-muted-foreground">DATA</span></Label>
				<pre class=" text-purple-400">{JSON.stringify(payload, null, 2)}</pre>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</div>
</ThemeWrapper>
