import ArticleGrid from '@/components/ArticleGrid'
import { getYears } from '@/lib/articles'

export const dynamicParams = false

export function generateStaticParams() {
    return getYears().map(group => ({ year: group.slug }))
}

function findGroup(slug) {
    return getYears().find(group => group.slug === slug)
}

export async function generateMetadata({ params }) {
    const { year } = await params
    return { title: `${findGroup(year).name}` }
}

export default async function Page({ params }) {
    const { year } = await params
    const group = findGroup(year)
    return (
        <main>
            <h1 className="pageTitle">{group.name}</h1>
            <ArticleGrid articles={group.articles} />
        </main>
    )
}
