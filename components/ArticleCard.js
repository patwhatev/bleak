import Link from 'next/link'
import { formatDate } from '@/lib/format'

export default function ArticleCard({ article }) {
    return (
        <Link href={`/article/${article.slug}/`} className="articleCard">
            <div className="cover">
                {article.cover
                    ? <img src={article.cover} alt="" loading="lazy" />
                    : <span>{article.title}</span>}
            </div>
            <div className="meta">
                <h3>{article.title}</h3>
                {article.description && <p className="dek">{article.description}</p>}
                <p className="small">
                    {article.authors.map(a => a.name).join(', ')} — {formatDate(article.date)}
                </p>
            </div>
        </Link>
    )
}
