import GroupIndex from '@/components/GroupIndex'
import { getIssues } from '@/lib/articles'

export const metadata = { title: 'Issues' }

export default function Page() {
    return <GroupIndex title="Issues" groups={getIssues()} hrefBase="/issue" labelPrefix="Issue " />
}
