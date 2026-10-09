"""Hand-built 16x16 favicon (plan step 10): every pixel is placed by hand on the grid below.
#  ink 100%   +  ink 60% (rounding)   -  ink 28% (anti-alias on the S-step)
C  child 100% c  child 60%            .  transparent
3-px stems on whole columns (3–5 and 10–12), 2-px arm that steps down 2 rows through the S,
3-px heads with softened corners, one fully empty row between each head and the arm, 1-px overhangs both sides."""
from PIL import Image

GRID = [
    "................",
    "...+#+..........",
    "...###..........",
    "...+#+....cCc...",
    "..........CCC...",
    "..+#####-.cCc...",
    "..+######-......",
    "...###.+#####+..",
    "...###..-####+..",
    "...###....###...",
    "...###....###...",
    "...###....###...",
    "...###....###...",
    "...###....###...",
    "...###....###...",
    "................",
]
ALPHA = {'#': 255, '+': 153, '-': 72, 'C': 255, 'c': 153}


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def render(ink='#0F1B24', child='#0B7FAE'):
    assert len(GRID) == 16 and all(len(r) == 16 for r in GRID)
    im = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    for y, row in enumerate(GRID):
        for x, ch in enumerate(row):
            if ch == '.':
                continue
            col = hex2rgb(child if ch in 'Cc' else ink)
            im.putpixel((x, y), col + (ALPHA[ch],))
    return im


# the plan's pixel-aligned vector (step 10), kept as the editable source for 16px
PLAN_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" color="#0F1B24">
<title>Proud Indian favicon, 16px grid</title>
<circle cx="4.5" cy="2.5" r="1.6" fill="currentColor"/>
<path fill="currentColor" d="M2.5 5H7.5L9.5 7H14A1 1 0 0 1 14 9H13V15H10V9H9L7 7H6V15H3V7H2.5A1 1 0 0 1 2.5 5Z"/>
<circle cx="11.5" cy="4.5" r="1.6" fill="#0B7FAE"/>
</svg>
'''


def write(out):
    render().save(out + 'favicon-16.png')
    render('#F6F2EA', '#4CC0EC').save(out + 'favicon-16-on-dark.png')
    render('#0F1B24', '#0F1B24').save(out + 'favicon-16-mono.png')   # one colour; also the rule on cyan grounds
    open(out + 'favicon-16.svg', 'w').write(PLAN_SVG)
