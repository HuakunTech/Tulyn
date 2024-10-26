<script setup lang="ts">
import { DEEP_LINK_PATH_AUTH_CONFIRM } from "@kksh/api"
import { Button } from "@kksh/vue/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@kksh/vue/card"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"
import { open } from "tauri-plugin-shellx-api"
import { toast } from "vue-sonner"

const supabase = useSupabaseClient()
const session = useSupabaseSession()

const redirectTo = DEEP_LINK_PATH_AUTH_CONFIRM
// const redirectTo = "http://localhost:3000/auth/confirm"

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

function onBack() {
	navigateTo("/")
}

const signInWithOAuth = async (provider: "github" | "google") => {
	// console.log(`Login with ${provider} redirecting to ${redirectTo}`);
	const { error, data } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo,
			skipBrowserRedirect: true
		}
	})
	console.log("Sign In With OAuth", data)
	if (error) {
		console.log(error)
		toast.error("Failed to sign in with OAuth", { description: error.message })
	} else {
		data.url && open(data.url)
	}
}

onMounted(async () => {
	if (session.value) {
		// navigateTo("/")
	}
})
</script>

<template>
	<main h-screen w-screen flex flex-col justify-center items-center>
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<!-- <Button @click="supabase.auth.signOut()">Sign Out</Button> -->
		<Card class="w-80">
			<CardHeader class="space-y-1">
				<CardTitle class="flex flex-col items-center text-2xl">
					<div class="p-5">
						<nuxt-img src="/img/logo.png" alt="Kunkun" class="h-12 w-12 invert" />
					</div>
					<Button v-if="session" variant="outline" @click="supabase.auth.signOut()"
						>Sign Out</Button
					>
					<span v-else>Sign In</span>
				</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
				<div v-if="!session" class="grid grid-cols-2 place-items-center gap-4">
					<Button variant="outline" size="lg" class="w-full" @click="signInWithOAuth('github')">
						<Icon name="fa6-brands:github" class="h-5 w-5" />
					</Button>
					<Button variant="outline" size="lg" class="w-full" @click="signInWithOAuth('google')">
						<Icon name="logos:google-icon" class="h-5 w-5" />
					</Button>
				</div>
			</CardContent>
		</Card>
	</main>
</template>
