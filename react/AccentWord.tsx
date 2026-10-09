import type { HTMLAttributes } from "react";

import { cx } from "./cx";

export interface AccentWordProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * "paper": deep cyan, on paper (default) · "outline": white with an ink outline and offset, on cyan bands (40px
   * and up only) · "marigold": on ink, Kalakriti only
   */
  variant?: "paper" | "outline" | "marigold";
}

/** The one highlighted word of a headline (.pi-accent). */
export function AccentWord({
  variant = "paper",
  className,
  ...rest
}: AccentWordProps) {
  return (
    <span
      className={cx(
        "pi-accent",
        variant !== "paper" && `pi-accent--${variant}`,
        className
      )}
      {...rest}
    />
  );
}
