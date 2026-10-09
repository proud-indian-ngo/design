import type { SVGAttributes } from "react";

import { cx } from "./cx";
import { type DoodleName, doodleArt } from "./generated/doodles";

export interface DoodleProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "name"
> {
  /** any file in illustrations/ (without .svg) */
  name: DoodleName;
  /** accessible name; without it the doodle is decorative (aria-hidden) */
  label?: string;
  /** width/height shorthand (the other side follows the viewBox) */
  size?: number | string;
}

/**
 * A brand doodle from illustrations/, inlined so its line follows CSS `color` (currentColor) and its animation hook
 * classes (.rays, .wink, .steam, …) are styleable. Adds .pi-doodle (display:block).
 */
export function Doodle({
  name,
  label,
  size,
  className,
  width,
  height,
  ...rest
}: DoodleProps) {
  const art = doodleArt[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={art.viewBox}
      {...art.attrs}
      width={width ?? size}
      height={height}
      className={cx("pi-doodle", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      // oxlint-disable-next-line react/no-danger -- trusted, generated from the package's own SVG files
      dangerouslySetInnerHTML={{ __html: art.body }}
      {...rest}
    />
  );
}

export {
  doodleNames,
  doodleTitles,
  type DoodleName,
} from "./generated/doodles";
