import { Card } from "@proudindian/design";

export const Variants = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16,
      padding: 28,
    }}
  >
    <Card>
      <b style={{ font: "800 40px var(--font-pi-display)" }}>23k+</b>
      <span>people reached</span>
    </Card>
    <Card variant="sky">
      <b style={{ font: "800 40px var(--font-pi-display)" }}>3.6k+</b>
      <span>Optimists</span>
    </Card>
    <Card variant="deep">
      <b style={{ font: "800 40px var(--font-pi-display)" }}>95%</b>
      <span>of funds go to programmes</span>
    </Card>
    <Card variant="paper-2">
      <b style={{ font: "800 40px var(--font-pi-display)" }}>14k+</b>
      <span>volunteer hours</span>
    </Card>
    <Card variant="wash">
      <b style={{ font: "800 26px var(--font-pi-display)" }}>80G · 12A</b>
      <span>NGO Darpan KA/2019/0234065</span>
    </Card>
  </div>
);
