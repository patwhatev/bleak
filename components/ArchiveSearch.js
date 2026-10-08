'use client'
import { useEffect, useMemo, useState } from 'react'
import ArticleGrid from './ArticleGrid'

function metaText(article) {
    return [
        article.title,
        article.description,
        article.year,
        article.issue && `issue ${article.issue}`,
        ...article.authors.map(a => a.name),
        ...article.tags.map(t => t.name),
    ].filter(Boolean).join(' ').toLowerCase()
}

export default function ArchiveSearch({ articles }) {
    const [query, setQuery] = useState('')
    const [bodies, setBodies] = useState(null)

    // keep the query in the url so searches can be linked
    useEffect(() => {
        const q = new URLSearchParams(window.location.search).get('q')
        if (q) setQuery(q)
    }, [])

    useEffect(() => {
        const url = new URL(window.location.href)
        if (query) url.searchParams.set('q', query)
        else url.searchParams.delete('q')
        window.history.replaceState(null, '', url)
    }, [query])

    // full text is only fetched once someone actually searches
    useEffect(() => {
        if (!query || bodies) return
        fetch('/search-index.json')
            .then(res => res.json())
            .then(index => setBodies(Object.fromEntries(index.map(e => [e.slug, e.text.toLowerCase()]))))
            .catch(() => setBodies({}))
    }, [query, bodies])

    const results = useMemo(() => {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
        if (!terms.length) return articles
        return articles.filter(article => {
            const haystack = metaText(article) + ' ' + (bodies?.[article.slug] || '')
            return terms.every(term => haystack.includes(term))
        })
    }, [articles, query, bodies])

    return (
        <>
            <div className="searchBar">
                <input
                    type="search"
                    placeholder="Search titles, authors, tags, text…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    aria-label="Search articles"
                />
                <span className="small">{results.length} / {articles.length}</span>
            </div>
            <ArticleGrid articles={results} />
        </>
    )
}
