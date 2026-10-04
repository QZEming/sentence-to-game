#!/bin/sh
cd "$(dirname "$0")" || exit 1
python3 -m http.server "${1:-4188}" --bind 127.0.0.1 --directory dist
