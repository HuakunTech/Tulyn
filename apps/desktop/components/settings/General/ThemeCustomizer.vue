<script lang="ts" setup>
import { colors } from "@/lib/themes/colors"
import { allColors } from "@/lib/themes/themes"
import { LightMode } from "@kksh/api/models"
import { Button, Label } from "@kksh/vue"
import { useStore } from "@nanostores/vue"
import { CheckIcon, MoonIcon, SunIcon } from "@radix-icons/vue"
import { useColorMode, useDark } from "@vueuse/core"
import { useAppConfigStore } from "~/stores/appConfig"

const appConfig = useAppConfigStore()

// const isDark = useDark();
const RADII = [0, 0.25, 0.5, 0.75, 1]
// const appConfig = useAppConfigStore();
const colorMode = useColorMode()

function changeLightMode(mode: LightMode) {
	colorMode.value = mode
	appConfig.setLightMode(mode)
}
</script>

<template>
	<div class="p-2">
		<div class="space-y-1.5 pt-6">
			<Label for="color" class="text-xs"> Color </Label>
			<div class="grid grid-cols-3 gap-2 py-1.5">
				<Button
					v-for="(color, index) in allColors"
					:key="index"
					variant="outline"
					class="h-8 justify-start px-3"
					:class="color === appConfig.theme ? 'border-foreground border-2' : ''"
					@click="appConfig.setTheme(color)"
				>
					<span
						class="flex h-5 w-5 items-center justify-center rounded-full"
						:style="{ backgroundColor: colors[color][7].rgb }"
					>
						<CheckIcon v-if="color === appConfig.theme" class="h-3 w-3 text-white" />
					</span>
					<span class="ml-2 text-xs capitalize">
						{{ color }}
					</span>
				</Button>
			</div>
		</div>
		<div class="space-y-1.5 pt-6">
			<Label for="radius" class="text-xs"> Radius </Label>
			<div class="grid grid-cols-5 gap-2 py-1.5">
				<Button
					v-for="(r, index) in RADII"
					:key="index"
					variant="outline"
					class="h-8 justify-center px-3"
					:class="r === appConfig.radius ? 'border-foreground border-2' : ''"
					@click="appConfig.setRadius(r)"
				>
					<span class="text-xs">
						{{ r }}
					</span>
				</Button>
			</div>
		</div>
		<div class="space-y-1.5 pt-6">
			<Label for="theme" class="text-xs"> Theme </Label>

			<div class="flex space-x-2 py-1.5">
				<Button
					class="h-8"
					variant="outline"
					:class="{ 'border-foreground border-2': appConfig.lightMode == 'light' }"
					@click="changeLightMode('light')"
				>
					<SunIcon class="mr-2 h-4 w-4" />
					<span class="text-xs">Light</span>
				</Button>
				<Button
					class="h-8"
					variant="outline"
					:class="{ 'border-foreground border-2': appConfig.lightMode == 'dark' }"
					@click="changeLightMode('dark')"
				>
					<MoonIcon class="mr-2 h-4 w-4" />
					<span class="text-xs">Dark</span>
				</Button>
				<Button
					class="h-8"
					variant="outline"
					:class="{ 'border-foreground border-2': appConfig.lightMode == 'auto' }"
					@click="changeLightMode('auto')"
				>
					<MoonIcon class="mr-2 h-4 w-4" />
					<span class="text-xs">System</span>
				</Button>
			</div>
		</div>
	</div>
</template>
