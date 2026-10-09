import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
export type CardVariant = "paper" | "paper-2" | "sky" | "wash" | "deep";
export type CardProps = {
    variant?: CardVariant;
} & (({
    as?: "div";
} & HTMLAttributes<HTMLDivElement>) | ({
    as: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>));
/** The rounded, outlined bento tile (.pi-card). Renders <div>, or <button> with `as="button"`. */
export declare function Card({ variant, className, as, ...rest }: CardProps): import("react").JSX.Element;
