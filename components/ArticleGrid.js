import ArticleCard from './ArticleCard'

export default function ArticleGrid({ articles }) {
    if (!articles.length) return <p className="empty">Nothing here.</p>
    return (
        <div className="articleGrid">
            {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
        </div>
    )
}
