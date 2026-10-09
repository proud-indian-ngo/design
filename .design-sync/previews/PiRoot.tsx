import { PiRoot, SectionLabel, AccentWord, Button } from "@proudindian/design";

export const Page = () => (
  <PiRoot style={{ padding: 40 }}>
    <SectionLabel num="01">Education</SectionLabel>
    <h2
      style={{
        font: "800 56px/1 var(--font-pi-display)",
        letterSpacing: "-.035em",
        margin: "8px 0 20px",
      }}
    >
      Your next weekend, <AccentWord>sorted.</AccentWord>
    </h2>
    <Button variant="ink" arrow href="https://dash.proudindian.ngo/register">
      Become an Optimist
    </Button>
  </PiRoot>
);
