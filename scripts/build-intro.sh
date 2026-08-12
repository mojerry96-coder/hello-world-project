#!/usr/bin/env bash
# Edit the five generated intro shots into one 30.00s cinematic sequence.
#
#   - trims weak heads and the two tails carrying garbled generated screen text
#   - 350ms dissolves between shots (motivated, no decorative transitions)
#   - keeps each shot's native location ambience, crossfaded across the cuts
#   - lays a near-subliminal low bed under the ambience for depth
#   - if public/media/intro-music.mp3 exists it is mixed in and the ambience
#     ducks beneath it; otherwise the cue runs on ambience alone
#   - freezes the final frame to land exactly on 30.00s
#   - exports 1280x720 H.264 / AAC 48kHz at -14 LUFS, peaks <= -1 dBTP
#
# Usage: build-intro.sh <dir-with-s1..s5.mp4> <output.mp4>
set -euo pipefail

SRC="${1:?source dir}"
OUT="${2:?output path}"
MEDIA="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/media"
MUSIC="$MEDIA/intro-music.mp3"

# Per-shot in-point and duration (seconds).
IN1=0.10; D1=5.94   # clinic doorway -> mother -> wide
IN2=0.10; D2=5.94   # reports/map -> folder handover -> director to camera
IN3=0.10; D3=5.40   # map+photo -> radio booth -> phone  (tail trimmed: screen text)
IN4=0.10; D4=5.80   # visit list -> dusk compound -> circled map (tail trimmed)
IN5=0.10; D5=5.94   # folders dolly -> stakeholders -> officer from behind

X=0.35              # dissolve length
TARGET=30.00

# xfade offsets accumulate: each join costs one dissolve.
O1=$(python3 -c "print(round($D1-$X,3))")
L1=$(python3 -c "print(round($D1+$D2-$X,3))")
O2=$(python3 -c "print(round($L1-$X,3))")
L2=$(python3 -c "print(round($L1+$D3-$X,3))")
O3=$(python3 -c "print(round($L2-$X,3))")
L3=$(python3 -c "print(round($L2+$D4-$X,3))")
O4=$(python3 -c "print(round($L3-$X,3))")
L4=$(python3 -c "print(round($L3+$D5-$X,3))")
HOLD=$(python3 -c "print(round($TARGET-$L4,3))")

echo "cut length ${L4}s + ${HOLD}s final-frame hold = ${TARGET}s"

if [ -f "$MUSIC" ]; then
  MUSIC_IN=(-i "$MUSIC")
  # Music sits under the ambience; ambience ducks so the cue reads clearly.
  BED="[5:a]atrim=0:${TARGET},asetpts=PTS-STARTPTS,volume=0.55,afade=t=in:st=0:d=1.2,afade=t=out:st=$(python3 -c "print($TARGET-2.5)"):d=2.5[mus];
       [amb][mus]sidechaincompress=threshold=0.05:ratio=6:attack=25:release=350[ducked];
       [ducked][mus]amix=inputs=2:duration=first:dropout_transition=0[premix];"
else
  MUSIC_IN=("-hide_banner")   # no-op placeholder; `set -u` dislikes empty arrays
  BED="[amb]anull[premix];"
fi

ffmpeg -nostdin -loglevel error -y \
  -i "$SRC/s1.mp4" -i "$SRC/s2.mp4" -i "$SRC/s3.mp4" -i "$SRC/s4.mp4" -i "$SRC/s5.mp4" \
  "${MUSIC_IN[@]}" \
  -filter_complex "
    [0:v]trim=${IN1}:$(python3 -c "print($IN1+$D1)"),setpts=PTS-STARTPTS,format=yuv420p[v0];
    [1:v]trim=${IN2}:$(python3 -c "print($IN2+$D2)"),setpts=PTS-STARTPTS,format=yuv420p[v1];
    [2:v]trim=${IN3}:$(python3 -c "print($IN3+$D3)"),setpts=PTS-STARTPTS,format=yuv420p[v2];
    [3:v]trim=${IN4}:$(python3 -c "print($IN4+$D4)"),setpts=PTS-STARTPTS,format=yuv420p[v3];
    [4:v]trim=${IN5}:$(python3 -c "print($IN5+$D5)"),setpts=PTS-STARTPTS,format=yuv420p[v4];
    [v0][v1]xfade=transition=fade:duration=${X}:offset=${O1}[x1];
    [x1][v2]xfade=transition=fade:duration=${X}:offset=${O2}[x2];
    [x2][v3]xfade=transition=fade:duration=${X}:offset=${O3}[x3];
    [x3][v4]xfade=transition=fade:duration=${X}:offset=${O4}[x4];
    [x4]fade=t=in:st=0:d=0.6,format=yuv420p[vout];

    [0:a]atrim=${IN1}:$(python3 -c "print($IN1+$D1)"),asetpts=PTS-STARTPTS[a0];
    [1:a]atrim=${IN2}:$(python3 -c "print($IN2+$D2)"),asetpts=PTS-STARTPTS[a1];
    [2:a]atrim=${IN3}:$(python3 -c "print($IN3+$D3)"),asetpts=PTS-STARTPTS[a2];
    [3:a]atrim=${IN4}:$(python3 -c "print($IN4+$D4)"),asetpts=PTS-STARTPTS[a3];
    [4:a]atrim=${IN5}:$(python3 -c "print($IN5+$D5)"),asetpts=PTS-STARTPTS[a4];
    [a0][a1]acrossfade=d=${X}:c1=tri:c2=tri[y1];
    [y1][a2]acrossfade=d=${X}:c1=tri:c2=tri[y2];
    [y2][a3]acrossfade=d=${X}:c1=tri:c2=tri[y3];
    [y3][a4]acrossfade=d=${X}:c1=tri:c2=tri[y4];
    [y4]apad=pad_dur=${HOLD},atrim=0:${TARGET},volume=0.85[ambraw];

    sine=frequency=55:duration=${TARGET}:sample_rate=48000[d1];
    sine=frequency=110:duration=${TARGET}:sample_rate=48000[d2];
    sine=frequency=164.81:duration=${TARGET}:sample_rate=48000[d3];
    [d1][d2][d3]amix=inputs=3:duration=first,
        lowpass=f=220,tremolo=f=0.12:d=0.35,volume=0.045,
        afade=t=in:st=0:d=3,afade=t=out:st=$(python3 -c "print($TARGET-3)"):d=3[drone];
    [ambraw][drone]amix=inputs=2:duration=first:weights=1 1[amb];
    ${BED}
    [premix]loudnorm=I=-14:TP=-1:LRA=11,aresample=48000,
        alimiter=limit=0.85:level=false,
        afade=t=out:st=$(python3 -c "print($TARGET-1.0)"):d=1.0[aout]
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 19 -preset slow -r 24 \
  -c:a aac -ar 48000 -b:a 192k -movflags +faststart \
  -t "${TARGET}" \
  "${OUT}.cut.mp4"

# Freeze the final frame out to TARGET as its own pass. tpad inside the xfade
# graph above is silently ignored — the video stream ends at the last cut and
# the closing title card is left with no picture under it.
ffmpeg -nostdin -loglevel error -y -i "${OUT}.cut.mp4" \
  -vf "tpad=stop_mode=clone:stop_duration=${HOLD},fade=t=out:st=$(python3 -c "print($TARGET-1.0)"):d=1.0,format=yuv420p" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 19 -preset medium -r 24 \
  -c:a copy -movflags +faststart -t "${TARGET}" \
  "$OUT"
rm -f "${OUT}.cut.mp4"

echo "wrote $OUT"
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,codec_name -of default=nw=1 "$OUT"
