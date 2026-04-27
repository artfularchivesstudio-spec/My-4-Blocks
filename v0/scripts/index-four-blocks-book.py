#!/usr/bin/env python3
"""
🎭 The Four Blocks Book Indexer — Where Pages Become Wisdom ✨

"This ancient tome holds not just words, but pathways to transformation.
Each page a portal, each section a star in our constellation of knowledge."

- The Spellbinding Librarian of Graph Topology

Indexes the Four Blocks paperback book PDF using PageIndex and stores results
in the knowledge graph for semantic search and graph traversal.
"""

import os
import sys
import json
import asyncio
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# PageIndex imports
try:
    from pageindex import PageIndexClient
    from pageindex.models import SubmitDocumentResponse, TreeResponse
except ImportError:
    print("💥 😭 PageIndex not found! Install with: pip install pageindex")
    sys.exit(1)

# Supabase imports (for storage)
try:
    import supabase
except ImportError:
    print("💥 😭 Supabase client not found! Install with: pip install supabase")
    sys.exit(1)


# 🔮 Configuration
FOUR_BLOCKS_PDF = Path("/Users/admin/Developer/My-4-Blocks/content/Four blocks paperback book (full book).pdf")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")  # Or service role key for writes
PAGE_INDEX_API_KEY = os.getenv("PAGE_INDEX_API_KEY", "")  # If needed


class FourBlocksBookIndexer:
    """🎭 The Grand Archivist of Four Blocks Wisdom"""

    def __init__(self):
        """🌟 Initialize the mystical indexing journey"""
        print("🌐 ✨ FOUR BLOCKS BOOK INDEXER AWAKENS!")

        # Validate PDF exists
        if not FOUR_BLOCKS_PDF.exists():
            print(f"💥 😭 PDF not found at: {FOUR_BLOCKS_PDF}")
            raise FileNotFoundError(f"PDF not found: {FOUR_BLOCKS_PDF}")

        # Initialize PageIndex client
        print("📜 ✨ Connecting to PageIndex API...")
        self.page_client = PageIndexClient()

        # Initialize Supabase client
        if not SUPABASE_KEY:
            print("🌙 ⚠️ No Supabase key found — running in dry-run mode")
            self.supabase = None
        else:
            print("🔗 ✨ Connecting to Supabase...")
            self.supabase = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

        # Storage for indexed content
        self.document_id: Optional[str] = None
        self.page_contents: List[Dict[str, Any]] = []
        self.tree_structure: Optional[Dict[str, Any]] = None

    async def submit_document(self) -> str:
        """
        🚀 Submit the PDF to PageIndex for processing

        Returns the document ID for tracking
        """
        print(f"📤 ✨ Submitting {FOUR_BLOCKS_PDF.name} to PageIndex...")

        try:
            # Submit document for processing
            response = await self.page_client.submit_document(
                file_path=str(FOUR_BLOCKS_PDF),
                # Optional: Add metadata
                metadata={
                    "title": "Four Blocks Paperback Book",
                    "author": "The Four Blocks Team",
                    "indexed_at": datetime.now().isoformat()
                }
            )

            self.document_id = response.id
            print(f"🎉 ✨ Document submitted! ID: {self.document_id}")
            print(f"🎪 📦 Status: {response.status}")

            return self.document_id

        except Exception as e:
            print(f"💥 😭 Document submission failed: {e}")
            raise

    async def wait_for_processing(self, timeout: int = 300) -> bool:
        """
        ⏳ Wait for PageIndex to complete processing

        Args:
            timeout: Maximum seconds to wait (default: 5 minutes)
        """
        print(f"⏳ ✨ Waiting for document processing (max {timeout}s)...")

        start_time = time.time()
        check_interval = 10  # Check every 10 seconds

        while time.time() - start_time < timeout:
            try:
                status = await self.page_client.get_status(self.document_id)

                if status.status == "completed":
                    print("🎉 ✨ PROCESSING COMPLETE! The wisdom is ready!")
                    return True
                elif status.status == "failed":
                    print(f"💥 😭 Processing failed: {status.error}")
                    return False
                else:
                    elapsed = int(time.time() - start_time)
                    print(f"🌟 ✨ Still processing... ({elapsed}s elapsed)")
                    time.sleep(check_interval)

            except Exception as e:
                print(f"🌙 ⚠️ Status check failed: {e}")
                time.sleep(check_interval)

        print(f"💥 😭 Processing timeout after {timeout}s")
        return False

    async def retrieve_content(self) -> List[Dict[str, Any]]:
        """
        📚 Retrieve all page content from processed document

        Returns list of page contents with text and metadata
        """
        print("📜 ✨ Retrieving page contents...")

        try:
            # Get retrieval results
            retrieval = await self.page_client.get_retrieval(self.document_id)

            self.page_contents = retrieval.results
            print(f"🎉 ✨ Retrieved {len(self.page_contents)} pages!")

            # Show sample of first page
            if self.page_contents:
                first_page = self.page_contents[0]
                print(f"🎪 📦 Sample page {first_page.get('page_number', '?')}:")
                preview = first_page.get('content', '')[:200]
                print(f"   '{preview}...'...")

            return self.page_contents

        except Exception as e:
            print(f"💥 😭 Content retrieval failed: {e}")
            raise

    async def retrieve_tree_structure(self) -> Dict[str, Any]:
        """
        🌳 Retrieve the hierarchical tree structure of the document

        Returns tree structure with sections and subsections
        """
        print("🌳 ✨ Retrieving document tree structure...")

        try:
            # Get tree structure
            tree = await self.page_client.get_tree(self.document_id)

            self.tree_structure = tree.dict() if hasattr(tree, 'dict') else tree
            print("🎉 ✨ Tree structure retrieved!")

            # Show structure summary
            self._print_tree_summary(self.tree_structure)

            return self.tree_structure

        except Exception as e:
            print(f"💥 😭 Tree retrieval failed: {e}")
            raise

    def _print_tree_summary(self, tree: Dict[str, Any], indent: int = 0):
        """🎨 Print a summary of the tree structure"""
        prefix = "  " * indent

        if 'title' in tree:
            print(f"{prefix}📖 {tree['title']}")

        if 'children' in tree:
            for child in tree['children'][:5]:  # Show first 5 children
                self._print_tree_summary(child, indent + 1)
            if len(tree['children']) > 5:
                print(f"{prefix}... and {len(tree['children']) - 5} more sections")

    async def store_in_database(self):
        """
        💾 Store indexed content in Supabase knowledge graph

        Creates page_index_sections records and corresponding knowledge_nodes
        """
        if not self.supabase:
            print("🌙 ⚠️ Skipping database storage (no Supabase client)")
            return

        print("💾 ✨ Storing content in knowledge graph...")

        try:
            # Store each page as a section
            stored_count = 0

            for page in self.page_contents:
                page_number = page.get('page_number', 0)
                content = page.get('content', '')

                # Extract keywords (simple version: top words by frequency)
                keywords = self._extract_keywords(content)

                # Create section title from tree or page number
                section_title = self._get_section_title(page_number)
                section_slug = self._slugify(section_title)

                # Store in page_index_sections
                section_data = {
                    'page_number': page_number,
                    'section_title': section_title,
                    'section_slug': section_slug,
                    'content': content,
                    'keywords': keywords,
                    'created_at': datetime.now().isoformat()
                }

                result = self.supabase.table('page_index_sections').insert(section_data).execute()
                stored_count += 1

                # Create corresponding knowledge_node
                node_data = {
                    'slug': f"section-{section_slug}",
                    'title': section_title,
                    'node_type': 'section',
                    'content': content[:500],  # First 500 chars as preview
                    'description': f"Section from page {page_number}",
                    'metadata': {
                        'page_number': page_number,
                        'word_count': len(content.split())
                    },
                    'source_type': 'book_section',
                    'source_file': 'Four blocks paperback book (full book).pdf',
                    'created_at': datetime.now().isoformat()
                }

                self.supabase.table('knowledge_nodes').insert(node_data).execute()

            print(f"🎉 ✨ Stored {stored_count} sections in knowledge graph!")

        except Exception as e:
            print(f"💥 😭 Database storage failed: {e}")
            raise

    def _extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """
        🔍 Extract key concepts from text

        Simple implementation: find capitalized words and common terms
        """
        # Simple keyword extraction: capitalized words > 2 chars
        words = text.split()
        keywords = []

        for word in words:
            # Clean word
            clean = word.strip('.,!?;:"()[]').lower()

            # Keep if it's meaningful
            if len(clean) > 3 and clean[0].isupper():
                if clean not in keywords:
                    keywords.append(clean)

                    if len(keywords) >= max_keywords:
                        break

        return keywords

    def _get_section_title(self, page_number: int) -> str:
        """🎨 Get section title from tree structure or fallback"""
        # Try to find in tree structure
        if self.tree_structure:
            title = self._find_title_in_tree(self.tree_structure, page_number)
            if title:
                return title

        # Fallback to page number
        return f"Page {page_number}"

    def _find_title_in_tree(self, tree: Dict[str, Any], page_number: int) -> Optional[str]:
        """🔍 Recursively search for title by page number"""
        if 'page_number' in tree and tree['page_number'] == page_number:
            return tree.get('title', f"Page {page_number}")

        if 'children' in tree:
            for child in tree['children']:
                title = self._find_title_in_tree(child, page_number)
                if title:
                    return title

        return None

    def _slugify(self, text: str) -> str:
        """🎨 Convert title to URL-friendly slug"""
        # Simple slugification
        slug = text.lower()
        slug = ''.join(c if c.isalnum() or c in ['-', '_'] else '-' for c in slug)
        slug = slug.strip('-')
        return slug[:50]  # Limit length

    async def query_by_topic(self, topic: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        🔍 Test semantic search for a topic

        Args:
            topic: Search query (e.g., "anger", "should statements")
            max_results: Maximum number of results

        Returns list of relevant sections
        """
        print(f"🔍 ✨ Querying for: '{topic}'")

        try:
            # Submit query to PageIndex
            results = await self.page_client.submit_query(
                document_id=self.document_id,
                query=topic,
                max_results=max_results
            )

            print(f"🎉 ✨ Found {len(results.results)} relevant sections!")

            # Display results
            for i, result in enumerate(results.results, 1):
                print(f"\n🎪 📦 Result {i}:")
                print(f"   Page: {result.get('page_number', '?')}")
                print(f"   Title: {result.get('title', 'N/A')}")
                preview = result.get('content', '')[:150]
                print(f"   Preview: '{preview}...'")

            return results.results

        except Exception as e:
            print(f"💥 😭 Query failed: {e}")
            raise

    async def run_full_indexing(self) -> Dict[str, Any]:
        """
        🎭 Run the complete indexing ritual

        Returns summary of indexing results
        """
        print("\n" + "="*60)
        print("🌟 ✨ THE GRAND INDEXING RITUAL COMMENCES! ✨")
        print("="*60 + "\n")

        try:
            # Step 1: Submit document
            await self.submit_document()

            # Step 2: Wait for processing
            if not await self.wait_for_processing():
                raise Exception("Document processing failed or timed out")

            # Step 3: Retrieve content
            await self.retrieve_content()

            # Step 4: Retrieve tree structure
            await self.retrieve_tree_structure()

            # Step 5: Store in database
            await self.store_in_database()

            # Step 6: Test query
            print("\n🔍 ✨ Testing semantic search...")
            await self.query_by_topic("anger")

            # Return summary
            summary = {
                'document_id': self.document_id,
                'total_pages': len(self.page_contents),
                'sections_indexed': len(self.page_contents),
                'has_tree_structure': self.tree_structure is not None,
                'timestamp': datetime.now().isoformat()
            }

            print("\n" + "="*60)
            print("🎉 ✨ INDEXING MASTERPIECE COMPLETE! ✨")
            print("="*60 + "\n")

            return summary

        except Exception as e:
            print("\n" + "="*60)
            print(f"💥 😭 INDEXING TEMPERARILY HALTED!")
            print(f"Error: {e}")
            print("="*60 + "\n")
            raise


async def main():
    """🚀 Main entry point for the indexing ritual"""
    indexer = FourBlocksBookIndexer()
    await indexer.run_full_indexing()


if __name__ == "__main__":
    asyncio.run(main())
