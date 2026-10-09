import type { HTMLAttributes, LiHTMLAttributes } from "react";

import { cx } from "./cx";

export type ChipsProps = HTMLAttributes<HTMLUListElement>;

/** A wrapping row of chips (.pi-chips). */
export function Chips({ className, ...rest }: ChipsProps) {
  return <ul className={cx("pi-chips", className)} {...rest} />;
}

export type ChipProps = LiHTMLAttributes<HTMLLIElement>;

/** Small outlined pill (.pi-chip). Put chips in <Chips>. */
export function Chip({ className, ...rest }: ChipProps) {
  return <li className={cx("pi-chip", className)} {...rest} />;
}
