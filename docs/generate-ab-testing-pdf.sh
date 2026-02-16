#!/usr/bin/env bash
# 🎨 Generate A/B Testing Architecture PDF with diagrams
#
# 1. Regenerates Mermaid diagrams (larger, dark text for readability)
# 2. Runs create_ab_testing_pdf.py

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "📐 Regenerating A/B Testing diagrams (1600px, 2.5x scale, 20px font, spacing)..."
for mmd in docs/diagrams/ab-architecture.mmd docs/diagrams/ab-blueprints.mmd docs/diagrams/ab-four-blocks.mmd docs/diagrams/ab-data-flow.mmd; do
  [ -f "$mmd" ] || continue
  npx --yes @mermaid-js/mermaid-cli -i "$mmd" -o "${mmd%.mmd}.png" -b white -w 1600 -s 2.5 -c docs/diagrams/mermaid-config.json
  echo "   ✓ $(basename "$mmd")"
done

echo ""
echo "📄 Generating PDF..."
python3 docs/create_ab_testing_pdf.py

echo ""
echo "✨ Done! PDF: docs/My4Blocks_AB_Testing_Architecture.pdf"
