#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 -m http.server "${1:-4173}" --directory dist
