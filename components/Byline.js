import Link from 'next/link'
import { formatDate, slugify } from '@/lib/format'

export default function Byline({ article, linkDate = true }) {
    return (
        <p className="byline">
            {article.authors.map((author, i) => (
                <span key={author.slug}>
                    {i > 0 && (i === article.authors.length - 1 ? ' & ' : ', ')}
                    <Link href={`/author/${author.slug}/`}>{author.name}</Link>
                </span>
            ))}
            <span className="sep">/</span>
            {linkDate
                ? <Link href={`/year/${article.year}/`}>{formatDate(article.date)}</Link>
                : formatDate(article.date)}
            {article.issue && (
                <>
                    <span className="sep">/</span>
                    <Link href={`/issue/${slugify(article.issue)}/`}>Issue {article.issue}</Link>
                </>
            )}
        </p>
    )
}
