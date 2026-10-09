"""Round 2 mark geometry. Hand-authored: every coordinate below is a design decision, not a trace.
Ink parts use currentColor; the accent uses class="s" (fill) so the board can recolour it."""
import math
from type import n

SKY, SKYINK, INK, PAPER = '#4CC0EC', '#08668C', '#0F1B24', '#F6F2EA'
RC = 'stroke-linecap="round" stroke-linejoin="round"'


def P(x, y, nd=2):
    return f'{n(x, nd)} {n(y, nd)}'


def stroke(d, w, cls='', extra=''):
    c = f' class="{cls}"' if cls else ''
    col = f'var(--s,{SKY})' if cls == 'so' else 'currentColor'
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{n(w)}" {RC}{c}{extra}/>'


def fill(d, cls='', extra=''):
    if cls == 's':
        return f'<path d="{d}" class="s" fill="{SKY}"{extra}/>'
    return f'<path d="{d}" fill="currentColor"{extra}/>'


def circle(cx, cy, r, cls=''):
    if cls == 's':
        return f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" class="s" fill="{SKY}"/>'
    return f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="currentColor"/>'


def masked(uid, vb, body, holes):
    """body: svg drawn in currentColor; holes: svg drawn in black (knock-outs)."""
    w, h = vb
    m = f'pi2-{uid}'
    return (f'<mask id="{m}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="{w + 40}" height="{h + 40}">'
            f'<rect x="-20" y="-20" width="{w + 40}" height="{h + 40}" fill="#fff"/>{holes}</mask>'
            f'<g mask="url(#{m})">{body}</g>')


def black(svg):
    return (svg.replace('fill="currentColor"', 'fill="#000"').replace('stroke="currentColor"', 'stroke="#000"')
            .replace(f'class="s" fill="{SKY}"', 'fill="#000"'))


# =========================================================== 1 · π, together
# viewBox 100 x 100. Two figures: the tall one's arm is the crossbar, resting on the short one's shoulder.
PI = dict(w=15, ax=31, cx=69, base=90, a_sh=37, c_sh=50, ar=10.2, cr=8.8, gap=4.6, l=15.5, r=84, foot=0, droop=1.0)


def pi_mark(v=None, mono=False):
    v = dict(PI, **(v or {}))
    w, ax, cx, base = v['w'], v['ax'], v['cx'], v['base']
    a, c = v['a_sh'], v['c_sh']
    # the arm: level across the tall figure's shoulders, then easing down onto the child's shoulder,
    # finishing just past it (the hand cupping the far shoulder)
    k = v['droop']
    arm = (f"M{P(v['l'], a)}H{n(ax)}"
           f"C{P(ax + (cx - ax) * 0.52, a)} {P(cx - (cx - ax) * 0.30, c)} {P(cx, c)}"
           f"C{P(cx + (v['r'] - cx) * 0.45, c)} {P(v['r'] - 2, c + 1.6 * k)} {P(v['r'], c + 3.2 * k)}")
    legs = f"M{P(ax, a)}V{n(base)}M{P(cx, c)}V{n(base - v['foot'] * 0.6)}"
    if v['foot']:
        legs += f"Q{P(cx, base)} {P(cx + v['foot'], base)}"
    ahy = a - w / 2 - v['gap'] - v['ar']
    chy = c - w / 2 - v['gap'] - v['cr']
    return (stroke(arm + legs, w) + circle(ax, ahy, v['ar']) +
            circle(cx, chy, v['cr'], '' if mono else 's'))


def pi_fav(mono=False):
    """32 x 32 pixel grid. Straight bar (no droop) with one step; stroke 4.5 px."""
    w = 4.6
    ax, cx = 10.3, 22.3
    a, c = 13.6, 17.2
    d = f"M{P(4.6, a)}H{n(ax)}C{P(15.6, a)} {P(18.8, c)} {P(cx, c)}H{n(26.6)}M{P(ax, a)}V{n(28.4)}M{P(cx, c)}V{n(28.4)}"
    return (stroke(d, w) + circle(ax, a - w / 2 - 1.6 - 3.4, 3.4) +
            circle(cx, c - w / 2 - 1.6 - 3.0, 3.0, '' if mono else 's'))


# =========================================================== 2 · thumbprint to signature
TH = dict(cx=40, cy=47, rot=-12, w=4.2, core=(4.4, 10.5), rings=5, pitch=8.4, aspect=1.16, theta=62, gapw=1.55)


def _ell(cx, cy, rx, ry, rot, t):
    tr, rr = math.radians(t), math.radians(rot)
    x, y = rx * math.cos(tr), ry * math.sin(tr)
    return cx + x * math.cos(rr) - y * math.sin(rr), cy + x * math.sin(rr) + y * math.cos(rr)


def _t_for_polar(rx, ry, th):
    """ellipse parameter t whose point lies on the polar ray at angle th (degrees)."""
    a = math.radians(th)
    return math.degrees(math.atan2(rx * math.sin(a), ry * math.cos(a)))


def _speed(rx, ry, t):
    tr = math.radians(t)
    return math.hypot(rx * math.sin(tr), ry * math.cos(tr))


def thumb_rings(v):
    """returns list of (rx, ry, t_gap, dt) for each ridge, innermost first."""
    out = []
    crx, cry = v['core']
    for i in range(v['rings']):
        rx = crx + i * v['pitch']
        ry = cry + i * v['pitch'] * v['aspect']
        t = _t_for_polar(rx, ry, v['theta'])
        dt = math.degrees(v['gapw'] * v['w'] / _speed(rx, ry, t))
        out.append((rx, ry, t, dt))
    return out


def arc(cx, cy, rx, ry, rot, t0, t1):
    """elliptical arc from param t0 to t1 (t1 > t0), split so each piece < 180 deg."""
    segs = max(1, math.ceil((t1 - t0) / 170))
    d = ''
    x0, y0 = _ell(cx, cy, rx, ry, rot, t0)
    d += f'M{P(x0, y0)}'
    for k in range(1, segs + 1):
        t = t0 + (t1 - t0) * k / segs
        x, y = _ell(cx, cy, rx, ry, rot, t)
        d += f'A{n(rx)} {n(ry)} {n(rot)} 0 1 {P(x, y)}'
    return d


SIG = None


def thumb_mark(v=None, mono=False, sig=True, breaks=True):
    v = dict(TH, **(v or {}))
    cx, cy, rot, w = v['cx'], v['cy'], v['rot'], v['w']
    rings = thumb_rings(v)
    d = ''
    # ridge breaks (natural ridge endings) so it reads as skin, not a target
    brk = {2: (200, 9), 4: (305, 6)} if breaks else {}
    for i, (rx, ry, t, dt) in enumerate(rings):
        if i == 0:
            continue
        t0, t1 = t + dt, t - dt + 360
        if i in brk:
            bt, bw = brk[i]
            bt = bt + (0 if bt > t0 else 360)
            d += arc(cx, cy, rx, ry, rot, t0, bt - bw / 2) + arc(cx, cy, rx, ry, rot, bt + bw / 2, t1)
        else:
            d += arc(cx, cy, rx, ry, rot, t0, t1)
    # the core: starts on the channel's far side, loops once and leaves along the channel
    rx, ry, t, dt = rings[0]
    t0 = t + dt * 1.0
    core = arc(cx, cy, rx, ry, rot, t0, t + 360 - 28)
    ex, ey = _ell(cx, cy, rx, ry, rot, t + 360 - 28)
    # leave radially through the gaps
    th = math.radians(v['theta'] + rot)
    R_out = rings[-1][0] * 1.05 + w * 1.4
    ox, oy = cx + R_out * math.cos(th) * 1.0, cy + R_out * math.sin(th) * 1.12
    mx, my = cx + (rings[1][0] + 2) * math.cos(th), cy + (rings[1][1] + 1) * math.sin(th)
    core += f'C{P(ex + 3, ey + 4)} {P(mx - 2, my - 3)} {P(mx, my)}L{P(ox, oy)}'
    out = stroke(d, w)
    if sig:
        s = SIG or signature(ox, oy, th, v)
        out += stroke(core + s, w, '' if mono else 'so') if False else stroke(core + s, w)
    else:
        out += stroke(core, w)
    return out


def signature(ox, oy, th, v):
    """A monoline flourish: one tall loop, a dip, and a long underline that ends in an upward flick."""
    dx, dy = math.cos(th), math.sin(th)
    return (f'C{P(ox + dx * 8, oy + dy * 8)} {P(ox + 8, oy + 14)} {P(ox + 17, oy + 11)}'
            f'C{P(ox + 30, oy + 6)} {P(ox + 34, oy - 30)} {P(ox + 26, oy - 34)}'
            f'C{P(ox + 18, oy - 38)} {P(ox + 16, oy - 6)} {P(ox + 30, oy + 4)}'
            f'C{P(ox + 40, oy + 11)} {P(ox + 52, oy + 2)} {P(ox + 62, oy - 10)}')


# =========================================================== 3 · pass the light
def flame(fx, fy, rf, h, lean=0.0):
    """Teardrop flame: round base centred (fx, fy) radius rf, tip h above the base centre, leaning by `lean`."""
    tx, ty = fx + lean, fy - h
    return (f'M{P(tx, ty)}'
            f'C{P(tx + rf * 0.25, ty + h * 0.30)} {P(fx + rf, fy - rf * 1.35)} {P(fx + rf, fy)}'
            f'A{n(rf)} {n(rf)} 0 0 1 {P(fx - rf, fy)}'
            f'C{P(fx - rf, fy - rf * 1.15)} {P(tx - rf * 0.15, ty + h * 0.42)} {P(tx, ty)}Z')


def diya(W, D, spout=1.0):
    """Clay diya, side view. Local coords: back of the rim at (-W/2, 0); the rim runs level, then lifts
    into a pinched spout whose tip is at (W/2, -0.34D). The bowl is a deep round belly."""
    tx, ty = W / 2, -0.34 * D * spout
    return (f'M{P(-W / 2, 0)}H{n(W * 0.14)}'
            f'Q{P(W * 0.36, 0)} {P(tx, ty)}'
            f'Q{P(W * 0.44, D * 0.16)} {P(W * 0.31, D * 0.34)}'
            f'C{P(W * 0.20, D * 0.98)} {P(-W * 0.30, D * 1.04)} {P(-W * 0.45, D * 0.40)}'
            f'Q{P(-W * 0.51, D * 0.14)} {P(-W / 2, 0)}Z')


def _tf(x, y, tx, ty, rot, flip):
    if flip:
        x = -x
    r = math.radians(rot)
    return tx + x * math.cos(r) - y * math.sin(r), ty + x * math.sin(r) + y * math.cos(r)


DY = dict(W1=64, D1=29, rot1=13, x1=36, y1=64, W2=40, D2=18, rot2=-4, x2=81, y2=79, gap=1.6, rf=6.4, h=30, lean=3, wick=0.0)


def _xf(d_path, x, y, rot, flip=False):
    s = ' scale(-1 1)' if flip else ''
    return f'<g transform="translate({n(x)} {n(y)}) rotate({n(rot)}){s}">{fill(d_path)}</g>'


def diya_mark(v=None, mono=False):
    v = dict(DY, **(v or {}))
    big = _xf(diya(v['W1'], v['D1']), v['x1'], v['y1'], v['rot1'])
    small = _xf(diya(v['W2'], v['D2']), v['x2'], v['y2'], v['rot2'], flip=True)
    t1 = _tf(v['W1'] / 2, -0.34 * v['D1'], v['x1'], v['y1'], v['rot1'], False)
    t2 = _tf(v['W2'] / 2, -0.34 * v['D2'], v['x2'], v['y2'], v['rot2'], True)
    fx = (t1[0] + t2[0]) / 2
    fy = min(t1[1], t2[1]) - v['gap'] - v['rf']
    return big + small + fill(flame(fx, fy, v['rf'], v['h'], v['lean']), '' if mono else 's')


# =========================================================== 4 · half full
HF = dict(W=84, D=31, cy=58, foot=(22, 7), r=23, vis=0.5, gap=4.6, lip=0)


def half_mark(v=None, mono=False):
    v = dict(HF, **(v or {}))
    W, D, cy = v['W'], v['D'], v['cy']
    x0, x1 = 50 - W / 2, 50 + W / 2
    fw, fh = v['foot']
    bowl = (f'M{P(x0, cy)}H{n(x1)}'
            f'C{P(x1, cy + D * 0.62)} {P(50 + W * 0.28, cy + D)} {P(50 + fw / 2, cy + D)}'
            f'V{n(cy + D + fh)}H{n(50 - fw / 2)}V{n(cy + D)}'
            f'C{P(50 - W * 0.28, cy + D)} {P(x0, cy + D * 0.62)} {P(x0, cy)}Z')
    r = v['r']
    top = cy - v['gap']
    ccy = top - (2 * r * v['vis'] - r)   # centre so that `vis` of the diameter shows above the gap
    disc = (f'M{P(50 - math.sqrt(max(r * r - (top - ccy) ** 2, 0)), top)}'
            f'A{n(r)} {n(r)} 0 {1 if v["vis"] > 0.5 else 0} 1 {P(50 + math.sqrt(max(r * r - (top - ccy) ** 2, 0)), top)}Z')
    return fill(bowl) + fill(disc, '' if mono else 's')


# =========================================================== 5 · flame child
FC = dict()


def flame_body():
    # a full, upright flame: round belly, tip leaning slightly right, viewBox 100 x 120
    return ('M56 4C60 22 86 40 86 74A36 36 0 0 1 14 74C14 52 30 40 36 26C38 38 44 44 48 46C50 32 52 18 56 4Z')


def flame_child(v=None, mono=False, uid='fc'):
    body = fill(flame_body())
    holes = (circle(44, 63, 7.6) + fill('M34 112C34 92 37 78 44 76C51 78 54 92 54 112Z') +
             stroke('M48 79L70 50', 6.6))
    return masked(uid, (100, 120), body, black(holes))


# =========================================================== 6 · the lit I  (wordmark helpers live in build2)
def lit_flame(cx, base_y, h, w, mono=False, hollow=True):
    """flame sitting with its base centre at (cx, base_y), height h, max width w."""
    rf = w / 2
    fy = base_y - rf
    d = flame(cx, fy, rf, h - rf, lean=w * 0.18)
    if hollow:
        k = 0.42
        d += flame(cx + w * 0.02, fy + rf * 0.12, rf * k, (h - rf) * 0.52, lean=w * 0.08)
        return f'<path d="{d}" fill-rule="evenodd" class="s" fill="{SKY}"/>' if not mono else f'<path d="{d}" fill-rule="evenodd" fill="currentColor"/>'
    return fill(d, '' if mono else 's')


# =========================================================== 7 · A, revised (bulb + side-raised arm)
BULB_GLASS = 'M36 90C36 78 14 70.5 14 46A36 36 0 0 1 86 46C86 70.5 64 78 64 90Z'
BULB_RINGS = 'M36 101H64M39 112H61M45.5 122.5H54.5'


def arm_holes(v=None):
    # child's arm rising from the bulb's neck, leaning right; sleeve cuff, forearm, mitten hand + thumb
    return (fill('M39 96L37 80Q37 77 40 76.6L54 75Q57 74.8 57.4 77.6L59.6 94Z') +
            stroke('M49 76L58 40', 9) +
            stroke('M58.4 38L62 22', 11.5) + stroke('M55.6 44L49 37', 5))


def bulb_arm(v=None, mono=False, uid='ar'):
    body = (f'<path d="{BULB_GLASS}" fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>')
    return masked(uid, (100, 132), body, black(arm_holes(v))) + stroke(BULB_RINGS, 7)


# ----------------------------------------------------------- 2 · v2: an inked impression (oval clip) not a target
T2 = dict(ox=38, oy=50, orx=29, ory=38, orot=-10,      # impression oval
          cx=37, cy=45, crx=2.6, cry=8.5, pitch=7.4, n=8, aspect=1.08, rot=-10,
          w=3.7, theta=58, gapw=1.45, exit_t=None)


def thumb2(v=None, mono=False, uid='th', sig='a'):
    v = dict(T2, **(v or {}))
    w = v['w']
    clip = f'pi2-{uid}-clip'
    rings = []
    for i in range(v['n']):
        rx, ry = v['crx'] + i * v['pitch'], v['cry'] + i * v['pitch'] * v['aspect']
        t = _t_for_polar(rx, ry, v['theta'])
        dt = math.degrees(v['gapw'] * w / _speed(rx, ry, t))
        rings.append((rx, ry, t, dt))
    d = ''
    brk = {3: (205, 7), 5: (300, 5), 6: (150, 4)}
    for i, (rx, ry, t, dt) in enumerate(rings[1:], 1):
        t0, t1 = t + dt, t - dt + 360
        if i in brk:
            bt, bw = brk[i]
            bt = bt + (0 if bt > t0 else 360)
            d += arc(v['cx'], v['cy'], rx, ry, v['rot'], t0, bt - bw / 2) + arc(v['cx'], v['cy'], rx, ry, v['rot'], bt + bw / 2, t1)
        else:
            d += arc(v['cx'], v['cy'], rx, ry, v['rot'], t0, t1)
    rx, ry, t, dt = rings[0]
    core = arc(v['cx'], v['cy'], rx, ry, v['rot'], t + dt, t + 360 - 40)
    ex, ey = _ell(v['cx'], v['cy'], rx, ry, v['rot'], t + 360 - 40)
    th = math.radians(v['theta'] + v['rot'])
    # exit point on the impression oval along the channel ray
    R = 1.0
    ux, uy = math.cos(th), math.sin(th)
    # distance to oval boundary along the ray from (cx,cy): solve numerically
    lo, hi = 0, 80
    for _ in range(40):
        mid = (lo + hi) / 2
        px, py = v['cx'] + ux * mid - v['ox'], v['cy'] + uy * mid - v['oy']
        rr = math.radians(-v['orot'])
        qx, qy = px * math.cos(rr) - py * math.sin(rr), px * math.sin(rr) + py * math.cos(rr)
        if (qx / v['orx']) ** 2 + (qy / v['ory']) ** 2 < 1:
            lo = mid
        else:
            hi = mid
    bx, by = v['cx'] + ux * lo, v['cy'] + uy * lo
    m1x, m1y = v['cx'] + ux * (rings[1][0] + 3), v['cy'] + uy * (rings[1][1] + 0)
    core += f'C{P(ex + 2.5, ey + 4.5)} {P(m1x - ux * 6, m1y - uy * 6)} {P(m1x, m1y)}L{P(bx, by)}'
    tail = SIGS[sig](bx, by, ux, uy)
    ridges = (f'<clipPath id="{clip}"><ellipse cx="{n(v["ox"])}" cy="{n(v["oy"])}" rx="{n(v["orx"])}" ry="{n(v["ory"])}" '
              f'transform="rotate({n(v["orot"])} {n(v["ox"])} {n(v["oy"])})"/></clipPath>'
              f'<g clip-path="url(#{clip})">{stroke(d, w)}</g>')
    return ridges + stroke(core + tail, w)


def _sig_a(x, y, ux, uy):
    # down-and-out, one tall right-leaning loop, long underline with an upward flick
    return (f'C{P(x + ux * 7, y + uy * 7)} {P(x + 9, y + 13)} {P(x + 17, y + 12)}'
            f'C{P(x + 27, y + 11)} {P(x + 38, y - 20)} {P(x + 33, y - 27)}'
            f'C{P(x + 28, y - 33)} {P(x + 20, y - 4)} {P(x + 27, y + 8)}'
            f'C{P(x + 33, y + 17)} {P(x + 46, y + 10)} {P(x + 64, y - 6)}')


def _sig_b(x, y, ux, uy):
    # no loop: a long confident wave, like the underline of a signature, ending in a flick
    return (f'C{P(x + ux * 9, y + uy * 9)} {P(x + 12, y + 14)} {P(x + 24, y + 10)}'
            f'C{P(x + 36, y + 6)} {P(x + 40, y - 2)} {P(x + 50, y - 2)}'
            f'C{P(x + 58, y - 2)} {P(x + 60, y + 6)} {P(x + 72, y - 10)}')


def _sig_c(x, y, ux, uy):
    # a small cursive 'l' loop then a long tail
    return (f'C{P(x + ux * 6, y + uy * 6)} {P(x + 8, y + 11)} {P(x + 15, y + 9)}'
            f'C{P(x + 24, y + 6)} {P(x + 31, y - 16)} {P(x + 26, y - 19)}'
            f'C{P(x + 21, y - 22)} {P(x + 16, y - 2)} {P(x + 24, y + 7)}'
            f'C{P(x + 32, y + 15)} {P(x + 42, y + 4)} {P(x + 48, y - 1)}'
            f'C{P(x + 52, y - 4)} {P(x + 54, y + 4)} {P(x + 60, y + 3)}'
            f'C{P(x + 66, y + 2)} {P(x + 72, y - 4)} {P(x + 76, y - 12)}')


SIGS = dict(a=_sig_a, b=_sig_b, c=_sig_c)


# ----------------------------------------------------------- 5 · v2: flame with two tongues; the gap between them is the child's arm
def flame2_body():
    # viewBox 100 x 120: round belly centred (50, 82) r 34; main tip top-left of centre, a second tongue on the right
    return ('M44 4'
            'C50 22 70 30 76 46'           # main tip down its right flank into the notch
            'C80 40 82 32 82 24'           # up the second tongue
            'C92 38 96 56 92 74'           # tongue's outer edge into the belly
            'C92 98 74 116 50 116'
            'C26 116 8 98 8 76'
            'C8 50 26 38 34 26'
            'C38 20 42 12 44 4Z')


def flame_child2(v=None, mono=False, uid='fc2', closed=False):
    v = v or {}
    body = fill(flame2_body())
    hx, hy, hr = v.get('head', (40, 70, 8.6))
    holes = circle(hx, hy, hr)
    # body: a soft child torso, shoulders at y~83, widening slightly to the hem
    holes += fill(v.get('torso', 'M28 112C28 96 30 86 40 84.6C50 86 52 96 52 112Z'))
    arm = v.get('arm', 'M47 87L63 60L78 36')
    holes += stroke(arm, v.get('aw', 7.4))
    return masked(uid, (100, 120), body, black(holes))


# ----------------------------------------------------------- 7 · v2: the bulb with a side-raised arm, tilted hand, cuff
HAND = dict(
    palm=[(-7, -18.5), (7, -18.5), (7.4, -11), (4.8, -5), (4.3, 0), (-3.3, 0), (-3.8, -5), (-6.6, -9.5)],
    root_y=-18.5,
    fingers=[(-7, -22, 18), (-2.4, -7.5, 21.5), (2.4, 7, 20.5), (7, 21, 15.5)],
    thumb=[(-4.2, -8.5), (-14.6, -15)],
)


def hand(cx, by, k, w, geo=HAND, rot=0, nd=2, fill_='currentColor', flip=False):
    ca, sa = math.cos(math.radians(rot)), math.sin(math.radians(rot))

    def Q(x, y):
        if flip:
            x = -x
        x, y = x * k, y * k
        return f"{n(cx + x * ca - y * sa, nd)} {n(by + x * sa + y * ca, nd)}"
    palm = 'M' + 'L'.join(Q(*p) for p in geo['palm']) + 'Z'
    ry = geo['root_y']
    fing = ''
    for rx, ang, L in geo['fingers']:
        a = math.radians(ang)
        fing += f"M{Q(rx, ry)}L{Q(rx + L * math.sin(a), ry - L * math.cos(a))}"
    (tx0, ty0), (tx1, ty1) = geo['thumb']
    fing += f"M{Q(tx0, ty0)}L{Q(tx1, ty1)}"
    return (f'<path d="{palm}" fill="{fill_}" stroke="{fill_}" stroke-width="{n(w)}" stroke-linejoin="round"/>'
            f'<path d="{fing}" fill="none" stroke="{fill_}" stroke-width="{n(w)}" {RC}/>')


def bulb_arm2(v=None, mono=False, uid='ar2'):
    v = v or {}
    rot = v.get('rot', 22)
    wx, wy = v.get('wrist', (55, 56))      # wrist point; the forearm runs from the neck up to here
    k = v.get('k', 0.98)
    r = math.radians(rot)
    ex, ey = v.get('elbow', (43, 92))
    holes = stroke(f'M{P(ex, ey)}L{P(wx, wy)}', v.get('fw', 9.5))
    # cuff: a short band across the forearm, perpendicular to it
    fx, fy = wx - ex, wy - ey
    L = math.hypot(fx, fy); fx, fy = fx / L, fy / L
    c0 = v.get('cuff', 0.30)
    cx0, cy0 = ex + fx * L * c0, ey + fy * L * c0
    cw = v.get('cw', 8.5)
    holes += stroke(f'M{P(cx0 - fy * cw, cy0 + fx * cw)}L{P(cx0 + fy * cw, cy0 - fx * cw)}', v.get('ch', 9))
    holes += hand(wx + fx * 2, wy + fy * 2, k, 7, rot=math.degrees(math.atan2(fx, -fy)), flip=v.get('flip', False))
    body = f'<path d="{BULB_GLASS}" fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>'
    return masked(uid, (100, 132), body, black(holes)) + stroke(BULB_RINGS, 7)


# ----------------------------------------------------------- 3 · v3: a real diya (deep belly, foot, pinched spout, lip line)
def diya3(W, D):
    """Local coords; spout tip returned too. Back lip at (-W/2, -0.04D)."""
    tip = (W / 2, -0.36 * D)
    d = (f'M{P(-W / 2, -0.05 * D)}'
         f'Q{P(-W * 0.05, D * 0.10)} {P(W * 0.24, D * 0.02)}'      # rim, sagging slightly
         f'Q{P(W * 0.40, -D * 0.04)} {P(*tip)}'                     # lifting into the spout
         f'Q{P(W * 0.43, D * 0.14)} {P(W * 0.33, D * 0.30)}'        # under the spout
         f'C{P(W * 0.26, D * 0.74)} {P(W * 0.18, D * 0.86)} {P(W * 0.13, D * 0.90)}'
         f'L{P(W * 0.13, D * 1.04)}H{n(-W * 0.13)}L{P(-W * 0.13, D * 0.90)}'
         f'C{P(-W * 0.36, D * 0.84)} {P(-W * 0.50, D * 0.52)} {P(-W / 2, -0.05 * D)}Z')
    lip = f'M{P(-W * 0.40, D * 0.13)}Q{P(-W * 0.04, D * 0.27)} {P(W * 0.27, D * 0.16)}'
    return d, tip, lip


D3 = dict(W1=60, D1=34, rot1=10, x1=36, y1=60, W2=38, D2=21.5, rot2=-6, x2=82, y2=76,
          gap=1.4, rf=5.6, h=28, lean=2.5, lipw=2.6, lip=True)


def diya_mark3(v=None, mono=False, uid='dy'):
    v = dict(D3, **(v or {}))
    out = ''
    tips = []
    for W, D, rot, x, y, flip in ((v['W1'], v['D1'], v['rot1'], v['x1'], v['y1'], False),
                                  (v['W2'], v['D2'], v['rot2'], v['x2'], v['y2'], True)):
        d, tip, lip = diya3(W, D)
        s = ' scale(-1 1)' if flip else ''
        g = f'<g transform="translate({n(x)} {n(y)}) rotate({n(rot)}){s}">'
        body = g + fill(d) + '</g>'
        if v['lip']:
            body = masked(f'{uid}{len(tips)}', (110, 100), body, g + black(stroke(lip, v['lipw'] * W / v['W1'] ** 0.0 if False else v['lipw'])) + '</g>')
        out += body
        tips.append(_tf(*tip, x, y, rot, flip))
    (x1, y1), (x2, y2) = tips
    fx = (x1 + x2) / 2
    fy = min(y1, y2) - v['gap'] - v['rf']
    return out + fill(flame(fx, fy, v['rf'], v['h'], v['lean']), '' if mono else 's')


# ----------------------------------------------------------- 2 · v3: open-bottomed ridges (arches), the core's leg walks out
T3 = dict(cx=38, cy=44, rot=-8, w=3.8, pitch=7.6, crx=3.0, cry=9.0, n=6, aspect=1.1,
          # per ridge (start, end) in ellipse-param degrees; 90 = bottom. Ridges run over the top.
          spans=[None, (108, 412), (118, 404), (100, 398), (126, 392), (112, 386)],
          brk={3: (232, 8), 5: (300, 7)})


def thumb3(v=None, mono=False, uid='t3', sig='d'):
    v = dict(T3, **(v or {}))
    w = v['w']
    d = ''
    rings = [(v['crx'] + i * v['pitch'], v['cry'] + i * v['pitch'] * v['aspect']) for i in range(v['n'])]
    for i in range(1, v['n']):
        rx, ry = rings[i]
        t0, t1 = v['spans'][i]
        if i in v['brk']:
            bt, bw = v['brk'][i]
            d += arc(v['cx'], v['cy'], rx, ry, v['rot'], t0, bt - bw / 2) + arc(v['cx'], v['cy'], rx, ry, v['rot'], bt + bw / 2, t1)
        else:
            d += arc(v['cx'], v['cy'], rx, ry, v['rot'], t0, t1)
    # core: a hairpin. Left leg starts low, runs up over the top and down the right side, then walks out.
    rx, ry = rings[0]
    core = arc(v['cx'], v['cy'], rx, ry, v['rot'], 120, 360)     # left-bottom, over the top, to the right side
    ex, ey = _ell(v['cx'], v['cy'], rx, ry, v['rot'], 360)
    tail = SIGS[sig](ex, ey, v)
    return stroke(d, w) + stroke(core + tail, w)


def _sig_d(x, y, v):
    # straight down the right side (through the open ends), then a cursive 'l' loop and a long flick
    return (f'C{P(x + 0.6, y + 14)} {P(x + 4, y + 30)} {P(x + 14, y + 38)}'
            f'C{P(x + 24, y + 46)} {P(x + 36, y + 40)} {P(x + 44, y + 22)}'
            f'C{P(x + 50, y + 8)} {P(x + 46, y - 2)} {P(x + 42, y + 2)}'
            f'C{P(x + 37, y + 8)} {P(x + 38, y + 34)} {P(x + 52, y + 40)}'
            f'C{P(x + 62, y + 44)} {P(x + 72, y + 34)} {P(x + 82, y + 22)}')


def _sig_e(x, y, v):
    # down, then a long underline that sweeps back under the print and flicks up at the right
    return (f'C{P(x + 0.6, y + 14)} {P(x + 3, y + 30)} {P(x + 12, y + 37)}'
            f'C{P(x + 20, y + 43)} {P(x + 30, y + 40)} {P(x + 40, y + 33)}'
            f'C{P(x + 48, y + 27)} {P(x + 54, y + 28)} {P(x + 56, y + 34)}'
            f'C{P(x + 58, y + 40)} {P(x + 66, y + 40)} {P(x + 80, y + 26)}')


SIGS.update(d=_sig_d, e=_sig_e)


# ----------------------------------------------------------- 5 · v3: shorter arm, hand inside, arm echoes the tongue
def flame3_body(t=None):
    t = t or {}
    nx, ny = t.get('notch', (70, 44))
    tx, ty = t.get('tongue', (80, 26))
    return (f'M44 4'
            f'C50 20 {n(nx - 8)} {n(ny - 16)} {n(nx)} {n(ny)}'
            f'C{n(nx + 4)} {n(ny - 6)} {n(tx - 1)} {n(ty + 8)} {n(tx)} {n(ty)}'
            f'C92 40 96 58 92 76'
            f'C92 100 74 116 50 116'
            f'C26 116 8 100 8 78'
            f'C8 52 26 40 34 26'
            f'C38 20 42 12 44 4Z')


def flame_child3(v=None, mono=False, uid='fc3'):
    v = v or {}
    body = fill(flame3_body(v.get('t')))
    hx, hy, hr = v.get('head', (42, 70, 8.8))
    holes = circle(hx, hy, hr)
    holes += fill(v.get('torso', 'M29 104C29 92 32 85.5 42 84.5C52 85.5 55 92 55 104Q55 107 52 107H32Q29 107 29 104Z'))
    holes += stroke(v.get('arm', 'M49 88L62 64'), v.get('aw', 7.6))
    return masked(uid, (100, 120), body, black(holes))


# ----------------------------------------------------------- 7 · v3: sleeve as a step in width (no cross), fingers closer
HAND_C = dict(
    palm=[(-7, -18.5), (7, -18.5), (7.4, -11), (4.8, -5), (4.3, 0), (-3.3, 0), (-3.8, -5), (-6.6, -9.5)],
    root_y=-18.5,
    fingers=[(-6.6, -13, 16.5), (-2.2, -4, 20), (2.2, 4, 19), (6.6, 12, 14.5)],
    thumb=[(-4.2, -8.5), (-14, -16.5)],
)


def bulb_arm3(v=None, mono=False, uid='ar3'):
    v = v or {}
    ex, ey = v.get('elbow', (44, 100))
    wx, wy = v.get('wrist', (55.5, 58))
    fx, fy = wx - ex, wy - ey
    L = math.hypot(fx, fy); ux, uy = fx / L, fy / L
    holes = stroke(f'M{P(ex, ey)}L{P(wx, wy)}', v.get('fw', 9))
    # sleeve: wider band from the neck up to the cuff, square-ended at the cuff
    s1 = v.get('sleeve', 0.42)
    sw = v.get('sw', 17) / 2
    cx1, cy1 = ex + ux * L * s1, ey + uy * L * s1
    px, py = -uy, ux
    holes += fill(f'M{P(ex + px * sw, ey + py * sw)}L{P(cx1 + px * sw, cy1 + py * sw)}'
                  f'L{P(cx1 - px * sw, cy1 - py * sw)}L{P(ex - px * sw, ey - py * sw)}Z',
                  extra=' stroke="#000" stroke-width="2.4" stroke-linejoin="round"')
    holes += hand(wx + ux * 2, wy + uy * 2, v.get('k', 0.9), 7, geo=HAND_C, rot=math.degrees(math.atan2(ux, -uy)))
    body = f'<path d="{BULB_GLASS}" fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>'
    return masked(uid, (100, 132), body, black(holes)) + stroke(BULB_RINGS, 7)


# =========================================================== FINAL-TRACK DRAWINGS (v4+)
# ----------------------------------------------------------- 1 · π, together (final)
PI4 = dict(w=15, ax=31, cx=69, base=90, a_sh=36, c_sh=49, ar=10.6, cr=7.6, gap=4.4, l=15.5, r=83.5)


def pi4(v=None, mono=False):
    """Tall figure left, child right. The crossbar is one arm: level across the adult's shoulders,
    easing down with a single curve, and resting just past the child's shoulder (the hand)."""
    v = dict(PI4, **(v or {}))
    w, ax, cx, base, a, c = v['w'], v['ax'], v['cx'], v['base'], v['a_sh'], v['c_sh']
    arm = (f"M{P(v['l'], a)}H{n(ax + 4)}"
           f"C{P(ax + (cx - ax) * 0.55, a)} {P(cx - (cx - ax) * 0.34, c)} {P(cx, c)}"
           f"Q{P(cx + (v['r'] - cx) * 0.6, c)} {P(v['r'], c + 1.8)}")
    legs = f"M{P(ax, a)}V{n(base)}M{P(cx, c)}V{n(base)}"
    ahy = a - w / 2 - v['gap'] - v['ar']
    chy = c - w / 2 - v['gap'] - v['cr']
    return (stroke(arm + legs, w) + circle(ax, ahy, v['ar']) + circle(cx, chy, v['cr'], '' if mono else 's'))


def pi4_fav(mono=False):
    """32px grid: straight bar with one soft step; 4.4px strokes; heads separated by 1.4px."""
    w = 4.4
    ax, cx, a, c = 10.4, 21.8, 13.2, 17.0
    d = (f"M{P(5.0, a)}H{n(ax + 1)}C{P(16.2, a)} {P(18.2, c)} {P(cx, c)}H{n(26.4)}"
         f"M{P(ax, a)}V{n(28.2)}M{P(cx, c)}V{n(28.2)}")
    return (stroke(d, w) + circle(ax, a - w / 2 - 1.4 - 3.3, 3.3) +
            circle(cx, c - w / 2 - 1.4 - 2.5, 2.5, '' if mono else 's'))


# ----------------------------------------------------------- 3 · pass the light (final track)
def flame4(fx, fy, rf, h, lean=0.0, inner=True):
    """A true flame: broad round base, flanks that pinch then flick to a leaning tip (not a drop).
    Base centre (fx, fy) radius rf; tip h above the base centre. Inner flame is an even-odd counter."""
    tx, ty = fx + lean, fy - h
    d = (f'M{P(tx, ty)}'
         f'C{P(tx - rf * 0.10, ty + h * 0.22)} {P(fx + rf * 0.55, fy - h * 0.52)} {P(fx + rf * 0.92, fy - rf * 0.95)}'
         f'C{P(fx + rf * 1.12, fy - rf * 0.55)} {P(fx + rf, fy - rf * 0.2)} {P(fx + rf, fy)}'
         f'A{n(rf)} {n(rf)} 0 0 1 {P(fx - rf, fy)}'
         f'C{P(fx - rf, fy - rf * 0.95)} {P(fx - rf * 0.55, fy - h * 0.42)} {P(fx - rf * 0.05, fy - h * 0.62)}'
         f'C{P(fx + lean * 0.3, fy - h * 0.74)} {P(tx - rf * 0.35, ty + h * 0.12)} {P(tx, ty)}Z')
    if inner:
        ri, hi = rf * 0.42, h * 0.40
        ix, iy = fx + rf * 0.05, fy + rf * 0.18
        d += (f'M{P(ix + lean * 0.25, iy - hi)}'
              f'C{P(ix + ri * 0.5, iy - hi * 0.55)} {P(ix + ri, iy - ri * 0.9)} {P(ix + ri, iy)}'
              f'A{n(ri)} {n(ri)} 0 0 1 {P(ix - ri, iy)}'
              f'C{P(ix - ri, iy - ri * 0.9)} {P(ix - ri * 0.3, iy - hi * 0.6)} {P(ix + lean * 0.25, iy - hi)}Z')
    return d


def diya4(W, D, tip):
    """Upright clay diya, rim centre at (0,0), bowl width W, depth D, foot on y = D + 3.
    tip = (x, y) of the beak (the pinched wick spout) to the right."""
    tx, ty = tip
    bx = W * 0.30                     # where the beak leaves the rim
    d = (f'M{P(-W / 2, 0)}'
         f'L{P(bx, 0)}'
         f'C{P(bx + (tx - bx) * 0.45, 0)} {P(tx - 4, ty + 1.2)} {P(tx, ty)}'          # beak, upper edge
         f'C{P(tx - 2.5, ty + 5)} {P(bx + 6, D * 0.30)} {P(W * 0.40, D * 0.42)}'      # beak, under edge
         f'C{P(W * 0.32, D * 0.86)} {P(W * 0.16, D)} {P(W * 0.13, D)}'
         f'L{P(W * 0.15, D + 3)}H{n(-W * 0.15)}L{P(-W * 0.13, D)}'
         f'C{P(-W * 0.32, D)} {P(-W / 2, D * 0.60)} {P(-W / 2, 0)}Z')
    lip = f'M{P(-W * 0.43, D * 0.20)}Q{P(-W * 0.05, D * 0.40)} {P(W * 0.33, D * 0.20)}'
    return d, lip


D4 = dict(base=90, W1=58, D1=24, x1=32, tip1=(44, -6), W2=36, D2=15, x2=84, tip2=(29, -9),
          lipw=2.6, gap=1.2, rf=6.6, h=27, lean=-2.2, inner=True)


def diya4_mark(v=None, mono=False, uid='d4'):
    v = dict(D4, **(v or {}))
    out, tips = '', []
    for k, (W, D, x, tip, flip) in enumerate(((v['W1'], v['D1'], v['x1'], v['tip1'], False),
                                              (v['W2'], v['D2'], v['x2'], v['tip2'], True))):
        d, lip = diya4(W, D, tip)
        y = v['base'] - D - 3
        g = f'<g transform="translate({n(x)} {n(y)}){" scale(-1 1)" if flip else ""}">'
        out += masked(f'{uid}{k}', (110, 100), g + fill(d, extra=' stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"') + '</g>',
                      g + black(stroke(lip, v['lipw'] * (1 if k == 0 else 0.8))) + '</g>')
        tips.append((x + (-tip[0] if flip else tip[0]), y + tip[1]))
    (x1, y1), (x2, y2) = tips
    fx, fy = (x1 + x2) / 2, min(y1, y2) - v['gap'] - v['rf']
    fd = flame4(fx, fy, v['rf'], v['h'], v['lean'], v['inner'])
    if mono:
        return out + f'<path d="{fd}" fill-rule="evenodd" fill="currentColor"/>'
    return out + f'<path d="{fd}" fill-rule="evenodd" class="s" fill="{SKY}"/>'


def flame5(fx, fy, rf, h, lean=0.5, inner=0.45):
    """Asymmetric flame: convex left flank, concave right flank, tip flicking right by lean*rf.
    Broad base so it never reads as a water drop."""
    tx, ty = fx + lean * rf, fy - h
    d = (f'M{P(tx, ty)}'
         f'C{P(tx - rf * 0.05, ty + h * 0.30)} {P(fx + rf * 1.04, fy - rf * 1.45)} {P(fx + rf, fy)}'
         f'A{n(rf)} {n(rf)} 0 0 1 {P(fx - rf, fy)}'
         f'C{P(fx - rf * 1.0, fy - rf * 1.75)} {P(tx - rf * 0.95, ty + h * 0.36)} {P(tx, ty)}Z')
    if inner:
        ri, hi = rf * inner, h * 0.42
        ix, iy = fx, fy + rf * 0.12
        itx, ity = ix + lean * ri * 0.8, iy - hi
        d += (f'M{P(itx, ity)}'
              f'C{P(itx - ri * 0.05, ity + hi * 0.30)} {P(ix + ri * 1.04, iy - ri * 1.45)} {P(ix + ri, iy)}'
              f'A{n(ri)} {n(ri)} 0 0 1 {P(ix - ri, iy)}'
              f'C{P(ix - ri, iy - ri * 1.75)} {P(itx - ri * 0.95, ity + hi * 0.36)} {P(itx, ity)}Z')
    return d


D5 = dict(D4, D1=20, D2=13, tip1=(43, -5), tip2=(27, -8), gap=0.8, rf=7.6, h=31, lean=0.55, inner=0.44)


def diya5_mark(v=None, mono=False, uid='d5'):
    v = dict(D5, **(v or {}))
    out, tips = '', []
    for k, (W, D, x, tip, flip) in enumerate(((v['W1'], v['D1'], v['x1'], v['tip1'], False),
                                              (v['W2'], v['D2'], v['x2'], v['tip2'], True))):
        d, lip = diya4(W, D, tip)
        y = v['base'] - D - 3
        g = f'<g transform="translate({n(x)} {n(y)}){" scale(-1 1)" if flip else ""}">'
        out += masked(f'{uid}{k}', (110, 100), g + fill(d, extra=' stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"') + '</g>',
                      g + black(stroke(lip, v['lipw'] * (1 if k == 0 else 0.8))) + '</g>')
        tips.append((x + (-tip[0] if flip else tip[0]), y + tip[1]))
    (x1, y1), (x2, y2) = tips
    fx, fy = (x1 + x2) / 2, min(y1, y2) - v['gap'] - v['rf']
    fd = flame5(fx, fy, v['rf'], v['h'], v['lean'], v['inner'])
    cls = 'fill="currentColor"' if mono else f'class="s" fill="{SKY}"'
    return out + f'<path d="{fd}" fill-rule="evenodd" {cls}/>'


# ----------------------------------------------------------- 2 · thumbprint (final track): fitted, + favicon
T6 = dict(T3, cx=46, cy=48)


def thumb6(v=None, mono=False):
    v = dict(T6, **(v or {}))
    return thumb3(v, sig='d')


def _sig_fav(x, y, v):
    return (f'C{P(x + 0.2, y + 5)} {P(x + 1.2, y + 10)} {P(x + 4.6, y + 11.6)}'
            f'C{P(x + 8, y + 13)} {P(x + 11, y + 10)} {P(x + 14, y + 4.8)}')


SIGS['fav'] = _sig_fav


def thumb_fav(mono=False):
    v = dict(cx=12.6, cy=13.2, rot=-8, w=2.3, pitch=4.7, crx=1.3, cry=3.6, n=4, aspect=1.1,
             spans=[None, (112, 410), (104, 400), (120, 392)], brk={})
    return thumb3(v, sig='fav')


# ----------------------------------------------------------- 4 · half full (final track)
HF6 = dict(W=84, D=30, cy=60, foot=(22, 7), r=24, vis=0.64, gap=6.5, rim=3.2)


def half6(v=None, mono=False):
    """Katori with a rounded lip; a rayless disc rising out of it, clearly separate (a gap = the horizon)."""
    v = dict(HF6, **(v or {}))
    W, D, cy, rr = v['W'], v['D'], v['cy'], v['rim']
    x0, x1 = 50 - W / 2, 50 + W / 2
    fw, fh = v['foot']
    bowl = (f'M{P(x0 + rr, cy)}H{n(x1 - rr)}Q{P(x1, cy)} {P(x1, cy + rr)}'
            f'C{P(x1 - 1, cy + D * 0.66)} {P(50 + W * 0.27, cy + D)} {P(50 + fw / 2, cy + D)}'
            f'L{P(50 + fw / 2 + 1, cy + D + fh)}H{n(50 - fw / 2 - 1)}L{P(50 - fw / 2, cy + D)}'
            f'C{P(50 - W * 0.27, cy + D)} {P(x0 + 1, cy + D * 0.66)} {P(x0, cy + rr)}Q{P(x0, cy)} {P(x0 + rr, cy)}Z')
    r, top = v['r'], cy - v['gap']
    ccy = top - (2 * r * v['vis'] - r)
    hx = math.sqrt(max(r * r - (top - ccy) ** 2, 0))
    disc = f'M{P(50 - hx, top)}A{n(r)} {n(r)} 0 {1 if v["vis"] > 0.5 else 0} 1 {P(50 + hx, top)}Z'
    return fill(bowl) + fill(disc, '' if mono else 's')


def half_fav(mono=False):
    return half6(dict(W=30, D=10.5, cy=19.2, foot=(8, 2.6), r=8.4, vis=0.66, gap=2.2, rim=1.2), mono).replace('', '') if False else \
        f'<g transform="translate(-0.5 -2.6) scale(.33)">' + half6(None, mono) + '</g>'


T6 = dict(T3, cx=46, cy=55)


def thumb_fav(mono=False):
    v = dict(cx=14, cy=15.6, rot=-8, w=2.1, pitch=3.95, crx=1.2, cry=3.0, n=4, aspect=1.0,
             spans=[None, (112, 410), (104, 400), (120, 392)], brk={})
    return thumb3(v, sig='fav')


# ----------------------------------------------------------- 5 · flame child (final track): one smooth child silhouette
CHILD = ('M30 105C30 93 32.5 85 40.5 83.6L46 83.2C49 82.8 51.2 80 52.8 76.4L59.4 61.4'
         'A3.8 3.8 0 0 1 66.4 64.4L60 79.6C58.4 83.4 56 87.6 55.6 92.4L55.4 105'
         'Q55.4 107.4 53 107.4H32.4Q30 107.4 30 105Z')


def flame_child7(v=None, mono=False, uid='fc7'):
    v = v or {}
    body = fill(flame3_body(v.get('t')))
    hx, hy, hr = v.get('head', (41.6, 70.4, 8.6))
    holes = circle(hx, hy, hr) + fill(v.get('child', CHILD))
    return masked(uid, (100, 120), body, black(holes))


# ----------------------------------------------------------- 7 · bulb (final track): forearm + closed hand in profile
ARM = ('M-7.6 0L-7.6 -15.5Q-7.6 -17 -6 -17L-4.6 -17L-4.6 -38'
       'C-5.6 -46 -6.2 -53 -5.2 -59.5C-4 -66.5 4.4 -67.4 5.8 -60.8'
       'C6.6 -56.6 6.6 -53 6.1 -50.6C9.6 -49.6 10.2 -45.2 7.6 -43.2'
       'C6 -42 5 -41 4.6 -37.6L4.6 -17L6 -17Q7.6 -17 7.6 -15.5L7.6 0Z')


def bulb_arm7(v=None, mono=False, uid='ar7'):
    v = v or {}
    x, y, rot, k = v.get('x', 46.5), v.get('y', 98), v.get('rot', 13), v.get('k', 1.0)
    holes = f'<g transform="translate({n(x)} {n(y)}) rotate({n(rot)}) scale({n(k)})">{fill(ARM)}</g>'
    body = f'<path d="{BULB_GLASS}" fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>'
    return masked(uid, (100, 132), body, black(holes)) + stroke(BULB_RINGS, 7)


def thumb_fav(mono=False):
    v = dict(cx=15.2, cy=15.4, rot=-8, w=2.1, pitch=3.75, crx=1.2, cry=3.0, n=4, aspect=1.0,
             spans=[None, (112, 410), (104, 400), (122, 390)], brk={})
    return thumb3(v, sig='fav')


# hand wider than the wrist (fingers together, back of hand to the viewer's left), thumb clearly split forward
ARM2 = ('M-7.6 0L-7.6 -15.5Q-7.6 -17 -6 -17L-4.6 -17L-4.6 -35.5'
        'C-6.8 -38.5 -7.8 -42.5 -7.8 -47L-7.8 -58.5C-7.8 -67 6.6 -67.4 6.8 -58.5'
        'L6.9 -50.2C9 -52.6 11.2 -56 13.4 -55.2C15.4 -54.4 15 -51.4 13.4 -49'
        'L9.2 -42C7.6 -39.4 5.6 -38 4.6 -35.5L4.6 -17L6 -17Q7.6 -17 7.6 -15.5L7.6 0Z')


def bulb_arm8(v=None, mono=False, uid='ar8'):
    v = v or {}
    x, y, rot, k = v.get('x', 46), v.get('y', 99), v.get('rot', 12), v.get('k', 1.0)
    holes = f'<g transform="translate({n(x)} {n(y)}) rotate({n(rot)}) scale({n(k)})">{fill(v.get("arm", ARM2))}</g>'
    body = f'<path d="{BULB_GLASS}" fill="currentColor" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>'
    return masked(uid, (100, 132), body, black(holes)) + stroke(BULB_RINGS, 7)
