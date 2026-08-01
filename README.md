# artifact-to-pdf

Render a **Claude artifact** (or any web page / exported HTML) into a **single, continuous, pixel-accurate PDF** — one long page sized to the whole artifact, **no page cuts**.

A Claude artifact is just HTML/CSS/JS rendered by Chromium. This tool loads it in headless Chromium, measures the true full content size, and emits **one page of exactly that size**. Because it's the same engine that renders the artifact in your browser, the PDF looks like what you see in the viewer — just as one uninterrupted scroll.

## Why one page (no page cuts)

Normal HTML→PDF tools slice your content into A4/Letter pages. An artifact isn't a paginated document — it's a scroll. So instead of paginating, `artifact-to-pdf` sets the PDF's single page height to the artifact's full height. You get the scroll, frozen into a PDF.

## Install

```bash
git clone https://github.com/yheshamx/artifact-to-pdf.git
cd artifact-to-pdf
npm install        # also downloads a bundled Chromium (~120MB) via Playwright
```

## Usage

```bash
# from an exported .html file (best fidelity for a Claude artifact)
node artifact-to-pdf.mjs ./my-artifact.html -o my-artifact.pdf

# from any URL
node artifact-to-pdf.mjs https://example.com -o page.pdf

# control render width (for responsive layouts) and image sharpness
node artifact-to-pdf.mjs ./my-artifact.html --width 1440 --dsf 2
```

Or install it as a command:

```bash
npm link
artifact-to-pdf ./my-artifact.html -o out.pdf
```

### Options

| Flag | Default | Meaning |
|------|---------|---------|
| `-o, --out <file>` | `<input>.pdf` | output path |
| `--width <px>` | `1200` | render width — set this to the artifact's design width so responsive layouts don't reflow |
| `--dsf <n>` | `2` | device scale factor; higher = sharper raster images, larger file |

## Getting the artifact's HTML

For the sharpest result, feed the artifact's **own** HTML rather than a `claude.ai` page URL (which also captures the app UI around the artifact):

- In the artifact view, use the **⋯ / Copy** or download option to export the HTML, save it as `my-artifact.html`, and point the tool at it, **or**
- If the artifact is **published** to a standalone URL, pass that URL directly.

## The one limit: 200 inches

The PDF standard ([ISO 32000](https://en.wikipedia.org/wiki/PDF)) caps a single page at **14,400pt = 200 inches (~19,200px)** per side. Beyond that, PDF viewers may show a blank or truncated page.

- Artifact up to **~19,200px tall** → a flawless single page. (The large majority of artifacts.)
- Taller than that → the whole thing is **auto-scaled down proportionally** so it still fits on one page. Nothing is cut; content just gets a little smaller. The CLI prints the scale it used.
- Absurdly tall (won't fit even at min scale) → it warns you it may clip in strict viewers.

## How it works

1. Load the target in headless Chromium (Playwright).
2. `emulateMedia('screen')` so it uses the on-screen styles you see, not hidden `@media print` rules.
3. Auto-scroll top-to-bottom to trigger lazy-loaded images/content, and wait for web fonts.
4. Measure the full `scrollWidth` / `scrollHeight`.
5. `page.pdf()` with the page sized to that content, `printBackground: true`, zero margins, and a single-page range — auto-scaling if it exceeds 200in.

## Test

```bash
npm test   # renders a 4000px sample and asserts the PDF is ONE tall page
```

## License

MIT © Youssef Hesham
