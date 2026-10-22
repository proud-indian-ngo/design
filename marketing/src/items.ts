/**
 * The marketing kit: every piece, its rendered files and what it's for. marketing/render.ts renders these to
 * marketing/out/<group>/ and writes marketing/out/manifest.json, which the website's /brand/ page lists.
 *
 * screen: rendered to PNG or JPG at w × h px (the template is designed at w / zoom website pixels).
 * print: rendered to PDF at the trim size plus `bleed` mm on every side (no crop marks), with a PNG preview.
 * `hidden` outputs are only inputs for the editable files (the PPTX and DOCX backgrounds) and aren't listed.
 */
import * as t from "./templates";

export type Group = "social" | "print" | "office" | "merch";

export interface Output {
  file: string;
  label: string;
  html: () => string;
  screen?: { w: number; h: number; zoom: number; format: "png" | "jpg" };
  print?: {
    w: number;
    h: number;
    bleed: number;
    zoom?: number;
    transparent?: boolean;
    previewOn?: string;
  };
  hidden?: boolean;
}

export interface Piece {
  id: string;
  group: Group;
  title: string;
  use: string;
  outputs: Output[];
  /** files made by render.ts from the outputs (PPTX, DOCX, HTML), listed after them */
  editables?: { file: string; label: string }[];
}

export const GROUPS: Record<Group, string> = {
  social: "Social media",
  print: "Print",
  office: "Office and email",
  merch: "Cards and merchandise",
};

const post = (
  file: string,
  label: string,
  html: () => string,
  h: number
): Output => ({
  file,
  label,
  html,
  screen: { w: 1080, h: h === 540 ? 1350 : 1080, zoom: 2.5, format: "jpg" },
});
const story = (file: string, label: string, html: () => string): Output => ({
  file,
  label,
  html,
  screen: { w: 1080, h: 1920, zoom: 2.5, format: "jpg" },
});
const BLEED = 3;

export const pieces: Piece[] = [
  // ---- social
  {
    id: "post-volunteer",
    group: "social",
    title: "Post: volunteer call",
    use: "Instagram, Facebook and LinkedIn. One-colour lockup on sky. Blank: add your own words in Canva.",
    outputs: [
      post("post-volunteer-4x5.jpg", "4:5", () => t.postVolunteer(540), 540),
      post("post-volunteer-1x1.jpg", "1:1", () => t.postVolunteer(432), 432),
      post(
        "post-volunteer-blank-4x5.jpg",
        "Blank 4:5",
        () => t.postVolunteer(540, true),
        540
      ),
    ],
  },
  {
    id: "post-donate",
    group: "social",
    title: "Post: donation appeal",
    use: "Full colour on paper, marigold only on Donate.",
    outputs: [
      post("post-donate-4x5.jpg", "4:5", () => t.postDonate(540), 540),
      post("post-donate-1x1.jpg", "1:1", () => t.postDonate(432), 432),
      post(
        "post-donate-blank-4x5.jpg",
        "Blank 4:5",
        () => t.postDonate(540, true),
        540
      ),
    ],
  },
  {
    id: "post-kalakriti",
    group: "social",
    title: "Post: Kalakriti",
    use: "The festival, on ink with marigold. Works all year; the 4:5 adds Kalakriti 3.0's numbers.",
    outputs: [
      post("post-kalakriti-4x5.jpg", "4:5", () => t.postKalakriti(540), 540),
      post("post-kalakriti-1x1.jpg", "1:1", () => t.postKalakriti(432), 432),
      post(
        "post-kalakriti-blank-4x5.jpg",
        "Blank 4:5",
        () => t.postKalakriti(540, true),
        540
      ),
    ],
  },
  {
    id: "story-volunteer",
    group: "social",
    title: "Story: volunteer",
    use: "Instagram and Facebook stories, WhatsApp status. 1080 × 1920.",
    outputs: [
      story("story-volunteer.jpg", "Story", () => t.storyVolunteer()),
      story("story-volunteer-blank.jpg", "Blank", () => t.storyVolunteer(true)),
    ],
  },
  {
    id: "story-donate",
    group: "social",
    title: "Story: donate",
    use: "Stories and WhatsApp status. Add the donate link as a link sticker.",
    outputs: [
      story("story-donate.jpg", "Story", () => t.storyDonate()),
      story("story-donate-blank.jpg", "Blank", () => t.storyDonate(true)),
    ],
  },
  {
    id: "cover-linkedin",
    group: "social",
    title: "LinkedIn cover",
    use: "Company page banner, 1584 × 396. No logo: the avatar covers the bottom left.",
    outputs: [
      {
        file: "cover-linkedin.png",
        label: "PNG",
        html: () => t.cover(792, 198, { safeLeft: 120, safeRight: 20 }),
        screen: { w: 1584, h: 396, zoom: 2, format: "png" },
      },
    ],
  },
  {
    id: "cover-facebook",
    group: "social",
    title: "Facebook cover",
    use: "Page cover, 1640 × 624. Phones crop the sides, so everything sits in the middle.",
    outputs: [
      {
        file: "cover-facebook.png",
        label: "PNG",
        html: () => t.cover(820, 312, { safeLeft: 70, safeRight: 70 }),
        screen: { w: 1640, h: 624, zoom: 2, format: "png" },
      },
    ],
  },
  {
    id: "cover-x",
    group: "social",
    title: "X header",
    use: "Profile header, 1500 × 500. The avatar covers the bottom left.",
    outputs: [
      {
        file: "cover-x.png",
        label: "PNG",
        html: () => t.cover(750, 250, { safeLeft: 110, safeRight: 20 }),
        screen: { w: 1500, h: 500, zoom: 2, format: "png" },
      },
    ],
  },
  {
    id: "cover-youtube",
    group: "social",
    title: "YouTube banner",
    use: "Channel art, 2560 × 1440, with everything inside the 1546 × 423 area every device shows.",
    outputs: [
      {
        file: "cover-youtube.png",
        label: "PNG",
        html: t.youtube,
        screen: { w: 2560, h: 1440, zoom: 2, format: "png" },
      },
    ],
  },
  {
    id: "share-donate",
    group: "social",
    title: "Share card: donate",
    use: "WhatsApp and link previews for a donation appeal, 1200 × 630.",
    outputs: [
      {
        file: "share-donate.png",
        label: "PNG",
        html: t.shareDonate,
        screen: { w: 1200, h: 630, zoom: 2, format: "png" },
      },
    ],
  },

  // ---- print
  {
    id: "flyer-volunteer",
    group: "print",
    title: "Volunteer flyer, A4",
    use: "Notice boards, colleges, offices. The QR code opens the register page. 3 mm bleed.",
    outputs: [
      {
        file: "flyer-volunteer-a4.pdf",
        label: "PDF",
        html: () => t.flyerVolunteer(BLEED),
        print: { w: 210, h: 297, bleed: BLEED },
      },
    ],
  },
  {
    id: "leaflet-donate",
    group: "print",
    title: "Donation leaflet, A5",
    use: "Events and drives. The QR code opens the donate page. 3 mm bleed.",
    outputs: [
      {
        file: "leaflet-donate-a5.pdf",
        label: "PDF",
        html: () => t.leafletDonate(BLEED),
        print: { w: 148, h: 210, bleed: BLEED },
      },
    ],
  },
  {
    id: "poster-kalakriti",
    group: "print",
    title: "Kalakriti poster, A3",
    use: "For any edition: no date. The QR code opens the festival page. 3 mm bleed.",
    outputs: [
      {
        file: "poster-kalakriti-a3.pdf",
        label: "PDF",
        html: () => t.posterKalakriti(BLEED),
        print: { w: 297, h: 420, bleed: BLEED },
      },
    ],
  },
  {
    id: "standee",
    group: "print",
    title: "Roll-up standee, 85 × 200 cm",
    use: "Events and stalls. Keep the bottom 15 cm clear: most stands hide it. 5 mm bleed; check your printer's template.",
    outputs: [
      {
        file: "standee-85x200.pdf",
        label: "PDF",
        html: () => t.standee(5),
        print: { w: 850, h: 2000, bleed: 5, zoom: 10 },
      },
    ],
  },
  {
    id: "banner-centre",
    group: "print",
    title: "Community centre banner, 4 × 2 ft",
    use: "Flex sign for the front of the community centre. The Kannada name leads, in the upper half, as Karnataka requires for name boards. Ask for eyelets in the corners. 5 mm bleed.",
    outputs: [
      {
        file: "banner-centre-4x2ft.pdf",
        label: "PDF",
        html: () => t.bannerCentre(5),
        print: { w: 1220, h: 610, bleed: 5, zoom: 10 },
      },
    ],
  },

  // ---- office
  {
    id: "slides",
    group: "office",
    title: "Slide template, 16:9",
    use: "Title, section, content, photo and closing layouts with editable text. Opens in PowerPoint, Keynote and Google Slides.",
    outputs: (["title", "section", "content", "photo", "closing"] as const).map(
      (kind) => ({
        file: `slide-${kind}.png`,
        label: `BG ${kind}`,
        html: () => t.slide(kind),
        screen: { w: 1920, h: 1080, zoom: 2, format: "png" as const },
      })
    ),
    editables: [{ file: "proud-indian-slides.pptx", label: "PPTX" }],
  },
  {
    id: "letterhead",
    group: "office",
    title: "Letterhead, A4",
    use: "Letters and formal documents. The DOCX opens in Word and Google Docs with the header and footer set.",
    outputs: [
      {
        file: "letterhead-a4.pdf",
        label: "PDF",
        html: t.letterhead,
        print: { w: 210, h: 297, bleed: 0 },
      },
    ],
    editables: [{ file: "letterhead.docx", label: "DOCX" }],
  },
  {
    id: "certificate",
    group: "office",
    title: "Certificate of participation",
    use: "A4 landscape. Type the name and occasion in the DOCX, or print the PDF and write them in.",
    outputs: [
      {
        file: "certificate-a4.pdf",
        label: "PDF",
        html: () => t.certificate(),
        print: { w: 297, h: 210, bleed: 0 },
      },
      {
        file: "certificate-bg.png",
        label: "BG",
        html: () => t.certificate(true),
        print: { w: 297, h: 210, bleed: 0 },
        hidden: true,
      },
    ],
    editables: [{ file: "certificate.docx", label: "DOCX" }],
  },
  {
    id: "email-signature",
    group: "office",
    title: "Email signature",
    use: "Paste the HTML into Gmail or Outlook settings, then change the name and role. The logo loads from proudindian.ngo.",
    outputs: [
      {
        file: "email-signature-logo.png",
        label: "PNG",
        html: () =>
          `<div class="art white" style="width:max-content;padding:0">${t.logo("pi-lockup-compact", 28)}</div>`,
        screen: { w: 0, h: 56, zoom: 2, format: "png" },
      },
    ],
    editables: [{ file: "email-signature.html", label: "HTML" }],
  },
  {
    id: "email-header",
    group: "office",
    title: "Newsletter header and footer",
    use: "For a 600 px email (images at 2x). Put the address and links in the email as text, under the footer.",
    outputs: [
      {
        file: "email-header.png",
        label: "Header",
        html: t.emailHeader,
        screen: { w: 1200, h: 192, zoom: 2, format: "png" },
      },
      {
        file: "email-footer.png",
        label: "Footer",
        html: t.emailFooter,
        screen: { w: 1200, h: 220, zoom: 2, format: "png" },
      },
    ],
  },
  {
    id: "call-background",
    group: "office",
    title: "Video-call background",
    use: "Zoom, Meet and Teams, 1920 × 1080. The logo sits top right, clear of your face.",
    outputs: [
      {
        file: "call-background-paper.png",
        label: "Paper",
        html: () => t.callBackground("paper"),
        screen: { w: 1920, h: 1080, zoom: 2, format: "png" },
      },
      {
        file: "call-background-ink.png",
        label: "Ink",
        html: () => t.callBackground("ink"),
        screen: { w: 1920, h: 1080, zoom: 2, format: "png" },
      },
    ],
  },

  // ---- cards and merchandise
  {
    id: "visiting-card",
    group: "merch",
    title: "Visiting card, 85 × 55 mm",
    use: "Front: stacked reversed on ink. Back: type your name in the PPTX, then export a PDF for the printer. 3 mm bleed.",
    outputs: [
      {
        file: "visiting-card-front.pdf",
        label: "Front PDF",
        html: () => t.cardFront(BLEED),
        print: { w: 85, h: 55, bleed: BLEED },
      },
      {
        file: "visiting-card-back.pdf",
        label: "Back PDF",
        html: () => t.cardBack(BLEED),
        print: { w: 85, h: 55, bleed: BLEED },
      },
      {
        file: "visiting-card-back-bg.png",
        label: "BG",
        html: () => t.cardBack(BLEED, true),
        print: { w: 85, h: 55, bleed: BLEED },
        hidden: true,
      },
    ],
    editables: [{ file: "visiting-card.pptx", label: "PPTX" }],
  },
  {
    id: "badge",
    group: "merch",
    title: "Volunteer badge, ID-card size",
    use: "54 × 86 mm, reversed on ink with the volunteer seal. Type names in the PPTX. 3 mm bleed.",
    outputs: [
      {
        file: "badge-volunteer.pdf",
        label: "PDF",
        html: () => t.badge(BLEED),
        print: { w: 54, h: 86, bleed: BLEED },
      },
      {
        file: "badge-volunteer-bg.png",
        label: "BG",
        html: () => t.badge(BLEED, true),
        print: { w: 54, h: 86, bleed: BLEED },
        hidden: true,
      },
    ],
    editables: [{ file: "badge-volunteer.pptx", label: "PPTX" }],
  },
  {
    id: "crew-pass",
    group: "merch",
    title: "Kalakriti crew pass",
    use: "100 × 55 mm, the website's ticket style. Write the date on the line. 3 mm bleed.",
    outputs: [
      {
        file: "kalakriti-crew-pass.pdf",
        label: "PDF",
        html: () => t.crewPass(BLEED),
        print: { w: 100, h: 55, bleed: BLEED },
      },
    ],
  },
  {
    id: "lanyard",
    group: "merch",
    title: "Lanyard, 20 mm",
    use: "Woven or printed strap, 90 cm. One colour, paper on ink, symbol 13 mm tall. 2 mm bleed.",
    outputs: [
      {
        file: "lanyard-20mm.pdf",
        label: "PDF",
        html: () => t.lanyard(2),
        print: { w: 900, h: 20, bleed: 2 },
      },
    ],
  },
  {
    id: "tee",
    group: "merch",
    title: "Tee, back print",
    use: "One colour paper for an ink tee, on a transparent page, 28 × 32 cm. Front: the one-colour symbol (pi-symbol-mono.svg), 9 cm wide.",
    outputs: [
      {
        file: "tee-back.pdf",
        label: "PDF",
        html: t.teeBack,
        print: {
          w: 280,
          h: 320,
          bleed: 0,
          transparent: true,
          previewOn: "ink",
        },
      },
    ],
  },
  {
    id: "mug",
    group: "merch",
    title: "Mug wrap",
    use: "200 × 85 mm, one colour ink, the lockup on both sides. Tote and cap: use pi-stacked-mono.svg and pi-symbol-mono.svg.",
    outputs: [
      {
        file: "mug-wrap.pdf",
        label: "PDF",
        html: t.mugWrap,
        print: {
          w: 200,
          h: 85,
          bleed: 0,
          transparent: true,
          previewOn: "white",
        },
      },
    ],
  },
  {
    id: "sticker-sheet",
    group: "merch",
    title: "Sticker sheet, A6",
    use: "Discs, seals and “Optimist.” Send both PDFs: the art, and the art with the die-cut lines in magenta. 3 mm bleed.",
    outputs: [
      {
        file: "sticker-sheet-a6.pdf",
        label: "PDF",
        html: () => t.stickerSheet(BLEED, false),
        print: { w: 105, h: 148, bleed: BLEED },
      },
      {
        file: "sticker-sheet-a6-cutlines.pdf",
        label: "Cut lines",
        html: () => t.stickerSheet(BLEED, true),
        print: { w: 105, h: 148, bleed: BLEED },
      },
    ],
  },
];
