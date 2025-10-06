<template>
  <div class="app-toolbar flex flex-row-reverse flex-wrap justify-between items-center container mx-auto px-4 py-2 bg-white/60 backdrop-blur-md rounded-b-lg shadow text-sm sticky top-0 z-10">
    <div class="flex items-center space-x-2">
      <template v-if="store.custom">
        <template v-if="!store.isEditing">
          <div class="flex">
            <label for="file-input" class="btn btn-sm btn-primary">导入</label>
            <input type="file" id="file-input" accept=".json,.html" @change="handleFile" class="hidden" />
          </div>
          <button @click="exportFile" class="btn btn-sm btn-primary">导出</button>
        </template>
        <button @click="store.isEditing = !store.isEditing" class="btn btn-sm btn-primary">
          {{ store.isEditing ? '退出编辑' : '编辑' }}
        </button>
      </template>

      <label class="label text-gray-700 px-3 py-1">
        <input type="checkbox" v-model="store.custom" class="toggle toggle-primary" />
        自定义
      </label>
    </div>

    <div class="flex items-center space-x-2">
      <template v-if="store.isEditing">
        <label class="label text-gray-700">
          <input type="checkbox" v-model="allSelected" class="w-4 h-4" />
          全选
        </label>

        <template v-if="store.selectedSites.size > 0">
          <button @click="store.showMoveDialog = true" class="btn btn-sm btn-primary">
            移动
          </button>
          <button @click="deleteSelectedSites" class="btn btn-sm btn-secondary">
            删除({{ store.selectedSites.size }})
          </button>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { saveAs } from 'file-saver'
import { bookmarkParser } from '../utils/bookmarkParser'
import { useAppStore } from '../stores/appStore'
import type { Category } from '../types'

const store = useAppStore()

watch(() => store.isEditing, (isEditing) => {
  if (!isEditing) store.selectedSites.clear()
})

const allSelected = computed({
  get: () => {
    const allSites = store.resource.flatMap(category => category.site)
    return allSites.length > 0 && allSites.length == store.selectedSites.size
  },
  set: (value: boolean) => {
    if (value) {
      store.resource.forEach(category => {
        category.site.forEach(site => {
          if (site.id) store.selectedSites.add(site.id)
        })
      })
    } else {
      store.selectedSites.clear()
    }
  }
})

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        try {
          const content = e.target.result
          let uploadData: Category[] = []
          if (content.includes('NETSCAPE-Bookmark-file-1')) {
            uploadData = bookmarkParser(content)
          } else {
            uploadData = JSON.parse(content)
          }

          uploadData.forEach(category => {
            category.site.forEach(site => {
                site.id = store.generateId()
            })
          })

          if (store.resource.length > 0) {
            uploadData.forEach(newCategory => {
              const existingCategory = store.resource.find(cat => cat.name === newCategory.name)
              if (existingCategory) {
                newCategory.site.forEach(newSite => {
                  const siteExists = existingCategory.site.some(
                    existingSite => existingSite.name === newSite.name && existingSite.url === newSite.url
                  )
                  if (!siteExists) {
                    existingCategory.site.push(newSite)
                  }
                })
              } else {
                store.resource.push(newCategory)
              }
            })
          } else {
            store.resource = uploadData
          }

          store.storeFile()
          console.log('文件导入成功！')
        } catch (error) {
          alert('文件格式错误，请上传有效的书签文件或JSON文件')
          console.error('解析错误:', error)
        }
      }
    }
    reader.readAsText(files[0])
    target.value = ''
  }
}

const exportFile = () => {
  const data = JSON.stringify(store.resource, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const date = new Date()
  const dataStr = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`
  saveAs(blob, `bookmarks_${dataStr}.json`)
}

const deleteSelectedSites = () => {
  if (store.selectedSites.size === 0) return
  if (!confirm(`确定要删除 ${store.selectedSites.size} 个网站吗？`)) return

  store.resource.forEach(category => {
    category.site = category.site.filter(site => !store.selectedSites.has(site.id!))
  })
  store.selectedSites.clear()
  store.storeFile()
}
</script>
