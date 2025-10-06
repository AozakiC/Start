<template>
  <div v-if="store.showAddDialog" class="add-dialog fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-5 rounded-lg w-full max-w-md">
      <h3 class="text-lg font-medium mb-4">{{ store.editingSite?.id ? '编辑网站' : '添加网站' }}</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
          <input v-model="store.editingSite!.name" type="text" class="input w-full">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">网站地址</label>
          <input v-model="store.editingSite!.url" type="url" class="input w-full">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea v-model="store.editingSite!.description" class="textarea w-full"></textarea>
        </div>
      </div>
      <div class="flex justify-end space-x-2 mt-5">
        <button @click="store.showAddDialog = false" class="btn btn-ghost">取消</button>
        <button @click="saveEditedSite" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const saveEditedSite = () => {
  if (!store.editingSite || !store.editingCategory) return

  const index = store.editingCategory.site.findIndex(s => s.id === store.editingSite!.id)
  if (index !== -1) {
    store.editingCategory.site[index] = store.editingSite
  } else {
    store.editingSite.id = store.generateId()
    store.editingCategory.site.push(store.editingSite)
  }

  store.showAddDialog = false
  store.editingSite = null
  store.editingCategory = null
  store.storeFile()
}
</script>
