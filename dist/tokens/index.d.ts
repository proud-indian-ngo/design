export * from "./primitives";
export { components } from "./components";
export { semantic, semanticColor, shadow } from "./semantic";
export type Group = {
    title: string;
    theme: boolean;
    vars: [string, string][];
};
/** Every custom property, grouped for theme.css, tokens.css and the style guide. */
export declare function tokenGroups(): Group[];
/** Tailwind v4 theme. `static` emits every variable, used or not, so hand-written CSS can rely on them. */
export declare function themeCss(): string;
export declare function tokensCss(): string;
