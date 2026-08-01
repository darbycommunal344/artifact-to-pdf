/**
 * Self-check: prove the core promise — ONE page, sized to the content, no cuts.
 * Renders a 4000px-tall sample and asserts the PDF is a single long page.
 */
import { artifactToPdf } from '../artifact-to-pdf.mjs';
import { PDFDocument } from 'pdf-lib';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sample = path.join(dir, 'sample.html');
const out = path.join(dir, 'sample.pdf');

const r = await artifactToPdf(sample, { out, width: 800 });

assert.ok(existsSync(out), 'PDF file was created');

const pdf = await PDFDocument.load(readFileSync(out));
assert.equal(pdf.getPageCount(), 1, `expected exactly 1 page, got ${pdf.getPageCount()}`);

const { width, height } = pdf.getPage(0).getSize();
// A normal A4 page is 842pt tall; a "long scroll" of 20x200px must be far taller.
assert.ok(height > 2000, `expected a tall single page, got ${Math.round(height)}pt`);
assert.ok(Math.abs(width - r.pagePt.w) < 2, 'page width matches computed size');
assert.ok(Math.abs(height - r.pagePt.h) < 2, 'page height matches computed size');

rmSync(out, { force: true });
console.log(`selfcheck OK — 1 page, ${Math.round(width)}x${Math.round(height)}pt (content ${r.contentPx.w}x${r.contentPx.h}px)`);
