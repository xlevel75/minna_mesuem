/**
 * Thin client for KCISA open APIs. Their endpoints return either JSON or XML
 * depending on the service, so we fetch text and normalize both into a flat
 * array of string-keyed records (`response.body.items.item[]`).
 */

export type KcisaRecord = Record<string, string>

export async function fetchKcisaItems(
  url: string,
  signal?: AbortSignal,
): Promise<KcisaRecord[]> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`KCISA request failed: ${res.status}`)

  const text = await res.text()
  const trimmed = text.trimStart()

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseJson(JSON.parse(text))
  }
  return parseXml(text)
}

function parseJson(data: unknown): KcisaRecord[] {
  // Common KCISA shape: { response: { body: { items: { item: [...] } } } }
  const item = pick(data, ['response', 'body', 'items', 'item'])
  return toRecordArray(item)
}

function pick(obj: unknown, path: string[]): unknown {
  let cur = obj
  for (const key of path) {
    if (cur && typeof cur === 'object' && key in (cur as object)) {
      cur = (cur as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return cur
}

function toRecordArray(item: unknown): KcisaRecord[] {
  if (Array.isArray(item)) return item as KcisaRecord[]
  if (item && typeof item === 'object') return [item as KcisaRecord]
  return []
}

function parseXml(xml: string): KcisaRecord[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  const items = Array.from(doc.getElementsByTagName('item'))
  return items.map((el) => {
    const record: KcisaRecord = {}
    for (const child of Array.from(el.children)) {
      record[child.tagName] = child.textContent?.trim() ?? ''
    }
    return record
  })
}

/** Read the first present field among candidate keys (case-insensitive). */
export function field(record: KcisaRecord, keys: string[]): string {
  const lower: Record<string, string> = {}
  for (const [k, v] of Object.entries(record)) lower[k.toLowerCase()] = v
  for (const key of keys) {
    const v = lower[key.toLowerCase()]
    if (v && v.trim()) return v.trim()
  }
  return ''
}
