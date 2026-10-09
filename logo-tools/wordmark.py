"""The wordmark is ONE swappable input. A wordmark file is an SVG whose root carries its metrics:

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="..."
       data-cap="40" data-baseline="40" data-stem="9.76" data-left="4.18" data-right="356.71"
       data-status="provisional">  ...paths filled with currentColor...  </svg>

Coordinates: cap top at y = baseline - cap. data-left/right are the ink edges (for spacing).
data-stem is the vertical stem weight (used to report symbol/letter weight balance)."""
import os
import re

CURRENT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'wordmark', 'current.svg')


def load(path=CURRENT):
    s = open(path).read()
    root = re.search(r'<svg\b[^>]*>', s).group(0)
    attr = lambda k: float(re.search(rf'data-{k}="([^"]+)"', root).group(1))
    status = re.search(r'data-status="([^"]+)"', root)
    inner = s[s.index(root) + len(root):s.rindex('</svg>')]
    inner = re.sub(r'<title>.*?</title>', '', inner, flags=re.S).strip()
    return dict(svg=inner, cap=attr('cap'), baseline=attr('baseline'), stem=attr('stem'),
                left=attr('left'), right=attr('right'), status=status.group(1) if status else 'final', path=path)
