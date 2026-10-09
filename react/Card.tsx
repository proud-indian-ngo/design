import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import { cx } from "./cx";

export type CardVariant = "paper" | "paper-2" | "sky" | "wash" | "deep";

export type CardProps = { variant?: CardVariant } & (
  | ({ as?: "div" } & HTMLAttributes<HTMLDivElement>)
  | ({ as: "button" } & ButtonHTMLAttributes<HTMLButtonElement>)
);

/** The rounded, outlined bento tile (.pi-card). Renders <div>, or <button> with `as="button"`. */
export function Card({ variant = "paper", className, as, ...rest }: CardProps) {
  const cls = cx(
    "pi-card",
    variant !== "paper" && `pi-card--${variant}`,
    className
  );
  if (as === "button") {
    return (
      <button
        type="button"
        className={cls}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
  return <div className={cls} {...(rest as HTMLAttributes<HTMLDivElement>)} />;
}
