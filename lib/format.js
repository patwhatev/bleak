// no node imports here: this file is shared with client components

export function slugify(value) {
    return String(value)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')
}

export function formatDate(isoDate) {
    return new Date(isoDate + 'T00:00:00Z').toLocaleDateString('en-US', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}
