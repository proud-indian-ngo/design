import type { SVGAttributes } from "react";
import { type DoodleName } from "./generated/doodles";
export interface DoodleProps extends Omit<SVGAttributes<SVGSVGElement>, "name"> {
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
export declare function Doodle({ name, label, size, className, width, height, ...rest }: DoodleProps): import("react").JSX.Element;
export { doodleNames, doodleTitles, type DoodleName, } from "./generated/doodles";
