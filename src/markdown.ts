const modules = import.meta.glob('../docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface DocPage {
  slug: string
  title: string
  lang: 'zh' | 'en'
  body: string
}

const pages: Record<string, DocPage> = {}

for (const [filePath, body] of Object.entries(modules)) {
  const rel = filePath.replace(/^\.\.\/docs\//, '').replace(/\.md$/, '')
  const lang = (rel.startsWith('en/') ? 'en' : 'zh') as 'zh' | 'en'
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : rel
  pages[rel] = { slug: rel, title, lang, body }
}

export function getDoc(slug: string): DocPage | null {
  return pages[slug] ?? null
}

export function listDocs(lang?: 'zh' | 'en'): DocPage[] {
  const all = Object.values(pages)
  return lang ? all.filter((p) => p.lang === lang) : all
}
