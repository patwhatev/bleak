import Link from 'next/link'
import Markdown from 'markdown-to-jsx'
import { notFound } from 'next/navigation'
import Byline from '@/components/Byline'
import { getArticle, getArticles } from '@/lib/articles'

export const dynamicParams = false

export function generateStaticParams() {
    return getArticles().map(article => ({ slug: article.slug }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const article = getArticle(slug)
    if (!article) return {}
    return {
        title: article.title,
        description: article.description,
        openGraph: article.cover ? { images: [article.cover] } : undefined,
    }
}

export default async function ArticlePage({ params }) {
    const { slug } = await params
    const article = getArticle(slug)
    if (!article) notFound()

    return (
        <main>
            <article className="article">
                <header>
                    <h1>{article.title}</h1>
                    {article.description && <p className="dek">{article.description}</p>}
                    <Byline article={article} />
                </header>
                {article.cover && <img className="articleCover" src={article.cover} alt="" />}
                <div className="articleBody">
                    <Markdown options={{ forceBlock: true }}>{article.content}</Markdown>
                </div>
                {article.tags.length > 0 && (
                    <p className="tagList">
                        {article.tags.map(tag => (
                            <Link key={tag.slug} href={`/tag/${tag.slug}/`}>#{tag.name}</Link>
                        ))}
                    </p>
                )}
            </article>
        </main>
    )
}
