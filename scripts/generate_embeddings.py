#!/usr/bin/env python3
"""
🔮 The Embedding Alchemist - Transform Knowledge into Vector Crystals ✨

"Where wisdom becomes mathematical essence,
flowing through dimensional space with purpose."

This script processes the unified knowledge base and generates
semantic embeddings for RAG retrieval across all My-4-Blocks variants.

- The Cosmic Embedding Orchestrator
"""

import json
import os
import sys
from pathlib import Path
from typing import Any

from openai import OpenAI
from dotenv import load_dotenv

# 🌟 Load environment variables from .env file
load_dotenv()

# 🔮 Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 🎭 Configuration constants
EMBEDDING_MODEL = "text-embedding-3-small"
INPUT_FILE = Path(__file__).parent.parent / "content" / "unified-knowledge-base.json"
OUTPUT_FILE = Path(__file__).parent.parent / "shared" / "data" / "embeddings.json"


def get_embedding(text: str) -> list[float]:
    """
    🌊 Transform text into crystallized vector wisdom

    Takes the raw content and alchemizes it into a 1536-dimensional
    vector that captures semantic meaning. ✨
    """
    response = client.embeddings.create(
        input=text,
        model=EMBEDDING_MODEL
    )
    return response.data[0].embedding


def determine_block_type(chunk: dict[str, Any]) -> str:
    """
    🎨 Detect which emotional block this chunk addresses

    Maps chapter codes to the Four Blocks + additional categories.
    Because even wisdom needs proper labeling! 🏷️
    """
    chapter_to_block = {
        "ANG": "Anger",
        "ANX": "Anxiety",
        "DEP": "Depression",
        "GUILT": "Guilt",
        "MC": "Mental Contamination",
        "ABC": "ABCs",
        "INS": "Three Insights",
        "IRR": "Irrational Beliefs",
        "HAP": "Happiness",
    }
    return chapter_to_block.get(chunk.get("chapter", ""), "General")


def process_knowledge_base(input_path: Path, output_path: Path) -> None:
    """
    🌟 The Grand Orchestration - Transform knowledge base into embeddings

    1. Load unified knowledge base
    2. Generate embeddings for each chunk
    3. Preserve all metadata for retrieval
    4. Crystallize into the sacred JSON format
    """
    print("🌐 ✨ EMBEDDING GENERATION AWAKENS!")
    print(f"📖 Reading from: {input_path}")

    # 🌊 Step 1: Load the knowledge base
    with open(input_path, "r") as f:
        knowledge_base = json.load(f)

    chunks = knowledge_base.get("chunks", [])
    print(f"💎 Found {len(chunks)} wisdom chunks to process")

    # 💎 Step 2: Generate embeddings for each chunk
    embedded_chunks = []

    for idx, chunk in enumerate(chunks, 1):
        chunk_id = chunk.get("chunk", f"chunk_{idx}")
        content = chunk.get("content", "")

        if not content.strip():
            print(f"🌙 ⚠️ Skipping empty chunk: {chunk_id}")
            continue

        print(f"🎪 📦 Batch {idx}/{len(chunks)} entering the cosmic ring! ({chunk_id})")

        # 🔮 Generate the embedding
        try:
            embedding = get_embedding(content)
        except Exception as e:
            print(f"💥 😭 Failed to embed {chunk_id}: {e}")
            continue

        # 🎨 Create the embedded chunk with full metadata
        embedded_chunk = {
            "id": chunk_id,
            "text": content,
            "embedding": embedding,
            "block_type": determine_block_type(chunk),
            "metadata": {
                "chapter": chunk.get("chapter", ""),
                "section": chunk.get("section", ""),
                "title": chunk.get("title", ""),
                "tags": chunk.get("tags", []),
                "keywords": chunk.get("keywords", []),
                "related": chunk.get("related", []),
                "audience": chunk.get("audience", "general"),
                "category": chunk.get("category", ""),
            }
        }
        embedded_chunks.append(embedded_chunk)

    print(f"\n🎉 ✨ EMBEDDING MASTERPIECE COMPLETE!")
    print(f"🌟 Total chunks embedded: {len(embedded_chunks)}")

    # 📜 Step 3: Crystallize into JSON
    output_data = {
        "version": "2.0",
        "model": EMBEDDING_MODEL,
        "dimensions": 1536,
        "total_chunks": len(embedded_chunks),
        "chapters": knowledge_base.get("chapters", []),
        "chunks": embedded_chunks,
        "metadata": {
            "source": "My4Blocks Unified Training Data",
            "description": "Semantic embeddings for RAG retrieval",
            "blocks": ["Anger", "Anxiety", "Depression", "Guilt"],
            "additional_topics": ["Mental Contamination", "ABCs", "Three Insights", "Irrational Beliefs", "Happiness"],
        }
    }

    # 🌟 Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\n💎 Wisdom crystallized at: {output_path}")

    # 📊 Print summary statistics
    block_counts = {}
    for chunk in embedded_chunks:
        block = chunk["block_type"]
        block_counts[block] = block_counts.get(block, 0) + 1

    print(f"\n📊 Block Distribution:")
    for block, count in sorted(block_counts.items()):
        print(f"   🎭 {block}: {count} chunks")


def main():
    """
    🚀 The Cosmic Entry Point

    Validates environment and kicks off the embedding ritual.
    """
    # 🔑 Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("💥 😭 OPENAI_API_KEY not found!")
        print("🌙 Please set it in your .env file or environment")
        sys.exit(1)

    # 📖 Check input file exists
    if not INPUT_FILE.exists():
        print(f"💥 😭 Input file not found: {INPUT_FILE}")
        print("🌙 Run this script from the project root after creating unified-knowledge-base.json")
        sys.exit(1)

    # 🌟 Run the ritual
    process_knowledge_base(INPUT_FILE, OUTPUT_FILE)

    print("\n✨ 🎊 EMBEDDING GENERATION RITUAL COMPLETE!")
    print("🔮 Your wisdom crystals are ready for RAG retrieval")


if __name__ == "__main__":
    main()
