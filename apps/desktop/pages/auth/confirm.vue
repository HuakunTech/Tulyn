<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@kksh/vue/avatar"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"
import { toast } from "vue-sonner"

const session = useSupabaseSession()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

function onBack() {
	navigateTo("/")
}

const route = useRoute()
onMounted(async () => {
	const code = route.query.code
	console.log("Exchange Code", code)
	if (code) {
		await supabase.auth.exchangeCodeForSession(code as string)
	} else {
		toast.error("No code found")
	}
})

const avatarFallback = computed(() => {
	if (!session.value) return "?"
	const nameSplit = session.value?.user.user_metadata.name.split(" ").filter(Boolean)
	if (nameSplit.length > 1) {
		return nameSplit[0][0] + nameSplit.at(-1)[0]
	} else if (nameSplit.length === 1) {
		return nameSplit[0][0]
	} else {
		return "?"
	}
})

function onSignOut() {
	supabase.auth.signOut()
	navigateTo("/auth")
}
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<div class="flex grow items-center justify-center pt-16">
			<div class="flex flex-col items-center gap-4">
				<span v-if="session" class="font-mono text-4xl font-bold">Welcome, You are Logged In</span>
				<span v-else class="font-mono text-4xl font-bold">You Are Not Logged In</span>
				<span flex flex-col items-center gap-5 text-xl>
					<Avatar v-if="session" class="h-32 w-32 border">
						<AvatarImage :src="session?.user.user_metadata.avatar_url" alt="avatar" />
						<AvatarFallback>{{ avatarFallback }}</AvatarFallback>
					</Avatar>
					<Button variant="outline" @click="onSignOut">Sign Out</Button>
				</span>
			</div>
		</div>
	</main>
</template>
