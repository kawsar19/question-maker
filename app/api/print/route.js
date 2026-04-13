import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Launch a browser — uses bundled puppeteer in local dev, and the lightweight
 * @sparticuz/chromium binary on Vercel / other serverless platforms.
 */
async function launchBrowser() {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const puppeteer = (await import("puppeteer")).default;
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all(
    [import("@sparticuz/chromium"), import("puppeteer-core")],
  );
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

function escapeHtml(s) {
  return String(s).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function buildHtmlDoc({ bodyHtml, title, fontDataUrl, layout }) {
  const isDuplicate = layout === "duplicate-2up";
  const layoutBody = isDuplicate
    ? `<div class="sheet sheet-2up">
         <div class="half"><div class="content">${bodyHtml}</div></div>
         <div class="half"><div class="content">${bodyHtml}</div></div>
       </div>`
    : bodyHtml;

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
@font-face {
  font-family: 'Kalpurush';
  src: url('${fontDataUrl}') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

@counter-style bn-digits {
  system: numeric;
  symbols: "\\09E6" "\\09E7" "\\09E8" "\\09E9" "\\09EA" "\\09EB" "\\09EC" "\\09ED" "\\09EE" "\\09EF";
  suffix: "। ";
}

@counter-style bn-letters {
  system: alphabetic;
  symbols: "\\0995" "\\0996" "\\0997" "\\0998" "\\0999" "\\099A" "\\099B" "\\099C" "\\099D" "\\099E"
           "\\099F" "\\09A0" "\\09A1" "\\09A2" "\\09A3" "\\09A4" "\\09A5" "\\09A6" "\\09A7" "\\09A8"
           "\\09AA" "\\09AB" "\\09AC" "\\09AD" "\\09AE" "\\09AF" "\\09B0" "\\09B2" "\\09B6" "\\09B7"
           "\\09B8" "\\09B9";
  suffix: ") ";
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  color: #000;
  background: #fff;
}

body {
  font-family: 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif;
  font-size: 13pt;
  line-height: 1.7;
  padding: 0;
}

h1, h2, h3 { font-weight: 700; page-break-after: avoid; }
h1 { font-size: 20pt; margin: 14pt 0 8pt; }
h2 { font-size: 16pt; margin: 12pt 0 6pt; }
h3 { font-size: 14pt; margin: 10pt 0 6pt; }

p { margin: 6pt 0; }

em { font-style: italic; }
strong { font-weight: 700; }

blockquote {
  border-left: 2.5pt solid #555;
  padding: 4pt 12pt;
  margin: 8pt 0;
  background: #f5f5f5;
  page-break-inside: avoid;
}

hr {
  border: none;
  border-top: 1pt solid #000;
  margin: 14pt 0;
}

ul {
  list-style: disc;
  padding-left: 20pt;
  margin: 6pt 0;
}

/* Default <ol> — browser decimal */
ol {
  list-style: decimal;
  padding-left: 20pt;
  margin: 6pt 0;
}

/* Bangla digit list: ১। ২। ৩। */
ol.bn-digits-list,
ol.bangla-list {
  list-style: none !important;
  counter-reset: bn-li;
  padding-left: 32pt;
  margin: 6pt 0;
}

ol.bn-digits-list > li,
ol.bangla-list > li {
  counter-increment: bn-li;
  position: relative;
  margin: 5pt 0;
}

ol.bn-digits-list > li::before,
ol.bangla-list > li::before {
  content: counter(bn-li, bn-digits) "। ";
  font-weight: 700;
  position: absolute;
  left: -28pt;
  top: 0;
  min-width: 24pt;
  text-align: right;
  padding-right: 3pt;
}

/* Bangla letter list: ক) খ) গ) ঘ) */
ol.bn-letters-list {
  list-style: none !important;
  counter-reset: bn-letter;
  padding-left: 28pt;
  margin: 4pt 0;
}

ol.bn-letters-list > li {
  counter-increment: bn-letter;
  position: relative;
  margin: 3pt 0;
}

ol.bn-letters-list > li::before {
  content: counter(bn-letter, bn-letters) ") ";
  font-weight: 700;
  position: absolute;
  left: -24pt;
  top: 0;
  min-width: 20pt;
  text-align: right;
  padding-right: 3pt;
}

li > p { margin: 2pt 0; }
li > p:first-child,
ol.bn-digits-list > li > p:first-child,
ol.bn-letters-list > li > p:first-child,
ol.bangla-list > li > p:first-child { margin-top: 0; }

a { color: #1e40af; text-decoration: underline; }

code {
  font-family: ui-monospace, Menlo, monospace;
  background: #f0f0f0;
  border-radius: 2pt;
  padding: 1pt 4pt;
  font-size: 0.9em;
}

pre {
  background: #1e1e1e;
  color: #f0f0f0;
  border-radius: 3pt;
  padding: 8pt;
  overflow-x: auto;
  page-break-inside: avoid;
}

/* Question-paper tables */
table,
table.q-table {
  border-collapse: collapse;
  margin: 6pt 0;
  page-break-inside: avoid;
}

table td,
table th {
  border: 1pt solid #000;
  padding: 4pt 8pt;
  min-width: 22pt;
  text-align: center;
  vertical-align: middle;
}

table th {
  background: #e5e7eb;
  font-weight: 700;
}

table p {
  margin: 0;
}

/* Avoid orphan question parts splitting across pages */
ol > li { page-break-inside: avoid; }
blockquote { page-break-inside: avoid; }

/* 2-up duplicate layout (landscape A4, two identical halves side-by-side) */
.sheet-2up {
  display: flex;
  gap: 0;
  width: 100%;
  position: relative;
}
.sheet-2up .half {
  flex: 1 1 0;
  min-width: 0;
  padding: 4mm 6mm;
  overflow: hidden;
}
.sheet-2up .half + .half {
  border-left: 1pt dashed #888;
}
.sheet-2up .content {
  font-size: 11pt;
  line-height: 1.55;
}
.sheet-2up .content h1 { font-size: 15pt; margin: 6pt 0 4pt; }
.sheet-2up .content h2 { font-size: 13pt; margin: 6pt 0 4pt; }
.sheet-2up .content h3 { font-size: 12pt; margin: 4pt 0 3pt; }
.sheet-2up .content p { margin: 3pt 0; }
.sheet-2up .content blockquote { margin: 4pt 0; padding: 3pt 8pt; }
.sheet-2up .content ol.bn-digits-list,
.sheet-2up .content ol.bangla-list {
  padding-left: 22pt;
}
.sheet-2up .content ol.bn-digits-list > li::before,
.sheet-2up .content ol.bangla-list > li::before {
  left: -22pt;
  min-width: 18pt;
}
.sheet-2up .content ol.bn-letters-list {
  padding-left: 20pt;
}
.sheet-2up .content ol.bn-letters-list > li::before {
  left: -20pt;
  min-width: 16pt;
}
</style>
</head>
<body>
${layoutBody}
</body>
</html>`;
}

let _fontCache = null;
function getFontDataUrl() {
  if (_fontCache) return _fontCache;
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "kalpurush.ttf",
  );
  const base64 = readFileSync(fontPath).toString("base64");
  _fontCache = `data:font/ttf;base64,${base64}`;
  return _fontCache;
}

export async function POST(request) {
  let browser;
  try {
    const {
      html,
      title = "প্রশ্নপত্র",
      layout = "single",
    } = await request.json();
    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Missing 'html'" }, { status: 400 });
    }

    const isDuplicate = layout === "duplicate-2up";
    const fontDataUrl = getFontDataUrl();
    const fullHtml = buildHtmlDoc({
      bodyHtml: html,
      title,
      fontDataUrl,
      layout,
    });

    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    const pdf = await page.pdf({
      format: "A4",
      landscape: isDuplicate,
      printBackground: true,
      margin: isDuplicate
        ? { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" }
        : { top: "18mm", right: "15mm", bottom: "18mm", left: "15mm" },
      displayHeaderFooter: !isDuplicate,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="width:100%;font-size:9pt;color:#555;padding:0 15mm;display:flex;justify-content:space-between;font-family:sans-serif;">
          <span>${escapeHtml(title)}</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
    });

    const safeFilename = `${title.replace(/[^\w\u0980-\u09FF\- ]+/g, "").trim() || "question-paper"}.pdf`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/print] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "PDF generation failed" },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
