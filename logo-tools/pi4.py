"""Round 4: the refined master ('π, together', v01) and its family. viewBox 100 x 100."""
import math
from type import n
from marks2 import P, stroke, fill, circle, masked, black, SKY, INK, PAPER, RC

M0 = dict(w=15, ax=31, cx=69, base=90, a=36, c=49, arm_c=None, ar=10.6, cr=7.6, gap=4.4, l=15.5,
          reach=83.5, drop=1.8, k1=0.55, k2=0.34, lean=-1.2, stem_top=None, taper=0)


def master(v=None, mode='cyan', mono=False, parts=False):
    """a = adult shoulder line; c = where the arm rests on the child (y);
    stem_top = top of the child's body (if above c, the body rises behind the arm: an embrace, not a press)."""
    v = dict(M0, **(v or {}))
    w, ax, cx, base, a, c = v['w'], v['ax'], v['cx'], v['base'], v['a'], v['c']
    st = v['stem_top'] if v['stem_top'] is not None else c
    arm = (f"M{P(v['l'], a)}H{n(ax + 4)}"
           f"C{P(ax + (cx - ax) * v['k1'], a)} {P(cx - (cx - ax) * v['k2'], c)} {P(cx, c)}"
           f"Q{P(cx + (v['reach'] - cx) * 0.6, c)} {P(v['reach'], c + v['drop'])}")
    legs = f"M{P(ax, a)}V{n(base)}M{P(cx, st)}V{n(base)}"
    ahy = a - w / 2 - v['gap'] - v['ar']
    chy = st - w / 2 - v['gap'] - v['cr']
    head_c = circle(cx + v['lean'], chy, v['cr']) if (mono or mode == 'ink') else circle(cx + v['lean'], chy, v['cr'], 's')
    out = stroke(arm + legs, w) + circle(ax, ahy, v['ar']) + head_c
    if parts:
        return out, dict(ahy=ahy, chy=chy, **v)
    return out


ARMS = {
 'a0': ('As round 3', dict()),
 'a1': ('Arm lowered: the body rises behind it', dict(c=55, stem_top=47, drop=1.4)),
 'a2': ('Longer reach, wraps past the child', dict(reach=89, drop=4.2)),
 'a3': ('Resting bend: drops early, lands flat', dict(k1=0.22, k2=0.52, c=51, drop=0.6)),
 'a4': ('Child head larger and higher', dict(cr=8.4, gap=5.2)),
 'a5': ('Lowered + resting + reach (combined)', dict(c=55, stem_top=46.5, k1=0.3, k2=0.46, reach=86.5, drop=2.4, cr=8.0, gap=4.8)),
}

ARMS.update({
 'm1': ('Refined: a1 with softer drop, longer reach, head 8.0, stroke 14.4',
        dict(w=14.4, c=53, stem_top=46, k1=0.5, k2=0.36, reach=86, drop=2.2, cr=8.0, gap=4.6, ar=10.4, l=16)),
 'm2': ('m1 with a flatter bar (more π)',
        dict(w=14.4, c=51.5, stem_top=45.5, k1=0.5, k2=0.36, reach=86, drop=1.8, cr=8.0, gap=4.6, ar=10.4, l=16)),
})


# ================================================================ the chosen master
MASTER = dict(M0, **ARMS['m2'][1])
INKBOX = None   # filled by build4 from bbox.json


def mark(mode='cyan', mono=False, w=None):
    v = dict(MASTER)
    if w:
        v['w'] = w
    return master(v, mode, mono)


def figure_knock(scale, ox, oy, w=None):
    """the mark as a black knock-out group (for discs, tiles)"""
    return f'<g transform="translate({n(ox)} {n(oy)}) scale({n(scale, 4)})">' + black(mark('ink', True, w)) + '</g>'


def child_head(scale, ox, oy):
    _, p = master(MASTER, parts=True)
    return (ox + (p['cx'] + p['lean']) * scale, oy + p['chy'] * scale, p['cr'] * scale)


# --------------------------------------------------------------- the disc (v10 refined)
# master ink box ~ (8.8, 3.0) – (93.2, 97.3); optical centre sits a touch high so the feet have room
def disc(kind='ink', uid='d', size=100, w=None, k=0.60):
    """kind: 'ink' (ink disc, paper figure, cyan child head), 'cyan' (cyan disc, ink figure, paper child head),
    'mono' (one colour: currentColor disc, knocked-out figure)."""
    k = k * size / 100
    ox = size / 2 - 51 * k
    oy = size / 2 - 50.6 * k
    r = size / 2 - 0.5
    hx, hy, hr = child_head(k, ox, oy)
    if kind == 'cyan':
        return (f'<circle cx="{n(size / 2)}" cy="{n(size / 2)}" r="{n(r)}" class="s" fill="{SKY}"/>'
                f'<g transform="translate({n(ox)} {n(oy)}) scale({n(k, 4)})">{mark("ink", True, w)}</g>'
                f'<circle cx="{n(hx)}" cy="{n(hy)}" r="{n(hr)}" fill="{PAPER}" class="pp"/>')
    body = f'<circle cx="{n(size / 2)}" cy="{n(size / 2)}" r="{n(r)}" fill="currentColor"/>'
    out = masked(uid, (size, size), body, figure_knock(k, ox, oy, w))
    if kind == 'ink':
        out += circle(hx, hy, hr, 's')
    return out


def tile(kind='ink', uid='t', size=100, rx=22.5, w=None, k=0.62):
    """rounded-square app tile; rx=0 gives the full-bleed square (iOS rounds it)."""
    k = k * size / 100
    ox = size / 2 - 51 * k
    oy = size / 2 - 50.6 * k
    hx, hy, hr = child_head(k, ox, oy)
    body = f'<rect width="{size}" height="{size}" rx="{n(rx * size / 100)}" fill="currentColor"/>'
    out = masked(uid, (size, size), body, figure_knock(k, ox, oy, w))
    if kind == 'ink':
        out += circle(hx, hy, hr, 's')
    return out


# --------------------------------------------------------------- seals (v11 refined), viewBox 120 x 120
from type import GEIST7, arc_text


def _ring_text(txt, cap, rm, bottom, span, min_track=0.09):
    """Shrink the cap height until the text fits with at least min_track, then solve the tracking so the arc covers exactly `span` degrees (optical letterspacing: both arcs
    are set to the same span, whatever their letter count). Returns path data."""
    while arc_text(GEIST7, txt, cap, 60, 60, rm, 0, bottom=bottom, track=min_track)[1] > span and cap > 4:
        cap -= 0.1
    lo, hi = min_track, 1.2
    for _ in range(40):
        t = (lo + hi) / 2
        d, s = arc_text(GEIST7, txt, cap, 60, 60, rm, 180 if bottom else 0, bottom=bottom, track=t)
        if s > span:
            hi = t
        else:
            lo = t
    return d


def _fit_cap(txt, cap, rm, span, min_track=0.09):
    while arc_text(GEIST7, txt, cap, 60, 60, rm, 0, track=min_track)[1] > span and cap > 4:
        cap -= 0.1
    return cap


def _diamond(cx, cy, r):
    return f'<path d="M{P(cx, cy - r)}L{P(cx + r * 0.8, cy)}L{P(cx, cy + r)}L{P(cx - r * 0.8, cy)}Z" fill="currentColor"/>'


def seal(top, bottom, mode='cyan', mono=False, span=(132, 124), cap=7.4, centre=None):
    """Double ring, Geist 700 caps on a mid radius, diamonds at 3 and 9 o'clock, the master in the centre.
    Bottom arc: radius pulled in 0.35 and its span narrowed, because text on the outside of a curve
    (tops pointing in) looks larger and lower than the same text on the top arc."""
    rm = 46.4
    out = (f'<circle cx="60" cy="60" r="55.4" fill="none" stroke="currentColor" stroke-width="4.8"/>'
           f'<circle cx="60" cy="60" r="37.6" fill="none" stroke="currentColor" stroke-width="1.6"/>')
    ct = _fit_cap(top, cap, rm, span[0])
    cb = min(ct, _fit_cap(bottom, cap, rm, span[1]))      # the bottom line never outranks the name
    out += f'<path d="{_ring_text(top, ct, rm, False, span[0])}" fill="currentColor"/>'
    out += f'<path d="{_ring_text(bottom, cb * 0.97, rm - 0.35, True, span[1])}" fill="currentColor"/>'
    out += _diamond(60 - rm, 60, 3.0) + _diamond(60 + rm, 60, 3.0)
    k = 0.47
    c = centre if centre is not None else mark(mode, mono)
    if c == '':
        return out
    return out + f'<g transform="translate({n(60 - 51.05 * k)} {n(60 - 50.35 * k)}) scale({k})">{c}</g>'


SEALS = {
 'seal': ('PROUD INDIAN', 'BENGALURU · SINCE 2019', (118, 150), 'Proud Indian seal: Bengaluru, since 2019'),
 'seal-80g': ('REGISTERED · 80G · 12A', 'PROUD INDIAN TRUST', (150, 132), '80G and 12A registered seal'),
 'seal-volunteer': ('OPTIMIST', 'VOLUNTEER', (88, 92), 'Optimist volunteer seal'),
 'seal-kalakriti': ('KALAKRITI 3.0', '20 SEP 2026', (108, 96), 'Kalakriti 3.0 seal, 20 September 2026'),
}

STAMP_FILTER = ('<filter id="{id}" x="-5%" y="-5%" width="110%" height="110%">'
                '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>'
                '<feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" result="d"/>'
                '<feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="2" seed="11" result="m"/>'
                '<feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.95" result="ma"/>'
                '<feComposite in="d" in2="ma" operator="in"/></filter>')


def stamped(inner, fid='pi-stamp'):
    return STAMP_FILTER.format(id=fid) + f'<g filter="url(#{fid})">{inner}</g>'
