# Marketing kit

Ready-to-use social, print, office and merchandise files, built from the brand guide's marketing pages (pp. 22–27) at real size. The website's internal brand page (`proudindian.ngo/brand/`) lists and serves them.

```sh
bun run marketing:render   # → marketing/out/ (about a minute; commit the result)
```

| Path | What it is |
|---|---|
| `src/templates.ts` | The artwork, one function per piece, in HTML and `kit.css` |
| `src/items.ts` | The catalogue: each piece's files, sizes, and what it's for |
| `src/facts.ts` | The stats, links, registrations and address the artwork prints. They mirror the website's `site.yaml`: change them there first |
| `render.ts` | Renders everything to `out/`, then builds the editable files and `out/manifest.json` |
| `assets/` | Photos and cut-outs, copied from the website (already published, consented, badges blurred). Add only photos that meet the guide's photography rules (p. 16) |
| `out/` | The rendered kit, by group (`social/`, `print/`, `office/`, `merch/`), with a `*.preview.jpg` per piece and `manifest.json` |

## How the files are made

- **Screen** pieces (posts, stories, covers, slides, email art) are PNG or JPG at their exact upload size. Templates are drawn in website pixels and rendered with CSS `zoom`, so outlines, offsets and type keep the website's proportions (a 1080 px post is a 432 px design at zoom 2.5).
- **Print** pieces are PDFs at the trim size plus bleed (3 mm; 5 mm on the standee, 2 mm on the lanyard), RGB, fonts embedded, no crop marks. The printer converts to CMYK: ask for a proof. Merchandise prints (tee, mug) are one colour on a transparent page.
- **Editable** files: the slide template, visiting card and badge as PPTX (PowerPoint, Keynote, Google Slides), the letterhead and certificate as DOCX (Word, Google Docs), the email signature as HTML. Their artwork is a rendered background, and their text uses Bricolage Grotesque and Geist, which people need to install (Google Fonts) or the text falls back.
- **Blank** variants of the posts and stories keep the ground, logo and art without the words, for Canva.
- QR codes are generated at render time from `facts.links`.

## Releases

Git installs leave `marketing/` and `brand/` out (`.gitattributes`). On each release, CI attaches `proud-indian-brand-assets.zip` to the GitHub release: the guide PDF, the Anek fonts and `marketing/out/`. The website downloads that zip for the version it pins.
