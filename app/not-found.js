import Link from 'next/link'

export default function NotFound() {
    return (
        <main>
            <h1 className="pageTitle">Nothing here.</h1>
            <p><Link href="/">Back to the index</Link></p>
        </main>
    )
}
