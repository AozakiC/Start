<template>
  <div class="app-sidebar w-full lg:w-1/6 bg-white/60 backdrop-blur-md mb-4 p-3 rounded-lg shadow sticky top-15 h-full">
    <div class="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
      <span class="text-lg font-semibold">分类</span>
    </div>

    <div class="mt-3">
      <ul class="space-y-1 max-h-64 overflow-y-auto">
        <li v-for="category in store.resource" :key="category.name">
          <a :href="'#' + category.name" class="hover:text-[#ff6496] text-base block py-1 px-2 rounded hover:bg-gray-100">
            {{ category.name }} <span class="text-xs text-gray-500">({{ category.site.length }})</span>
          </a>
        </li>
      </ul>
    </div>

    <template v-if="store.isEditing">
      <div class="flex items-center mt-3">
        <input v-model="newCategoryName" placeholder="新分类名称" class="input input-sm" />
        <button @click="addCategory" class="btn btn-sm btn-primary">添加</button>
      </div>
      <button @click="clearEmptyCategory" class="btn btn-sm btn-secondary mt-1">清理空分类</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/appStore'

const newCategoryName = ref('')
const store = useAppStore()

const addCategory = () => {
  const s = newCategoryName.value.trim()
  if (!s) return

  if(store.resource.some(category => category.name === s)) return

  store.resource.push({
    name: s,
    icon: "",
    site: []
  })
  newCategoryName.value = ''
  store.storeFile()
}


const clearEmptyCategory = () => {
  store.resource = store.resource.filter(category => category.site.length > 0)
  store.storeFile()
}
</script>
