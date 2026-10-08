import { getArticles, toPlainText } from '@/lib/articles'

// built once at export time; the home page fetches it lazily for full-text search
export const dynamic = 'force-static'

export function GET() {
    return Response.json(getArticles().map(article => ({
        slug: article.slug,
        text: toPlainText(article.content),
    })))
}
