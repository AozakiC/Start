<template>
  <div v-if="store.showMoveDialog" class="move-dialog fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-5 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-medium mb-4">移动选中的 {{ store.selectedSites.size }} 个网站</h3>
      <p class="text-sm text-gray-600 mb-4">选择目标分类：</p>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="category in store.resource"
          :key="category.name"
          @click="moveSelectedSites(category)"
          class="p-3 border rounded-md cursor-pointer hover:bg-gray-100"
        >
          {{ category.name }} <span class="text-xs text-gray-500">({{ category.site.length }}个站点)</span>
        </div>
      </div>
      <div class="flex justify-end mt-5">
        <button @click="store.showMoveDialog = false" class="btn btn-ghost">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/appStore'
import type {Category} from '../types'

const store = useAppStore()

const moveSelectedSites = (targetCategory: Category) => {
  if (store.selectedSites.size === 0) return

  store.resource.forEach(category => {
    if(category.name===targetCategory.name) return
    const sitesToMove = category.site.filter(site => store.selectedSites.has(site.id!))
    if (sitesToMove.length > 0) {
      targetCategory.site.push(...sitesToMove)
      category.site = category.site.filter(site => !store.selectedSites.has(site.id!))
    }
  })

  store.selectedSites.clear()
  store.showMoveDialog = false
  store.storeFile()
}
</script>
