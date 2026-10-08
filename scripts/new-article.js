#!/usr/bin/env node

const readline = require('readline')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const rl = readline.createInterface({ input: process.stdin })
// iterate lines instead of rl.question so piped input works too
const lines = rl[Symbol.asyncIterator]()

async function prompt(question, fallback = '') {
    const hint = fallback ? ` (${fallback})` : ''
    process.stdout.write(`${question}${hint}: `)
    const { value, done } = await lines.next()
    if (done) process.stdout.write('\n')
    return (done ? '' : value.trim()) || fallback
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')
}

function fail(message) {
    console.log(`❌ ${message}`)
    process.exit(1)
}

// yaml-safe double-quoted string
const q = value => JSON.stringify(value)

async function createArticle() {
    console.log('📝 New Bleak article\n')

    const title = await prompt('Title')
    if (!title) fail('Title is required')

    const author = await prompt('Author(s), comma separated')
    if (!author) fail('Author is required')

    const today = new Date().toISOString().slice(0, 10)
    const date = await prompt('Date YYYY-MM-DD', today)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date))) fail('Date must be YYYY-MM-DD')

    const description = await prompt('Description / dek')
    const tags = await prompt('Tags, comma separated')
    const issue = await prompt('Issue number (blank for none)')
    const web = (await prompt('Publish on web? y/n', 'y')).toLowerCase().startsWith('y')
    rl.close()

    const slug = `${date}-${slugify(title)}`
    const file = path.join(ROOT, 'articles', `${slug}.md`)
    if (fs.existsSync(file)) fail(`Article already exists: articles/${slug}.md`)

    const imageDir = path.join(ROOT, 'public', 'images', slug)
    fs.mkdirSync(imageDir, { recursive: true })

    const list = value => `[${value.split(',').map(s => s.trim()).filter(Boolean).map(q).join(', ')}]`
    const authors = author.split(',').map(s => s.trim()).filter(Boolean)

    const lines = [
        '---',
        `title: ${q(title)}`,
        `author: ${authors.length > 1 ? list(author) : q(authors[0])}`,
        `date: ${date}`,
        `description: ${q(description)}`,
        `tags: ${list(tags)}`,
        issue ? `issue: ${q(issue)}` : null,
        `cover: ${q(`/images/${slug}/cover.jpg`)}`,
        `web: ${web}`,
        '---',
        '',
        'Start writing here.',
        '',
        `![](/images/${slug}/photo.jpg)`,
        '',
    ]
    fs.writeFileSync(file, lines.filter(line => line !== null).join('\n'))

    console.log('\n✅ Article created')
    console.log(`📄 articles/${slug}.md`)
    console.log(`🖼  drop images in public/images/${slug}/ (cover.jpg is the card image)`)
}

createArticle().catch(error => {
    console.error('❌ Error creating article:', error)
    process.exit(1)
})
