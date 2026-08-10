#!/usr/bin/env bash
# Download one generated asset and normalise it to the spec's delivery format.
#   stills -> .webp   (spec section 6.3 filenames)
#   videos -> 1280x720 H.264 + AAC 48 kHz .mp4 (spec Phase 2 export settings)
#
# Usage: fetch-media.sh <url> <output-filename>
set -euo pipefail

URL="$1"
OUT="$2"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/media"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DIR"
curl -fsSL "$URL" -o "$TMP/src"

case "$OUT" in
  *.webp)
    python3 - "$TMP/src" "$DIR/$OUT" <<'PY'
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
im.save(dst, "WEBP", quality=88, method=6)
print(f"{dst}  {im.width}x{im.height}")
PY
    ;;
  *.mp4)
    # Normalise to the spec's 1280x720 H.264 / AAC 48kHz delivery target and
    # bring the mix to roughly -14 LUFS with peaks at or below -1 dBTP.
    ffmpeg -nostdin -loglevel error -y -i "$TMP/src" \
      -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset medium -r 24 \
      -af "loudnorm=I=-14:TP=-1:LRA=11" \
      -c:a aac -ar 48000 -b:a 160k -movflags +faststart \
      "$DIR/$OUT"
    echo "$DIR/$OUT  $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$DIR/$OUT")"
    ;;
  *)
    echo "unsupported output: $OUT" >&2; exit 1;;
esac
