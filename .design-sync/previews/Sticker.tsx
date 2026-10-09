import { Sticker } from "@proudindian/design";

const cutout =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><circle cx="100" cy="70" r="50" fill="#F4A62A"/><rect x="45" y="125" width="110" height="175" rx="40" fill="#0B7FAE"/></svg>'
  );

export const DieCut = () => (
  <div
    style={{
      display: "flex",
      gap: 40,
      padding: "40px 40px 64px",
      background: "var(--color-sky)",
    }}
  >
    <Sticker
      src={cutout}
      alt="A child (placeholder)"
      style={{ width: 140 }}
      tilt={-4}
    />
    <Sticker
      src={cutout}
      alt="A child (placeholder), cropped"
      crop="200/240"
      style={{ width: 140 }}
      tilt={3}
    />
  </div>
);
