#!/usr/bin/env node
/**
 * artifact-to-pdf — render a Claude artifact (URL or exported .html) to a
 * single, continuous, pixel-accurate PDF with NO page breaks.
 *
 * An artifact is just HTML rendered by Chromium. We load it, measure its true
 * full content size, then emit ONE page of exactly that size — so the PDF reads
 * like the scrolling artifact you see in the viewer, with zero page cuts.
 *
 * A PDF page caps at 200in per side (ISO 32000 = 14400pt). Artifacts taller
 * than that are auto-scaled down proportionally so they still fit on one page.
 */
import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PX_PER_IN = 96;  // CSS reference: 96 px per inch
const MAX_IN = 200;    // ISO 32000: 200in hard cap per side (14400pt)
const MIN_SCALE = 0.1; // Playwright page.pdf() scale floor

/**
 * @param {string} input  http(s) URL or path to an exported .html file
 * @param {{out?:string,width?:number,deviceScaleFactor?:number}} [opts]
 */
export async function artifactToPdf(input, opts = {}) {
  const width = opts.width ?? 1200;
  const dsf = opts.deviceScaleFactor ?? 2;
  const out = opts.out ?? defaultOut(input);

  const isUrl = /^https?:\/\//i.test(input);
  if (!isUrl && !existsSync(input)) throw new Error(`Input file not found: ${input}`);
  const target = isUrl ? input : pathToFileURL(path.resolve(input)).href;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: dsf });
    await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 });
    await page.emulateMedia({ media: 'screen' }); // render the on-screen look, not @media print
    await autoScroll(page);                        // trigger lazy-loaded images/content
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
    await page.waitForTimeout(250);

    // True content size in CSS px.
    const { w, h } = await page.evaluate((minW) => {
      const de = document.documentElement;
      const b = document.body;
      return {
        w: Math.max(de.scrollWidth, b ? b.scrollWidth : 0, minW),
        h: Math.max(de.scrollHeight, b ? b.scrollHeight : 0, de.offsetHeight, b ? b.offsetHeight : 0),
      };
    }, width);

    // Playwright page size accepts px/in/cm/mm (not pt), so work in inches.
    let wIn = w / PX_PER_IN;
    let hIn = (h + 1) / PX_PER_IN; // +1px epsilon: never let a sub-pixel sliver spill to page 2

    // Auto-scale to fit the 200in cap while staying a single page.
    let scale = 1;
    const over = Math.max(wIn, hIn) / MAX_IN;
    if (over > 1) {
      scale = Math.max(MIN_SCALE, 1 / over);
      wIn *= scale;
      hIn *= scale;
    }
    // ponytail: only true if the artifact is so tall even MIN_SCALE can't fit it under 200in.
    const clipped = Math.max(wIn, hIn) > MAX_IN + 0.01;

    await page.pdf({
      path: out,
      printBackground: true,
      width: `${wIn}in`,
      height: `${hIn}in`,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      scale,
      pageRanges: '1', // belt-and-suspenders: emit only the single page
    });

    // Report sizes in PDF points (72pt/in), the standard PDF unit.
    return { out, contentPx: { w, h }, pagePt: { w: wIn * 72, h: hIn * 72 }, scale, clipped };
  } finally {
    await browser.close();
  }
}

// Scroll top-to-bottom so lazy images / on-scroll content actually load before we measure.
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 500;
      const timer = setInterval(() => {
        const max = (document.body || document.documentElement).scrollHeight;
        window.scrollBy(0, step);
        y += step;
        if (y >= max) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 40);
    });
  });
}

function defaultOut(input) {
  if (/^https?:\/\//i.test(input)) return 'artifact.pdf';
  return `${path.basename(input).replace(/\.[^.]+$/, '')}.pdf`;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const HELP = `artifact-to-pdf — one continuous, pixel-accurate PDF from a Claude artifact

Usage:
  artifact-to-pdf <url-or-html-file> [options]

Options:
  -o, --out <file>   output PDF path (default: <input>.pdf, or artifact.pdf for a URL)
      --width <px>   render width for responsive layouts (default: 1200)
      --dsf <n>      device scale factor / image sharpness (default: 2)
  -h, --help         show this help

Notes:
  - Emits ONE page sized to the artifact's full height — no page cuts.
  - PDF pages cap at 200in (ISO 32000); taller artifacts auto-scale to fit.
  - For a Claude artifact, feed the exported .html for best fidelity
    (a claude.ai page URL also captures the app chrome around the artifact).`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--out') args.out = argv[++i];
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--dsf' || a === '--device-scale-factor') args.deviceScaleFactor = Number(argv[++i]);
    else if (a === '-h' || a === '--help') args.help = true;
    else args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args._.length === 0) {
    console.log(HELP);
    process.exit(args.help ? 0 : 1);
  }
  try {
    const r = await artifactToPdf(args._[0], args);
    let msg = `✓ ${r.out} — 1 page, ${Math.round(r.pagePt.w)}×${Math.round(r.pagePt.h)}pt`
      + ` (content ${r.contentPx.w}×${r.contentPx.h}px)`;
    if (r.scale < 1) msg += `, scaled ${(r.scale * 100).toFixed(0)}% to fit the 200in cap`;
    console.log(msg);
    if (r.clipped) console.warn('⚠ artifact exceeds 200in even at min scale — may clip in some viewers');
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();
