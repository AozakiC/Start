<template>
  <div class="text-black min-h-screen bg-[url('/img/banner.webp')] bg-cover bg-center bg-fixed bg-no-repeat">
    <AppToolbar />

    <AppHeader />

    <div class="flex flex-col lg:flex-row container mx-auto mt-4 space-x-4">
      <div class="app-content w-full lg:w-5/6">
        <CategoryCard
          v-for="category in store.resource"
          :key="category.name"
          :category="category"
        />

        <div v-if="store.resource.length === 0" class="text-center py-10 bg-white/60 backdrop-blur-md rounded-lg shadow">
          <p class="text-gray-500">暂无数据，请导入或添加分类</p>
        </div>
      </div>

      <AppSidebar />
    </div>

    <AddDialog />
    <MoveDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from './stores/appStore'
import type { Category } from './types'
import AppToolbar from './components/AppToolbar.vue'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import CategoryCard from './components/CategoryCard.vue'
import AddDialog from './components/AddDialog.vue'
import MoveDialog from './components/MoveDialog.vue'
import defaultResourceData from './resource.json'

const defaultResource = ref<Category[]>([])
const customResource = ref<Category[]>([])
const store = useAppStore()

onMounted(() => {
  defaultResource.value = [...defaultResourceData]

  const savedData = localStorage.getItem("resource")
  if (savedData && savedData.includes('name')) {
    store.custom = true
    customResource.value = JSON.parse(savedData)
  }

  defaultResource.value.forEach(category => {
    category.site.forEach(site => {
      site.id = store.generateId()
    })
  })
  customResource.value.forEach(category => {
    category.site.forEach(site => {
      site.id = store.generateId()
    })
  })

  store.resource = store.custom ? customResource.value : defaultResource.value
  watch(() => store.custom, (custom) => {
    store.resource = custom ? customResource.value : defaultResource.value
    if (!custom && store.isEditing) store.isEditing = false
  })
})

</script>

<style scoped>

</style>
