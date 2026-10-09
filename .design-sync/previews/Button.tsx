import { Button } from "@proudindian/design";

export const Variants = () => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: 28 }}>
    <Button variant="ink">Become an Optimist</Button>
    <Button variant="sky" arrow>
      Register
    </Button>
    <Button variant="donate">Donate</Button>
    <Button variant="ghost">Read reports</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 28 }}>
    <Button>Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="xl" variant="donate">
      Give once
    </Button>
  </div>
);
