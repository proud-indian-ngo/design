"""Glyph outlining helpers: Bricolage 800 + Geist (static instances) -> SVG path data.
The fonts are decompressed from the package woff2s in ../fonts/."""
import math
import os
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib import instancer
import uharfbuzz as hb

T = '/tmp/pi-design-logo-tools/'
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts') + '/'


def _prep():
    """Decompress the site's woff2 files to ttf once (HarfBuzz and the instancer want sfnt)."""
    import os
    os.makedirs(T, exist_ok=True)
    for src, dst in (('bricolage-grotesque-latin-wdth-normal.woff2', 'brico.ttf'), ('geist-latin-wght-normal.woff2', 'geist.ttf')):
        if not os.path.exists(T + dst):
            t = TTFont(FONTS + src); t.flavor = None; t.save(T + dst)


_prep()


def n(v, nd=2):
    s = f"{v:.{nd}f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


class PathPen(BasePen):
    def __init__(self, gs, f, nd=2):
        super().__init__(gs)
        self.f, self.d, self.nd = f, [], nd

    def p(self, pt):
        x, y = self.f(pt)
        return f"{n(x, self.nd)} {n(y, self.nd)}"

    def _moveTo(self, a): self.d.append('M' + self.p(a))
    def _lineTo(self, a): self.d.append('L' + self.p(a))
    def _curveToOne(self, a, b, c): self.d.append('C' + ' '.join(self.p(q) for q in (a, b, c)))
    def _qCurveToOne(self, a, b): self.d.append('Q' + self.p(a) + ' ' + self.p(b))
    def _closePath(self): self.d.append('Z')
    def _endPath(self): pass


class Font:
    def __init__(self, path, wght=None):
        t = TTFont(path)
        if wght is not None:
            t = instancer.instantiateVariableFont(t, {'wght': wght})
            path = path.replace('.ttf', f'-{wght}.ttf')
            t.save(path)
        self.t = t
        self.gs = t.getGlyphSet()
        self.order = t.getGlyphOrder()
        self.cap = t['OS/2'].sCapHeight
        self.hbfont = hb.Font(hb.Face(hb.Blob.from_file_path(path)))

    def shape(self, text):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, {'kern': True, 'liga': False})
        return [(self.order[i.codepoint], p.x_advance, i.cluster) for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def contours(self, g):
        r = RecordingPen(); self.gs[g].draw(r)
        # decompose components
        from fontTools.pens.recordingPen import DecomposingRecordingPen
        r = DecomposingRecordingPen(self.gs); self.gs[g].draw(r)
        out, cur = [], []
        for op, args in r.value:
            cur.append((op, args))
            if op in ('closePath', 'endPath'):
                out.append(cur); cur = []
        return out

    def path(self, g, f, nd=2, only=None):
        """Outline glyph g through point map f. only: predicate on contour index/bounds."""
        pen = PathPen(self.gs, f, nd)
        for i, c in enumerate(self.contours(g)):
            if only and not only(i, cbounds(c)):
                continue
            for op, args in c:
                getattr(pen, op)(*args)
        return ''.join(pen.d)

    def bounds(self, g):
        b = BoundsPen(self.gs); self.gs[g].draw(b); return b.bounds


def cbounds(c):
    xs = [p[0] for op, a in c for p in a]; ys = [p[1] for op, a in c for p in a]
    return (min(xs), min(ys), max(xs), max(ys)) if xs else None


BRICO = Font(T + 'brico.ttf')            # default instance is wght 800, wdth 100
GEIST6 = Font(T + 'geist.ttf', 600)
GEIST7 = Font(T + 'geist.ttf', 700)


def set_line(font, text, cap, x0, base, track=0.0, kern=None, over=None, nd=2, scaley=None):
    """Lay out text (outlined). cap = cap height in output units; track in em.
    kern: {(a,b): units}; over: {index: fn(x, base, s) -> (svg, advance_units or None)}.
    scaley: {index: factor} vertical stretch from baseline. Returns (list of svg strings, width)."""
    s = cap / font.cap
    kern = kern or {}; over = over or {}; scaley = scaley or {}
    glyphs = font.shape(text)
    x = x0; parts = []; prev = None
    for k, (g, adv, cl) in enumerate(glyphs):
        ch = text[cl]
        if prev is not None:
            x += kern.get((prev, ch), 0) * s
        if k in over:
            svg, a2 = over[k](x, base, s)
            parts.append(svg)
            if a2 is not None:
                adv = a2
        elif g != 'space':
            sy = scaley.get(k, 1)
            parts.append(font.path(g, lambda p, x=x, sy=sy: (x + p[0] * s, base - p[1] * s * sy), nd))
        x += adv * s
        if k < len(glyphs) - 1:
            x += track * 1000 * s
        prev = ch
    return parts, x - x0


def text_width(font, text, cap, track=0.0):
    s = cap / font.cap
    g = font.shape(text)
    return (sum(a for _, a, _ in g) + track * 1000 * (len(g) - 1)) * s


def arc_text(font, text, cap, cx, cy, r_mid, centre_deg, bottom=False, track=0.1, nd=2):
    """Outlined text bent along a circle. Top arcs read clockwise (tops outward);
    bottom arcs read left-to-right with tops toward the centre."""
    s = cap / font.cap
    glyphs = font.shape(text)
    total = (sum(a for _, a, _ in glyphs) + track * 1000 * (len(glyphs) - 1)) * s
    rb = r_mid - cap / 2 if not bottom else r_mid + cap / 2  # baseline radius
    x = -total / 2; d = []
    c0 = math.radians(centre_deg)
    for k, (g, adv, cl) in enumerate(glyphs):
        if g != 'space':
            def f(p, x=x):
                xa = x + p[0] * s; h = p[1] * s
                if not bottom:
                    r = rb + h; th = c0 + xa / rb
                else:
                    r = rb - h; th = c0 - xa / rb
                return (cx + r * math.sin(th), cy - r * math.cos(th))
            d.append(font.path(g, f, nd))
        x += adv * s + track * 1000 * s
    return ''.join(d), math.degrees(total / rb)
