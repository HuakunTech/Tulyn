<script setup lang="ts">
const session = useSupabaseSession()
</script>
<template>
	<div>
		<pre>session: {{ session }}</pre>
	</div>
</template>
