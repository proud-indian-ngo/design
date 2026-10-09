import type { HTMLAttributes } from "react";
/**
 * Brand root: paper background, Geist text (`--font-pi-sans`) and ink colour. Wrap a page, a marketing block or a
 * Claude Design preview in it. The primitives and components do not need it: their tokens never clash with a
 * shadcn/ui theme, so they render on-brand anywhere.
 */
export declare function PiRoot({ className, ...rest }: HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
