function toIdFromPath(path) {
  const file = path.split('/').pop() || ''
  return file.replace(/\.json$/i, '')
}

export function loadJsonCollectionEager(globResult) {
  const items = []
  for (const [path, mod] of Object.entries(globResult)) {
    const data = mod?.default
    if (!data) continue

    if (Array.isArray(data)) {
      items.push({ id: toIdFromPath(path), lines: data })
      continue
    }

    const id = data.id ?? toIdFromPath(path)
    items.push({ ...data, id })
  }
  return items
}

export function indexById(items) {
  const map = new Map()
  for (const item of items) {
    if (!item?.id) continue
    map.set(item.id, item)
  }
  return map
}

export function renderTemplate(value, ctx) {
  if (typeof value !== 'string') return value
  return value.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, path) => {
    const parts = path.split('.')
    let cur = ctx
    for (const part of parts) {
      if (cur == null) return ''
      cur = cur[part]
    }
    return cur == null ? '' : String(cur)
  })
}

export function deepTemplate(obj, ctx) {
  if (obj == null) return obj
  if (typeof obj === 'string') return renderTemplate(obj, ctx)
  if (Array.isArray(obj)) return obj.map(v => deepTemplate(v, ctx))
  if (typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = deepTemplate(v, ctx)
    return out
  }
  return obj
}

