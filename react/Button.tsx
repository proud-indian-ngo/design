import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cx } from "./cx";

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

export type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/** Pill button with a 1.5px ink outline and a hard offset shadow (.pi-btn). Renders <a> when `href` is set. */
export function Button({
  variant = "ink",
  size = "md",
  block = false,
  arrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cx(
    "pi-btn",
    `pi-btn--${variant}`,
    size !== "md" && `pi-btn--${size}`,
    block && "pi-btn--block",
    className
  );
  const content = (
    <>
      {children}
      {arrow && (
        <>
          {" "}
          <span aria-hidden="true">→</span>
        </>
      )}
    </>
  );
  if (typeof rest.href === "string") {
    const anchor = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={cls} {...anchor}>
        {content}
      </a>
    );
  }
  const { type = "button", ...button } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    // oxlint-disable-next-line react/button-has-type -- type is a prop with a "button" default
    <button className={cls} type={type} {...button}>
      {content}
    </button>
  );
}
