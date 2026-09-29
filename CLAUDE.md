# arnaudbletterer.github.io

Personal site and portfolio, built with Jekyll (kramdown) and deployed to GitHub Pages. Global rules (git, writing, engineering) come from `~/.claude/CLAUDE.md`; this file only adds what is specific to this repo.

## Map
- `_posts/`: blog articles. Use the `blog-article-writer` skill for anything that drafts or edits a post.
- `_layouts/`: `page.html` (articles, with Mermaid theming, TOC, reading progress), `home.html`, `cv.html`, `visualizer.html`, `general_visualizer.html`.
- `_includes/`: shared style partials (`theme_tokens.html`, `card_styles.html`, `toc_styles.html`, `footer.html`). Reuse the theme tokens rather than hard-coding colors.
- `articles.html`: article index; cards, tag pills and search are driven by each post's `title`, `description` and `highlights` frontmatter.
- `resume.md`: CV. CI prints it to `media/arnaud-bletterer-cv.pdf` with headless Chrome, so keep its print stylesheet working (2-page layout).
- `projects/`: interactive research demos (bilateral filter, normal estimation, partial Voronoi).
- `sitemap.xml`, `feed.xml`: Liquid-generated, no manual edits needed when adding posts.

## Repo specifics
- Pushing `main` deploys (`.github/workflows/jekyll-gh-pages.yml`).
- Two remotes, `origin` and `github`; `main` is pushed to both.
- Local build/preview (no Gemfile, so no `bundle exec`): `/opt/homebrew/lib/ruby/gems/4.0.0/bin/jekyll build` or `... serve`, then check `http://localhost:4000`.
- Branches: `draft/<slug>` for articles, `<type>/<slug>` otherwise.
