import type { SVGAttributes } from "react";
export type LockupLayout = "horizontal" | "compact" | "stacked" | "symbol" | "wordmark";
export type LockupColourway = "colour" | "mono" | "reversed";
export interface LockupProps extends Omit<SVGAttributes<SVGSVGElement>, "color"> {
    /** horizontal (default; letterhead, footer), compact (header pill, under 32px), stacked, symbol, wordmark */
    layout?: LockupLayout;
    /** colour on paper (default), reversed on ink (screen), mono for one colour and anything on sky */
    colourway?: LockupColourway;
    /**
     * Ink colour. Defaults to the file's (ink, or paper for reversed). Pass "currentColor" to follow the parent's CSS
     * colour.
     */
    color?: string;
    /** let the child's head follow `--pi-accent` (falls back to the file's colour); see logo/README.md */
    accentVar?: boolean;
    /** accessible name (default "Proud Indian"); pass "" to make it decorative */
    title?: string;
    /** rendered height; width follows */
    height?: number | string;
}
/** The Proud Indian logo, inlined from logo/svg/. The file artwork is never redrawn. */
export declare function Lockup({ layout, colourway, color, accentVar, title, height, className, ...rest }: LockupProps): import("react").JSX.Element;
