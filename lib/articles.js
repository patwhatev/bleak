import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { slugify } from './format'

export { slugify, formatDate } from './format'

const ARTICLES_DIR = path.join(process.cwd(), 'articles')
const REQUIRED = ['title', 'date', 'author']

function toList(value) {
    if (!value) return []
    const list = Array.isArray(value) ? value : String(value).split(',')
    return list.map(v => String(v).trim()).filter(Boolean)
}

// gray-matter turns unquoted dates into Date objects, quoted ones stay strings
function toIsoDate(value, filename) {
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date)) throw new Error(`articles/${filename}: can't read date "${value}", use YYYY-MM-DD`)
    return date.toISOString().slice(0, 10)
}

// local covers that haven't been added yet are dropped rather than shown broken
function resolveCover(cover, filename) {
    if (!cover) return null
    if (cover.startsWith('/') && !fs.existsSync(path.join(process.cwd(), 'public', cover))) {
        console.warn(`articles/${filename}: cover ${cover} not found in public/, skipping it`)
        return null
    }
    return cover
}

function parseArticle(filename) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8')
    const { data, content } = matter(raw)

    const missing = REQUIRED.filter(key => !data[key])
    if (missing.length) {
        throw new Error(`articles/${filename}: missing frontmatter field(s): ${missing.join(', ')}`)
    }

    const date = toIsoDate(data.date, filename)
    return {
        slug: filename.replace(/\.md$/, ''),
        title: String(data.title),
        description: data.description ? String(data.description) : '',
        date,
        year: date.slice(0, 4),
        authors: toList(data.author).map(name => ({ name, slug: slugify(name) })),
        tags: toList(data.tags).map(name => ({ name, slug: slugify(name) })),
        issue: data.issue != null ? String(data.issue) : null,
        cover: resolveCover(data.cover, filename),
        web: data.web !== false,
        content,
    }
}

let cache = null

function loadAll() {
    // re-read on every request in dev so edits show up without a restart
    if (cache && process.env.NODE_ENV === 'production') return cache
    cache = fs.readdirSync(ARTICLES_DIR)
        .filter(file => file.endsWith('.md'))
        .map(parseArticle)
        .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    return cache
}

// only articles marked for the web; `web: false` articles stay print-only
export function getArticles() {
    return loadAll().filter(article => article.web)
}

export function getArticle(slug) {
    return getArticles().find(article => article.slug === slug) || null
}

// strips content so the list can be handed to client components cheaply
export function toSummary({ content, ...summary }) {
    return summary
}

function groupBy(articles, keysOf) {
    const groups = new Map()
    for (const article of articles) {
        for (const { name, slug } of keysOf(article)) {
            if (!groups.has(slug)) groups.set(slug, { name, slug, articles: [] })
            groups.get(slug).articles.push(article)
        }
    }
    return [...groups.values()]
}

export function getAuthors() {
    return groupBy(getArticles(), a => a.authors).sort((a, b) => a.name.localeCompare(b.name))
}

export function getTags() {
    return groupBy(getArticles(), a => a.tags).sort((a, b) => a.name.localeCompare(b.name))
}

export function getYears() {
    return groupBy(getArticles(), a => [{ name: a.year, slug: a.year }]).sort((a, b) => b.slug.localeCompare(a.slug))
}

export function getIssues() {
    return groupBy(getArticles(), a => (a.issue ? [{ name: a.issue, slug: slugify(a.issue) }] : []))
        .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }))
}

// rough markdown -> plain text, good enough for search matching
export function toPlainText(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[#>*_`~|-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}
