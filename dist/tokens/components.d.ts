/**
 * Component tokens, only where a primitive needs its own knobs. Consumed by css/primitives/.
 */
export declare const components: {
    readonly "btn-font": `${string} ${string} ${string}`;
    readonly "btn-pad": "12px 20px";
    readonly "btn-pad-lg": "16px 28px";
    readonly "btn-pad-xl": "18px 30px";
    readonly "btn-radius": string;
    readonly "btn-border": string;
    readonly "btn-shadow": string;
    readonly "btn-shadow-hover": string;
    readonly "btn-lift": "translate(-1px,-1px)";
    /** pressed: the button sinks into its own 3px hard shadow (2px move + 1px shadow keeps the shadow's edge still) */
    readonly "btn-press": "translate(2px,2px)";
    readonly "btn-shadow-press": `1px 1px 0 ${string}`;
    readonly "chip-font": `${string} ${string} ${string}`;
    readonly "chip-pad": "6px 13px";
    readonly "chip-bg": string;
    readonly "polaroid-bg": string;
    readonly "polaroid-pad": "9px 9px 0";
    readonly "polaroid-shadow": string;
    readonly "polaroid-frame-bg": string;
    readonly "peg-bg": string;
    readonly "tape-bg": string;
    readonly "ticket-notch": "12px";
    readonly "ticket-stub": "84px";
    readonly "ticket-h": "158px";
    readonly "ticket-h-phone": "150px";
    readonly "ticket-shadow": `drop-shadow(0 14px 16px ${string})`;
    readonly "card-radius": string;
    readonly "card-pad": "24px 26px";
    readonly sticker: `${string} ${string}`;
    readonly "doodle-outline-stroke": "1.4px";
    readonly "doodle-outline-on-paper": "0.42";
    readonly "doodle-outline-on-sky": "0.47";
    readonly "doodle-outline-on-ink": "0.3";
};
