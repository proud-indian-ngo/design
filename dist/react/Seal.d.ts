import type { HTMLAttributes, ReactNode } from "react";
export type SealKind = "main" | "80g" | "volunteer" | "kalakriti" | "optimists";
export interface SealProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
    /** main (Bengaluru · since 2019), 80g (receipts), volunteer, kalakriti, or optimists (an empty ring for a number) */
    kind?: SealKind;
    /** colour (default) or mono; the optimists ring is always one colour */
    colourway?: "colour" | "mono";
    /** ring colour; defaults to the file's ink. "currentColor" follows the parent */
    color?: string;
    /** size of the seal (min 64px on screen) */
    size?: number | string;
    /** centre content, for the optimists ring (e.g. "3.6k+") */
    children?: ReactNode;
    /** accessible name; defaults to the seal's own label */
    label?: string;
}
/**
 * A Proud Indian seal, inlined from logo/seals/. Stamp-production and screen-texture artwork stay as files (print
 * only / mock-ups only).
 */
export declare function Seal({ kind, colourway, color, size, children, label, className, style, ...rest }: SealProps): import("react").JSX.Element;
