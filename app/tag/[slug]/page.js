import ArticleGrid from '@/components/ArticleGrid'
import { getTags } from '@/lib/articles'

export const dynamicParams = false

export function generateStaticParams() {
    return getTags().map(group => ({ slug: group.slug }))
}

function findGroup(slug) {
    return getTags().find(group => group.slug === slug)
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    return { title: `#${findGroup(slug).name}` }
}

export default async function Page({ params }) {
    const { slug } = await params
    const group = findGroup(slug)
    return (
        <main>
            <h1 className="pageTitle">#{group.name}</h1>
            <ArticleGrid articles={group.articles} />
        </main>
    )
}
