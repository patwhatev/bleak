import './globals.css'
import Header from '@/components/Header'

export const metadata = {
    title: {
        default: 'Bleak',
        template: '%s — Bleak',
    },
    description: 'Bleak magazine',
    // set SITE_URL in your host's env so social preview images resolve
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                {children}
                <footer className="siteFooter">
                    <span>Bleak</span>
                    <span>© {new Date().getFullYear()}</span>
                </footer>
            </body>
        </html>
    )
}
