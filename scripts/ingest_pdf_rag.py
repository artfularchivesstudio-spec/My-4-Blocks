#!/usr/bin/env python3
"""
🔮 The Chonkie RAG Ritual - Transform Full PDF into Crystallized Wisdom ✨

"Where the sacred scroll meets intelligent chunking,
and every page becomes retrievable gold."

Uses Chonkie for intelligent semantic chunking, then OpenAI embeddings.
Outputs to shared/data/embeddings.json for all variants (claude, gemini, v0).

- The Cosmic Chonkie Alchemist
"""

import json
import os
import sys
from pathlib import Path
from typing import Any

import pdfplumber
from chonkie.chunker import token
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# 🌟 Paths - run from project root
PROJECT_ROOT = Path(__file__).parent.parent
PDF_PATH = PROJECT_ROOT / "content" / "you-only-have-four-problems-book-text.pdf"
OUTPUT_PATH = PROJECT_ROOT / "shared" / "data" / "embeddings.json"

# 🎭 Variant copies - so each variant gets the same embeddings
VARIANT_PATHS = [
    PROJECT_ROOT / "claude" / "shared" / "data" / "embeddings.json",
    PROJECT_ROOT / "gemini" / "shared" / "data" / "embeddings.json",
    PROJECT_ROOT / "v0" / "shared" / "data" / "embeddings.json",
]

# 🎭 Block detection + chapter mapping
BLOCKS = ["Anger", "Anxiety", "Depression", "Guilt"]
CHAPTER_KEYWORDS = {
    "Mental Contamination": ["mental contamination", "contamination", "thought"],
    "Three Insights": ["three insights", "first insight", "second insight", "third insight"],
    "ABCs": ["abc", "activating event", "belief", "consequence", "emotional consequence"],
    "Irrational Beliefs": ["irrational belief", "seven irrational", "awfuliz", "must", "should"],
    "Anger": ["anger", "formula for anger", "angry formula"],
    "Anxiety": ["anxiety", "formula for anxiety", "anxious formula"],
    "Depression": ["depression", "formula for depression", "depressed formula"],
    "Guilt": ["guilt", "formula for guilt", "guilty formula"],
    "Happiness": ["happiness", "formula for happiness", "joy", "contentment"],
    "Zen Meditation": ["zen", "meditation", "mindfulness", "ox-herding"],
    "Healthy Living": ["healthy body", "healthy mind", "body", "mind"],
}


def extract_text_from_pdf(pdf_path: Path) -> str:
    """🌊 Extract the river of text from the sacred PDF scroll"""
    print("🌐 ✨ PDF EXTRACTION AWAKENS!")
    print(f"📖 Reading: {pdf_path}")

    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"

    print(f"💎 Extracted {len(full_text):,} characters of wisdom")
    return full_text


def chunk_with_chonkie(text: str) -> list[str]:
    """✨ Chonkie chunking - intelligent token-based boundaries"""
    print("🧮 ✨ CHONKIE CHUNKING RITUAL BEGINS! (size=500, overlap=100)")

    chunker = token.TokenChunker(
        chunk_size=500,
        chunk_overlap=100,
    )
    chunks = chunker.chunk(text)

    # Filter trivial chunks (Chonkie returns Chunk objects with .text)
    meaningful = [
        (c.text if hasattr(c, "text") else str(c)).strip()
        for c in chunks
        if len((c.text if hasattr(c, "text") else str(c)).strip()) > 80
    ]
    print(f"🎉 ✨ CHONKIE MASTERPIECE COMPLETE! {len(meaningful)} wisdom nuggets created")
    return meaningful


def detect_block_type(chunk_text: str) -> str:
    """🎨 Detect which emotional block this chunk addresses"""
    chunk_lower = chunk_text.lower()

    # First check Four Blocks
    for block in BLOCKS:
        if block.lower() in chunk_lower:
            return block

    # Then check chapter themes
    for chapter, keywords in CHAPTER_KEYWORDS.items():
        if any(kw in chunk_lower for kw in keywords):
            return chapter

    return "General"


def get_embedding(client: OpenAI, text: str) -> list[float]:
    """🔮 Transform text into crystallized vector wisdom"""
    response = client.embeddings.create(
        input=text[:8000],  # Truncate if too long
        model="text-embedding-3-small",
    )
    return response.data[0].embedding


def create_chunk_metadata(chunk_text: str, block_type: str, idx: int) -> dict[str, Any]:
    """📄 Create metadata matching shared/lib types.ts"""
    title = chunk_text[:60].rstrip() + "..." if len(chunk_text) > 60 else chunk_text
    return {
        "chapter": block_type,
        "section": "",
        "title": title,
        "tags": [],
        "keywords": [],
        "related": [],
        "audience": "general",
        "category": block_type.lower().replace(" ", "_"),
    }


def process_pdf_to_embeddings() -> None:
    """🌟 The Grand Orchestration - PDF → Chonkie → Embeddings → shared"""
    print("🌐 ✨ THE CHONKIE RAG RITUAL AWAKENS!")
    print("=" * 50)

    if not os.getenv("OPENAI_API_KEY"):
        print("💥 😭 OPENAI_API_KEY not found! Set it in .env")
        sys.exit(1)

    if not PDF_PATH.exists():
        print(f"💥 😭 PDF NOT FOUND: {PDF_PATH}")
        sys.exit(1)

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 🌐 Step 1: Extract full PDF
    full_text = extract_text_from_pdf(PDF_PATH)
    if not full_text.strip():
        print("💥 😭 No text extracted from PDF!")
        sys.exit(1)

    # 🧮 Step 2: Chonkie chunking (smart boundaries!)
    chunk_texts = chunk_with_chonkie(full_text)

    # 💎 Step 3: Generate embeddings
    print("\n🌐 ✨ EMBEDDING GENERATION AWAKENS!")
    embedded_chunks = []

    for idx, chunk_text in enumerate(chunk_texts, 1):
        if idx % 20 == 0:
            print(f"🎪 📦 Batch {idx}/{len(chunk_texts)} entering the cosmic ring!")

        block_type = detect_block_type(chunk_text)
        embedding = get_embedding(client, chunk_text)

        embedded_chunks.append({
            "id": f"chunk_{idx}",
            "text": chunk_text,
            "embedding": embedding,
            "block_type": block_type,
            "metadata": create_chunk_metadata(chunk_text, block_type, idx),
        })

    print(f"\n🎉 ✨ EMBEDDING MASTERPIECE COMPLETE!")

    # 📊 Build chapter summary from block distribution
    block_counts: dict[str, int] = {}
    for c in embedded_chunks:
        bt = c["block_type"]
        block_counts[bt] = block_counts.get(bt, 0) + 1

    chapters = [
        {"code": k[:3].upper() if len(k) >= 3 else k, "name": k, "count": v}
        for k, v in sorted(block_counts.items())
    ]

    # 📜 Step 4: Crystallize into JSON
    output_data = {
        "version": "3.0",
        "model": "text-embedding-3-small",
        "dimensions": 1536,
        "total_chunks": len(embedded_chunks),
        "chapters": chapters,
        "chunks": embedded_chunks,
        "metadata": {
            "source": "You Only Have Four Problems (full PDF)",
            "description": "Full PDF extraction via Chonkie chunking + OpenAI embeddings",
            "blocks": BLOCKS,
            "additional_topics": ["Mental Contamination", "ABCs", "Three Insights", "Irrational Beliefs", "Happiness", "Zen Meditation"],
        },
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\n💎 Wisdom crystallized at: {OUTPUT_PATH}")
    print(f"🌟 Total chunks: {len(embedded_chunks)}")
    print(f"🌊 Blocks: {dict(block_counts)}")

    # 📋 Step 5: Copy to variant shared folders
    for variant_path in VARIANT_PATHS:
        variant_path.parent.mkdir(parents=True, exist_ok=True)
        with open(variant_path, "w") as f:
            json.dump(output_data, f, indent=2)
        print(f"✨ Synced to {variant_path.relative_to(PROJECT_ROOT)}")

    print("\n🎊 CHONKIE RAG RITUAL COMPLETE! All variants updated.")


if __name__ == "__main__":
    process_pdf_to_embeddings()
