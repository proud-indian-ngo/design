import { Lockup } from "@proudindian/design";

export const Layouts = () => (
  <div style={{ display: "flex", gap: 28, alignItems: "center", padding: 28 }}>
    <Lockup layout="compact" height={30} />
    <Lockup layout="horizontal" height={44} />
    <Lockup layout="stacked" height={96} />
    <Lockup layout="symbol" height={56} />
  </div>
);

export const Colourways = () => (
  <div style={{ display: "flex", gap: 20, padding: 28 }}>
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "var(--color-paper)",
      }}
    >
      <Lockup height={36} />
    </div>
    <div
      style={{ padding: 18, borderRadius: 14, background: "var(--color-ink)" }}
    >
      <Lockup colourway="reversed" height={36} />
    </div>
    <div
      style={{ padding: 18, borderRadius: 14, background: "var(--color-sky)" }}
    >
      <Lockup colourway="mono" height={36} />
    </div>
  </div>
);
