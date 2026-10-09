import { Doodle, doodleNames } from "@proudindian/design";

export const All = () => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 20,
      padding: 28,
      color: "var(--color-ink)",
    }}
  >
    {doodleNames.map((n) => (
      <figure
        key={n}
        style={{
          margin: 0,
          display: "grid",
          gap: 4,
          justifyItems: "center",
          font: "600 12px var(--font-pi-sans)",
        }}
      >
        <Doodle name={n} style={{ width: 80, height: 64 }} />
        {n}
      </figure>
    ))}
  </div>
);
