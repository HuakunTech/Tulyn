<script setup lang="ts">
import MetadataLabel from "@/components/Metadata/label.vue"
import MetadataLink from "@/components/Metadata/link.vue"
import MetadataSeparator from "@/components/Metadata/separator.vue"
import MetadataTags from "@/components/Metadata/tags.vue"
import {
	List,
	ListSchema,
	MarkdownSchema,
	NodeNameEnum,
	WorkerExtension
} from "@kksh/api/ui/worker"

const props = defineProps<{
	items: ListSchema.ItemDetailMetadataItem[]
}>()
</script>
<template>
	<div class="px-3">
		<div v-for="item in items">
			<MetadataLabel
				v-if="item.nodeName === NodeNameEnum.ListItemDetailMetadataLabel"
				:title="(item as ListSchema.ItemDetailMetadataLabel).title"
				:text="(item as ListSchema.ItemDetailMetadataLabel).text"
				:icon="(item as ListSchema.ItemDetailMetadataLabel).icon"
			/>
			<MetadataSeparator v-if="item.nodeName === NodeNameEnum.ListItemDetailMetadataSeparator" />
			<MetadataLink
				v-if="item.nodeName === NodeNameEnum.ListItemDetailMetadataLink"
				:title="(item as ListSchema.ItemDetailMetadataLink).title"
				:text="(item as ListSchema.ItemDetailMetadataLink).text"
				:url="(item as ListSchema.ItemDetailMetadataLink).url"
			/>
			<MetadataTags
				v-if="item.nodeName === NodeNameEnum.ListItemDetailMetadataTagList"
				:tags="(item as ListSchema.ItemDetailMetadataTagList).tags"
				:title="(item as ListSchema.ItemDetailMetadataTagList).title"
			/>
		</div>
	</div>
</template>
