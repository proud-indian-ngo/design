import type { CSSProperties, HTMLAttributes } from "react";

import { cx } from "./cx";

export interface PolaroidProps extends HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  caption?: string;
  /** "peg" hangs from a clothesline (marigold peg, pivot at the top); "tape" is taped down; "plain" is just the frame */
  variant?: "plain" | "peg" | "tape";
  /** wrap the photo in the 4:5 window (default true) */
  frame?: boolean;
  /** object-position of the photo, e.g. "50% 35%" */
  position?: string;
  /** a small marigold label on the photo */
  tag?: string;
  /** tilt in degrees */
  tilt?: number;
  /** width of the whole polaroid, e.g. 220 or "14rem" */
  width?: number | string;
}

/** White-framed photo with a 1.5px ink border and an offset ink shadow (.pi-polaroid). */
export function Polaroid({
  src,
  alt,
  caption,
  variant = "plain",
  frame = true,
  position,
  tag,
  tilt,
  width,
  className,
  style,
  ...rest
}: PolaroidProps) {
  const imgStyle: CSSProperties | undefined = position
    ? { objectPosition: position }
    : undefined;
  const img = <img src={src} alt={alt} style={imgStyle} />;
  return (
    <figure
      className={cx(
        "pi-polaroid",
        "pi-polaroid--standalone",
        variant === "peg" && "pi-polaroid--peg",
        className
      )}
      style={{
        width,
        ...(tilt ? { transform: `rotate(${tilt}deg)` } : {}),
        ...style,
      }}
      {...rest}
    >
      {variant === "peg" && <Peg />}
      {variant === "tape" && <Tape />}
      {tag && <span className="pi-polaroid__tag">{tag}</span>}
      {frame ? <span className="pi-polaroid__photo">{img}</span> : img}
      {caption && (
        <figcaption className="pi-polaroid__caption">{caption}</figcaption>
      )}
    </figure>
  );
}

/** The marigold clothes peg a hanging polaroid clips onto (.pi-peg). */
export function Peg({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <i className={cx("pi-peg", className)} aria-hidden="true" {...rest} />;
}

/** A strip of translucent sky tape (.pi-tape), centred on the top edge by default. */
export function Tape({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx("pi-tape", "pi-tape--top", className)}
      aria-hidden="true"
      {...rest}
    />
  );
}
