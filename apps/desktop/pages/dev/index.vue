<script setup lang="ts">
definePageMeta({
	layout: false
})

const session = useSupabaseSession()
</script>

<template>
	<div>
		<h1>dev</h1>
		<pre>session: {{ session }}</pre>
	</div>
</template>
