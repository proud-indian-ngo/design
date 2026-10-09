import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";

export interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  /** the pill number, e.g. "01" */
  num: ReactNode;
}

/** The numbered eyebrow, e.g. "01 Education" (.pi-label). */
export function SectionLabel({
  num,
  className,
  children,
  ...rest
}: SectionLabelProps) {
  return (
    <p className={cx("pi-label", className)} {...rest}>
      <span className="pi-label__num">{num}</span>
      {children}
    </p>
  );
}
