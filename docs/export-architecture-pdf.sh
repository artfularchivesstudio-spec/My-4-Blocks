#!/usr/bin/env bash
# Export Voice & Chat Architecture docs to print-optimized PDF
# v2 uses Mermaid diagrams (PNG) — regenerates them before PDF export

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📐 Regenerating Mermaid diagrams..."
for mmd in docs/diagrams/*.mmd; do
  [ -f "$mmd" ] || continue
  name="${mmd%.mmd}"
  mmdc -i "$mmd" -o "${name}.png" -b transparent
  echo "   ✓ $(basename "$mmd") → $(basename "${name}.png")"
done

echo ""
echo "📄 Generating print-optimized PDF (v2)..."
npx --yes md-to-pdf docs/Voice_and_Chat_Architecture_v2.md \
  --stylesheet docs/print-optimized.css \
  --pdf-options '{"format": "Letter", "margin": {"top": "18mm", "right": "18mm", "bottom": "18mm", "left": "18mm"}, "printBackground": true}'

echo ""
echo "✨ PDF saved to docs/Voice_and_Chat_Architecture_v2.pdf"
