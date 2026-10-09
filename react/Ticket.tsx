import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";

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

export type TicketProps = TicketOwnProps &
  (
    | ({ href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "title"
      >)
    | ({ href?: undefined } & Omit<HTMLAttributes<HTMLDivElement>, "title">)
  );

/** The "Admit one" stub ticket with punched corners and a perforated stub (.pi-ticket). One link when `href` is set. */
export function Ticket({
  variant = "paper",
  kicker,
  title,
  arrow,
  rail,
  stub,
  className,
  ...rest
}: TicketProps) {
  const body = (
    <span className="pi-ticket__body">
      <span className="pi-ticket__main">
        <span className="pi-ticket__kicker">{kicker}</span>
        <span className="pi-ticket__title">
          {title}
          {arrow && (
            <>
              {" "}
              <span aria-hidden="true">→</span>
            </>
          )}
        </span>
        <span className="pi-ticket__rail">
          {rail.map((r, i) => (
            // oxlint-disable-next-line react/no-array-index-key -- static cells
            <span key={i}>{r}</span>
          ))}
        </span>
      </span>
      <span className="pi-ticket__stub" aria-hidden="true">
        <span>{stub}</span>
      </span>
    </span>
  );
  const cls = cx("pi-ticket", `pi-ticket--${variant}`, className);
  if (typeof rest.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {body}
      </a>
    );
  }
  return (
    <div className={cls} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {body}
    </div>
  );
}
