<template>
  <div class="text-black min-h-screen bg-[url('/img/banner.webp')] bg-cover bg-center bg-fixed bg-no-repeat">
    <div class="app-toolbar flex flex-row-reverse flex-wrap justify-between items-center container mx-auto px-4 py-2 bg-white/60 backdrop-blur-md rounded-b-lg shadow text-sm sticky top-0 z-10">
      <div class="flex items-center space-x-2">
        <template v-if="custom">
          <template v-if="!isEditing">
            <div class="flex">
                <label for="file-input" class="btn btn-sm btn-primary">导入</label>
                <input type="file" id="file-input" accept=".json,.html" @change="handleFile" class="hidden" />
            </div>

            <button @click="exportFile" class="btn btn-sm btn-primary">导出</button>
          </template>

          <button @click="toggleIsEditing" class="btn btn-sm btn-primary">
            {{ isEditing ? '退出编辑' : '编辑' }}
          </button>
        </template>

        <label class="label text-gray-700 px-3 py-1">
          <input type="checkbox" v-model="custom" @change="toggleCustom" class="toggle toggle-primary" />
          自定义
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <template v-if="isEditing">
          <label class="label text-gray-700">
            <input type="checkbox" v-model="allSelected" class="w-4 h-4" />
            全选
          </label>

          <template v-if="selectedSites.size > 0">
            <button @click="showMoveDialog = true" class="btn btn-sm btn-primary">
              移动
            </button>

            <button @click="deleteSelectedSites" class="btn btn-sm btn-secondary">
              删除({{ selectedSites.size }})
            </button>
          </template>
        </template>
      </div>
    </div><!--end app-toolbar-->

    <div class="app-header flex justify-center items-center h-[calc(100vh-4rem)] w-full">
      <div class="text-4xl font-semibold text-white">网址导航</div>
      <div class="ml-4 flex space-x-2">
        <!--
          pink-400 yellow-400 blue-600 red-600
        -->
        <span class="bg-[#ff6496] rounded-lg w-3 h-3"></span>
        <span class="bg-[#fabe03] rounded-lg w-3 h-3"></span>
        <span class="bg-[#006ebe] rounded-lg w-3 h-3"></span>
        <span class="bg-[#e60046] rounded-lg w-3 h-3"></span>
      </div>
    </div><!--end app-header-->

    <div class="flex flex-col lg:flex-row container mx-auto mt-4 space-x-4">
      <div class="app-content w-full lg:w-5/6">
        <div v-for="r in resource" :key="r.name" class="bg-white/60 backdrop-blur-md mb-4 p-3 rounded-lg shadow">
          <div :id="r.name" class="app-content-title flex justify-between items-center">
            <div class="flex items-baseline space-x-2">
              <span class="text-base bg-primary text-white px-3 py-1 rounded-lg">{{ r.name }}</span>
              <span class="text-sm text-gray-500">{{ r.site.length }}个站点</span>
            </div>

            <div v-if="isEditing" class="flex space-x-2">
              <button @click="addSite(r)" class="btn btn-sm btn-primary">
                添加网站
              </button>
              <button @click="deleteCategory(r)" class="btn btn-sm btn-secondary">
                删除分类
              </button>
            </div>
          </div><!--end app-content-title-->

          <div class="app-content-card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            <div v-for="s in r.site" :key="s.id"
              class="relative rounded-md border border-gray-200 hover:border-[#ff6496]">
              <input v-if="isEditing" type="checkbox" :checked="selectedSites.has(s.id!)"
                @change="selectedSites.has(s.id!) ? selectedSites.delete(s.id!) : selectedSites.add(s.id!)"
                class="absolute top-1 left-1 w-4 h-4" />

              <a :href="s.url" class="px-3 py-4 text-center block truncate" :title="s.description || s.name"
                target="_blank" rel="noreferrer">
                <span class="font-medium">{{ s.name }}</span>
              </a>

              <div v-if="isEditing" class="absolute bottom-1 right-1 flex space-x-1">
                <span @click="editSite(s, r)" class="p-1 text-blue-500 hover:text-blue-700" title="编辑">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              </div>
            </div>
          </div><!--end app-content-card-->
        </div>

        <div v-if="resource.length === 0" class="text-center py-10 bg-white/60 backdrop-blur-md rounded-lg shadow">
          <p class="text-gray-500">暂无数据，请导入或添加分类</p>
        </div>
      </div><!--end app-content-->

      <div class="app-sidebar w-full lg:w-1/6 bg-white/60 backdrop-blur-md mb-4 p-3 rounded-lg shadow sticky top-15 h-full">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
          <span class="text-lg font-semibold">分类</span>
        </div>

        <div class="mt-3">
          <ul class="space-y-1 max-h-64 overflow-y-auto">
            <li v-for="r in resource" :key="r.name">
              <a :href="'#' + r.name" class="hover:text-[#ff6496] text-base block py-1 px-2 rounded hover:bg-gray-100">
                {{ r.name }} <span class="text-xs text-gray-500">({{ r.site.length }})</span>
              </a>
            </li>
          </ul>
        </div>

        <template v-if="isEditing">
          <div class="flex items-center mt-3">
            <input v-model="newCategoryName" placeholder="新分类名称" class="input input-sm" />
            <button @click="addCategory" class="btn btn-sm btn-primary">添加</button>
          </div>
          <button @click="clearEmptyCategory" class="hidden btn btn-sm btn-secondary mt-1">清理空分类</button>
        </template>
      </div><!--end app-sidebar-->
    </div>

    <div v-if="showAddDialog" class="add-dialog fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">{{ editingSite?.id ? '编辑网站' : '添加网站' }}</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
            <input v-model="editingSite!.name" type="text" class="input w-full">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网站地址</label>
            <input v-model="editingSite!.url" type="url" class="input w-full">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea v-model="editingSite!.description" class="textarea w-full"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-5">
          <button @click="showAddDialog = false" class="btn btn-ghost">取消</button>
          <button @click="saveEditedSite" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div><!--end add-dialog-->

    <div v-if="showMoveDialog" class="move-dialog fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">移动选中的 {{ selectedSites.size }} 个网站</h3>
        <p class="text-sm text-gray-600 mb-4">选择目标分类：</p>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div v-for="cat in resource" :key="cat.name" @click="moveSelectedSites(cat)"
            class="p-3 border rounded-md cursor-pointer hover:bg-gray-100">
            {{ cat.name }} <span class="text-xs text-gray-500">({{ cat.site.length }}个站点)</span>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button @click="showMoveDialog = false" class="btn btn-ghost">取消</button>
        </div>
      </div>
    </div><!--end move-dialog-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { saveAs } from 'file-saver'
import type { Category, Site } from './types'
import defaultResourceData from './resource.json'
import { bookmarkParser } from './utils/bookmarkParser'


const resource = ref<Category[]>([])
const defaultResource = ref<Category[]>([])
const customResource = ref<Category[]>([])
const selectedSites = ref<Set<string>>(new Set())
const editingSite = ref<Site | null>(null)
const editingCategory = ref<Category | null>(null)
const newCategoryName = ref('')
const custom = ref(false)
const isEditing = ref(false)
const showAddDialog = ref(false)
const showMoveDialog = ref(false)

// 生成唯一ID
const generateId = () => Math.random().toString(36).slice(2, 9)

// 初始化时加载数据
onMounted(() => {
  defaultResource.value = [...defaultResourceData]
  // 确保每个站点都有唯一ID

  const savedData = localStorage.getItem("resource")

  if (savedData && savedData.includes('name')) {
    custom.value = true
    customResource.value = JSON.parse(savedData)
  }

  defaultResource.value.forEach(category => {
    category.site.forEach(site => {
      if (!site.id) site.id = generateId()
    })
  })
  customResource.value.forEach(category => {
    category.site.forEach(site => {
      if (!site.id) site.id = generateId()
    })
  })

  resource.value = custom.value ? customResource.value : defaultResource.value
})

// 全选/取消全选
const allSelected = computed({
  get: () => {
    const allSites = resource.value.flatMap(category => category.site)
    return allSites.length > 0 && allSites.length == selectedSites.value.size
  },
  set: (value: boolean) => {
    if (value) {
      resource.value.forEach(category => {
        category.site.forEach(site => {
          if (site.id) selectedSites.value.add(site.id)
        })
      })
    } else {
      selectedSites.value.clear()
    }
  }
})

// 处理文件上传
function handleFile(event: Event) {
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
            // 解析HTML文件
            uploadData = bookmarkParser(content)
          } else {
            // 解析JSON文件
            uploadData = JSON.parse(content)
          }

          // 为每个站点添加ID
          uploadData.forEach(category => {
            category.site.forEach(site => {
              if (!site.id) {
                site.id = generateId()
              }
            })
          })

          if (resource.value.length > 0) {
            // 增量导入：合并到现有数据
            uploadData.forEach(newCategory => {
              // 查找是否已存在同名分类
              const existingCategory = resource.value.find(cat => cat.name === newCategory.name)

              if (existingCategory) {
                // 合并到现有分类
                newCategory.site.forEach(newSite => {
                  // 检查是否已存在相同站点（根据名称和URL判断）
                  const siteExists = existingCategory.site.some(
                    existingSite => existingSite.name === newSite.name && existingSite.url === newSite.url
                  )

                  if (!siteExists) {
                    existingCategory.site.push(newSite)
                  }
                })
              } else {
                // 添加新分类
                resource.value.push(newCategory)
              }
            })
          } else {
            // 全量导入：替换现有数据
            resource.value = uploadData
          }

          storeFile()
          console.log('文件导入成功！')
        } catch (error) {
          alert('文件格式错误，请上传有效的书签文件或JSON文件')
          console.error('解析错误:', error)
        }
      }
    }
    reader.readAsText(files[0])
    target.value = '' // 重置文件输入
  }
}

// 导出文件
function exportFile() {
  const data = JSON.stringify(resource.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const date = new Date()
  const dataStr = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`
  saveAs(blob, `bookmarks_${dataStr}.json`)
}

// 保存到本地存储
function storeFile() {
  localStorage.setItem("resource", JSON.stringify(resource.value))
}

// 添加新分类
function addCategory() {
  const s = newCategoryName.value.trim()
  if (!s) return

  if(resource.value.some(category => category.name === s)) return

  resource.value.push({
    name: s,
    icon: "",
    site: []
  })
  newCategoryName.value = ''
  storeFile()
}

// 添加新站点
function addSite(category: Category) {
  const newSite: Site = {
    id: generateId(),
    name: '新网站',
    url: 'https://',
    description: ''
  }
  editSite(newSite, category)
}

// 编辑站点
function editSite(site: Site, category: Category) {
  editingSite.value = site
  editingCategory.value = category
  showAddDialog.value = true
}

// 保存编辑的站点
function saveEditedSite() {
  if (!editingSite.value || !editingCategory.value) return

  const index = editingCategory.value.site.findIndex(s => s.id === editingSite.value!.id)
  if (index !== -1) {
    editingCategory.value.site[index] = editingSite.value
  } else {
    editingCategory.value.site.push(editingSite.value)
  }

  showAddDialog.value = false
  editingSite.value = null
  editingCategory.value = null
  storeFile()
}

// 删除选中的站点
function deleteSelectedSites() {
  if (selectedSites.value.size === 0) return
  if (!confirm(`确定要删除 ${selectedSites.value.size} 个网站吗？`)) return

  resource.value.forEach(category => {
    category.site = category.site.filter(site => !selectedSites.value.has(site.id!))
  })
  selectedSites.value.clear()
  storeFile()
}

// 移动选中的站点
function moveSelectedSites(targetCategory: Category) {
  if (selectedSites.value.size === 0) return

  resource.value.forEach(category => {
    if(category.name===targetCategory.name) return
    const sitesToMove = category.site.filter(site => selectedSites.value.has(site.id!))
    if (sitesToMove.length > 0) {
      targetCategory.site.push(...sitesToMove)
      category.site = category.site.filter(site => !selectedSites.value.has(site.id!))
    }
  })

  selectedSites.value.clear()
  showMoveDialog.value = false
  storeFile()
}

// 删除分类
function deleteCategory(category: Category) {
  if (category.site.length > 0 && !confirm(`分类"${category.name}"中还有${category.site.length}个网站，确定要删除吗？`)) return

  const deletedSites = new Set(category.site.map(site => site.id).filter(Boolean))
  deletedSites.forEach(site => {
    selectedSites.value.delete(site!)
  })

  const index = resource.value.indexOf(category)
  if (index !== -1) {
    resource.value.splice(index, 1)
    storeFile()
  }
}

function clearEmptyCategory() {
  resource.value = resource.value.filter(category => category.site.length > 0)
  storeFile()
}

// 编辑模式变化，退出编辑模式时清空选择
function toggleIsEditing() {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    selectedSites.value.clear()
  }
}

// 自定义模式变化
function toggleCustom() {
  if (custom.value) {
    resource.value = customResource.value;
  } else {
    isEditing.value = false;
    resource.value = defaultResource.value;
  }
}
</script>

<style scoped>
.app-content-title {
  scroll-margin-top: 4rem;
}
</style>
