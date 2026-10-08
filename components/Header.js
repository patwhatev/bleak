import Link from 'next/link'

const NAV = [
    { href: '/', label: 'Index' },
    { href: '/issues/', label: 'Issues' },
    { href: '/authors/', label: 'Authors' },
    { href: '/tags/', label: 'Tags' },
    { href: '/years/', label: 'Years' },
    { href: '/about/', label: 'About' },
]

export default function Header() {
    return (
        <header className="siteHeader">
            <Link href="/" className="wordmark">Bleak</Link>
            <nav>
                {NAV.map(item => (
                    <Link key={item.href} href={item.href}>{item.label}</Link>
                ))}
            </nav>
        </header>
    )
}
