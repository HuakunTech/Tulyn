<script lang="ts" setup>
import { Toaster } from "@kksh/vue/toast"
</script>
<template>
	<Toaster />
	<div>
		<NuxtLink to="/">Home</NuxtLink>
	</div>
	<slot />
</template>
