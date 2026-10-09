import { Polaroid } from "@proudindian/design";

// Placeholder art: Claude Design has no event photos (they live in the website repo). Use real, consented photos.
const photo =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#BFE6F6"/><circle cx="200" cy="210" r="90" fill="#4CC0EC"/><rect x="110" y="300" width="180" height="200" rx="60" fill="#0B7FAE"/></svg>'
  );

export const Variants = () => (
  <div
    style={{
      display: "flex",
      gap: 36,
      padding: "40px 28px",
      alignItems: "flex-start",
    }}
  >
    <Polaroid
      src={photo}
      alt="Placeholder"
      caption="Maths class"
      width={200}
      tilt={-2}
    />
    <Polaroid
      src={photo}
      alt="Placeholder"
      caption="Gift a Smile"
      variant="tape"
      width={200}
      tilt={2}
    />
    <Polaroid
      src={photo}
      alt="Placeholder"
      caption="Rangoli"
      variant="peg"
      tag="Kalakriti"
      width={200}
      tilt={-3}
    />
  </div>
);
