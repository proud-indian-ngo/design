import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
interface TicketOwnProps {
    /** paper (sessions) or marigold (Kalakriti) */
    variant?: "paper" | "marigold";
    /** small line above the title, e.g. "Sat 18 Oct · 10:00" */
    kicker: ReactNode;
    title: ReactNode;
    /** trailing "→" after the title */
    arrow?: boolean;
    /** the small cells along the bottom (usually three) */
    rail: ReactNode[];
    /** vertical text on the tear-off stub, e.g. "Admit one" */
    stub: ReactNode;
}
export type TicketProps = TicketOwnProps & (({
    href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "title">) | ({
    href?: undefined;
} & Omit<HTMLAttributes<HTMLDivElement>, "title">));
/** The "Admit one" stub ticket with punched corners and a perforated stub (.pi-ticket). One link when `href` is set. */
export declare function Ticket({ variant, kicker, title, arrow, rail, stub, className, ...rest }: TicketProps): import("react").JSX.Element;
export {};
