import type { HTMLAttributes } from "react";
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
export declare function Polaroid({ src, alt, caption, variant, frame, position, tag, tilt, width, className, style, ...rest }: PolaroidProps): import("react").JSX.Element;
/** The marigold clothes peg a hanging polaroid clips onto (.pi-peg). */
export declare function Peg({ className, ...rest }: HTMLAttributes<HTMLElement>): import("react").JSX.Element;
/** A strip of translucent sky tape (.pi-tape), centred on the top edge by default. */
export declare function Tape({ className, ...rest }: HTMLAttributes<HTMLSpanElement>): import("react").JSX.Element;
