"""Logo build (was prototypes/_brand6/_tools/build6.py): every asset from the LOCKED symbol (master.py) + ONE wordmark input (wordmark.py).
Usage: ./py.sh build.py [path/to/wordmark.svg]   (default: wordmark/current.svg)"""
import os, sys
from type import n
import master as M
import wordmark as W
import pi4

# masters are written to .build/masters/ (gitignored); export.mjs lays them out into ../logo/
OUT = os.environ.get('PI_LOGO_MASTERS', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.build', 'masters')) + '/'
ASSETS = {}                                  # name -> (w, h, inner, label, color)
WM = W.load(sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].endswith('.svg') else W.CURRENT)
PROVISIONAL = WM['status'] != 'final'


def asset(name, w, h, inner, label, color=M.INK):
    ASSETS[name] = (w, h, inner, label, color)


def place(inner, x, y, k):
    return f'<g transform="translate({n(x)} {n(y)}) scale({n(k, 5)})">{inner}</g>'


def grown(kind, g):
    """Heavier symbol for the compact lockup: thicken the body by g units per edge (same-colour stroke),
    heads by g (gaps shrink by g but stay ≥ 9 units)."""
    s = M.mark(kind)
    s = s.replace('fill="currentColor"/>', f'fill="currentColor" stroke="currentColor" stroke-width="{2 * g:g}" stroke-linejoin="round"/>', 1)
    import re
    return re.sub(r'r="([\d.]+)"', lambda m: f'r="{float(m.group(1)) + g:g}"', s)


# ---------------------------------------------------------------- lockups (wordmark is a parameter)
def horizontal(wm=WM, kind='colour', gap_k=0.75, grow=0.0):
    """Feet on the baseline, arm top on cap height (symbol scale = cap / (feet - shoulder)), gap = gap_k × cap."""
    cap = wm['cap']
    k = cap / (M.FEET - M.SHOULDER_TOP)
    sym = grown(kind, grow) if grow else M.mark(kind)
    bw = (M.BOX[2] - M.BOX[0]) * k
    B = (M.FEET - M.BOX[1]) * k                                   # baseline y in lockup space (symbol top at 0)
    wx = bw + gap_k * cap - wm['left']
    wy = B - wm['baseline']
    inner = (place(sym, -M.BOX[0] * k, -M.BOX[1] * k, k) +
             f'<g transform="translate({n(wx)} {n(wy)})">{wm["svg"]}</g>')
    w = wx + wm['right']
    h = B + 0.025 * cap
    return inner, w, h, dict(scale=k, sym_stem=M.STEM * k, letter_stem=wm['stem'], gap=gap_k * cap)


def stacked(wm=WM, kind='colour', sym_k=1.9, gap_k=0.55):
    cap = wm['cap']
    H = sym_k * cap
    k = H / (M.BOX[3] - M.BOX[1])
    ww = wm['right'] - wm['left']
    cx_sym = (M.BOX[0] + M.BOX[2]) / 2
    sx = wm['left'] + ww / 2 - cx_sym * k
    top = H + gap_k * cap                                          # cap-top of the wordmark
    wy = top + cap - wm['baseline']
    inner = place(M.mark(kind), sx, -M.BOX[1] * k, k) + f'<g transform="translate(0 {n(wy)})">{wm["svg"]}</g>'
    return inner, wm['right'] + wm['left'], top + cap * 1.025


def wordmark_only(wm=WM):
    return f'<g transform="translate(0 {n(-(wm["baseline"] - wm["cap"]))})">{wm["svg"]}</g>', wm['right'] + wm['left'], wm['cap'] * 1.025


# ---------------------------------------------------------------- containers
def figure_in(size, frac, kind, nudge=(0.5, 0.0)):
    k = frac * size / (M.BOX[3] - M.BOX[1])
    cx, cy = (M.BOX[0] + M.BOX[2]) / 2, (M.BOX[1] + M.BOX[3]) / 2
    return k, size / 2 + nudge[0] - cx * k, size / 2 + nudge[1] - cy * k


def disc(kind='ink', size=100):
    k, ox, oy = figure_in(size, 0.60, kind)
    r = size / 2
    if kind == 'ink':      # ink disc, reversed-screen figure (paper + bright head)
        return (f'<circle cx="{r}" cy="{r}" r="{r}" fill="{M.INK}"/>'
                f'<g color="{M.PAPER}">{place(M.mark("reversed"), ox, oy, k)}</g>')
    if kind == 'cyan':     # cyan ground: one-colour ink figure (the rule on cyan)
        return (f'<circle cx="{r}" cy="{r}" r="{r}" fill="{M.BRIGHT}"/>'
                f'<g color="{M.INK}">{place(M.mark("mono"), ox, oy, k)}</g>')
    # mono: currentColor disc, figure knocked out
    return (f'<mask id="pi-disc-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="{size}" height="{size}">'
            f'<rect width="{size}" height="{size}" fill="#fff"/><g color="#000">{place(M.mark("mono"), ox, oy, k)}</g></mask>'
            f'<circle cx="{r}" cy="{r}" r="{r}" fill="currentColor" mask="url(#pi-disc-mask)"/>')


def tile(rounded=True, size=128):
    # the locked app layout (_brand5-tuned/final/pi-tuned-app.svg): figure translate(21.2 14) scale(.86) in 128
    rx = f' rx="{n(size * 0.225)}"' if rounded else ''
    return (f'<rect width="{size}" height="{size}"{rx} fill="{M.INK}"/>'
            f'<g color="{M.PAPER}" transform="scale({n(size / 128, 5)})">{place(M.mark("reversed"), 21.2, 14, 0.86)}</g>')


def favicon_svg():
    """Pixel-exact copy of the hand-built 16px map as rects (crisp at 16, 32, 48), with dark-mode colours."""
    rects = ''
    for y, row in enumerate(M.FAV16.GRID):
        for x, ch in enumerate(row):
            if ch == '.':
                continue
            cls = 'c' if ch in 'Cc' else 'i'
            op = M.FAV16.ALPHA[ch] / 255
            rects += f'<rect x="{x}" y="{y}" width="1" height="1" class="{cls}"' + (f' opacity="{op:.2f}"' if op < 1 else '') + '/>'
    style = ('<style>.i{fill:#0F1B24}.c{fill:#0B7FAE}'
             '@media (prefers-color-scheme:dark){.i{fill:#F6F2EA}.c{fill:#4CC0EC}}</style>')
    return style + f'<g shape-rendering="crispEdges">{rects}</g>'


# ---------------------------------------------------------------- seals (per-arc Geist ring, round 4)
def seal_centre(kind):
    k = 0.455
    cx, cy = (M.BOX[0] + M.BOX[2]) / 2, (M.BOX[1] + M.BOX[3]) / 2
    return place(M.mark(kind), 60 - cx * k, 60 - cy * k, k)


def seal(key, kind='colour', production=False):
    t, b, sp, lab = pi4.SEALS[key]
    ring = pi4.seal(t, b, span=sp, centre='')
    if production:
        ring = ring.replace('stroke-width="1.6"', 'stroke-width="2.2"')     # rubber needs a heavier hairline ring
    return ring + seal_centre('mono' if production else kind), lab


# ---------------------------------------------------------------- build
def build():
    tag = ' (wordmark provisional)' if PROVISIONAL else ''
    sx = 2
    for kind, suf, col in (('colour', '', M.INK), ('mono', '-mono', M.INK), ('reversed', '-reversed', M.PAPER)):
        asset(f'pi-symbol{suf}', M.BOX[2] - M.BOX[0] + 2 * sx, M.BOX[3] - M.BOX[1] + 2 * sx,
              place(M.mark(kind), -M.BOX[0] + sx, -M.BOX[1] + sx, 1), 'Proud Indian', col)
        inner, w, h, _ = horizontal(kind=kind)
        asset(f'pi-lockup{suf}', w, h, inner, 'Proud Indian' + tag, col)
        inner, w, h, _ = horizontal(kind=kind, gap_k=0.6, grow=0.9)
        asset(f'pi-lockup-compact{suf}', w, h, inner, 'Proud Indian' + tag, col)
        inner, w, h = stacked(kind=kind)
        asset(f'pi-stacked{suf}', w, h, inner, 'Proud Indian' + tag, col)
    inner, w, h = wordmark_only()
    asset('pi-wordmark', w, h, inner, 'Proud Indian' + tag)
    asset('pi-disc', 100, 100, disc('ink'), 'Proud Indian')
    asset('pi-disc-cyan', 100, 100, disc('cyan'), 'Proud Indian')
    asset('pi-disc-mono', 100, 100, disc('mono'), 'Proud Indian')
    asset('pi-app-tile', 128, 128, tile(True), 'Proud Indian app icon')
    asset('pi-app-tile-square', 128, 128, tile(False), 'Proud Indian app icon (full bleed; the platform applies its mask)')
    asset('favicon', 16, 16, favicon_svg(), 'Proud Indian')
    for key in pi4.SEALS:
        s, lab = seal(key)
        asset(f'pi-{key}', 120, 120, s, lab)
        s, lab = seal(key, 'mono')
        asset(f'pi-{key}-mono', 120, 120, s, lab)
        s, lab = seal(key, production=True)
        asset(f'pi-{key}-stamp-production', 120, 120, s, lab + ' (rubber-stamp artwork, one colour)')
    s, lab = seal('seal-80g', 'mono')
    asset('pi-seal-80g-SCREEN-ONLY-texture', 120, 120, pi4.stamped(s), lab + ' (screen-only ink texture; never send to print)')
    m = horizontal()[3]
    print(f'lockup: symbol scale {m["scale"]:.4f}, symbol stem {m["sym_stem"]:.2f} vs letter stem {m["letter_stem"]:.2f}, gap {m["gap"]:.1f}')


def svg_file(name):
    w, h, inner, label, color = ASSETS[name]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(w)} {n(h)}" role="img" '
            f'aria-label="{label}" color="{color}">\n<title>{label}</title>\n{inner}\n</svg>\n')


def write_all():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith('.svg'):
            os.remove(OUT + f)
    for name in ASSETS:
        open(OUT + name + '.svg', 'w').write(svg_file(name))
    print(len(ASSETS), 'svgs', '· wordmark:', WM['path'], f'({WM["status"]})')


build()
if __name__ == '__main__':
    write_all()
