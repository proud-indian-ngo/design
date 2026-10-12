/**
 * Render the marketing kit (marketing/src/items.ts) to marketing/out/:
 *   bun run marketing:render
 * - screen pieces to PNG or JPG at their real size, print pieces to PDF (trim + bleed, RGB, fonts embedded);
 * - a preview JPG per piece (what the website's /brand/ page shows);
 * - the editable files: the slide template and the card and badge as PPTX, the letterhead and certificate as DOCX,
 *   and the email signature as HTML;
 * - out/manifest.json, which the website reads to list everything.
 * Serves the repo on a throwaway local port, so the templates load the real fonts, logo files and doodles.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  TextRun,
  VerticalPositionRelativeFrom,
} from "docx";
import { chromium, type Page } from "playwright";
import PptxGenJS from "pptxgenjs";
import QRCode from "qrcode";
import sharp from "sharp";

import { color } from "../tokens/primitives";
import { facts as f } from "./src/facts";
import { GROUPS, type Output, type Piece, pieces } from "./src/items";
import { QR_URLS, setQr } from "./src/templates";

const ROOT = join(import.meta.dir, "..");
const OUT = join(import.meta.dir, "out");
const BUILD = join(import.meta.dir, ".build");
const PX_PER_MM = 96 / 25.4;
const PRINT_DPI = 300;
const PREVIEW = 900;
const hex = (c: string) => c.slice(1).toUpperCase();
const version = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
  .version as string;

// ---- QR codes, in ink on a transparent ground
for (const url of QR_URLS) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: color.ink, light: "#0000" },
  });
  setQr(url, svg);
}

// ---- a local server: the repo's files, plus each artboard's page at /__page/<file>
const TYPES: Record<string, string> = {
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};
const pages = new Map<string, string>();
const server = Bun.serve({
  port: 0,
  fetch(req) {
    const path = decodeURIComponent(new URL(req.url).pathname);
    if (path.startsWith("/__page/")) {
      const html = pages.get(path.slice(8));
      return html
        ? new Response(html, { headers: { "content-type": "text/html" } })
        : new Response("", { status: 404 });
    }
    const file = join(ROOT, path);
    if (!file.startsWith(ROOT)) return new Response("", { status: 403 });
    const body = Bun.file(file);
    return new Response(body, {
      headers: {
        "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      },
    });
  },
});
const origin = `http://127.0.0.1:${server.port}`;

/** the colours and font stacks, which live in the Tailwind theme (theme.css) rather than tokens.css */
const kebab = (k: string) =>
  k
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase();
const ROOT_VARS = `:root{${Object.entries(color)
  .map(([k, v]) => `--color-${kebab(k)}:${v};`)
  .join(
    ""
  )}--font-pi-display:Brico,system-ui,sans-serif;--font-pi-sans:Geist,system-ui,sans-serif}`;

const page = (o: Output, extra = "") => {
  const zoom = o.screen?.zoom ?? o.print?.zoom ?? 1;
  const print = o.print
    ? `@page{size:${o.print.w + 2 * o.print.bleed}mm ${o.print.h + 2 * o.print.bleed}mm;margin:0}`
    : "";
  const ground = o.print?.transparent
    ? "html,body{background:transparent}"
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/marketing/src/kit.css">
<style>${ROOT_VARS}${print}${ground}body{margin:0}.stage{zoom:${zoom};width:max-content}${extra}</style></head>
<body><div class="stage">${o.html()}</div></body></html>`;
};

const browser = await chromium.launch();
const errors: string[] = [];

async function open(o: Output, scale: number, extra = ""): Promise<Page> {
  const key = `${o.file}-${scale}-${extra.length}`;
  pages.set(key, page(o, extra));
  const p = await browser.newPage({
    viewport: { width: 4000, height: 3000 },
    deviceScaleFactor: scale,
  });
  p.on("requestfailed", (r) => errors.push(`${o.file}: failed ${r.url()}`));
  p.on(
    "response",
    (r) =>
      r.status() >= 400 && errors.push(`${o.file}: ${r.status()} ${r.url()}`)
  );
  await p.goto(`${origin}/__page/${encodeURIComponent(key)}`, {
    waitUntil: "networkidle",
  });
  await p.evaluate(() => document.fonts.ready);
  const failed = await p.evaluate(() =>
    [...document.fonts].filter((x) => x.status === "error").map((x) => x.family)
  );
  if (failed.length)
    errors.push(`${o.file}: fonts failed to load: ${failed.join(", ")}`);
  return p;
}

const art = (p: Page) => p.locator(".stage > .art");

/** a print piece's trim box in CSS px (the bleed cropped off), for previews */
const trimClip = async (p: Page, o: Output) => {
  const box = (await art(p).boundingBox())!;
  const b = o.print!.bleed * PX_PER_MM * (o.print!.zoom ?? 1);
  return {
    x: box.x + b,
    y: box.y + b,
    width: box.width - 2 * b,
    height: box.height - 2 * b,
  };
};

async function renderScreen(o: Output, dest: string) {
  const s = o.screen!;
  const p = await open(o, 1);
  const buf = await art(p).screenshot({
    type: s.format === "jpg" ? "jpeg" : "png",
    quality: s.format === "jpg" ? 90 : undefined,
  });
  const meta = await sharp(buf).metadata();
  if ((s.w && meta.width !== s.w) || meta.height !== s.h)
    errors.push(
      `${o.file}: rendered ${meta.width} × ${meta.height}, expected ${s.w || "any"} × ${s.h}`
    );
  writeFileSync(dest, buf);
  await p.close();
  return buf;
}

/** a print piece: its PDF, a 300 dpi PNG (for the editables), and a preview of the trim area */
async function renderPrint(o: Output, dest: string) {
  const pr = o.print!;
  const W = pr.w + 2 * pr.bleed;
  const H = pr.h + 2 * pr.bleed;
  const big =
    Math.max(W, H) * PX_PER_MM * (pr.zoom ?? 1) * (PRINT_DPI / 96) > 16000;
  if (dest.endsWith(".pdf")) {
    const p = await open(o, 1);
    await p.pdf({
      path: dest,
      width: `${W}mm`,
      height: `${H}mm`,
      printBackground: true,
      pageRanges: "1",
    });
    await p.close();
  }
  // previews and editables' backgrounds: 300 dpi, or the preview size for huge pieces (the standee, the lanyard)
  const dpiScale = big ? 1 : PRINT_DPI / 96 / (pr.zoom ?? 1);
  const ground = pr.previewOn
    ? `html,body{background:var(--color-${pr.previewOn})!important}`
    : "";
  const p = await open(o, dpiScale, ground);
  const full = await art(p).screenshot({
    type: "png",
    omitBackground: !!pr.transparent && !pr.previewOn,
  });
  if (dest.endsWith(".png")) writeFileSync(dest, full);
  else writeFileSync(join(BUILD, o.file.replace(/\.pdf$/, ".png")), full);
  const trim = await p.screenshot({
    type: "png",
    clip: await trimClip(p, o),
    fullPage: true,
  });
  await p.close();
  return trim;
}

const preview = (buf: Buffer, dest: string) =>
  sharp(buf)
    .flatten({ background: color.paper })
    .resize({
      width: PREVIEW,
      height: PREVIEW,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);

// ---- render everything

rmSync(OUT, { recursive: true, force: true });
rmSync(BUILD, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });
for (const g of Object.keys(GROUPS))
  mkdirSync(join(OUT, g), { recursive: true });

const previews = new Map<string, string>();
for (const piece of pieces) {
  for (const [i, o] of piece.outputs.entries()) {
    const dest = join(o.hidden ? BUILD : join(OUT, piece.group), o.file);
    const buf = o.screen
      ? await renderScreen(o, dest)
      : await renderPrint(o, dest);
    if (i === 0) {
      const file = `${piece.group}/${piece.id}.preview.jpg`;
      await preview(buf, join(OUT, file));
      previews.set(piece.id, file);
    }
    console.log(`${piece.group}/${o.file}`);
  }
}
await browser.close();
server.stop();

// ---- editables

const build = (file: string) => join(BUILD, file);
const out = (piece: Piece, file: string) => join(OUT, piece.group, file);
const byId = (id: string) => pieces.find((p) => p.id === id)!;
const FONT_D = "Bricolage Grotesque";
const FONT = "Geist";
const ink = hex(color.ink);
const paper = hex(color.paper);
const mmIn = (n: number) => n / 25.4;

// slides: one master per background, with editable placeholders, and a sample deck that uses each one
{
  const piece = byId("slides");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.333 × 7.5 in = the 960 × 540 design at 72 px per inch
  pptx.title = "Proud Indian slides";
  const bg = (kind: string) => ({ path: out(piece, `slide-${kind}.png`) });
  const t = <const O extends object>(o: O) => ({
    fontFace: FONT_D,
    bold: true,
    color: ink,
    align: "left" as const,
    valign: "top" as const,
    margin: 0,
    ...o,
  });
  const b = <const O extends object>(o: O) => ({
    fontFace: FONT,
    color: ink,
    align: "left" as const,
    valign: "top" as const,
    margin: 0,
    ...o,
  });
  pptx.defineSlideMaster({
    title: "Title",
    background: bg("title"),
    objects: [
      {
        placeholder: {
          options: t({
            name: "title",
            type: "title",
            x: 0.78,
            y: 1.9,
            w: 6.6,
            h: 2.4,
            fontSize: 56,
          }),
          text: "Title",
        },
      },
      {
        placeholder: {
          options: b({
            name: "body",
            type: "body",
            x: 0.78,
            y: 4.5,
            w: 6,
            h: 1,
            fontSize: 20,
          }),
          text: "Subtitle",
        },
      },
    ],
  });
  pptx.defineSlideMaster({
    title: "Section",
    background: bg("section"),
    objects: [
      {
        placeholder: {
          options: b({
            name: "body",
            type: "body",
            x: 0.78,
            y: 1.9,
            w: 3,
            h: 0.5,
            fontSize: 16,
            bold: true,
            color: hex(color.sky),
          }),
          text: "01",
        },
      },
      {
        placeholder: {
          options: t({
            name: "title",
            type: "title",
            x: 0.78,
            y: 2.5,
            w: 9,
            h: 2.4,
            fontSize: 54,
            color: paper,
          }),
          text: "Section title",
        },
      },
    ],
  });
  pptx.defineSlideMaster({
    title: "Content",
    background: bg("content"),
    slideNumber: {
      x: 12.1,
      y: 6.95,
      w: 0.5,
      h: 0.3,
      fontFace: FONT,
      fontSize: 10,
      color: ink,
      align: "right",
    },
    objects: [
      {
        placeholder: {
          options: t({
            name: "title",
            type: "title",
            x: 0.78,
            y: 0.6,
            w: 11.8,
            h: 1,
            fontSize: 36,
          }),
          text: "Slide title",
        },
      },
      {
        placeholder: {
          options: b({
            name: "body",
            type: "body",
            x: 0.78,
            y: 1.8,
            w: 11.8,
            h: 4.6,
            fontSize: 18,
          }),
          text: "Text",
        },
      },
    ],
  });
  pptx.defineSlideMaster({
    title: "Photo",
    background: bg("photo"),
    slideNumber: {
      x: 12.1,
      y: 6.95,
      w: 0.5,
      h: 0.3,
      fontFace: FONT,
      fontSize: 10,
      color: ink,
      align: "right",
    },
    objects: [
      {
        placeholder: {
          options: t({
            name: "title",
            type: "title",
            x: 0.78,
            y: 0.8,
            w: 6.2,
            h: 1.6,
            fontSize: 36,
          }),
          text: "Slide title",
        },
      },
      {
        placeholder: {
          options: b({
            name: "body",
            type: "body",
            x: 0.78,
            y: 2.6,
            w: 6.2,
            h: 3.6,
            fontSize: 18,
          }),
          text: "Text",
        },
      },
    ],
  });
  pptx.defineSlideMaster({
    title: "Closing",
    background: bg("closing"),
    objects: [
      {
        placeholder: {
          options: t({
            name: "title",
            type: "title",
            x: 0.78,
            y: 2.1,
            w: 7,
            h: 1.4,
            fontSize: 60,
          }),
          text: "Thank you.",
        },
      },
      {
        placeholder: {
          options: b({
            name: "body",
            type: "body",
            x: 0.78,
            y: 3.7,
            w: 6.5,
            h: 1.4,
            fontSize: 18,
          }),
          text: "Contact",
        },
      },
    ],
  });
  const add = (master: string, title: string, body: string) => {
    const s = pptx.addSlide({ masterName: master });
    s.addText(title, { placeholder: "title" });
    s.addText(body, { placeholder: "body" });
  };
  add(
    "Title",
    "Side by side since 2019.",
    "An update for supporters and partners"
  );
  add("Section", "What we did this year", "01");
  add(
    "Content",
    "Four ways we show up",
    "Teach: weekend learning sessions and the Math Challenge\nFeed: nutrition drives and health check-ups\nPaint: Kalakriti, our yearly festival of arts and culture\nConnect: Gift a Smile, clean-ups and community days"
  );
  add(
    "Photo",
    "One full day of arts and culture.",
    `Kalakriti 3.0: ${f.kalakriti.children} children, ${f.kalakriti.events} events, ${f.kalakriti.volunteers} volunteers.`
  );
  add("Closing", "Thank you.", `${f.email} · ${f.phone}\n${f.siteShort}`);
  await pptx.writeFile({ fileName: out(piece, "proud-indian-slides.pptx") });
}

/** a small PPTX at a print size (bleed included, so an exported PDF keeps it) with a background and text boxes */
async function printPptx(
  file: string,
  size: [number, number],
  slides: {
    bg: string;
    text?: {
      t: string;
      x: number;
      y: number;
      w: number;
      h: number;
      o: object;
    }[];
  }[]
) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({
    name: "PRINT",
    width: mmIn(size[0]),
    height: mmIn(size[1]),
  });
  pptx.layout = "PRINT";
  for (const s of slides) {
    const slide = pptx.addSlide();
    slide.background = { path: s.bg };
    for (const t of s.text ?? [])
      slide.addText(t.t, {
        x: mmIn(t.x),
        y: mmIn(t.y),
        w: mmIn(t.w),
        h: mmIn(t.h),
        margin: 0,
        valign: "top" as const,
        color: ink,
        ...t.o,
      });
  }
  await pptx.writeFile({ fileName: file });
}

{
  const piece = byId("visiting-card");
  await printPptx(
    out(piece, "visiting-card.pptx"),
    [91, 61],
    [
      { bg: build("visiting-card-front.png") },
      {
        bg: build("visiting-card-back-bg.png"),
        text: [
          {
            t: "Your Name",
            x: 9,
            y: 17,
            w: 70,
            h: 6,
            o: { fontFace: FONT_D, bold: true, fontSize: 13 },
          },
          {
            t: "Role",
            x: 9,
            y: 23.5,
            w: 70,
            h: 4,
            o: {
              fontFace: FONT,
              bold: true,
              fontSize: 7,
              color: hex(color.skyInk),
            },
          },
          {
            t: `${f.email}\n${f.phone}\n${f.siteShort}`,
            x: 9,
            y: 30,
            w: 70,
            h: 14,
            o: { fontFace: FONT, fontSize: 6.5, lineSpacingMultiple: 1.2 },
          },
        ],
      },
    ]
  );
}
{
  const piece = byId("badge");
  await printPptx(
    out(piece, "badge-volunteer.pptx"),
    [60, 92],
    [
      {
        bg: build("badge-volunteer-bg.png"),
        text: [
          {
            t: "Name",
            x: 5,
            y: 59,
            w: 50,
            h: 7,
            o: {
              fontFace: FONT_D,
              bold: true,
              fontSize: 12,
              color: paper,
              align: "center",
            },
          },
          {
            t: "Volunteer ID",
            x: 5,
            y: 66,
            w: 50,
            h: 4,
            o: {
              fontFace: FONT,
              fontSize: 6.5,
              color: hex(color.sky),
              align: "center",
            },
          },
        ],
      },
    ]
  );
}

// DOCX: the letterhead (header logo, footer registrations) and the certificate (background art, editable lines)
const lockupPng = await sharp(join(ROOT, "logo/svg/pi-lockup.svg"), {
  density: 600,
})
  .resize({ width: 1200 })
  .png()
  .toBuffer();
{
  const piece = byId("letterhead");
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 21, color: ink } } },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1900,
              bottom: 1500,
              left: 1134,
              right: 1134,
              header: 700,
              footer: 500,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    type: "png",
                    data: lockupPng,
                    transformation: { width: 192, height: 30 },
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${f.email} · ${f.phone} · ${f.siteShort}`,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: f.address,
                    size: 15,
                    color: hex(color.mute),
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Registered under 12A and 80G · NGO Darpan ${f.reg.darpan} · PAN ${f.reg.pan} · CSR-1 ${f.reg.csr1} · Trust registration ${f.reg.trust}`,
                    size: 15,
                    color: hex(color.mute),
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({ text: "Date" }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Dear …," }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Type the letter here." }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Yours sincerely," }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: "Name", bold: true })],
          }),
          new Paragraph({ text: "Role, Proud Indian" }),
        ],
      },
    ],
  });
  writeFileSync(out(piece, "letterhead.docx"), await Packer.toBuffer(doc));
}
{
  const piece = byId("certificate");
  const bg = readFileSync(build("certificate-bg.png"));
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: 30, color: ink } } },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 11906,
              height: 16838,
            }, // docx swaps them for landscape
            margin: { top: 4300, bottom: 1200, left: 1700, right: 1700 },
          },
        },
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                type: "png",
                data: bg,
                transformation: { width: 1123, height: 794 },
                floating: {
                  horizontalPosition: {
                    relative: HorizontalPositionRelativeFrom.PAGE,
                    offset: 0,
                  },
                  verticalPosition: {
                    relative: VerticalPositionRelativeFrom.PAGE,
                    offset: 0,
                  },
                  behindDocument: true,
                },
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Name of the participant",
                font: FONT_D,
                bold: true,
                size: 88,
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 300 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "took part in (occasion) on (date) in Bengaluru.",
              }),
            ],
          }),
        ],
      },
    ],
  });
  writeFileSync(out(piece, "certificate.docx"), await Packer.toBuffer(doc));
}

// email signature: plain HTML with inline styles (what Gmail and Outlook keep), the logo from proudindian.ngo
{
  const piece = byId("email-signature");
  const logoUrl =
    "https://proudindian.ngo/brand/files/office/email-signature-logo.png";
  const html = `<!-- Proud Indian email signature. Change the name and role, then paste it into Gmail (Settings → Signature) or
     Outlook (Settings → Signatures): open this file in a browser, select everything and copy. -->
<table cellpadding="0" cellspacing="0" style="font-family:Geist,Arial,sans-serif;color:${color.ink};font-size:13px;line-height:1.45">
  <tr><td style="font-weight:700;font-size:14px">Your Name</td></tr>
  <tr><td>Role, Proud Indian</td></tr>
  <tr><td><a href="mailto:${f.email}" style="color:${color.skyInk}">${f.email}</a> · ${f.phone}</td></tr>
  <tr><td style="padding-top:10px"><a href="${f.links.site}"><img src="${logoUrl}" width="${Math.round((370.41 / 58.91) * 28)}" height="28" alt="Proud Indian" style="display:block;border:0"></a></td></tr>
  <tr><td style="padding-top:6px">Be an Optimist → <a href="${f.links.register}" style="color:${color.skyInk}">${f.links.registerShort}</a></td></tr>
</table>
`;
  writeFileSync(out(piece, "email-signature.html"), html);
}

// ---- manifest

const manifest = {
  version,
  groups: Object.entries(GROUPS).map(([id, title]) => ({
    id,
    title,
    items: pieces
      .filter((p) => p.group === id)
      .map((p) => ({
        id: p.id,
        title: p.title,
        use: p.use,
        preview: previews.get(p.id),
        files: [
          ...p.outputs
            .filter((o) => !o.hidden)
            .map((o) => ({ path: `${p.group}/${o.file}`, label: o.label })),
          ...(p.editables ?? []).map((e) => ({
            path: `${p.group}/${e.file}`,
            label: e.label,
          })),
        ],
      })),
  })),
};
writeFileSync(
  join(OUT, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);
rmSync(BUILD, { recursive: true, force: true });

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.join("\n")}`);
  process.exit(1);
}
console.log(`\nmarketing kit: ${pieces.length} pieces → marketing/out/`);
