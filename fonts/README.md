# Fonts

These are the brand fonts the website uses: the Latin subsets of the two variable fonts, plus a small static instance of Bricolage, self-hosted as woff2. Both are under the SIL Open Font License 1.1 (see the `OFL-*.txt` files). The two variable files are byte-identical to `proud-indian-design/prototypes/final/fonts/`.

| File | Family | Axes | Use |
|---|---|---|---|
| `bricolage-grotesque-latin-wdth-normal.woff2` | Bricolage Grotesque (Mathieu Triay), v1.001 | `wght` 200–800, `wdth` 75–100 | Display and headings: 800, normal width, tracking −0.035em |
| `bricolage-grotesque-800-latin.woff2` | Bricolage Grotesque, a static instance of the file above at `wght` 800, `wdth` 100, subset to Basic Latin, Latin-1, General Punctuation, ₹, €, ™, ← ↑ → ↓, −, ✓ ✕ ✦ (all OpenType features kept) | none | Display at 800 and normal width, which is all the brand uses. About 20 KB against 78 KB. `css/fonts.css` serves it for exactly 800 at 100% width and falls back to the variable file for anything else. Preload this one |
| `geist-latin-wght-normal.woff2` | Geist (Vercel), v1.800 | `wght` 100–900 | Body and interface: 400–600 |

The `@font-face` rules are in `css/fonts.css` (export `@proudindian/design/fonts.css`).

The prototype names the family `Brico`. The brand guide also uses Anek Latin, Kannada and Devanagari for the wordmark and for Indian scripts; those fonts are in `brand/guidelines/assets/fonts/`.

To regenerate the static Bricolage file (fontTools 4.x):

```py
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
f = instancer.instantiateVariableFont(TTFont("bricolage-grotesque-latin-wdth-normal.woff2"), {"wght": 800, "wdth": 100}, updateFontNames=True)
o = subset.Options(); o.flavor = "woff2"; o.layout_features = ["*"]; o.name_IDs = ["*"]; o.name_languages = ["*"]; o.notdef_outline = True
s = subset.Subsetter(o)
s.populate(unicodes=subset.parse_unicodes("U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+20B9,U+2122,U+2190-2193,U+2212,U+2713,U+2715,U+2726"))
s.subset(f); f.flavor = "woff2"; f.save("bricolage-grotesque-800-latin.woff2")
```
