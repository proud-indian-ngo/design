import type { HTMLAttributes } from "react";

import { cx } from "./cx";

/**
 * Brand root: paper background, Geist text (`--font-pi-sans`) and ink colour. Wrap a page, a marketing block or a
 * Claude Design preview in it. The primitives and components do not need it: their tokens never clash with a
 * shadcn/ui theme, so they render on-brand anywhere.
 */
export function PiRoot({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("pi-root", className)} {...rest} />;
}
