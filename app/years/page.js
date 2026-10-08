import GroupIndex from '@/components/GroupIndex'
import { getYears } from '@/lib/articles'

export const metadata = { title: 'Years' }

export default function Page() {
    return <GroupIndex title="Years" groups={getYears()} hrefBase="/year" labelPrefix="" />
}
