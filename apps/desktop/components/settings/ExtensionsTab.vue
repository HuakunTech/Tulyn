<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { TListGroup, type TListItem } from "@/lib/types/list"
import { useAppConfigStore } from "~/stores/appConfig"
import { useDevExtStore, useExtStore } from "~/stores/extensionLoader"
import { useRemoteCmdStore } from "~/stores/remoteCmds"
import { ElMessage, ElTable, ElTableColumn } from "element-plus"
import { Trash2Icon } from "lucide-vue-next"
import { onMounted, ref } from "vue"

const remoteCmdStore = useRemoteCmdStore()
const devExtStore = useDevExtStore()
const extStore = useExtStore()
const appConfig = useAppConfigStore()
const tableData = ref<TListGroup[]>([])

function refreshListing() {
	return Promise.all([remoteCmdStore.load(), devExtStore.load(), extStore.load()]).then(() => {
		tableData.value = [...remoteCmdStore.groups(), ...devExtStore.groups(), ...extStore.groups()]
	})
}

onMounted(() => {
	refreshListing()
})

function handleDeleteCommand(index: number, item: TListItem) {
	if (item.type === "Remote Command") {
		remoteCmdStore
			.removeRemoteCmd(parseInt(item.value))
			.then(() => {
				ElMessage.success(`Removed Remote Command: ${item.title}`)
				refreshListing()
			})
			.catch(ElMessage.error)
	}
}

function handleDeleteExtension(index: number, item: TListGroup) {
	const ext = item.flags.isDev ? devExtStore : extStore
	ext
		.uninstallExt(item.identifier)
		.then(() => {
			ElMessage.success({
				message: `Deleted Extension: ${item.title}`
			})
			refreshListing()
		})
		.catch((error) => {
			ElMessage.error({ message: error })
		})
}
</script>
<template>
	<el-table :data="tableData" class="w-full" height="100%" size="small">
		<el-table-column type="expand" width="30">
			<template #default="props">
				<div m="4">
					<el-table :data="props.row.items" :border="false" size="small">
						<el-table-column width="50" />
						<el-table-column label="Command">
							<template #default="scope">
								<div class="flex items-center space-x-2">
									<IconMultiplexer :icon="scope.row.icon" class="h-4 w-4" />
									<span>{{ scope.row.title }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="Type" />
						<el-table-column label="Operations">
							<template #default="scope">
								<el-button
									v-if="scope.row.flags.isRemovable"
									type="danger"
									:icon="Trash2Icon"
									circle
									size="small"
									@click="handleDeleteCommand(scope.$index, scope.row)"
								/>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="Name">
			<template #default="scope">
				<div class="flex items-center space-x-2">
					<IconMultiplexer :icon="scope.row.icon" class="h-4 w-4" />
					<span class="">{{ scope.row.title }}</span>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="Type">
			<template #default="props">
				<div class="flex items-center space-x-2">
					<span class="font-mono">{{ props.row.type }}</span>
					<Icon
						v-if="props.row.flags.isDev"
						name="ph:dev-to-logo-fill"
						class="inline h-6 w-5 text-green-500"
					/>
				</div>
			</template>
		</el-table-column>
		<el-table-column label="Operations">
			<template #default="scope">
				<el-button
					v-if="scope.row.flags.isRemovable"
					type="danger"
					:icon="Trash2Icon"
					circle
					size="small"
					@click="handleDeleteExtension(scope.$index, scope.row)"
				/>
			</template>
		</el-table-column>
	</el-table>
</template>
