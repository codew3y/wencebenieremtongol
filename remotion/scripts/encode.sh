#!/usr/bin/env bash
# Encodes a Remotion master into the delivery files: H.264 MP4 + VP9 WebM, no audio.
# Usage: scripts/encode.sh dark   (reads out/dark/master.mp4, writes out/dark/ads.mp4 and ads.webm)
set -euo pipefail
th="${1:?light or dark}"
in="out/$th/master.mp4"
ffmpeg -v error -y -i "$in" -an -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "out/$th/ads.mp4"
ffmpeg -v error -y -i "$in" -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -pass 1 -f null /dev/null
ffmpeg -v error -y -i "$in" -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -pass 2 -pix_fmt yuv420p "out/$th/ads.webm"
rm -f ffmpeg2pass-0.log
ls -lh "out/$th"
