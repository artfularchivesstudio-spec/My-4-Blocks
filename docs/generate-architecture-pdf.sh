#!/usr/bin/env bash
# 🎨 Generate Print-Optimized Architecture PDF
#
# Usage: ./generate-architecture-pdf.sh
#
# This script:
# 1. Renders all Mermaid diagrams to PNG
# 2. Generates the PDF with proper styling

set -e
cd "$(dirname "$0")/.."

echo "📐 Rendering Mermaid diagrams..."
for mmd in docs/diagrams/v4/*.mmd; do
  [ -f "$mmd" ] || continue
  name="${mmd%.mmd}"
  echo "   🎨 $(basename "$mmd")"
  npx --yes @mermaid-js/mermaid-cli -i "$mmd" -o "${name}.png" -b white -w 700 -s 2
done

echo ""
echo "📄 Generating PDF..."
npx --yes md-to-pdf docs/Voice_and_Chat_Architecture_v4_print.md \
  --stylesheet docs/print-optimized.css \
  --pdf-options '{"format":"Letter","printBackground":true}'

echo ""
echo "✨ Done! PDF saved to:"
echo "   docs/Voice_and_Chat_Architecture_v4_print.pdf"
