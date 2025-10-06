<template>
  <div class="relative rounded-md border border-gray-200 hover:border-[#ff6496]">
    <input
      v-if="store.isEditing"
      type="checkbox"
      :checked="store.selectedSites.has(site.id!)"
      @change="toggleSelect"
      class="absolute top-1 left-1 w-4 h-4"
    />

    <a
      :href="site.url"
      class="px-3 py-4 text-center block truncate"
      :title="site.description || site.name"
      target="_blank"
      rel="noreferrer"
    >
      <span class="font-medium">{{ site.name }}</span>
    </a>

    <div v-if="store.isEditing" class="absolute bottom-1 right-1 flex space-x-1">
      <span @click="$emit('editSite')" class="p-1 text-blue-500 hover:text-blue-700" title="编辑">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Site } from '../types'
import { useAppStore } from '../stores/appStore'

const props = defineProps<{
  site: Site
}>()

const store = useAppStore()

const toggleSelect = () => {
  if (props.site.id) {
    if (store.selectedSites.has(props.site.id)) {
      store.selectedSites.delete(props.site.id)
    } else {
      store.selectedSites.add(props.site.id)
    }
  }
}
</script>
