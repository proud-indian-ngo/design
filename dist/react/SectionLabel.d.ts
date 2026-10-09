import type { HTMLAttributes, ReactNode } from "react";
export interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
    /** the pill number, e.g. "01" */
    num: ReactNode;
}
/** The numbered eyebrow, e.g. "01 Education" (.pi-label). */
export declare function SectionLabel({ num, className, children, ...rest }: SectionLabelProps): import("react").JSX.Element;
