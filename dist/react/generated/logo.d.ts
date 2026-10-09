import type { Art } from "./doodles";
export type LogoFile = "pi-lockup-compact-mono" | "pi-lockup-compact-reversed" | "pi-lockup-compact" | "pi-lockup-mono" | "pi-lockup-reversed" | "pi-lockup" | "pi-stacked-mono" | "pi-stacked-reversed" | "pi-stacked" | "pi-symbol-mono" | "pi-symbol-reversed" | "pi-symbol" | "pi-wordmark";
export type SealFile = "pi-seal-80g-mono" | "pi-seal-80g" | "pi-seal-kalakriti-mono" | "pi-seal-kalakriti" | "pi-seal-mono" | "pi-seal-optimists-ring" | "pi-seal-volunteer-mono" | "pi-seal-volunteer" | "pi-seal";
export declare const logoArt: Readonly<Record<LogoFile, Art>>;
export declare const sealArt: Readonly<Record<SealFile, Art>>;
