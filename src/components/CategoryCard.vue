<template>
  <div class="bg-white/60 backdrop-blur-md mb-4 p-3 rounded-lg shadow">
    <div :id="category.name" class="app-content-title flex justify-between items-center">
      <div class="flex items-baseline space-x-2">
        <span class="text-base bg-primary text-white px-3 py-1 rounded-lg">{{ category.name }}</span>
        <span class="text-sm text-gray-500">{{ category.site.length }}个站点</span>
      </div>

      <div v-if="store.isEditing" class="flex space-x-2">
        <button @click="addSite(category)" class="btn btn-sm btn-primary">
          添加网站
        </button>
        <button @click="deleteCategory(category)" class="btn btn-sm btn-secondary">
          删除分类
        </button>
      </div>
    </div>

    <div class="app-content-card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
      <SiteCard
        v-for="site in category.site"
        :key="site.id"
        :site="site"
        @edit-site="editSite(site,category)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Site } from '../types'
import { useAppStore } from '../stores/appStore'
import SiteCard from './SiteCard.vue'
defineProps<{
  category: Category
}>()

const store = useAppStore()


const addSite = (category: Category) => {
  const newSite: Site = {
    name: '新网站',
    url: 'https://',
    description: ''
  }
  editSite(newSite, category)
}

const editSite = (site: Site, category: Category) => {
  store.editingSite = site
  store.editingCategory = category
  store.showAddDialog = true
}

const deleteCategory = (category: Category) => {
  if (category.site.length > 0 && !confirm(`分类"${category.name}"中还有${category.site.length}个网站，确定要删除吗？`)) return

  const deletedSites = new Set(category.site.map(site => site.id).filter(Boolean))
  deletedSites.forEach(site => {
    store.selectedSites.delete(site!)
  })

  const index = store.resource.indexOf(category)
  if (index !== -1) {
    store.resource.splice(index, 1)
    store.storeFile()
  }
}

</script>


<style scoped>
.app-content-title {
  scroll-margin-top: 4rem;
}
</style>
