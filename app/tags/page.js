import GroupIndex from '@/components/GroupIndex'
import { getTags } from '@/lib/articles'

export const metadata = { title: 'Tags' }

export default function Page() {
    return <GroupIndex title="Tags" groups={getTags()} hrefBase="/tag" labelPrefix="#" />
}
