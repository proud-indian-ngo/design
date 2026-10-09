import type { ImgHTMLAttributes } from "react";
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
export declare function Sticker({ src, alt, crop, tilt, className, style, ...rest }: StickerProps): import("react").JSX.Element;
