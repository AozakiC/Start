import { defineStore } from 'pinia'
import type {Category,Site} from '../types'

export const useAppStore = defineStore('app', {
  state: () => ({
    resource: [] as Category[],
    selectedSites: new Set() as Set<string>,
    editingSite: null as Site | null,
    editingCategory: null as Category | null,
    count: 0,
    custom: false,
    isEditing: false,
    showAddDialog: false,
    showMoveDialog: false
  }),
  actions: {
    generateId() {
      this.count++
      return this.count.toString()
    },
    storeFile() {
      localStorage.setItem("resource", JSON.stringify(this.resource))
    }
  }
})
