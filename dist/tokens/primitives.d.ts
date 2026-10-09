/**
 * Primitive tokens: raw values with no meaning attached.
 *
 * Source of truth for the Proud Indian style system. `build.ts` turns them into:
 *   theme.css   a Tailwind v4 `@theme static` block (colours, fonts, type scale, radii, shadows, breakpoints,
 *               containers, easings), so `bg-sky`, `text-ink`, `font-pi-display`, `shadow-ink-sm`, `rounded-pill`,
 *               `max-tab:` and friends exist;
 *   tokens.css  plain custom properties for everything Tailwind has no namespace for (z-index, durations, loop
 *               timings, spacing steps used by the hand-written CSS, component knobs).
 * Values are written exactly as the website's CSS writes them, so CSS moved onto the tokens renders pixel-identical.
 *
 * Naming. Names never reuse a Tailwind default name with a different value, so pi-dash can import this theme on top
 * of Tailwind's defaults. Irregular scales (type, radius, space) are keyed by their px value: `text-15` is 15px.
 *
 * This folder stays self-contained (no imports from outside tokens/).
 */
/** Brand palette (brand/guidelines). */
export declare const color: {
    readonly sky: "#4CC0EC";
    readonly skyDeep: "#0B7FAE";
    readonly skyInk: "#08668C";
    readonly skyWash: "#E9F5FA";
    readonly skyTint: "#BFE6F6";
    readonly ink: "#0F1B24";
    readonly mute: "#3A4650";
    readonly paper: "#F6F2EA";
    readonly paper2: "#EFE9DE";
    readonly marigold: "#F4A62A";
    readonly white: "#FFFFFF";
    readonly black: "#000000";
};
/**
 * Product interfaces (pi-dash and any later app): the neutrals and status colours a dense screen needs, which the
 * website never uses (brand/guidelines, appendix A1). Light mode is white with greys tinted toward ink; dark mode is a
 * neutral charcoal. Sky stays the brand accent in both: sky ink on sky wash (light) and sky on `ui-dark-active` (dark)
 * mark the active or selected item. Every text colour here passes WCAG 4.5:1 on its own surface:
 *   ui-mute 5.87 and ui-label 4.93 on white; ui-dark-text 14.22, ui-dark-mute 6.48 and ui-dark-label 5.05 on
 *   ui-dark-card; sky 6.09 on ui-dark-active; status-* 5.93 / 6.52 / 6.54 on white; status-*-dark 10.39 / 9.29 / 7.28
 *   on ui-dark-card.
 * Marigold is never a status colour: it keeps meaning Donate.
 */
export declare const productColor: {
    readonly uiCanvas: "#FAFBFB";
    readonly uiSidebar: "#F6F7F8";
    readonly uiField: "#F1F3F4";
    readonly uiLine: "#E7EAED";
    readonly uiLineSoft: "#EEF0F2";
    readonly uiMute: "#5B6670";
    readonly uiLabel: "#66727C";
    readonly uiDarkPage: "#161618";
    readonly uiDarkSidebar: "#111113";
    readonly uiDarkCanvas: "#131315";
    readonly uiDarkCard: "#1E1E21";
    readonly uiDarkRaised: "#27272B";
    readonly uiDarkLine: "#2F2F34";
    readonly uiDarkLineSoft: "#28282C";
    readonly uiDarkText: "#EDEDEF";
    readonly uiDarkMute: "#A1A1A9";
    readonly uiDarkLabel: "#8D8D95";
    /** sky at 14% over ui-dark-card: the active item's background in dark mode */
    readonly uiDarkActive: "#24353D";
    readonly statusPending: "#8A5A00";
    readonly statusPendingDot: "#E0A526";
    readonly statusDone: "#1F6B3A";
    readonly statusDoneDot: "#3FA866";
    readonly statusRejected: "#B3261E";
    readonly statusRejectedDot: "#D9443A";
    readonly statusPendingDark: "#F1C76B";
    readonly statusDoneDark: "#7FD3A0";
    readonly statusRejectedDark: "#FF8A80";
    readonly statusRejectedDotDark: "#E5584D";
};
/**
 * Alpha variants the site uses. Keys are the alpha in percent; values are written exactly as the site's CSS
 * writes them so the output is byte-for-byte the same colour. `bg-ink-a30`, `border-paper-a35`, ...
 */
export declare const alpha: {
    readonly ink: {
        readonly 5: ".05";
        readonly 7: ".07";
        readonly 14: ".14";
        readonly 16: ".16";
        readonly 25: ".25";
        readonly 28: ".28";
        readonly 30: ".3";
        readonly 35: ".35";
        readonly 40: ".4";
        readonly 50: ".5";
    };
    readonly paper: {
        readonly 0: ".0";
        readonly 8: ".08";
        readonly 10: ".1";
        readonly 16: ".16";
        readonly 35: ".35";
        readonly 40: ".4";
        readonly 55: ".55";
        readonly 60: ".6";
        readonly 78: ".78";
        readonly 82: ".82";
        readonly 86: ".86";
        readonly 90: ".9";
        readonly 94: ".94";
    };
    readonly paper2: {
        readonly 82: ".82";
    };
    readonly sky: {
        readonly 55: ".55";
    };
    readonly black: {
        readonly 25: ".25";
        readonly 55: ".55";
        readonly 60: ".6";
        readonly 80: ".8";
    };
    /** warm paper grain inside the Kalakriti poster */
    readonly tan: {
        readonly 25: ".25";
    };
};
/** rgb triplets for the alpha variants (emitted in rgba() form) */
export declare const rgb: {
    readonly ink: "15,27,36";
    readonly paper: "246,242,234";
    readonly paper2: "239,233,222";
    readonly sky: "76,192,236";
    readonly black: "0,0,0";
    readonly tan: "196,180,150";
};
/** Bricolage Grotesque (heavy display, 800) and Geist (text). No italics anywhere. Emitted as `--font-pi-display` and
 *  `--font-pi-sans` (utilities `font-pi-display`, `font-pi-sans`): the `pi-` keeps them clear of Tailwind's and
 *  shadcn's `--font-sans` / `--font-display`. Paper Mono (`--font-pi-mono`) is the data font of product interfaces:
 *  amounts, dates, counts, IDs and table headers. The website does not use it. */
export declare const font: {
    readonly "pi-display": 'Brico,"Arial Black",system-ui,sans-serif';
    readonly "pi-sans": 'Geist,system-ui,-apple-system,"Segoe UI",sans-serif';
    readonly "pi-mono": 'PaperMono,ui-monospace,"SF Mono",Menlo,monospace';
};
/** Same names and values as Tailwind's defaults. */
export declare const weight: {
    readonly normal: 400;
    readonly medium: 500;
    readonly semibold: 600;
    readonly bold: 700;
    readonly extrabold: 800;
};
/**
 * Type scale in px: every size the site uses more than once (one-offs stay literal). Each step also sets
 * line-height: normal, which is what a `font:` shorthand resets it to; add a `leading-*` to change it.
 */
export declare const text: readonly [11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 18, 19, 20, 21, 22, 24, 26, 27, 30, 32, 34, 40, 44, 46, 52, 56, 60, 64, 84, 92, 96, 104, 128, 132];
/** Fluid display sizes (the giant words): `text-optimist`, `text-verb`, ... */
export declare const display: {
    /** hero "Optimist." */
    readonly optimist: "clamp(140px,19vw,300px)";
    /** "Optimist." on phones */
    readonly "optimist-phone": "20.5vw";
    /** programme verbs (Teach. Feed. Gather.); the script then fits each verb to its band */
    readonly verb: "clamp(110px,24vw,370px)";
    /** programme verbs on phones */
    readonly "verb-phone": "27vw";
};
/** Line heights. `none` matches Tailwind's; the rest use names Tailwind does not. */
export declare const leading: {
    readonly none: "1";
    readonly display: ".9";
    readonly title: "1.05";
    readonly label: "1.2";
    readonly body: "1.3";
    readonly lede: "1.42";
    readonly copy: "1.5";
};
/** Letter spacing. `tighter` and `normal` match Tailwind's values; the rest use names Tailwind does not. */
export declare const tracking: {
    readonly tightest: "-.055em";
    readonly tighter: "-.05em";
    readonly poster: "-.045em";
    readonly heavy: "-.04em";
    readonly heading: "-.035em";
    readonly title: "-.03em";
    readonly subtitle: "-.025em";
    readonly label: "-.02em";
    readonly body: "-.01em";
    readonly normal: "0";
    /** small sans captions (13px and under) open up slightly */
    readonly caption: ".01em";
    readonly ticket: ".02em";
    readonly caps: ".08em";
    readonly stamp: ".11em";
    readonly sign: ".22em";
};
/**
 * Spacing steps in px used by the hand-written CSS (`var(--space-14)`). Markup uses Tailwind's own spacing, which is
 * 4px-based and takes quarter steps (p-3.5 is 14px), so no Tailwind override is needed.
 */
export declare const space: readonly [2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 48, 54, 56, 64, 72, 80, 84, 88, 96, 104, 110, 112, 120, 128];
/** Radii in px (`rounded-14`), plus the two shapes (`rounded-pill`, `rounded-round`). */
export declare const radius: readonly [3, 4, 5, 6, 8, 10, 14, 18, 20, 22, 24, 26, 28];
export declare const radiusShape: {
    readonly pill: "99px";
    readonly round: "50%";
};
export declare const border: {
    readonly hair: "1px";
    readonly ink: "1.5px";
    readonly heavy: "2px";
};
/**
 * Z-index layers for fixed and overlay UI (`z-(--z-header)`). Local stacking inside a section stays literal. A modal
 * side drawer and its scrim sit above the fixed header (the header must not cover an open drawer); the full-screen
 * menu stays on top of both.
 */
export declare const z: {
    readonly stickyBar: 50;
    readonly programmeIndex: 55;
    readonly header: 60;
    readonly scrim: 70;
    readonly drawer: 71;
    readonly menu: 90;
    readonly skipLink: 200;
};
/**
 * Breakpoints, as Tailwind v4 `--breakpoint-*` (min-width). The design is desktop-first, so most overrides use the
 * `max-*` variants: `max-tab:` is phones (700px and below), `tab:` is 701px and up. In hand-written CSS use
 * `@media (width < --theme(--breakpoint-tab))`. The client scripts import the numbers from here.
 */
export declare const breakpoint: {
    /** max-pad: 600px and below */
    readonly pad: 601;
    /** max-tab: phones, 700px and below; tab: 701px and up */
    readonly tab: 701;
    /** max-lap: 1100px and below */
    readonly lap: 1101;
    /** max-nav: 1180px and below (header links collapse into the menu) */
    readonly nav: 1181;
    /** max-desk: 1239px and below */
    readonly desk: 1240;
    /** wide: 1440px and up */
    readonly wide: 1440;
};
/** px value of the phone breakpoint, for scripts */
export declare const PHONE_MAX: number;
export declare const shortScreen = 640;
/** Max widths of the centred containers (`max-w-section`, ...). */
export declare const container: {
    readonly hero: "1600px";
    readonly scene: "1600px";
    readonly band: "1520px";
    readonly collage: "1440px";
    readonly footer: "1328px";
    readonly kalakriti: "1320px";
    readonly section: "1264px";
    readonly drawer: "600px";
};
/** Motion. Only transform, opacity, clip-path and stroke-dashoffset animate. */
export declare const motion: {
    readonly duration: {
        readonly fast: "150ms";
        readonly base: "200ms";
        readonly medium: "250ms";
        readonly slow: "300ms";
        readonly slower: "350ms";
    };
    /** `ease-settle`, `ease-spring`, ... (Tailwind's ease-in/out/in-out are left alone) */
    readonly ease: {
        readonly settle: "cubic-bezier(.22,1,.36,1)";
        readonly spring: "cubic-bezier(.34,1.56,.64,1)";
        readonly draw: "cubic-bezier(.65,0,.35,1)";
        readonly overshoot: "cubic-bezier(.3,.9,.4,1)";
        readonly wipe: "cubic-bezier(.45,0,.1,1)";
        readonly fall: "cubic-bezier(.45,0,.85,.55)";
        readonly glide: "cubic-bezier(.4,0,.2,1)";
    };
    /** scroll-in reveal (site scripts), in ms */
    readonly reveal: {
        readonly stagger: 75;
        readonly rise: 560;
        readonly riseTilt: 640;
        readonly riseFade: 420;
        readonly slap: 540;
        readonly hang: 640;
        readonly draw: 700;
        readonly wipe: 480;
        readonly riseDistance: 24;
    };
    /** continuous loops, one per section; each is a `.loop` paused off-screen */
    readonly loop: {
        readonly sun: "60s";
        readonly marquee: "38s";
        readonly sway: "3.4s";
        readonly "csun-rays": "8s";
        readonly wink: "8s";
        readonly leaf: "7s";
        readonly steam: "4.8s";
        readonly beat: "5s";
        readonly mini: "5s";
        readonly twinkle: "6s";
        readonly glint: "6s";
        readonly tick: "12s";
        readonly ring: "12s";
        readonly bob: "5s";
        readonly pencil: "10s";
        readonly hop: "6s";
        readonly kite: "7s";
        readonly flap: "5s";
        readonly gbird: "6s";
        readonly look: "9s";
        readonly wisp: "4.8s";
    };
};
