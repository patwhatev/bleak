import Link from 'next/link'

// shared list view for /authors, /tags, /years, /issues
export default function GroupIndex({ title, groups, hrefBase, labelPrefix = '' }) {
    return (
        <main>
            <h1 className="pageTitle">{title}</h1>
            {groups.length ? (
                <ul className="groupIndex">
                    {groups.map(group => (
                        <li key={group.slug}>
                            <Link href={`${hrefBase}/${group.slug}/`}>{labelPrefix}{group.name}</Link>
                            <span className="small">{group.articles.length}</span>
                        </li>
                    ))}
                </ul>
            ) : <p className="empty">Nothing here yet.</p>}
        </main>
    )
}
