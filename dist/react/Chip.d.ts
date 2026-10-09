import type { HTMLAttributes, LiHTMLAttributes } from "react";
export type ChipsProps = HTMLAttributes<HTMLUListElement>;
/** A wrapping row of chips (.pi-chips). */
export declare function Chips({ className, ...rest }: ChipsProps): import("react").JSX.Element;
export type ChipProps = LiHTMLAttributes<HTMLLIElement>;
/** Small outlined pill (.pi-chip). Put chips in <Chips>. */
export declare function Chip({ className, ...rest }: ChipProps): import("react").JSX.Element;
