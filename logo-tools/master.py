"""The LOCKED symbol: read straight from logo-tools/symbol/ (never redrawn here).
Colour rules: deep #0B7FAE head on light grounds · reversed screen master (paper body, bright #4CC0EC head)
on dark screens · one colour (mono) on cyan and wherever only one colour is available."""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

SRC = os.path.join(HERE, 'symbol') + '/'
INK, PAPER, DEEP, BRIGHT = '#0F1B24', '#F6F2EA', '#0B7FAE', '#4CC0EC'
VB = (100, 112)
BOX = (12.5, 6.0, 89.5, 103.0)        # visible ink box (measured on the 10x raster of the locked master)
SHOULDER_TOP, FEET = 36.0, 103.0       # adult arm top and baseline of the feet (lockup alignment)
STEM = 16.0                            # stem width in symbol units
HEAD_D = 20.0                          # adult head diameter = clear-space unit


def _parse(fname):
    s = open(SRC + fname).read()
    body = re.search(r'<path d="([^"]+)"', s).group(1)
    circles = [tuple(float(v) for v in m) for m in re.findall(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"', s)]
    return body, circles


_N = _parse('pi-tuned-symbol.svg')
_R = _parse('pi-tuned-symbol-reversed-screen.svg')


def mark(kind='colour', accent_var=False):
    """kind: 'colour' (ink + deep head, light grounds), 'mono' (all currentColor),
    'reversed' (screen reverse geometry; currentColor body + bright head; set color to paper).
    accent_var: child head reads var(--pi-accent) so one inline <symbol> can follow its ground."""
    body, ((ax, ay, ar), (cx, cy, cr)) = _R if kind == 'reversed' else _N
    out = f'<path d="{body}" fill="currentColor"/><circle cx="{ax:g}" cy="{ay:g}" r="{ar:g}" fill="currentColor"/>'
    if kind == 'mono':
        return out + f'<circle cx="{cx:g}" cy="{cy:g}" r="{cr:g}" fill="currentColor"/>'
    col = BRIGHT if kind == 'reversed' else DEEP
    if accent_var:
        return out + f'<circle cx="{cx:g}" cy="{cy:g}" r="{cr:g}" class="s" style="fill:var(--pi-accent,{col})"/>'
    return out + f'<circle cx="{cx:g}" cy="{cy:g}" r="{cr:g}" class="s" fill="{col}"/>'


def child_head(kind='colour'):
    return (_R if kind == 'reversed' else _N)[1][1]


# the hand-built 16px pixel map (symbol/favicon16.py), used for favicon.svg
import importlib.util as _u
_spec = _u.spec_from_file_location('favicon16', os.path.join(HERE, 'symbol', 'favicon16.py'))
FAV16 = _u.module_from_spec(_spec); _spec.loader.exec_module(FAV16)
