<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from "@kksh/vue/alert"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@kksh/vue/alert-dialog"
import { AlertCircle, InfoIcon } from "lucide-vue-next"
</script>
<template>
	<Alert variant="destructive" class="dark:border-red-600 dark:text-red-600">
		<AlertCircle class="h-4 w-4 dark:text-red-600" />
		<AlertTitle>
			<span>Warning: Powerful Extensions, Potential Security Risks</span>

			<AlertDialog>
				<AlertDialogTrigger as-child>
					<button class="float-right">
						<InfoIcon class="inline h-5 w-5" />
					</button>
				</AlertDialogTrigger>
				<AlertDialogContent class="max-h-[30em] overflow-auto sm:max-w-[40em]">
					<AlertDialogHeader>
						<AlertDialogTitle class="prose dark:prose-invert">
							<h2 class="text-red-600/90">
								Warning: Powerful Extensions, Potential Security Risks
							</h2>
						</AlertDialogTitle>
						<AlertDialogDescription
							>Be Careful Installing Any Extension Here</AlertDialogDescription
						>
					</AlertDialogHeader>
					<article class="prose dark:prose-invert">
						<p>
							This app allows you to install extensions from external sources. While these
							extensions can provide advanced features and improve your experience (UX) and
							developer experience (DX), they also carry significant security risks.
						</p>

						<h3>Understanding the Risks:</h3>
						<ul>
							<li>
								<strong>File System and System API Access:</strong> Extensions can access your files
								and system APIs, making them powerful but potentially dangerous.
							</li>
							<li>
								<strong>Limited Review Process:</strong> Extensions from the app store can be
								reviewed by public, but there's still a chance of encountering security
								vulnerabilities.
							</li>
						</ul>

						<h3>Developer Settings and Untrusted Sources:</h3>
						<ul>
							<li>
								<strong>Developer settings</strong> allow installing extensions from anywhere, like
								your local machine or remote URLs. This is intended only for development purposes or
								when you absolutely trust the source.
							</li>
							<li>
								<strong>Loading extensions from remote URLs</strong> grants them access to your
								system, similar to giving a website that level of control. Since the author can
								update the code at any time, malicious extensions could steal information or take
								control of your system.
								<strong>Remote URLs should only be used for development.</strong>
							</li>
						</ul>

						<h3>Stay Safe: Trust Matters</h3>
						<p>
							Only install extensions from reputable sources that you trust (e.g. extensions written
							by yourself or your organization). By being cautious, you can maximize the benefits
							and minimize the risks associated with external extensions.
						</p>
					</article>
					<AlertDialogFooter>
						<AlertDialogAction>Understood</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</AlertTitle>
	</Alert>
</template>
