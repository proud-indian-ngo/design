import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
export type ButtonVariant = "ink" | "sky" | "donate" | "ghost";
export type ButtonSize = "md" | "lg" | "xl";
interface ButtonOwnProps {
    /** ink (primary), sky, donate (marigold; donate actions only) or ghost (paper) */
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** full width */
    block?: boolean;
    /** trailing "→", hidden from screen readers */
    arrow?: boolean;
    children?: ReactNode;
}
export type ButtonProps = ButtonOwnProps & (({
    href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) | ({
    href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>));
/** Pill button with a 1.5px ink outline and a hard offset shadow (.pi-btn). Renders <a> when `href` is set. */
export declare function Button({ variant, size, block, arrow, className, children, ...rest }: ButtonProps): import("react").JSX.Element;
export {};
