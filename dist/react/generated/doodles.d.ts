export interface Art {
    readonly viewBox: string;
    readonly attrs: Readonly<Record<string, string>>;
    readonly body: string;
}
export type DoodleName = "sun" | "sparkle" | "sparkle-glint" | "star" | "book" | "bowl-steam" | "heart" | "heart-plain" | "paintbrush" | "hands-raised" | "hand-point" | "clock" | "notepad" | "bird" | "paper-plane" | "matka" | "squiggle-underline" | "underline-loop" | "arrow-curve" | "arrow-wavy" | "kite";
export declare const doodleArt: Readonly<Record<DoodleName, Art>>;
export declare const doodleTitles: Readonly<Record<DoodleName, string>>;
export declare const doodleNames: DoodleName[];
