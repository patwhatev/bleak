import GroupIndex from '@/components/GroupIndex'
import { getAuthors } from '@/lib/articles'

export const metadata = { title: 'Authors' }

export default function Page() {
    return <GroupIndex title="Authors" groups={getAuthors()} hrefBase="/author" labelPrefix="" />
}
