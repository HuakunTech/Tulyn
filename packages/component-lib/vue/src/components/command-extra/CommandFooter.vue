<script setup lang="ts"></script>

<template>
	<!-- <Primitive
		:as="as"
		:as-child="asChild"
		:class="cn(buttonVariants({ variant, size }), props.class)"
	>
		<slot />
	</Primitive> -->
	<div
		class="bottom-0 flex w-full items-center justify-between rounded-b-lg border-t-[1px] px-1 py-1"
	>
		<slot />
	</div>
</template>
