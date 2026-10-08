import ArticleGrid from '@/components/ArticleGrid'
import { getIssues } from '@/lib/articles'

export const dynamicParams = false

export function generateStaticParams() {
    return getIssues().map(group => ({ issue: group.slug }))
}

function findGroup(slug) {
    return getIssues().find(group => group.slug === slug)
}

export async function generateMetadata({ params }) {
    const { issue } = await params
    return { title: `Issue ${findGroup(issue).name}` }
}

export default async function Page({ params }) {
    const { issue } = await params
    const group = findGroup(issue)
    return (
        <main>
            <h1 className="pageTitle">Issue {group.name}</h1>
            <ArticleGrid articles={group.articles} />
        </main>
    )
}
