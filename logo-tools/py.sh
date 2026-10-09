#!/bin/bash
# python with every dependency the round-6 tools need
cd "$(dirname "$0")" && exec uv run -q --with fonttools --with brotli --with uharfbuzz --with pillow python "$@"
