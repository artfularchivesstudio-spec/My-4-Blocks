import json
import os
from pathlib import Path

def prepare_data():
    base_path = Path("docs/GEPA-DSPy-m1/four_blocks_runner/curriculum")
    output_path = Path("docs/GEPA-DSPy-m1/hermes-agent-self-evolution/datasets/skills/four-blocks-companion/golden.jsonl")
    
    examples = []
    
    # 1. Load hand-written golden examples
    for block in ["anger", "anxiety", "depression", "guilt"]:
        block_file = base_path / block / "golden_examples.json"
        if block_file.exists():
            print(f"Loading {block} examples...")
            with open(block_file) as f:
                data = json.load(f)
                # Some files are list of examples, some have a dict with "examples" key
                if isinstance(data, list):
                    block_examples = data
                else:
                    block_examples = data.get("examples", [])
                
                for ex in block_examples:
                    examples.append({
                        "task_input": ex["task_input"],
                        "expected_behavior": ex["expected_behavior"],
                        "difficulty": ex.get("difficulty", "medium"),
                        "category": ex.get("category", "general"),
                        "source": "golden"
                    })
    
    # 2. Load and incorporate new chapter chunks (0, 10, 11)
    rag_path = Path("docs/GEPA-DSPy-m1/refined-rag-dataset v1")
    new_chapters = [
        "chapter_0_front_matter_chunks.json",
        "chapter_10_zen_chunks.json",
        "chapter_11_healthy_body_chunks.json"
    ]
    
    for chapter_file in new_chapters:
        chapter_path = rag_path / chapter_file
        if chapter_path.exists():
            print(f"Incorportating {chapter_file}...")
            with open(chapter_path) as f:
                # Handle JSONC by stripping comments if needed (though milestones said they were cleaned)
                content = f.read()
                # Simple comment strip for safety
                lines = [line for line in content.splitlines() if not line.strip().startswith("//")]
                chunks = json.loads("\n".join(lines))
                
                for chunk in chunks:
                    # Create a synthetic-style "learning" example from the chunk
                    concept = chunk.get("concept", "Unknown")
                    content = chunk.get("content", "")
                    
                    # Task: "Tell me about [concept]"
                    task_input = f"I'm interested in learning about {concept}. What can you tell me?"
                    
                    # Expected: Should explain the concept using the content, following brand rules
                    expected_behavior = (
                        f"RESPONSE SHOULD: (1) Explain the concept of '{concept}' clearly and warmly. "
                        f"(2) Ground the explanation in the substance: '{content[:200]}...'. "
                        f"(3) Follow all 'Four Blocks Companion' rules: NO framework names, NO labeling, NO lecturing. "
                        f"(4) Stay brief (2-3 paragraphs) and conversational."
                    )
                    
                    examples.append({
                        "task_input": task_input,
                        "expected_behavior": expected_behavior,
                        "difficulty": "medium",
                        "category": "learning",
                        "source": "chunk-synthetic"
                    })

    # 3. Write to golden.jsonl
    print(f"Writing {len(examples)} examples to {output_path}...")
    with open(output_path, "w") as f:
        for ex in examples:
            f.write(json.dumps(ex) + "\n")

if __name__ == "__main__":
    prepare_data()
