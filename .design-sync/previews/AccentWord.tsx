import { AccentWord } from "@proudindian/design";

const h = {
  font: "800 48px/1.05 var(--font-pi-display)",
  letterSpacing: "-.035em",
  padding: "18px 24px",
  borderRadius: 26,
};

export const Grounds = () => (
  <div style={{ display: "grid", gap: 14, padding: 28 }}>
    <p style={h}>
      Four ways we <AccentWord>show up.</AccentWord>
    </p>
    <p style={{ ...h, background: "var(--color-sky)" }}>
      Be an <AccentWord variant="outline">Optimist.</AccentWord>
    </p>
    <p
      style={{
        ...h,
        background: "var(--color-ink)",
        color: "var(--color-paper)",
      }}
    >
      Kalakriti <AccentWord variant="marigold">3.0</AccentWord>
    </p>
  </div>
);
