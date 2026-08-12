#!/usr/bin/env bash
# Lay the five narration lines onto the finished intro film at their beat
# timings, with the location ambience ducked beneath the voice.
#
# Timings match src/sim/content/intro.ts. Each line starts a touch after its
# on-screen beat so the image lands first and the words follow it.
#
# The filtergraph is written to a file and passed with -filter_complex_script:
# inline graphs of this size are a quoting minefield in shell. The voice is
# asplit because a filter output label may only be consumed once — it feeds
# both the ducking sidechain and the final mix.
#
# Usage: build-narration.sh <dir-with-n1..n5.mp3> <intro.mp4> <output.mp4>
set -euo pipefail

VO="${1:?narration dir}"
IN="${2:?intro mp4}"
OUT="${3:?output mp4}"

TARGET=30
# Start time of each line, in milliseconds.
D1=900; D2=6400; D3=12000; D4=17000; D5=22500

WORK="$(mktemp -d)"
GRAPH="$WORK/filter.txt"
trap 'rm -rf "$WORK"' EXIT

# Normalise each line to a common loudness first. The raw TTS output varies by
# line, and a single blind gain on the mixed bus left the quieter lines sitting
# under the ambience they were supposed to be ducking.
for i in 1 2 3 4 5; do
  ffmpeg -nostdin -loglevel error -y -i "$VO/n$i.mp3" \
    -af "loudnorm=I=-16:TP=-2:LRA=7,highpass=f=90" \
    -ar 48000 -ac 2 "$WORK/n$i.wav"
done

cat > "$GRAPH" <<FILTER
[1:a]adelay=${D1}|${D1}[v1];
[2:a]adelay=${D2}|${D2}[v2];
[3:a]adelay=${D3}|${D3}[v3];
[4:a]adelay=${D4}|${D4}[v4];
[5:a]adelay=${D5}|${D5}[v5];
[v1][v2][v3][v4][v5]amix=inputs=5:duration=longest:normalize=0,atrim=0:${TARGET},asetpts=PTS-STARTPTS,acompressor=threshold=0.16:ratio=2.5:attack=12:release=180,volume=1.25,asplit=2[voiceduck][voicemix];
[0:a]atrim=0:${TARGET},asetpts=PTS-STARTPTS,volume=0.62[amb];
[amb][voiceduck]sidechaincompress=threshold=0.06:ratio=5:attack=20:release=450[ducked];
[ducked][voicemix]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1:LRA=11,aresample=48000,alimiter=limit=0.85:level=false,afade=t=out:st=29:d=1[aout]
FILTER

ffmpeg -nostdin -loglevel error -y \
  -i "$IN" \
  -i "$WORK/n1.wav" -i "$WORK/n2.wav" -i "$WORK/n3.wav" -i "$WORK/n4.wav" -i "$WORK/n5.wav" \
  -filter_complex_script "$GRAPH" \
  -map 0:v:0 -map "[aout]" \
  -c:v copy -c:a aac -ar 48000 -b:a 192k -movflags +faststart -t "${TARGET}" \
  "$OUT"

echo "wrote $OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
