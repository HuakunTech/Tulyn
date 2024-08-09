<script lang="ts">
	import { Alert, Button, ThemeWrapper, Command } from '@kksh/svelte';
	import Calendar from 'lucide-svelte/icons/calendar';
	import * as jose from 'jose';
	import { JwtToken, jwtIsValid, splitJwt, claimsDef } from '$lib/jwt';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';
	import { ModeWatcher } from 'mode-watcher';
	import { clipboard, toast, ui, log } from '@kksh/api/ui/iframe';
	import { parse, string, number, union, safeParse } from 'valibot';

	dayjs.extend(timezone);
	dayjs.extend(utc);

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
	});

	function pasteJwt() {
		clipboard.readText().then((text) => {
			if (jwtIsValid(text)) {
				jwtToken = parse(JwtToken, splitJwt(text));
			} else {
				toast.error('Invalid JWT in Clipboard');
			}
		});
	}

	function onSelect(key: string, val: unknown) {
		// val is either string or number, safe parse it with zod
		const schema = union([string(), number()]);
		const parsed = safeParse(schema, val);
		if (!parsed.success) {
			console.error(parsed.issues);
			toast.error('Invalid Data Type');
			return;
		} else {
			const content = parsed.output.toString();
			clipboard
				.writeText(content)
				.then(() => toast.success('Copied To Clipboard', { description: content }))
				.catch((err) => {
					log.error(`Failed to Copy To Clipboard: ${err.toString()}`);
					return toast.error('Failed to Copy To Clipboard');
				});
		}
	}

	function displayDate(val: unknown) {
		if (typeof val === 'number') {
			const date = new Date(val * 1000);
			return date;
			//   return dayjs(date).format("YYYY-MM-DD - hh:mm:ss SSS [Z] A");
		} else if (typeof val === 'string') {
			const date = new Date(parseInt(val) * 1000);
			return date;
		}
	}
</script>

<ThemeWrapper>
	<Command.Root class="h-screen w-full px-2">
		<Command.Input placeholder="Type a command or search..." autofocus />
		<Command.List class="h-full">
			<Command.Empty>
				No JWT found in Clipboard.
				<br />
				<Button class="mt-5" on:click={pasteJwt}>Load From Clipboard</Button>
			</Command.Empty>
			{#if Object.values(header).length > 0}
				<Command.Group heading="HEAD: ALGORITHM & TOKEN TYPE">
					{#each Object.entries(header) as [key, val]}
						<Command.Item onSelect={() => onSelect(key, val)} class="flex justify-between">
							<span class="flex items-center">
								<Calendar class="mr-2 h-4 w-4" />
								<span>{key}</span>
								<span class="text-muted-foreground ml-3">{val}</span>
							</span>
							<span class="text-muted-foreground">{claimsDef[key]}</span>
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}
			{#if Object.values(payload).length > 0}
				<Command.Group heading="PAYLOAD: DATA">
					{#each Object.entries(payload) as [key, val]}
						<Command.Item onSelect={() => onSelect(key, val)} class="flex justify-between">
							<span class="flex items-center">
								<Calendar class="mr-2 h-4 w-4" />
								<span>{key}</span>
								{#if ['iat', 'exp'].includes(key)}
									<span class="text-muted-foreground ml-3">{displayDate(val)}</span>
								{:else}
									<span class="text-muted-foreground ml-3">{val}</span>
								{/if}
							</span>
							{#if claimsDef[key]}
								<span class="text-muted-foreground">{claimsDef[key]}</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}
		</Command.List>
	</Command.Root>
</ThemeWrapper>
