#!/usr/bin/env python3
"""
🎭 The Knowledge Graph Ingestion Pipeline — Where Wisdom Flows ✨

"From system prompts to golden examples, every concept finds its place.
Nodes emerge from text, edges form from relationships, the constellation grows."

- The Spellbinding Alchemist of Graph Topology

Extracts concepts and relationships from curriculum sources and populates
the knowledge graph with nodes and edges for reasoning-based search.
"""

import os
import sys
import json
import asyncio
import re
from pathlib import Path
from typing import Dict, List, Any, Optional, Set
from datetime import datetime

# 🎨 Load environment variables from .env.local
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / ".env.local"
    if env_path.exists():
        load_dotenv(env_path)
        print(f"🔮 ✨ Loaded environment from {env_path}")
    else:
        print(f"🌙 ⚠️ No .env.local found at {env_path}")
except ImportError:
    print("🌙 ⚠️ python-dotenv not installed - using system env vars")

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Supabase imports
try:
    import supabase
except ImportError:
    print("💥 😭 Supabase client not found! Install with: pip install supabase")
    sys.exit(1)


# 🔮 Configuration
SYSTEM_PROMPT_PATH = Path("/Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md")
GOLDEN_EXAMPLES_PATH = Path("/Users/admin/Developer/My-4-Blocks/docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/anger/golden_examples.json")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
# 🎨 Check multiple possible env var names for the anon key
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "")


class KnowledgeGraphIngestor:
    """🎭 The Grand Architect of Knowledge Topology"""

    def __init__(self):
        """🌟 Initialize the mystical ingestion journey"""
        print("🌐 ✨ KNOWLEDGE GRAPH INGESTOR AWAKENS!")

        # Initialize Supabase client
        if not SUPABASE_KEY:
            print("🌙 ⚠️ No Supabase key found — running in dry-run mode")
            self.supabase = None
        else:
            print("🔗 ✨ Connecting to Supabase...")
            self.supabase = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

        # Storage for extracted entities
        self.concepts: List[Dict[str, Any]] = []
        self.scenarios: List[Dict[str, Any]] = []
        self.lenses: List[Dict[str, Any]] = []
        self.rubrics: List[Dict[str, Any]] = []
        self.relationships: List[Dict[str, Any]] = []

    async def extract_from_system_prompt(self):
        """
        📜 Extract concepts from system_prompt.md

        Parses the 9-section constitution and identifies core concepts
        like "ABC Model", "Should Statements", "Three Insights", etc.
        """
        print("📜 ✨ Extracting concepts from system_prompt.md...")

        if not SYSTEM_PROMPT_PATH.exists():
            print(f"💥 😭 System prompt not found: {SYSTEM_PROMPT_PATH}")
            return

        # Read the system prompt
        content = SYSTEM_PROMPT_PATH.read_text()

        # Extract concepts using patterns
        # Pattern 1: Section headers (## Concept Name)
        section_pattern = r'##\s+([^\n]+)'
        sections = re.findall(section_pattern, content)

        # Pattern 2: Bold terms (**Concept**)
        bold_pattern = r'\*\*([^*]+)\*\*'
        bold_terms = re.findall(bold_pattern, content)

        # Pattern 3: Capitalized phrases in lists
        # (e.g., "- The ABC Model: Antecedent, Belief, Consequence")
        list_pattern = r'^-\s+([A-Z][^:\n]+(?:[^\n]*)?)'
        list_items = re.findall(list_pattern, content, re.MULTILINE)

        # Combine and deduplicate
        all_concepts = set(sections + bold_terms + list_items)

        # Filter out non-concepts
        filtered_concepts = []
        for concept in all_concepts:
            # Must be meaningful length
            if len(concept) < 3:
                continue

            # Filter out common words
            skip_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out'}
            if concept.lower() in skip_words:
                continue

            # Clean up the concept name
            clean_concept = concept.strip('*').strip()

            # Create concept node
            filtered_concepts.append({
                'slug': self._slugify(clean_concept),
                'title': clean_concept,
                'node_type': 'concept',
                'content': self._extract_concept_definition(clean_concept, content),
                'description': f"Core concept from system_prompt.md",
                'metadata': {
                    'source_section': self._find_concept_section(clean_concept, content)
                },
                'source_type': 'system_prompt',
                'source_file': 'system_prompt.md',
                'confidence': 'high',
                'contested': False,
                'tags': ['core-concept']
            })

        self.concepts = filtered_concepts
        print(f"🎉 ✨ Extracted {len(self.concepts)} concepts!")

        # Show sample concepts
        for i, concept in enumerate(self.concepts[:5], 1):
            print(f"   {i}. {concept['title']}")

    def _extract_concept_definition(self, concept: str, content: str) -> Optional[str]:
        """🔍 Extract the definition/description of a concept"""
        # Find the concept in the text
        pattern = rf'(?:##\s+{re.escape(concept)}|{re.escape(concept)}[,:])\s*\n([^\n]+(?:\n[^\n]+){{0,3}})'
        match = re.search(pattern, content, re.IGNORECASE)

        if match:
            definition = match.group(1).strip()
            return definition[:500]  # First 500 chars

        return None

    def _find_concept_section(self, concept: str, content: str) -> Optional[str]:
        """🔍 Find which section a concept belongs to"""
        # Look for section headers before the concept
        sections = list(re.finditer(r'##\s+([^\n]+)', content))

        for i, section_match in enumerate(sections):
            section_title = section_match.group(1)
            section_start = section_match.end()

            # Check if concept appears in this section
            next_section = sections[i + 1] if i + 1 < len(sections) else None
            section_end = next_section.start() if next_section else len(content)

            section_content = content[section_start:section_end]
            if concept in section_content:
                return section_title

        return None

    async def extract_from_golden_examples(self):
        """
        🏆 Extract scenarios and rubrics from golden_examples.json

        Parses golden examples to create scenario nodes and rubric nodes
        """
        print("🏆 ✨ Extracting scenarios from golden_examples.json...")

        if not GOLDEN_EXAMPLES_PATH.exists():
            print(f"💥 😭 Golden examples not found: {GOLDEN_EXAMPLES_PATH}")
            return

        # Load the JSON
        content = GOLDEN_EXAMPLES_PATH.read_text()
        examples = json.loads(content)

        # Extract scenarios
        for example in examples:
            example_id = example.get('id', 'unknown')
            task_input = example.get('task_input', '')
            expected = example.get('expected_behavior', '')
            category = example.get('category', 'general')
            difficulty = example.get('difficulty', 'medium')

            # Create scenario node
            # 🎨 Create a brief description from the task input (first 100 chars)
            task_input_preview = task_input[:100] + '...' if len(task_input) > 100 else task_input
            scenario = {
                'slug': example_id.lower(),
                'title': f"{category} Example {example_id}",
                'node_type': 'scenario',
                'content': json.dumps(example, indent=2),
                'description': f"Golden example: {task_input_preview}",
                'metadata': {
                    'category': category,
                    'difficulty': difficulty,
                    'primary_tool': example.get('primary_tool', 'unknown'),
                    'task_input': task_input,
                    'expected_behavior': expected
                },
                'source_type': 'golden_example',
                'source_file': 'golden_examples.json',
                'confidence': 'high',
                'contested': False,
                'tags': [category, difficulty]
            }

            self.scenarios.append(scenario)

            # 🎨 Create a rubric node from expected behavior string
            # Since expected_behavior is a string (response guidance), create one rubric per example
            rubric = {
                'slug': f"{example_id}-rubric",
                'title': f"Response Criteria (from {example_id})",
                'node_type': 'rubric',
                'content': expected,
                'description': f"Evaluation criteria for {example_id}",
                'metadata': {
                    'scenario_id': example_id,
                    'criterion': 'response_quality',
                    'expected_guidance': expected
                },
                'source_type': 'golden_example',
                'source_file': 'golden_examples.json',
                'confidence': 'high',
                'contested': False,
                'tags': [category, 'rubric']
            }

            self.rubrics.append(rubric)

        print(f"🎉 ✨ Extracted {len(self.scenarios)} scenarios and {len(self.rubrics)} rubrics!")

        # Show sample
        for i, scenario in enumerate(self.scenarios[:3], 1):
            print(f"   {i}. {scenario['title']}")

    async def auto_extract_relationships(self):
        """
        🔗 Auto-extract relationships between nodes

        Finds patterns like:
        - Scenario demonstrates concept
        - Lens applies to concept
        - Rubric evaluates scenario
        """
        print("🔗 ✨ Auto-extracting relationships...")

        relationships = []

        # Scenario → demonstrates → Concept
        for scenario in self.scenarios:
            scenario_content = scenario.get('content', '').lower()

            for concept in self.concepts:
                concept_title = concept['title'].lower()

                # If concept name appears in scenario content
                if concept_title in scenario_content:
                    relationships.append({
                        'source_slug': scenario['slug'],
                        'target_slug': concept['slug'],
                        'edge_type': 'demonstrates',
                        'description': f"{scenario['title']} demonstrates {concept['title']}",
                        'weight': 0.8,
                        'metadata': {
                            'confidence': 'auto-extracted',
                            'match_type': 'content_match'
                        }
                    })

        # Rubric → evaluates → Scenario
        for rubric in self.rubrics:
            scenario_id = rubric['metadata'].get('scenario_id', '')

            # Find corresponding scenario
            scenario = next((s for s in self.scenarios if s['slug'] == scenario_id.lower()), None)

            if scenario:
                relationships.append({
                    'source_slug': rubric['slug'],
                    'target_slug': scenario['slug'],
                    'edge_type': 'evaluates',
                    'description': f"{rubric['title']} evaluates {scenario['title']}",
                    'weight': 1.0,
                    'metadata': {
                        'confidence': 'auto-extracted',
                        'match_type': 'explicit_reference'
                    }
                })

        self.relationships = relationships
        print(f"🎉 ✨ Extracted {len(self.relationships)} relationships!")

    async def store_in_database(self):
        """
        💾 Store all extracted entities in Supabase knowledge graph

        Creates nodes and edges in the database
        """
        if not self.supabase:
            print("🌙 ⚠️ Skipping database storage (no Supabase client)")
            return

        print("💾 ✨ Storing entities in knowledge graph...")

        try:
            # Store concepts
            for concept in self.concepts:
                try:
                    self.supabase.table('knowledge_nodes').insert(concept).execute()
                except Exception as e:
                    # May already exist
                    print(f"🌙 ⚠️ Concept {concept['title']} may already exist")

            # Store scenarios
            for scenario in self.scenarios:
                try:
                    self.supabase.table('knowledge_nodes').insert(scenario).execute()
                except Exception as e:
                    print(f"🌙 ⚠️ Scenario {scenario['title']} may already exist")

            # Store rubrics
            for rubric in self.rubrics:
                try:
                    self.supabase.table('knowledge_nodes').insert(rubric).execute()
                except Exception as e:
                    print(f"🌙 ⚠️ Rubric {rubric['title']} may already exist")

            # Store relationships (edges)
            # First, we need to map slugs to IDs
            slug_to_id = await self._get_slug_to_id_mapping()

            for rel in self.relationships:
                source_id = slug_to_id.get(rel['source_slug'])
                target_id = slug_to_id.get(rel['target_slug'])

                if source_id and target_id:
                    edge = {
                        'source_id': source_id,
                        'target_id': target_id,
                        'edge_type': rel['edge_type'],
                        'weight': rel['weight'],
                        'metadata': rel['metadata'],
                        'description': rel['description']
                    }

                    try:
                        self.supabase.table('knowledge_edges').insert(edge).execute()
                    except Exception as e:
                        print(f"🌙 ⚠️ Edge {rel['edge_type']} may already exist")

            print("🎉 ✨ Knowledge graph populated successfully!")

        except Exception as e:
            print(f"💥 😭 Database storage failed: {e}")
            raise

    async def _get_slug_to_id_mapping(self) -> Dict[str, str]:
        """🔍 Build mapping from slugs to node IDs"""
        mapping = {}

        # Fetch all nodes
        result = self.supabase.table('knowledge_nodes').select('id, slug').execute()

        for node in result.data:
            mapping[node['slug']] = node['id']

        return mapping

    def _slugify(self, text: str) -> str:
        """🎨 Convert text to URL-friendly slug"""
        slug = text.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = slug.strip('-')
        return slug[:50]

    async def run_full_ingestion(self):
        """🎭 Run the complete ingestion ritual"""
        print("\n" + "="*60)
        print("🌟 ✨ THE GRAND INGESTION RITUAL COMMENCES! ✨")
        print("="*60 + "\n")

        try:
            # Step 1: Extract concepts
            await self.extract_from_system_prompt()

            # Step 2: Extract scenarios and rubrics
            await self.extract_from_golden_examples()

            # Step 3: Auto-extract relationships
            await self.auto_extract_relationships()

            # Step 4: Store in database
            await self.store_in_database()

            # Return summary
            summary = {
                'concepts_extracted': len(self.concepts),
                'scenarios_extracted': len(self.scenarios),
                'rubrics_extracted': len(self.rubrics),
                'relationships_extracted': len(self.relationships),
                'total_nodes': len(self.concepts) + len(self.scenarios) + len(self.rubrics),
                'timestamp': datetime.now().isoformat()
            }

            print("\n" + "="*60)
            print("🎉 ✨ INGESTION MASTERPIECE COMPLETE! ✨")
            print(f"   📊 Nodes: {summary['total_nodes']}")
            print(f"   🔗 Edges: {summary['relationships_extracted']}")
            print("="*60 + "\n")

            return summary

        except Exception as e:
            print("\n" + "="*60)
            print(f"💥 😭 INGESTION TEMPERARILY HALTED!")
            print(f"Error: {e}")
            print("="*60 + "\n")
            raise


async def main():
    """🚀 Main entry point for the ingestion ritual"""
    ingestor = KnowledgeGraphIngestor()
    await ingestor.run_full_ingestion()


if __name__ == "__main__":
    asyncio.run(main())
