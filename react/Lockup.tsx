import type { SVGAttributes } from "react";

import { type LogoFile, logoArt } from "./generated/logo";

export type LockupLayout =
  | "horizontal"
  | "compact"
  | "stacked"
  | "symbol"
  | "wordmark";
export type LockupColourway = "colour" | "mono" | "reversed";

const BASE: Record<LockupLayout, string> = {
  horizontal: "pi-lockup",
  compact: "pi-lockup-compact",
  stacked: "pi-stacked",
  symbol: "pi-symbol",
  wordmark: "pi-wordmark",
};
const HEAD = /class="s" fill="(#[0-9A-Fa-f]{6})"/;

export interface LockupProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "color"
> {
  /** horizontal (default; letterhead, footer), compact (header pill, under 32px), stacked, symbol, wordmark */
  layout?: LockupLayout;
  /** colour on paper (default), reversed on ink (screen), mono for one colour and anything on sky */
  colourway?: LockupColourway;
  /**
   * Ink colour. Defaults to the file's (ink, or paper for reversed). Pass "currentColor" to follow the parent's CSS
   * colour.
   */
  color?: string;
  /** let the child's head follow `--pi-accent` (falls back to the file's colour); see logo/README.md */
  accentVar?: boolean;
  /** accessible name (default "Proud Indian"); pass "" to make it decorative */
  title?: string;
  /** rendered height; width follows */
  height?: number | string;
}

/** The Proud Indian logo, inlined from logo/svg/. The file artwork is never redrawn. */
export function Lockup({
  layout = "horizontal",
  colourway = "colour",
  color,
  accentVar = false,
  title = "Proud Indian",
  height,
  className,
  ...rest
}: LockupProps) {
  const way = layout === "wordmark" ? "colour" : colourway; // there is one wordmark file
  const key = `${BASE[layout]}${way === "colour" ? "" : `-${way}`}` as LogoFile;
  const art = logoArt[key];
  const body = accentVar
    ? art.body.replace(
        HEAD,
        (_m, hex: string) => `class="s" style="fill:var(--pi-accent,${hex})"`
      )
    : art.body;
  const fileColor = art.attrs.color;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={art.viewBox}
      color={color ?? fileColor}
      height={height}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      // oxlint-disable-next-line react/no-danger -- trusted, generated from the package's own logo files
      dangerouslySetInnerHTML={{ __html: body }}
      {...rest}
    />
  );
}
