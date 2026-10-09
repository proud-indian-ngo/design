/**
 * Semantic tokens: roles that point at primitives. Prefer these in components.
 * Values are CSS strings that reference the primitive custom properties.
 */
/** Semantic colours, emitted into the Tailwind theme: `bg-surface-sky`, `text-text-muted`, `bg-donate`, ...
 *  `text-muted` and `accent-ink` avoid shadcn's `--color-muted` / `--color-accent`. */
export declare const semanticColor: {
    readonly "surface-sky": string;
    readonly "surface-paper": string;
    readonly "surface-paper-2": string;
    readonly "surface-ink": string;
    readonly "surface-card": string;
    readonly "surface-wash": string;
    readonly "surface-deep": string;
    readonly "on-sky": string;
    readonly "on-ink": string;
    readonly "on-ink-muted": string;
    readonly "text-muted": string;
    readonly "accent-ink": string;
    readonly "accent-on-ink": string;
    /** marigold is for donate and Kalakriti only; never part of the logo */
    readonly donate: string;
    readonly festival: string;
    readonly link: string;
    readonly focus: string;
};
/** Shadows, emitted into the Tailwind theme: `shadow-ink-sm`, `shadow-photo`, `shadow-card-sky`, ...
 *  Offset "sticker" shadows are always hard (no blur); only `soft` blurs. */
export declare const shadow: {
    readonly "ink-sm": `2px 2px 0 ${string}`;
    readonly ink: `3px 3px 0 ${string}`;
    readonly "ink-md": `4px 4px 0 ${string}`;
    readonly "paper-sm": `2px 2px 0 ${string}`;
    readonly paper: `3px 3px 0 ${string}`;
    readonly "paper-md": `4px 4px 0 ${string}`;
    readonly sky: `3px 3px 0 ${string}`;
    readonly photo: `4px 5px 0 ${string}`;
    readonly "photo-sm": `3px 4px 0 ${string}`;
    readonly "card-sky": `8px 8px 0 ${string},8px 8px 0 1.5px ${string}`;
    readonly "card-sky-sm": `6px 6px 0 ${string},6px 6px 0 1.5px ${string}`;
    readonly "card-paper": `8px 8px 0 ${string},8px 8px 0 1.5px ${string}`;
    readonly "card-paper-sm": `6px 6px 0 ${string},6px 6px 0 1.5px ${string}`;
    readonly "ring-ink": `0 0 0 1.5px ${string}`;
    readonly "ring-paper": `0 0 0 1.5px ${string}`;
    readonly soft: `0 10px 24px ${string}`;
};
/** Plain semantic custom properties (tokens.css). */
export declare const semantic: {
    readonly "focus-ring": `3px solid ${string}`;
    readonly "focus-ring-on-dark": `3px solid ${string}`;
    /** on sky surfaces the default sky-deep ring is only 2.16:1; ink is 8.36:1 */
    readonly "focus-ring-on-sky": `3px solid ${string}`;
    readonly "focus-offset": "3px";
    readonly "line-ink": `${string} solid ${string}`;
    readonly "line-ink-dashed": `${string} dashed ${string}`;
    readonly "line-paper": `${string} solid ${string}`;
    /** die-cut sticker: a 5px paper outline drawn with four hard drop-shadows, then a soft lift */
    readonly "sticker-outline": `drop-shadow(5px 0 0 ${string}) drop-shadow(-5px 0 0 ${string}) drop-shadow(0 -5px 0 ${string}) drop-shadow(0 5px 0 ${string})`;
    readonly "sticker-lift": `drop-shadow(0 16px 22px ${string})`;
    /** an ink hairline traced round any shape (the "Four ways" card, session tickets) */
    readonly "hairline-ink": `drop-shadow(1.5px 0 0 ${string}) drop-shadow(-1.5px 0 0 ${string}) drop-shadow(0 1.5px 0 ${string}) drop-shadow(0 -1.5px 0 ${string})`;
    /** accent words on cyan bands (decision 1B): white fill, ink outline, ink offset */
    readonly "accent-fill": string;
    readonly "accent-stroke": `1.5px ${string}`;
    readonly "accent-shadow": `3px 3px 0 ${string}`;
    readonly "accent-stroke-lg": `3px ${string}`;
    readonly "header-h": "76px";
    readonly "header-h-phone": "66px";
};
