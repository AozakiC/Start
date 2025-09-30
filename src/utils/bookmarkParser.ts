/**
 * 解析NETSCAPE-Bookmark-file-1格式的书签文件
 *
 * @param bookmarkFileContent 字符串格式的书签文件内容
 * @returns resource.data 解析后的书签数据
 */

import type { Category, Site } from '@/types'

interface BookmarkResource {
  data: Category[],
  indexOf: (categoryName: string) => number,
  newCategory: (categoryName: string, add_date?: string, last_modified?: string) => void,
  newSite: (categoryName: string, site: Site) => void,
}

export function bookmarkParser(bookmarkFileContent: string): Category[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(bookmarkFileContent, 'text/html')
  const rootDl = doc.querySelector('dl')
  if (!rootDl) {
    throw new Error('无效的书签文件格式: 未找到DL元素')
  }

  const resource: BookmarkResource = {
    data: [],
    indexOf: function (s: string): number {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].name === s) {
          return i
        }
      }
      return -1
    },
    newCategory: function (categoryName: string, add_date: string | undefined = '', last_modified: string | undefined = ''): void {
      if (this.indexOf(categoryName) === -1) {
        const category: Category = {
          name: categoryName,
          add_date,
          last_modified,
          site: [],
        }
        this.data.push(category)
      }
    },
    newSite: function (categoryName: string, site: Site): void {
      const index = this.indexOf(categoryName)
      if (index !== -1) {
        this.data[index].site.push(site)
      } else {
        // 如果分类不存在，先创建分类
        this.newCategory(categoryName)
        this.newSite(categoryName, site)
      }
    }
  }


  function parseDl(dl: Element, categoryName: string): void {
    for (let i = 0; i < dl.children.length; i++) {
      const child = dl.children[i]
      if (child.tagName === 'P') {
        //跳过p标签
        continue
      }

      if (child.children[0].tagName === 'H3') {
        //h3标签代表文件夹标题
        const h3 = child.children[0]

        const subCategoryName = h3.textContent?.trim() || '未命名'
        const add_date = h3.getAttribute('add_date') || ''
        const last_modified = h3.getAttribute('last_modified') || ''
        resource.newCategory(subCategoryName, add_date, last_modified)

        //dl标签代表文件夹内容
        const dl = child.children[1]
        parseDl(dl, subCategoryName)
      } else if (child.children[0].tagName === 'A') {
        //a标签代表网站
        const a = child.children[0]

        const url = a.getAttribute('href') || ''
        const name = a.textContent?.trim() || url.split('/')[2] || '未命名'
        const icon = a.getAttribute('icon') || ''
        const add_date = a.getAttribute('add_date') || ''

        const site: Site = { name, url, icon, add_date }
        resource.newSite(categoryName, site)
      }
    }
  }

  parseDl(rootDl, '未分类')
  return resource.data
}
