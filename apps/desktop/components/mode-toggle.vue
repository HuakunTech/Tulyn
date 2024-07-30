<script setup lang="ts">
import { Button } from "@kkui/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@kkui/components/ui/dropdown-menu"

const colorMode = useColorMode()
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="outline">
				<Icon
					name="radix-icons:moon"
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Icon
					name="radix-icons:sun"
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuItem @click="colorMode = 'light'"> Light </DropdownMenuItem>
			<DropdownMenuItem @click="colorMode = 'dark'"> Dark </DropdownMenuItem>
			<DropdownMenuItem @click="colorMode = 'auto'"> System </DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
