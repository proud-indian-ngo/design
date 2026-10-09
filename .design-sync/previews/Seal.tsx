import { Seal } from "@proudindian/design";

export const Kinds = () => (
  <div style={{ display: "flex", gap: 20, alignItems: "center", padding: 28 }}>
    <Seal kind="main" />
    <Seal kind="80g" />
    <Seal kind="volunteer" />
    <Seal kind="kalakriti" />
    <Seal kind="optimists" size={140}>
      3.6k+
    </Seal>
  </div>
);
