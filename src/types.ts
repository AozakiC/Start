export interface Site {
  id?: string,
  name: string,
  url: string,
  icon?: string,
  add_date?: string,
  description?: string,
}

export interface Category {
  name: string,
  icon?: string,
  add_date?: string,
  last_modified?: string,
  site: Site[],
}
