# Akif Mustafa — personal website

A minimal Quarto website for biostatistics articles and a captioned photo gallery.

## Open in RStudio

Open `Akif-Mustafa.Rproj`. Install Quarto if it is not already available in your RStudio installation. The current `dist/` folder is a ready-to-publish website. The first version uses the supplied, already-rendered RMST article, so its figures and numerical results are preserved.

The editable RMST source was recovered from its HTML. R and Quarto were unavailable in the creation environment, so the recovered R code has **not** been re-executed here. Its original publication date, 1 June 2026, is fixed in the source.

Before the first local render, install the article's R dependencies in the R console:

```r
install.packages(c("survival", "survminer", "ggplot2", "survRM2", "dplyr", "patchwork", "knitr", "kableExtra"))
```

Python 3 is needed for the small post-render search-index script. On Windows, if your installation exposes `python` rather than `python3`, change that command in `_quarto.yml`.

In the RStudio Terminal:

```sh
quarto preview
quarto render
```

Render the whole website before publishing. The post-render hook updates navigation and search for the generated pages. Quarto's `freeze: auto` avoids re-running unchanged article computations on subsequent project renders. Commit `_freeze/` if created, as well as the rendered `dist/` folder.

## Edit the pages

- `index.qmd`: introduction and featured article.
- `blog.qmd`: article listing. Quarto includes new `posts/*/index.qmd` files automatically.
- `gallery.qmd`: photographs and captions.
- `assets/site.css`: typography, spacing and colours.
- `_includes/header.html` and `_includes/footer.html`: navigation and profile links.

The homepage uses your exact edited introduction. The gallery intentionally contains no sample or stock photographs.

## Add an article

Create `posts/your-article/index.qmd` with this starting point:

```yaml
---
title: "Your article title"
author: "Akif Mustafa"
date: 2026-09-11
categories: [Clinical trials, R]
description: "A short description for the blog listing."
format:
  html:
    toc: true
    toc-location: left
    code-fold: true
---
```

Write your article below the metadata and keep its images/data alongside it. Use the actual intended publication date. Render the site, then commit and push the source and `dist/` together. If introducing a new category, add its filter button in `blog.qmd`; existing topic filters are All, Survival analysis, Clinical trials and R. Update `index.qmd`'s listing `contents` to change the featured article.

## Add photographs

Place resized photographs under `assets/gallery/`. Replace the empty-gallery block inside `gallery.qmd` with your figures, for example:

```html
<div class="gallery-grid">
  <figure>
    <img src="assets/gallery/your-photo.jpg" alt="A descriptive account of what is in the photograph" loading="lazy">
    <figcaption>Your caption.</figcaption>
  </figure>
</div>
```

Use your own photo filename and descriptive alt text. The layout uses two columns on larger screens and one on mobile.

## Publish on GitHub Pages

1. Create a repository. For a root personal website, name it `akifiips.github.io`; a project repository also works.
2. Upload/push this project to its `main` branch. Keep `dist/` and `.github/workflows/publish.yml` included. The Sites-specific `.openai/` folder can be omitted from your separate GitHub copy.
3. In the repository, select **Settings → Pages → Source → GitHub Actions**.
4. Run the **Publish website to GitHub Pages** workflow, or push a change to `main`.

The workflow deploys the already-rendered `dist/` folder. It deliberately does not install R packages or rerun analyses on GitHub. After writing, run `quarto render` locally and push the updated `dist/` with your source. Relative links support either a username website or a project subdirectory.

No comments, newsletter, analytics, or photo-upload service is included.

## Multi-crossover article

The editable source is `posts/multicross-design/index.qmd`; its supplied rendered HTML is integrated at `dist/posts/multicross-design/index.html`, with shared navigation, a collapsible table of contents, and site search. Figures and computed results are preserved from the supplied HTML, without rerunning R. The publication date is fixed at 11 September 2026.

The GitHub Actions workflow publishes `dist/` without rendering Quarto. Uploading a `.qmd` alone will not update the live site. After future edits, render the whole site locally and commit both the source and updated `dist/`, including the blog listing and search index. The MultiCross source additionally requires the R package `scales`.
