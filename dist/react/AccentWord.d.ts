import type { HTMLAttributes } from "react";
export interface AccentWordProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * "paper": deep cyan, on paper (default) · "outline": white with an ink outline and offset, on cyan bands (40px
     * and up only) · "marigold": on ink, Kalakriti only
     */
    variant?: "paper" | "outline" | "marigold";
}
/** The one highlighted word of a headline (.pi-accent). */
export declare function AccentWord({ variant, className, ...rest }: AccentWordProps): import("react").JSX.Element;
