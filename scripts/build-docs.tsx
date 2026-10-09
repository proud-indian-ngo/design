/**
 * Build the static style guide: docs/index.html + docs/styleguide.css (Tailwind v4 CLI over the package CSS).
 * Every component is rendered with the real React components (react-dom/server), so the page is also a visual test.
 *   bun run docs            build
 *   bun run docs --shot     build, then screenshot to /tmp/pi-design/styleguide.png
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { $ } from "bun";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AccentWord,
  Button,
  Card,
  Chip,
  Chips,
  Doodle,
  Lockup,
  Polaroid,
  Seal,
  SectionLabel,
  Sticker,
  Ticket,
} from "../react";
import { doodleNames, doodleTitles } from "../react/generated/doodles";
import { color, motion, tokenGroups } from "../tokens";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
mkdirSync(DOCS, { recursive: true });

// ---------------------------------------------------------------- contrast
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].toSorted((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
};
const grade = (r: number) => (r >= 4.5 ? "AA" : r >= 3 ? "AA large" : "fail");

// ---------------------------------------------------------------- page parts
const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="sg-sec">
    <h2 className="font-pi-display text-40 tracking-heading leading-title mb-6 font-extrabold">
      {title}
    </h2>
    {children}
  </section>
);

const groups = tokenGroups();
const group = (title: string) =>
  groups.find((g) => g.title === title)?.vars ?? [];

const swatches = Object.entries(color).map(([name, hex]) => {
  const cr = [
    ["ink", color.ink],
    ["paper", color.paper],
    ["white", color.white],
  ] as const;
  return (
    <figure key={name} className="sg-swatch">
      <span className="sg-chip" style={{ background: hex }} />
      <figcaption>
        <b>{name}</b>
        <code>{hex}</code>
        {cr
          .filter(([, c]) => c !== hex)
          .map(([n, c]) => {
            const r = ratio(hex, c);
            return (
              <small key={n}>
                on {n}: {r.toFixed(2)}{" "}
                <em className={`sg-g sg-g--${grade(r).replace(" ", "-")}`}>
                  {grade(r)}
                </em>
              </small>
            );
          })}
      </figcaption>
    </figure>
  );
});

const roles = group("Colour roles").map(([k, v]) => (
  <li key={k} className="sg-role">
    <span className="sg-dot" style={{ background: `var(--${k})` }} />
    <code>{k.replace("color-", "")}</code> <small>{v}</small>
  </li>
));

const typeSteps = group("Type scale")
  .filter(([k]) => !k.endsWith("--line-height") && /^text-\d/.test(k))
  .map(([k, v]) => (
    <li key={k} className="sg-type">
      <code>{k}</code>
      <span
        className="font-pi-display tracking-heading font-extrabold"
        style={{ fontSize: v, lineHeight: 1 }}
      >
        Be an Optimist
      </span>
    </li>
  ));

const space = group("Space (hand-written CSS)").map(([k, v]) => (
  <li key={k} className="sg-space">
    <code>{k}</code>
    <span style={{ width: v }} />
  </li>
));

const radii = group("Radius").map(([k, v]) => (
  <li key={k} className="sg-radius" style={{ borderRadius: v }}>
    <code>{k.replace("radius-", "")}</code>
  </li>
));

const shadows = group("Shadow").map(([k]) => (
  <li key={k} className="sg-shadow" style={{ boxShadow: `var(--${k})` }}>
    <code>{k.replace("shadow-", "")}</code>
  </li>
));

const eases = Object.entries(motion.ease).map(([k, v]) => (
  <li key={k} className="sg-ease">
    <code>ease-{k}</code>
    <span className="sg-track">
      <i style={{ animationTimingFunction: v }} />
    </span>
    <small>{v}</small>
  </li>
));

const tableOf = (title: string) => (
  <table className="sg-table">
    <tbody>
      {group(title).map(([k, v]) => (
        <tr key={k}>
          <td>
            <code>--{k}</code>
          </td>
          <td>{v}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const logoFiles = readdirSync(join(ROOT, "logo", "svg")).toSorted();
const sealFiles = readdirSync(join(ROOT, "logo", "seals")).toSorted();
const onDark = (f: string) =>
  f.includes("reversed") || f === "pi-disc.svg" || f.startsWith("pi-app-tile");
const PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${color.skyTint}"/><circle cx="200" cy="210" r="90" fill="${color.sky}"/><rect x="110" y="300" width="180" height="200" rx="60" fill="${color.skyDeep}"/></svg>`
  );
const CUTOUT =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><circle cx="100" cy="70" r="50" fill="${color.marigold}"/><rect x="45" y="125" width="110" height="175" rx="40" fill="${color.skyDeep}"/></svg>`
  );

const page = (
  <main className="sg">
    <header className="sg-head">
      <Lockup layout="horizontal" height={44} />
      <div>
        <p className="font-pi-display text-64 tracking-heading leading-display font-extrabold">
          Design <AccentWord>system.</AccentWord>
        </p>
        <p className="text-17 leading-lede text-text-muted max-w-[60ch]">
          <code>@proudindian/design</code>: the Tailwind v4 theme, the{" "}
          <code>.pi-*</code> primitives, the React components, the brand doodles
          and the logo set. Everything on this page is rendered from the
          package.
        </p>
      </div>
      <nav className="sg-nav">
        {[
          "colour",
          "type",
          "space",
          "radius",
          "shadow",
          "motion",
          "layout",
          "components",
          "doodles",
          "logo",
        ].map((s) => (
          <a key={s} href={`#${s}`} className="pi-chip">
            {s}
          </a>
        ))}
      </nav>
    </header>

    <Section id="colour" title="Colour">
      <div className="sg-swatches">{swatches}</div>
      <h3 className="sg-h3">Roles (Tailwind: bg-*, text-*, border-*)</h3>
      <ul className="sg-roles">{roles}</ul>
      <p className="sg-note">
        Contrast is WCAG 2.x. Marigold is for donate actions and Kalakriti only.
        Never sky text on paper (1.87:1).
      </p>
    </Section>

    <Section id="type" title="Type">
      <p className="sg-note">
        Display: Bricolage Grotesque 800 (<code>font-pi-display</code>, family{" "}
        <code>Brico</code>). Text: Geist (<code>font-pi-sans</code>). No
        italics. Sizes are keyed by px: <code>text-15</code> is 15px.
      </p>
      <ul className="sg-types">{typeSteps}</ul>
      <h3 className="sg-h3">Fluid display sizes</h3>
      <ul className="sg-roles">
        {group("Type scale")
          .filter(
            ([k]) => /^text-[a-z]/.test(k) && !k.endsWith("--line-height")
          )
          .map(([k, v]) => (
            <li key={k} className="sg-role">
              <code>{k}</code> <small>{v}</small>
            </li>
          ))}
      </ul>
      <h3 className="sg-h3">Line height and letter spacing</h3>
      <div className="sg-cols">
        {tableOf("Line height")}
        {tableOf("Letter spacing")}
      </div>
    </Section>

    <Section id="space" title="Space">
      <p className="sg-note">
        Markup uses Tailwind&apos;s 4px spacing; hand-written CSS uses{" "}
        <code>var(--space-*)</code>.
      </p>
      <ul className="sg-spaces">{space}</ul>
    </Section>

    <Section id="radius" title="Radius">
      <ul className="sg-radii">{radii}</ul>
    </Section>

    <Section id="shadow" title="Shadow">
      <p className="sg-note">
        Offset sticker shadows are hard (no blur); only soft blurs.
      </p>
      <ul className="sg-shadows">{shadows}</ul>
    </Section>

    <Section id="motion" title="Motion">
      <p className="sg-note">
        Only transform, opacity, clip-path and stroke-dashoffset animate.
        Everything respects reduced motion.
      </p>
      <ul className="sg-eases">{eases}</ul>
      <div className="sg-cols">
        {tableOf("Duration")}
        {tableOf("Loop")}
      </div>
    </Section>

    <Section id="layout" title="Breakpoints, containers, layers">
      <div className="sg-cols">
        {tableOf("Breakpoint")}
        {tableOf("Container")}
        {tableOf("Z-index")}
      </div>
    </Section>

    <Section id="components" title="Components">
      <h3 className="sg-h3">Button</h3>
      <div className="sg-row">
        {(["ink", "sky", "donate", "ghost"] as const).map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
        <Button variant="ink" arrow>
          with arrow
        </Button>
        <Button variant="sky" size="lg">
          size lg
        </Button>
        <Button variant="donate" size="xl" href="#components">
          size xl (link)
        </Button>
      </div>
      <div className="sg-row" style={{ maxWidth: 360 }}>
        <Button variant="ink" block size="lg">
          block
        </Button>
      </div>
      <h3 className="sg-h3">Chip, SectionLabel, AccentWord</h3>
      <div className="sg-row">
        <Chips>
          <Chip>Weekend sessions</Chip>
          <Chip>80G · 12A</Chip>
          <Chip>Bengaluru</Chip>
        </Chips>
        <SectionLabel num="01">Education</SectionLabel>
      </div>
      <div className="sg-row sg-accents">
        <p className="font-pi-display text-46 tracking-heading font-extrabold">
          On paper, <AccentWord>accent.</AccentWord>
        </p>
        <p className="font-pi-display text-46 tracking-heading bg-sky rounded-26 px-6 py-4 font-extrabold">
          On sky, <AccentWord variant="outline">outline.</AccentWord>
        </p>
        <p className="font-pi-display text-46 tracking-heading bg-ink text-paper rounded-26 px-6 py-4 font-extrabold">
          On ink, <AccentWord variant="marigold">marigold.</AccentWord>
        </p>
      </div>
      <h3 className="sg-h3">Card</h3>
      <div className="sg-cards">
        {(["paper", "paper-2", "sky", "wash", "deep"] as const).map((v) => (
          <Card key={v} variant={v}>
            <b className="font-pi-display text-26 tracking-heading font-extrabold">
              {v}
            </b>
            <span>Bento tile</span>
          </Card>
        ))}
      </div>
      <h3 className="sg-h3">Polaroid and Sticker</h3>
      <div className="sg-row sg-photos">
        <Polaroid
          src={PHOTO}
          alt="Placeholder photo"
          caption="Plain"
          width={200}
          tilt={-2}
        />
        <Polaroid
          src={PHOTO}
          alt="Placeholder photo"
          caption="Tape"
          variant="tape"
          width={200}
          tilt={2}
        />
        <Polaroid
          src={PHOTO}
          alt="Placeholder photo"
          caption="Peg"
          variant="peg"
          width={200}
          tilt={-3}
          tag="Kalakriti"
        />
        <Sticker
          src={CUTOUT}
          alt="Placeholder cut-out"
          style={{ width: 120 }}
          tilt={-4}
        />
        <Sticker
          src={CUTOUT}
          alt="Placeholder cut-out, cropped"
          crop="200/240"
          style={{ width: 120 }}
          tilt={3}
        />
      </div>
      <h3 className="sg-h3">Ticket</h3>
      <div className="sg-row">
        <div style={{ width: 380 }}>
          <Ticket
            href="#components"
            kicker="Sat 18 Oct · 10:00"
            title="Maths class"
            arrow
            rail={["Kaggadasapura", "2 hrs", "12 seats"]}
            stub="Admit one"
          />
        </div>
        <div style={{ width: 380 }}>
          <Ticket
            variant="marigold"
            kicker="20 Sep 2026"
            title="Kalakriti 3.0"
            rail={["8 events", "Full day", "Free"]}
            stub="Festival"
          />
        </div>
      </div>
      <h3 className="sg-h3">Lockup and Seal (React)</h3>
      <div className="sg-row">
        <Lockup layout="compact" height={30} />
        <Lockup layout="horizontal" height={40} />
        <Lockup layout="stacked" height={90} />
        <Lockup layout="symbol" height={56} />
        <span className="bg-ink rounded-14 inline-flex px-4 py-3">
          <Lockup colourway="reversed" height={32} />
        </span>
        <span className="bg-sky rounded-14 inline-flex px-4 py-3">
          <Lockup colourway="mono" height={32} />
        </span>
      </div>
      <div className="sg-row">
        <Seal kind="main" />
        <Seal kind="80g" />
        <Seal kind="volunteer" />
        <Seal kind="kalakriti" />
        <Seal kind="main" colourway="mono" />
        <Seal kind="optimists" size={140}>
          3.6k+
        </Seal>
      </div>
    </Section>

    <Section id="doodles" title="Doodles">
      <p className="sg-note">
        <code>&lt;Doodle name=&quot;…&quot; /&gt;</code> or{" "}
        <code>illustrations/*.svg</code>. The line is <code>currentColor</code>;
        set CSS <code>color</code> to recolour it.
      </p>
      <ul className="sg-doodles">
        {doodleNames.map((n) => (
          <li key={n}>
            <Doodle name={n} />
            <b>{n}</b>
            <small>{doodleTitles[n]}</small>
          </li>
        ))}
      </ul>
    </Section>

    <Section id="logo" title="Logo set">
      <p className="sg-note">
        Files from <code>logo/</code>. Rules: <code>logo/README.md</code> and
        the brand guide.
      </p>
      <ul className="sg-logos">
        {logoFiles.map((f) => (
          <li
            key={f}
            className={
              onDark(f)
                ? "dark"
                : f.includes("cyan") || f.includes("mono")
                  ? "sky"
                  : ""
            }
          >
            <img src={`../logo/svg/${f}`} alt="" />
            <code>{f}</code>
          </li>
        ))}
        {sealFiles.map((f) => (
          <li key={f}>
            <img src={`../logo/seals/${f}`} alt="" />
            <code>{f}</code>
          </li>
        ))}
        {[
          "favicon.svg",
          "favicon-16.png",
          "favicon-32.png",
          "favicon-48.png",
          "apple-touch-icon-180.png",
          "icon-192.png",
        ].map((f) => (
          <li key={f}>
            <img src={`../logo/favicon/${f}`} alt="" className="sg-fav" />
            <code>{f}</code>
          </li>
        ))}
        <li className="wide">
          <img src="../logo/social/og-default.png" alt="" />
          <code>social/og-default.png</code>
        </li>
      </ul>
    </Section>
  </main>
);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proud Indian design system: style guide</title>
<link rel="icon" href="../logo/favicon/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="styleguide.css">
</head>
<body>
<!-- GENERATED by scripts/build-docs.tsx. Do not edit; run \`bun run docs\`. -->
${renderToStaticMarkup(page)}
</body>
</html>
`;
writeFileSync(join(DOCS, "index.html"), html);

const SG_CSS = readFileSync(join(ROOT, "scripts", "docs.css"), "utf8");
writeFileSync(
  join(DOCS, "_input.css"),
  `/* GENERATED by scripts/build-docs.tsx */\n@import "tailwindcss" source(none);\n@import "../css/index.css";\n@import "../css/base.css" layer(base);\n@source "./index.html";\n\n${SG_CSS}`
);
await $`bunx @tailwindcss/cli -i ${join(DOCS, "_input.css")} -o ${join(DOCS, "styleguide.css")}`.quiet();
console.log("docs: wrote docs/index.html and docs/styleguide.css");

if (process.argv.includes("--shot")) {
  const { chromium } = await import("playwright");
  mkdirSync("/tmp/pi-design", { recursive: true });
  const browser = await chromium.launch();
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors: string[] = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("requestfailed", (r) => errors.push(`failed: ${r.url()}`));
  await p.goto(`file://${join(DOCS, "index.html")}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: "/tmp/pi-design/styleguide.png", fullPage: true });
  await browser.close();
  console.log(
    "screenshot: /tmp/pi-design/styleguide.png",
    errors.length ? errors : "(no errors)"
  );
}
