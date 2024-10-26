<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@kksh/vue/avatar"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { onKeyStroke } from "@vueuse/core"

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
	// setTimeout(() => {
	// 	if (session.value) {
	// 		navigateTo("/")
	// 	} else {
	// 		navigateTo("/auth")
	// 	}
	// }, 5_000)
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
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<Button variant="outline" size="icon" class="absolute left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<!-- <pre>is logged in: {{ session }}</pre>
		<pre>route: {{ route.fullPath }}</pre> -->
		<div class="flex grow items-center justify-center pt-16">
			<div class="flex flex-col items-center gap-4">
				<span v-if="session" class="text-4xl font-bold font-mono">Welcome, You are Logged In</span>
				<span v-else class="text-4xl font-bold font-mono">You Are Not Logged In</span>
				<span class="flex items-center gap-1 text-xl">
					<Avatar v-if="session" class="h-32 w-32 border">
						<AvatarImage :src="session?.user.user_metadata.avatar_url" alt="avatar" />
						<AvatarFallback>{{ avatarFallback }}</AvatarFallback>
					</Avatar>
				</span>
			</div>
		</div>
	</main>
</template>
