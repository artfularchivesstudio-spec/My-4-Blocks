#!/usr/bin/env python3
"""
🔮 The Book Alchemy Ritual - Transform PDF into Crystallized Wisdom ✨

This mystical script transforms Dr. Vincent Parr's "You Only Have Four Problems"
into chunks and embeddings, creating the foundation for our RAG oracle.

The Four Blocks: Anger, Anxiety, Depression, Guilt → The Four Immeasurables
"""

import json
import os
import sys
from typing import Any
from pathlib import Path

import pdfplumber
from openai import OpenAI

# 🌟 Initialize the cosmic API connection
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 🎭 Constants for the ritual
BLOCKS = ["Anger", "Anxiety", "Depression", "Guilt"]
CHAPTERS = {
    "Mental Contamination": "Mental Contamination",
    "The Three Insights To A Mind Of Peace": "Three Insights",
    "The ABCs of How Emotions are Created": "ABCs",
    "The Seven Irrational Beliefs": "Irrational Beliefs",
    "The Formula for Anger": "Anger",
    "The Formula for Anxiety": "Anxiety",
    "The Formula for Depression": "Depression",
    "The Formula for Guilt": "Guilt",
    "The Formulas for Happiness": "Happiness",
    "Why Zen Meditation is Essential Mind Training": "Zen Meditation",
    "Healthy Body, Healthy Mind": "Healthy Living",
    "Lessons From the 10 Ox-Herding Pictures": "Ox-Herding",
}


def extract_text_from_pdf(pdf_path: str) -> str:
    """🌊 Extract the river of text from the sacred PDF scroll"""
    print("🌐 ✨ PDF EXTRACTION AWAKENS!")
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    
    print(f"💎 Extracted {len(full_text)} characters of wisdom")
    return full_text


def detect_block_type(chunk: str) -> str:
    """🎨 Detect which emotional block this chunk addresses"""
    chunk_lower = chunk.lower()
    for block in BLOCKS:
        if block.lower() in chunk_lower:
            return block
    return "General"


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[dict[str, Any]]:
    """✨ Transform flowing text into digestible wisdom nuggets"""
    print(f"🎪 📦 CHUNKING RITUAL BEGINS! (size={chunk_size}, overlap={overlap})")
    
    chunks = []
    tokens = text.split()
    
    for i in range(0, len(tokens), chunk_size - overlap):
        chunk_tokens = tokens[i : i + chunk_size]
        chunk_text = " ".join(chunk_tokens)
        
        if len(chunk_text.strip()) > 50:  # 🌙 Only keep meaningful chunks
            chunks.append({
                "text": chunk_text,
                "start_idx": i,
                "end_idx": i + len(chunk_tokens),
                "block_type": detect_block_type(chunk_text)
            })
    
    print(f"🎉 ✨ CHUNKING MASTERPIECE COMPLETE! {len(chunks)} wisdom nuggets created")
    return chunks


def get_embedding(text: str) -> list[float]:
    """🔮 Transform text into crystallized vector wisdom"""
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding


def process_book(pdf_path: str, output_path: str) -> None:
    """🌟 The Grand Orchestration - Process book into RAG foundation"""
    
    # 🌐 Step 1: Extract the sacred text
    full_text = extract_text_from_pdf(pdf_path)
    
    # 🎪 Step 2: Fragment into wisdom nuggets
    chunks = chunk_text(full_text)
    
    # 💎 Step 3: Generate embeddings for the cosmic retrieval
    print("\n🌐 ✨ EMBEDDING GENERATION AWAKENS!")
    
    embedded_chunks = []
    for idx, chunk in enumerate(chunks, 1):
        print(f"🎪 📦 Batch {idx}/{len(chunks)} entering the cosmic ring!")
        
        embedding = get_embedding(chunk["text"])
        
        embedded_chunks.append({
            "id": f"chunk_{idx}",
            "text": chunk["text"],
            "embedding": embedding,
            "block_type": chunk["block_type"],
            "metadata": {
                "chunk_index": idx,
                "token_count": len(chunk["text"].split()),
                "block": chunk["block_type"]
            }
        })
    
    print(f"\n🎉 ✨ EMBEDDING MASTERPIECE COMPLETE!")
    
    # 📜 Step 4: Crystallize into JSON
    output_data = {
        "version": "1.0",
        "model": "text-embedding-3-small",
        "total_chunks": len(embedded_chunks),
        "chunks": embedded_chunks,
        "metadata": {
            "source": "You Only Have Four Problems",
            "author": "Dr. Vincent E. Parr",
            "blocks": BLOCKS,
            "description": "RAG foundation for Four Blocks Chat"
        }
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n💎 Wisdom crystallized at: {output_path}")
    print(f"🌟 Total chunks: {len(embedded_chunks)}")
    print(f"🌊 Blocks covered: {set(chunk['block_type'] for chunk in embedded_chunks)}")


if __name__ == "__main__":
    pdf_path = os.getenv("PDF_PATH", "../content/you-only-have-four-problems-book-text.pdf")
    output_path = os.getenv("OUTPUT_PATH", "./data/embeddings.json")
    
    if not os.path.exists(pdf_path):
        print(f"💥 😭 PDF NOT FOUND: {pdf_path}")
        sys.exit(1)
    
    process_book(pdf_path, output_path)
