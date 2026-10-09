import { Ticket } from "@proudindian/design";

export const Session = () => (
  <div style={{ width: 380, padding: 28 }}>
    <Ticket
      href="https://dash.proudindian.ngo/register"
      kicker="Sat 18 Oct · 10:00"
      title="Maths class"
      arrow
      rail={["Bengaluru", "2 hrs", "Teach"]}
      stub="Admit one"
    />
  </div>
);

export const Kalakriti = () => (
  <div style={{ width: 380, padding: 28 }}>
    <Ticket
      variant="marigold"
      kicker="20 Sep 2026"
      title="Kalakriti 3.0"
      rail={["8 events", "Full day", "Bengaluru"]}
      stub="Festival"
    />
  </div>
);
