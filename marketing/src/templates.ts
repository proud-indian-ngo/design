/**
 * The marketing kit's artwork, one function per piece, returning the artboard's inner HTML. marketing/render.ts wraps
 * each in a page with kit.css and renders it at real size. Facts (stats, links, registrations, addresses) come from
 * `facts.ts`, which mirrors the website's src/content/site.yaml: change them there first.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { color } from "../../tokens/primitives";
import { facts as f } from "./facts";

const ROOT = join(import.meta.dir, "../..");

// ---- building blocks

export const logo = (file: string, height: number, style = "") =>
  `<img src="/logo/svg/${file}.svg" alt="" style="height:${height}px;width:auto;align-self:flex-start;flex:none;${style}">`;

/** a one-colour logo inline, in `ink` (for one-colour print on a dark ground) */
export const logoIn = (file: string, ink: string, height: number, style = "") =>
  readFileSync(join(ROOT, "logo", "svg", `${file}.svg`), "utf8")
    .replace(/<title>.*?<\/title>/, "")
    .replace(
      /color="#[0-9A-Fa-f]{6}"/,
      `color="${ink}" style="height:${height}px;width:auto;${style}"`
    )
    .replace(/\n/g, "");

export const seal = (file: string, size: number, style = "") =>
  `<img src="/logo/seals/${file}.svg" alt="" style="width:${size}px;height:${size}px;flex:none;${style}">`;

/** a brand doodle, inline so its line takes `ink` (default the ink colour) */
export const doodle = (name: string, style: string, ink: string = color.ink) =>
  readFileSync(join(ROOT, "illustrations", `${name}.svg`), "utf8")
    .replace(/^<svg /, `<svg class="doodle" style="color:${ink};${style}" `)
    .replace(/\n/g, "");

export const photo = (file: string) => `/marketing/assets/photos/${file}.jpg`;
export const cutout = (file: string) => `/marketing/assets/cutouts/${file}.png`;

export const cut = (file: string, style: string) =>
  `<img class="cut" src="${cutout(file)}" alt="" style="${style}">`;

export const pol = (
  file: string,
  caption: string,
  style: string,
  fix: "tape" | "peg" = "tape"
) => {
  // the caption scales with the polaroid, so a small one's caption stays inside its frame
  const width = Number(/width:(\d+)px/.exec(style)?.[1] ?? 120);
  const size = Math.min(13, Math.max(7, Math.round(width * 0.105)));
  return `<div class="pol" style="${style}">${fix === "tape" ? '<i class="tape"></i>' : '<i class="peg"></i>'}<img src="${photo(file)}" alt=""><span style="font-size:${size}px">${caption}</span></div>`;
};

/** a hand-drawn string for pegged polaroids, across the artboard at `top` */
export const line = (top: number, width: number, ink: string = color.ink) =>
  `<svg class="doodle" viewBox="0 0 ${width} 40" style="left:0;top:${top}px;width:${width}px;height:40px" fill="none"><path d="M-10 8 Q ${width / 2} 38 ${width + 10} 8" stroke="${ink}" stroke-width="2" stroke-linecap="round"/></svg>`;

const QR_SVG = new Map<string, string>();
/** QR codes are made by render.ts before the templates run (qrcode is async) */
export const setQr = (url: string, svg: string) => QR_SVG.set(url, svg);
export const qr = (url: string, size: number, style = "") => {
  const svg = QR_SVG.get(url);
  if (!svg) throw new Error(`marketing: no QR code made for ${url}`);
  return `<div class="qr" style="width:${size}px;${style}">${svg}</div>`;
};
export const QR_URLS = [
  f.links.register,
  f.links.donate,
  f.links.kalakriti,
  f.links.site,
] as const;

const arrow = " →";

// ---- social: screen sizes, designed in website px (zoom 2.5 for 1080-wide posts, 2 for covers)

/** volunteer call: "Be an Optimist." on sky, with a cut-out. 432 × 540 (4:5) or 432 × 432 (1:1) */
export const postVolunteer = (h: number, blank = false) => `
  <div class="art sky" style="width:432px;height:${h}px;padding:30px">
    ${logo("pi-lockup-mono", 20)}
    ${doodle("sun", "right:22px;top:20px;width:64px")}
    ${
      blank
        ? ""
        : `<div style="margin-top:${h > 450 ? 70 : 40}px;width:62%">
      <p class="d" style="font-size:40px">Be an</p>
      <p class="d acc" style="font-size:66px;margin-top:4px">Optimist.</p>
      <p class="lede" style="font-size:15px;margin-top:18px">On weekends we teach, feed, paint and connect alongside children across Bengaluru.</p>
      <span class="pill p-ink" style="margin-top:20px;font-size:14px">Become an Optimist${arrow}</span>
      <p class="small" style="margin-top:14px;font-weight:600">${f.links.registerShort}</p>
    </div>`
    }
    ${cut("GiftASmile2026_DSC_0036", `right:18px;bottom:-6px;height:${Math.round(h * 0.6)}px`)}
  </div>`;

/** donation appeal: a photo, "Give once. Light up a weekend." and marigold only on Donate */
export const postDonate = (h: number, blank = false) => `
  <div class="art paper" style="width:432px;height:${h}px">
    <img src="${photo("connect-gift-a-smile")}" alt="" style="width:100%;height:${Math.round(h * 0.5)}px;object-fit:cover;object-position:50% 40%;border-bottom:1.5px solid ${color.ink}">
    ${seal("pi-seal-80g", 78, `position:absolute;right:20px;top:${Math.round(h * 0.5) - 52}px;background:${color.paper};border-radius:50%;transform:rotate(8deg)`)}
    <div style="padding:22px 30px 26px;display:flex;flex-direction:column;flex:1">
      ${
        blank
          ? ""
          : `<p class="d" style="font-size:42px;line-height:.95">Give once. <span class="acc-paper">Light up a weekend.</span></p>
      ${h > 450 ? `<p style="font-size:14px;line-height:1.4;margin-top:12px;max-width:85%">Your gift keeps our weekend programmes going: learning sessions, nutrition drives, Kalakriti and community days.</p>` : ""}
      <p class="small" style="margin-top:auto">80G receipt by email · from ₹${f.donateMin}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
        <span class="pill p-sun" style="font-size:14px;align-self:center">Donate${arrow}</span>
        ${logo("pi-lockup-compact", 16, "align-self:center")}
      </div>`
      }
      ${blank ? `<div style="margin-top:auto;display:flex;justify-content:flex-end">${logo("pi-lockup-compact", 16)}</div>` : ""}
    </div>
  </div>`;

/** Kalakriti: the festival on ink, with a clothesline of polaroids and marigold for the accent */
export const postKalakriti = (h: number, blank = false) => {
  const tall = h > 450;
  return `
  <div class="art ink" style="width:432px;height:${h}px;padding:30px">
    ${
      blank
        ? ""
        : `<p class="eb" style="color:${color.sky}">Proud Indian presents</p>
    <p class="d" style="font-size:62px;margin-top:8px">Kalakriti</p>
    <p class="d acc-ink" style="font-size:30px;margin-top:4px">every September.</p>
    <p style="font-size:14px;margin-top:12px">One full day of arts and culture: a stage, an audience and a chance to shine.</p>`
    }
    ${line(tall ? 250 : 210, 432, color.paper)}
    ${pol("kala-fancy-dress", "Fancy dress", `left:26px;top:${tall ? 262 : 222}px;width:112px;transform:rotate(-4deg)`, "peg")}
    ${pol("kala-pot-painting", "Pot painting", `left:160px;top:${tall ? 276 : 236}px;width:112px;transform:rotate(3deg)`, "peg")}
    ${pol("kala-group-dance", "Group dance", `left:294px;top:${tall ? 266 : 226}px;width:112px;transform:rotate(-2deg)`, "peg")}
    ${
      blank || !tall
        ? ""
        : `<p class="small" style="position:absolute;left:30px;bottom:62px;right:30px"><b style="color:${color.marigold}">Kalakriti 3.0</b> · ${f.kalakriti.children} children · ${f.kalakriti.events} events · ${f.kalakriti.volunteers} volunteers</p>`
    }
    ${logo("pi-lockup-reversed", 18, "position:absolute;left:30px;bottom:28px")}
  </div>`;
};

/** story, volunteer: the three steps, sky, a cut-out. 432 × 768 */
export const storyVolunteer = (blank = false) => `
  <div class="art sky" style="width:432px;height:768px;padding:44px 30px">
    ${logo("pi-lockup-mono", 20)}
    ${doodle("paper-plane", "right:26px;top:36px;width:84px")}
    ${
      blank
        ? ""
        : `<p class="d" style="font-size:52px;margin-top:70px">Your next weekend, <span class="acc">sorted.</span></p>
    <p style="font-size:15px;line-height:1.4;margin-top:16px;width:85%">Optimists plan and run every programme, mostly at weekends. No experience needed.</p>
    <ol class="steps" style="margin-top:22px;width:80%">
      <li><i>1</i>Register on the dashboard</li>
      <li><i>2</i>Tap “I'm interested”</li>
      <li><i>3</i>Get approved, show up</li>
    </ol>
    <span class="pill p-ink" style="margin-top:24px">Become an Optimist${arrow}</span>`
    }
    ${cut("ArtCraft_May2026_1000381054", "right:10px;bottom:70px;height:300px")}
    <div style="position:absolute;left:0;right:0;bottom:0;height:62px;background:${color.ink};color:${color.paper};display:flex;align-items:center;padding:0 30px;font:600 15px var(--font-pi-sans)">${blank ? "" : f.links.registerShort}</div>
  </div>`;

/** story, donate: paper, a polaroid, 95% and 80G, marigold on Donate */
export const storyDonate = (blank = false) => `
  <div class="art paper" style="width:432px;height:768px;padding:44px 30px">
    ${logo("pi-lockup-compact", 18)}
    ${
      blank
        ? ""
        : `<p class="d" style="font-size:48px;margin-top:52px;line-height:.95">Give once. <span class="acc-paper">Light up a weekend.</span></p>
    <p style="font-size:15px;line-height:1.4;margin-top:16px;width:88%">Your gift keeps learning sessions, nutrition drives, Kalakriti and community days going, all run by volunteers.</p>`
    }
    ${pol("feed-lunch-kalakriti2", "Lunch at Kalakriti", "left:34px;top:376px;width:140px;transform:rotate(-4deg)")}
    ${doodle("matka", "right:50px;top:410px;width:120px")}
    ${
      blank
        ? ""
        : `<div class="stats" style="position:absolute;left:30px;right:30px;bottom:120px">
      <div class="stat" style="flex:1"><b>${f.stats.programmes}</b><span>of funds go to programmes</span></div>
      <div class="stat" style="flex:1"><b>80G · 12A</b><span>receipt by email</span></div>
    </div>
    <span class="pill p-sun" style="position:absolute;left:30px;bottom:52px">Donate once${arrow}</span>
    <span class="small" style="position:absolute;right:30px;bottom:62px">from ₹${f.donateMin} · ${f.siteShort}</span>`
    }
  </div>`;

/** profile covers: no logo (the avatar is the logo), the line on the left and a clothesline of polaroids on the right,
 * both inside the area every device shows (`safeLeft` and `safeRight` px in from the edges) */
export const cover = (
  w: number,
  h: number,
  opts: { safeLeft: number; safeRight: number }
) => {
  const big = Math.round(Math.min(h * 0.28, w * 0.075));
  const polW = Math.round(Math.min(h * 0.36, w * 0.09));
  const left = opts.safeLeft + 24;
  const right = (i: number) =>
    w - opts.safeRight - 24 - polW - i * Math.round(polW * 1.45);
  return `
  <div class="art sky" style="width:${w}px;height:${h}px">
    <div style="position:absolute;left:${left}px;top:50%;transform:translateY(-50%)">
      <p class="d" style="font-size:${Math.round(big * 0.54)}px">Be an</p>
      <p class="d acc" style="font-size:${big}px;margin-top:2px">Optimist.</p>
      <p class="chip" style="margin-top:${Math.round(h * 0.06)}px;background:${color.paper};font-size:${Math.max(10, Math.round(big * 0.2))}px">Weekend volunteering · Bengaluru · since 2019</p>
    </div>
    ${doodle("sun", `left:${left + Math.round(big * 2.6)}px;top:${Math.round(h / 2 - big * 1.25)}px;width:${Math.round(big * 0.85)}px`)}
    ${line(Math.round(h * 0.08), w)}
    ${pol("kala-group-dance", "Kalakriti", `left:${right(0)}px;top:${Math.round(h * 0.15)}px;width:${polW}px;transform:rotate(-2deg)`, "peg")}
    ${pol("connect-gift-a-smile", "Gift a Smile", `left:${right(1)}px;top:${Math.round(h * 0.2)}px;width:${polW}px;transform:rotate(3deg)`, "peg")}
    ${pol("strip-maths", "Maths class", `left:${right(2)}px;top:${Math.round(h * 0.16)}px;width:${polW}px;transform:rotate(-4deg)`, "peg")}
  </div>`;
};

/** YouTube: 2560 × 1440 (design 1280 × 720); everything inside the 1546 × 423 safe area every device shows */
export const youtube = () => `
  <div class="art sky" style="width:1280px;height:720px">
    ${doodle("star", "left:120px;top:90px;width:60px")}
    ${doodle("paper-plane", "right:150px;top:110px;width:120px")}
    ${doodle("kite", "left:200px;bottom:110px;width:90px")}
    ${doodle("sparkle", "right:220px;bottom:140px;width:40px")}
    <div style="position:absolute;left:254px;top:254px;width:773px;height:212px;display:flex;align-items:center;gap:36px">
      ${logo("pi-symbol-mono", 150)}
      <div>
        <p class="d" style="font-size:58px">Be an <span class="acc">Optimist.</span></p>
        <p style="font-size:19px;margin-top:14px;font-weight:600">Teach. Feed. Paint. Connect. Weekends in Bengaluru since 2019.</p>
      </div>
    </div>
  </div>`;

/** WhatsApp and link share card for the donate page, 1200 × 630 (design 600 × 315) */
export const shareDonate = () => `
  <div class="art paper" style="width:600px;height:315px;flex-direction:row">
    <img src="${photo("strip-maths")}" alt="" style="width:42%;height:100%;object-fit:cover;border-right:1.5px solid ${color.ink}">
    <div style="flex:1;padding:26px 28px;display:flex;flex-direction:column">
      ${logo("pi-lockup-compact", 18)}
      <p class="d" style="font-size:38px;margin-top:22px;line-height:.95">Give once. <span class="acc-paper">Light up a weekend.</span></p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:auto">
        <span class="pill p-sun" style="font-size:14px;align-self:center">Donate${arrow}</span>
        <span class="small">80G receipt · from ₹${f.donateMin}</span>
      </div>
    </div>
  </div>`;

// ---- office

/** email header, 1200 wide (600 at 2x) */
export const emailHeader = () => `
  <div class="art sky" style="width:600px;height:96px;flex-direction:row;align-items:center;justify-content:space-between;padding:0 32px">
    ${logo("pi-lockup-mono", 22, "align-self:center")}
    ${doodle("sun", "left:250px;top:18px;width:60px")}
    <span class="d" style="font-size:20px">Be an <span class="acc">Optimist.</span></span>
  </div>`;

/** email footer art (the address and links go in the email as text) */
export const emailFooter = () => `
  <div class="art ink" style="width:600px;height:110px;flex-direction:row;align-items:center;justify-content:space-between;padding:0 32px">
    ${logo("pi-lockup-reversed", 22, "align-self:center")}
    <span style="font:600 13px var(--font-pi-sans);color:${color.sky}">${f.siteShort}</span>
  </div>`;

/** video-call background, 1920 × 1080 (design 960 × 540); the logo sits top right, clear of a centred face */
export const callBackground = (ground: "paper" | "ink") => `
  <div class="art ${ground}" style="width:960px;height:540px">
    ${logo(ground === "ink" ? "pi-lockup-reversed" : "pi-lockup", 24, "position:absolute;right:40px;top:36px")}
    ${doodle("sun", "left:46px;top:40px;width:80px;opacity:.9", ground === "ink" ? color.paper : color.ink)}
    ${doodle("paper-plane", "right:60px;bottom:60px;width:110px;opacity:.9", ground === "ink" ? color.paper : color.ink)}
  </div>`;

/** slide backgrounds, 1920 × 1080 (design 960 × 540). The PPTX puts editable text on top */
export const slide = (
  kind: "title" | "section" | "content" | "photo" | "closing"
) => {
  if (kind === "title")
    return `<div class="art sky" style="width:960px;height:540px">
      ${logo("pi-lockup-mono", 26, "position:absolute;left:56px;top:48px")}
      ${doodle("sun", "left:520px;top:40px;width:84px")}
      ${cut("Kalakriti3_IMG_4409", "right:40px;bottom:-10px;height:440px")}
    </div>`;
  if (kind === "section")
    return `<div class="art ink" style="width:960px;height:540px">
      ${doodle("sparkle-glint", "right:90px;top:80px;width:60px", color.sky)}
      ${doodle("arrow-wavy", "right:120px;bottom:90px;width:150px", color.paper)}
      ${logo("pi-lockup-reversed", 18, "position:absolute;left:56px;bottom:40px")}
    </div>`;
  if (kind === "photo")
    return `<div class="art paper" style="width:960px;height:540px">
      ${pol("kalakriti-3-hall", "", "right:60px;top:60px;width:340px;transform:rotate(2deg)")}
      <div style="position:absolute;left:56px;right:56px;bottom:56px;border-top:1.5px solid ${color.ink}"></div>
      ${logo("pi-lockup-compact", 16, "position:absolute;left:56px;bottom:22px")}
    </div>`;
  if (kind === "closing")
    return `<div class="art sky" style="width:960px;height:540px">
      ${doodle("hands-raised", "right:90px;top:90px;width:200px")}
      ${doodle("heart", "right:330px;top:110px;width:60px")}
      ${logo("pi-stacked-mono", 120, "position:absolute;right:80px;bottom:60px")}
    </div>`;
  return `<div class="art paper" style="width:960px;height:540px">
      <div style="position:absolute;left:56px;right:56px;bottom:56px;border-top:1.5px solid ${color.ink}"></div>
      ${logo("pi-lockup-compact", 16, "position:absolute;left:56px;bottom:22px")}
    </div>`;
};

// ---- print: millimetres (1 mm = 3.7795 px at zoom 1); `bleed` mm on every side, content inside a safe margin

const mm = (n: number) => `${n}mm`;

/** A4 volunteer flyer, sky, with a QR code to register */
export const flyerVolunteer = (b: number) => `
  <div class="art sky" style="width:${mm(210 + 2 * b)};height:${mm(297 + 2 * b)};padding:${mm(b + 14)}">
    ${logo("pi-lockup-mono", 34)}
    ${doodle("sun", `right:${mm(b + 14)};top:${mm(b + 10)};width:${mm(30)}`)}
    <p class="d" style="font-size:84px;margin-top:${mm(18)};width:80%">Your next weekend, <span class="acc">sorted.</span></p>
    <p style="font-size:18px;line-height:1.4;margin-top:${mm(7)};width:62%">Optimists plan and run every programme: teaching, nutrition drives, Kalakriti and community days. Most sessions happen at weekends. No experience needed.</p>
    <ol class="steps" style="margin-top:${mm(8)};width:56%">
      <li><i>1</i>Register on the dashboard</li>
      <li><i>2</i>Tap “I'm interested”</li>
      <li><i>3</i>Get approved, show up</li>
    </ol>
    <div class="stats" style="margin-top:${mm(9)};width:58%">
      <div class="stat" style="flex:1"><b>${f.stats.optimists}</b><span>Optimists</span></div>
      <div class="stat" style="flex:1"><b>${f.stats.hours}</b><span>volunteer hours</span></div>
      <div class="stat" style="flex:1"><b>${f.stats.reached}</b><span>people reached</span></div>
    </div>
    <div style="position:absolute;left:${mm(b + 14)};bottom:${mm(b + 14)};display:flex;align-items:center;gap:${mm(5)}">
      ${qr(f.links.register, 118)}
      <p style="font:600 15px/1.35 var(--font-pi-sans)">Scan to register<br><span style="font-weight:400">${f.links.registerShort}</span></p>
    </div>
    ${cut("GiftASmile2026_DSC_0036", `right:${mm(b + 8)};bottom:${mm(b + 6)};height:${mm(118)}`)}
  </div>`;

/** A5 donation leaflet, paper, the 80G seal, a QR code to the donate page */
export const leafletDonate = (b: number) => `
  <div class="art paper" style="width:${mm(148 + 2 * b)};height:${mm(210 + 2 * b)}">
    <img src="${photo("connect-gift-a-smile")}" alt="" style="width:100%;height:${mm(b + 80)};object-fit:cover;object-position:50% 40%;border-bottom:1.5px solid ${color.ink}">
    ${seal("pi-seal-80g", 92, `position:absolute;right:${mm(b + 9)};top:${mm(b + 64)};background:${color.paper};border-radius:50%;transform:rotate(8deg)`)}
    <div style="padding:${mm(6)} ${mm(b + 10)} ${mm(b + 10)};display:flex;flex-direction:column;flex:1">
      ${logo("pi-lockup", 22)}
      <p class="d" style="font-size:44px;margin-top:${mm(5)};line-height:.95">Give once. <span class="acc-paper">Light up a weekend.</span></p>
      <p style="font-size:13px;line-height:1.45;margin-top:${mm(4)}">Your gift keeps our weekend programmes going: learning sessions, nutrition drives, Kalakriti and community days, all run by volunteers.</p>
      <div class="stats" style="margin-top:${mm(5)}">
        <div class="stat" style="flex:1"><b style="font-size:26px">${f.stats.programmes}</b><span>of funds go to programmes</span></div>
        <div class="stat" style="flex:1"><b style="font-size:26px">80G · 12A</b><span>registered · receipt by email</span></div>
      </div>
      <div style="display:flex;align-items:center;gap:${mm(4)};margin-top:auto">
        ${qr(f.links.donate, 84)}
        <div>
          <span class="pill p-sun" style="font-size:14px">Scan to donate${arrow}</span>
          <p class="small" style="margin-top:8px;font-size:10px">Minimum ₹${f.donateMin} · add your PAN to claim the 80G deduction · NGO Darpan ${f.reg.darpan}</p>
        </div>
      </div>
    </div>
  </div>`;

/** A3 Kalakriti poster, ink, polaroids on a line, the eight events, a QR code to the festival page */
export const posterKalakriti = (b: number) => `
  <div class="art ink" style="width:${mm(297 + 2 * b)};height:${mm(420 + 2 * b)};padding:${mm(b + 18)}">
    ${logo("pi-lockup-reversed", 40)}
    ${seal("pi-seal", 150, `position:absolute;right:${mm(b + 16)};top:${mm(b + 12)};background:${color.paper};border-radius:50%;padding:6px;transform:rotate(6deg)`)}
    <p class="eb" style="margin-top:${mm(26)};font-size:16px;color:${color.sky}">Proud Indian presents</p>
    <p class="d" style="font-size:170px;margin-top:${mm(4)}">Kalakriti</p>
    <p class="d acc-ink" style="font-size:64px;margin-top:${mm(3)}">every September.</p>
    <p style="font-size:24px;margin-top:${mm(6)};width:70%;line-height:1.35">One full day of arts and culture for children from our communities: a stage, an audience and the chance to show what they can do.</p>
    ${line(650, 1170, color.paper)}
    ${pol("kala-fancy-dress", "Fancy dress", "left:110px;top:670px;width:290px;transform:rotate(-4deg)", "peg")}
    ${pol("kala-pot-painting", "Pot painting", "left:450px;top:696px;width:290px;transform:rotate(3deg)", "peg")}
    ${pol("kala-group-dance", "Group dance", "left:790px;top:676px;width:290px;transform:rotate(-2deg)", "peg")}
    <div style="position:absolute;left:${mm(b + 18)};right:${mm(b + 18)};bottom:${mm(b + 18)}">
      <p class="eb" style="color:${color.marigold};font-size:15px">The 8 events</p>
      <p class="d" style="font-size:34px;line-height:1.15;margin-top:10px;letter-spacing:-.02em">${f.kalakriti.list.join(" · ")}</p>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:${mm(10)}">
        <div style="display:flex;gap:16px">
          <span class="pill p-paper" style="font-size:20px;padding:16px 26px">Volunteer at Kalakriti${arrow}</span>
          <span class="pill p-sun" style="font-size:20px;padding:16px 26px">Sponsor Kalakriti${arrow}</span>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
          <p style="font:600 18px/1.3 var(--font-pi-sans);text-align:right">Scan for the festival<br><span style="font-weight:400;color:${color.sky}">${f.links.kalakritiShort}</span></p>
          ${qr(f.links.kalakriti, 130)}
        </div>
      </div>
    </div>
  </div>`;

/** 85 × 200 cm roll-up standee, sky; no photos (they would print soft at this size). Keep the bottom 15 cm clear of
 * anything important: it disappears into the stand's base on most models. Designed at 1/10 scale, zoom 10 */
export const standee = (b: number) => `
  <div class="art sky" style="width:${(850 + 2 * b) / 10}mm;height:${(2000 + 2 * b) / 10}mm;align-items:center;text-align:center;padding-top:14mm">
    ${logo("pi-stacked-mono", 26, "align-self:center")}
    ${doodle("sun", "left:6mm;top:42mm;width:16mm")}
    ${doodle("paper-plane", "right:5mm;top:80mm;width:18mm")}
    ${doodle("kite", "left:8mm;top:118mm;width:12mm")}
    <p class="d" style="font-size:30px;margin-top:22mm">Be an</p>
    <p class="d acc" style="font-size:44px;margin-top:2px;-webkit-text-stroke-width:1px;text-shadow:2px 2px 0 ${color.ink}">Optimist.</p>
    <p class="d" style="font-size:13px;margin-top:10mm;letter-spacing:-.01em">Teach. Feed. Paint. Connect.</p>
    <p style="font-size:7px;line-height:1.4;margin-top:4mm;width:62mm">Volunteers plan and run every programme, mostly at weekends, alongside children across Bengaluru. No experience needed.</p>
    <div style="position:absolute;left:0;right:0;bottom:0;height:62mm;background:${color.ink};color:${color.paper};display:flex;flex-direction:column;align-items:center;padding-top:7mm;gap:3mm">
      <p class="d" style="font-size:16px">${f.siteShort}</p>
      <div style="display:flex;align-items:center;gap:3mm">
        ${qr(f.links.register, 34, "padding:2px;border-radius:3px;border-width:.5px")}
        <p style="font-size:6px;line-height:1.35;text-align:left">Volunteer:<br>${f.links.registerShort}</p>
      </div>
    </div>
  </div>`;

/** 4 × 2 ft (122 × 61 cm) flex sign for the community centre's front, paper with a sky band. Karnataka's Kannada
 * Language Comprehensive Development Act (s. 17(6), as amended in 2024) puts the Kannada name in the upper half, at
 * 60% of the name; Anek Kannada is the brand's Kannada face. Corners stay clear for the eyelets. 1/10 scale, zoom 10 */
export const bannerCentre = (b: number) => `
  <style>@font-face{font-family:AnekKn;src:url(/brand/guidelines/assets/fonts/AnekKannada.ttf) format("truetype")}</style>
  <div class="art paper" style="width:${(1220 + 2 * b) / 10}mm;height:${(610 + 2 * b) / 10}mm;align-items:center;text-align:center;padding-top:${b / 10 + 6}mm">
    <p lang="kn" style="font:700 34px/1.15 AnekKn;font-variation-settings:'wdth' 88,'wght' 720">ಪ್ರೌಡ್ ಇಂಡಿಯನ್<br><span class="acc-paper">ಸಮುದಾಯ ಕೇಂದ್ರ</span></p>
    <div style="display:flex;align-items:flex-end;gap:1.4mm;margin-top:5mm">
      ${logo("pi-lockup", 24)}
      <p class="d" style="font-size:24px;line-height:.8;position:relative;top:.36mm">Community <span class="acc-paper">Centre</span></p>
    </div>
    ${doodle("sun", "left:14mm;top:12mm;width:14mm")}
    ${doodle("paper-plane", "right:12mm;top:20mm;width:17mm")}
    ${doodle("kite", "right:13mm;top:3.5mm;width:5.5mm")}
    ${doodle("sparkle", "left:24mm;top:4mm;width:6mm")}
    <div style="position:absolute;left:0;right:0;bottom:0;height:${b / 10 + 13}mm;padding-bottom:${b / 10}mm;background:${color.sky};border-top:1.5px solid ${color.ink};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5mm">
      <p class="d" style="font-size:15px;letter-spacing:-.02em">${f.siteShort}</p>
      <p style="font-size:6px;font-weight:500">Registered charitable trust ${f.reg.trust} · 12A and 80G · NGO Darpan ${f.reg.darpan}</p>
    </div>
  </div>`;

// ---- cards and merchandise

/** visiting card front, 85 × 55 mm: stacked reversed on ink */
export const cardFront = (b: number) => `
  <div class="art ink" style="width:${mm(85 + 2 * b)};height:${mm(55 + 2 * b)};align-items:center;justify-content:center">
    ${logo("pi-stacked-reversed", 70, "align-self:center")}
  </div>`;

/** visiting card back: full colour on paper; `blank` leaves the name block for the PPTX's text */
export const cardBack = (b: number, blank = false) => `
  <div class="art paper" style="width:${mm(85 + 2 * b)};height:${mm(55 + 2 * b)};padding:${mm(b + 6)}">
    ${logo("pi-lockup-compact", 13)}
    ${
      blank
        ? ""
        : `<p class="d" style="font-size:17px;margin-top:${mm(5)};letter-spacing:-.02em">Your Name</p>
    <p style="font-size:9px;color:${color.skyInk};font-weight:600;margin-top:2px">Role</p>
    <p style="font-size:8px;line-height:1.45;margin-top:${mm(3)}">${f.email}<br>${f.phone}<br>${f.siteShort}</p>`
    }
  </div>`;

/** volunteer badge, ID-card size (54 × 86 mm), reversed on ink with the volunteer seal */
export const badge = (b: number, blank = false) => `
  <div class="art ink" style="width:${mm(54 + 2 * b)};height:${mm(86 + 2 * b)};padding:${mm(b + 5)};align-items:center;text-align:center">
    ${logo("pi-lockup-reversed", 13, "align-self:center")}
    ${seal("pi-seal-volunteer", 92, `margin-top:${mm(6)};background:${color.paper};border-radius:50%;padding:3px`)}
    <p class="d acc-ink" style="font-size:24px;margin-top:${mm(5)};color:${color.sky}">Optimist</p>
    ${
      blank
        ? ""
        : `<p class="d" style="font-size:16px;margin-top:${mm(4)}">Name</p>
    <p style="font-size:8px;margin-top:3px;color:${color.sky}">Volunteer ID</p>`
    }
    <p style="font-size:7px;position:absolute;bottom:${mm(b + 4)}">${f.siteShort}</p>
  </div>`;

/** Kalakriti crew pass, 100 × 55 mm, in the website's ticket style; no date, so it lasts every edition */
export const crewPass = (b: number) => `
  <div class="art paper" style="width:${mm(100 + 2 * b)};height:${mm(55 + 2 * b)};flex-direction:row">
    <div style="flex:1;padding:${mm(b + 5)} ${mm(4)} ${mm(b + 5)} ${mm(b + 6)};display:flex;flex-direction:column">
      <p class="eb" style="font-size:7px">Admit one · Optimist crew</p>
      <p class="d" style="font-size:28px;margin-top:${mm(3)}">Kalakriti</p>
      <p style="font-size:8px;margin-top:3px">Date ____________ · Bengaluru</p>
      <div style="display:flex;margin-top:auto;border:1px solid ${color.ink};border-radius:4px;font-size:7px">
        <span style="flex:1;padding:4px 6px;border-right:1px solid ${color.ink}">Crew</span>
        <span style="flex:1;padding:4px 6px;border-right:1px solid ${color.ink}">Volunteer</span>
        <span style="flex:1;padding:4px 6px">All day</span>
      </div>
    </div>
    <div style="width:${mm(24 + b)};border-left:1.5px dashed ${color.ink};background:${color.sky};display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:${mm(b + 5)} 0">
      ${logo("pi-symbol-mono", 26, "align-self:center")}
      <p class="d" style="font-size:13px;writing-mode:vertical-rl;transform:rotate(180deg)">Crew pass</p>
    </div>
  </div>`;

/** lanyard strap, 20 × 900 mm, one colour: paper on ink, the symbol 13 mm or larger */
export const lanyard = (b: number) => {
  const unit = `<span style="display:inline-flex;align-items:center;gap:4mm;padding:0 6mm">${logoIn("pi-symbol-mono", color.paper, 52)}<span style="font:700 9px var(--font-pi-sans);letter-spacing:.14em">PROUD INDIAN · OPTIMIST CREW</span></span>`;
  return `
  <div class="art ink" style="width:${mm(900 + 2 * b)};height:${mm(20 + 2 * b)};flex-direction:row;align-items:center;white-space:nowrap;color:${color.paper}">
    ${unit.repeat(12)}
  </div>`;
};

/** tee back print, one colour paper (for an ink tee), on a transparent page, 280 × 320 mm */
export const teeBack = () => `
  <div class="art" style="width:280mm;height:320mm;align-items:center;justify-content:center;background:transparent;color:${color.paper};text-align:center">
    ${logoIn("pi-symbol-mono", color.paper, 260)}
    <p class="d" style="font-size:150px;margin-top:20mm">Be an<br>Optimist.</p>
    <p style="font:700 34px var(--font-pi-sans);letter-spacing:.12em;margin-top:14mm">PROUD INDIAN · BENGALURU</p>
  </div>`;

/** mug wrap, 200 × 85 mm, one colour ink: the horizontal lockup twice, so it reads from either hand */
export const mugWrap = () => `
  <div class="art" style="width:200mm;height:85mm;flex-direction:row;align-items:center;justify-content:space-around;background:transparent">
    ${logo("pi-lockup-mono", 52, "align-self:center")}
    ${logo("pi-lockup-mono", 52, "align-self:center")}
  </div>`;

/** A6 sticker sheet: discs, seals, "Optimist." and the sun. The magenta lines are the die cut: tell the printer */
export const stickerSheet = (b: number, cutLines: boolean) => {
  const die = (style: string, r = "50%") =>
    cutLines
      ? `<i style="position:absolute;${style};border:.5px solid #EC008C;border-radius:${r}"></i>`
      : "";
  return `
  <div class="art paper" style="width:${mm(105 + 2 * b)};height:${mm(148 + 2 * b)}">
    ${logo("pi-disc", 0, `position:absolute;left:${mm(b + 8)};top:${mm(b + 8)};width:${mm(40)};height:${mm(40)}`)}
    ${die(`left:${mm(b + 6)};top:${mm(b + 6)};width:${mm(44)};height:${mm(44)}`)}
    ${logo("pi-disc-cyan", 0, `position:absolute;right:${mm(b + 10)};top:${mm(b + 12)};width:${mm(32)};height:${mm(32)}`)}
    ${die(`right:${mm(b + 8)};top:${mm(b + 10)};width:${mm(36)};height:${mm(36)}`)}
    ${seal("pi-seal-volunteer", 0, `position:absolute;left:${mm(b + 10)};top:${mm(b + 58)};width:${mm(36)};height:${mm(36)}`)}
    ${die(`left:${mm(b + 8)};top:${mm(b + 56)};width:${mm(40)};height:${mm(40)}`)}
    ${seal("pi-seal", 0, `position:absolute;right:${mm(b + 10)};top:${mm(b + 58)};width:${mm(36)};height:${mm(36)}`)}
    ${die(`right:${mm(b + 8)};top:${mm(b + 56)};width:${mm(40)};height:${mm(40)}`)}
    <div style="position:absolute;left:${mm(b + 10)};top:${mm(b + 108)};display:flex;align-items:center;gap:${mm(3)};background:${color.sky};border:1.5px solid ${color.ink};border-radius:999px;padding:${mm(3)} ${mm(6)};box-shadow:3px 3px 0 ${color.ink};transform:rotate(-4deg)">
      <span class="d acc" style="font-size:40px">Optimist.</span>
      ${doodle("sun", `position:static;width:${mm(14)}`)}
    </div>
    ${die(`left:${mm(b + 7)};top:${mm(b + 103)};width:${mm(82)};height:${mm(28)};transform:rotate(-4deg)`, "999px")}
  </div>`;
};

/** certificate of participation, A4 landscape; `blank` leaves the name, occasion and date for the DOCX's text */
export const certificate = (blank = false) => `
  <div class="art paper" style="width:297mm;height:210mm;padding:16mm 20mm;align-items:center;text-align:center">
    <div style="position:absolute;inset:8mm;border:1.5px solid ${color.ink};border-radius:14px"></div>
    ${logo("pi-lockup", 36, "align-self:center")}
    <p class="eb" style="margin-top:14mm;font-size:13px">Certificate of participation</p>
    ${
      blank
        ? ""
        : `<p class="d" style="font-size:54px;margin-top:9mm;border-bottom:1.5px solid ${color.ink};padding:0 20mm 6px;min-width:150mm">&nbsp;</p>
    <p style="font-size:17px;line-height:1.5;margin-top:8mm;width:180mm">took part in ________________________________ on ______________ in Bengaluru.</p>`
    }
    ${seal("pi-seal", 120, "position:absolute;right:26mm;bottom:22mm;transform:rotate(-6deg)")}
    <div style="position:absolute;left:30mm;bottom:24mm;text-align:left">
      <div style="width:60mm;border-top:1.5px solid ${color.ink}"></div>
      <p style="font-size:12px;margin-top:6px">Secretary, Proud Indian</p>
    </div>
    ${doodle("star", "left:24mm;top:22mm;width:16mm")}
    ${doodle("sparkle", "right:30mm;top:26mm;width:10mm")}
  </div>`;

/** letterhead, A4: the lockup at the top, registrations in the footer (also used as the DOCX's header and footer) */
export const letterhead = () => `
  <div class="art white" style="width:210mm;height:297mm;padding:16mm 20mm">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      ${logo("pi-lockup", 30)}
      <p style="font-size:9.5px;line-height:1.5;text-align:right">${f.email} · ${f.phone}<br>${f.siteShort}</p>
    </div>
    <div style="margin-top:auto;border-top:1.5px solid ${color.ink};padding-top:3mm;font-size:8.5px;line-height:1.5;color:${color.mute}">
      ${f.address}<br>
      Registered under 12A and 80G · NGO Darpan ${f.reg.darpan} · PAN ${f.reg.pan} · CSR-1 ${f.reg.csr1} · Trust registration ${f.reg.trust}
    </div>
  </div>`;
