import type { CSSProperties, ImgHTMLAttributes } from "react";

import { cx } from "./cx";

export interface StickerProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /**
   * Aspect ratio of a box that flat-crops the cut-out's bottom, e.g. "617/950". The box then carries the accessible
   * name as role="img".
   */
  crop?: string;
  /** tilt in degrees (the brand allows about ±5°) */
  tilt?: number;
}

/** A cut-out photo with a die-cut paper outline and a soft lift (.pi-sticker). */
export function Sticker({
  src,
  alt,
  crop,
  tilt,
  className,
  style,
  ...rest
}: StickerProps) {
  const rotate: CSSProperties | undefined = tilt
    ? { transform: `rotate(${tilt}deg)` }
    : undefined;
  if (crop) {
    return (
      <span
        className={cx("pi-sticker", "pi-sticker--crop", className)}
        role="img"
        aria-label={alt}
        style={{ aspectRatio: crop, ...rotate, ...style }}
      >
        <img src={src} alt="" {...rest} />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cx("pi-sticker", className)}
      style={{ ...rotate, ...style }}
      {...rest}
    />
  );
}
