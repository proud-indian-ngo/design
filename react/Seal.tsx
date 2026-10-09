import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";
import { type SealFile, sealArt } from "./generated/logo";

export type SealKind = "main" | "80g" | "volunteer" | "kalakriti" | "optimists";

const FILE: Record<SealKind, string> = {
  main: "pi-seal",
  "80g": "pi-seal-80g",
  volunteer: "pi-seal-volunteer",
  kalakriti: "pi-seal-kalakriti",
  optimists: "pi-seal-optimists-ring",
};

export interface SealProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** main (Bengaluru · since 2019), 80g (receipts), volunteer, kalakriti, or optimists (an empty ring for a number) */
  kind?: SealKind;
  /** colour (default) or mono; the optimists ring is always one colour */
  colourway?: "colour" | "mono";
  /** ring colour; defaults to the file's ink. "currentColor" follows the parent */
  color?: string;
  /** size of the seal (min 64px on screen) */
  size?: number | string;
  /** centre content, for the optimists ring (e.g. "3.6k+") */
  children?: ReactNode;
  /** accessible name; defaults to the seal's own label */
  label?: string;
}

const LABEL: Record<SealKind, string> = {
  main: "Proud Indian seal: Bengaluru, since 2019",
  "80g": "Proud Indian 80G seal",
  volunteer: "Proud Indian volunteer seal",
  kalakriti: "Kalakriti seal",
  optimists: "Optimists, since 2019, Bengaluru",
};

/**
 * A Proud Indian seal, inlined from logo/seals/. Stamp-production and screen-texture artwork stay as files (print
 * only / mock-ups only).
 */
export function Seal({
  kind = "main",
  colourway = "colour",
  color,
  size = 120,
  children,
  label,
  className,
  style,
  ...rest
}: SealProps) {
  const key =
    `${FILE[kind]}${colourway === "mono" && kind !== "optimists" ? "-mono" : ""}` as SealFile;
  const art = sealArt[key];
  const fileColor = art.attrs.color;
  return (
    <span
      className={cx("pi-seal", className)}
      role="img"
      aria-label={label ?? (children ? undefined : LABEL[kind])}
      style={{ width: size, color: color ?? fileColor, ...style }}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={art.viewBox}
        aria-hidden="true"
        focusable="false"
        // oxlint-disable-next-line react/no-danger -- trusted, generated from the package's own seal files
        dangerouslySetInnerHTML={{ __html: art.body }}
      />
      {children !== undefined && (
        <span className="pi-seal__centre">{children}</span>
      )}
    </span>
  );
}
