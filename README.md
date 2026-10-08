# Bleak

Static Next.js 15 site for Bleak magazine. Articles are markdown files in `articles/`, with no database. `npm run build` exports plain HTML to `out/`, which can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

Requires Node 20+.

## Writing

```sh
npm run new        # prompts for title, authors, date, tags, issue, web y/n
npm run dev        # http://localhost:3000, hot reloads as you edit
```

`npm run new` creates `articles/YYYY-MM-DD-slug.md` and an image folder at `public/images/YYYY-MM-DD-slug/`. The filename (without `.md`) is the article's URL: `/article/YYYY-MM-DD-slug/`.

### Frontmatter

```yaml
---
title: "Notes on Concrete"              # required
author: ["Jane Doe", "John Roe"]        # required, one string or a list
date: 2026-09-14                        # required, YYYY-MM-DD
description: "the dek under the title"
tags: ["architecture", "editorial"]
issue: "1"                              # optional, groups articles under /issue/1/
cover: "/images/2026-09-14-notes-on-concrete/cover.jpg"   # card + header image
web: true                               # false = print-only, never built into the site
---
```

A missing required field or an unreadable date fails the build with the filename in the error. A local `cover` that doesn't exist yet is skipped with a warning.

### Images

Put images in the article's folder under `public/images/` and reference them with an absolute path:

```md
![caption](/images/2026-09-14-notes-on-concrete/photo.jpg)
```

External image URLs work too.

## Pages

| URL | What |
| --- | --- |
| `/` | every web article, newest first, with search (`/?q=term` links work) |
| `/article/<slug>/` | the article |
| `/authors/`, `/author/<name>/` | author index and pages |
| `/tags/`, `/tag/<tag>/` | tag index and pages |
| `/years/`, `/year/<yyyy>/` | year index and pages |
| `/issues/`, `/issue/<n>/` | issue index and pages |
| `/about/` | edit in `app/about/page.js` |

Search filters titles, descriptions, authors, tags, year and issue right away, and pulls in full article text from `/search-index.json` (generated at build) on the first search.

## Deploying

```sh
npm run build      # writes out/
npm run preview    # serve out/ locally to check the real build
npm run deploy     # build, commit, push, then `vercel --prod` if the CLI is installed
```

Set `SITE_URL` (e.g. `https://bleak.example`) in the host's environment so social preview images get absolute URLs.

## Layout

```
articles/            markdown articles
public/images/       article images, one folder per article
app/                 routes (Next app router)
components/          shared UI
lib/articles.js      reads + validates articles, builds author/tag/year/issue groups
lib/format.js        slugify + date formatting (safe for client components)
scripts/             new-article.js, deploy.sh
```
