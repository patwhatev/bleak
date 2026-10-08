import ArchiveSearch from '@/components/ArchiveSearch'
import { getArticles, toSummary } from '@/lib/articles'

export default function Home() {
    const articles = getArticles().map(toSummary)
    return (
        <main>
            <ArchiveSearch articles={articles} />
        </main>
    )
}
