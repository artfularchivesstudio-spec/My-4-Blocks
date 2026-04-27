-- =============================================================================
-- 🎭 The Knowledge Graph Constellation — Where Concepts Interconnect ✨
--
-- "In the grand theater of wisdom, every concept connects to every other.
--  Scenarios demonstrate truths, lenses reveal perspectives, rubrics measure mastery.
--  The graph is the map, the database is the territory."
--
--  - The Spellbinding Museum Director of Graph Topology
-- =============================================================================
--
-- Migration: knowledge_nodes + knowledge_edges
-- Date     : 2026-04-26 15:00:00 UTC
-- Purpose  : Implement Karpathy's LLM Wiki pattern with persistent knowledge graph
--            for concepts, scenarios, lenses, rubrics, and book sections.
--
-- Dependencies:
--   - pgcrypto extension (for gen_random_uuid()) — Supabase enables by default
--   - Existing curriculum tables (for linking to scenarios/rubrics)
--
-- This schema supports:
--   ✅ Persistent knowledge graph with nodes and edges
--   ✅ Multiple node types: concepts, scenarios, lenses, rubrics, sections
--   ✅ Typed relationships: applies, demonstrates, evaluates, contains, related-to
--   ✅ Graph traversal queries for reasoning-based search
--   ✅ Integration with PageIndex for book content indexing
--   ✅ Wiki-style frontmatter and metadata
--   ✅ Full audit trail with timestamps and provenance
--
-- =============================================================================

-- 🔮 Ensure pgcrypto is available for UUID generation magic
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 🌟 TABLE 1: knowledge_nodes — The Stars of Our Knowledge Universe ✨
-- =============================================================================
-- Represents entities in the knowledge graph: concepts, scenarios, lenses,
-- rubrics, and book sections. Each node is a unique piece of wisdom.
--
-- Node types:
--   - concept: Core ideas from system_prompt.md (e.g., "Should Statements", "ABC Model")
--   - scenario: Golden examples from curriculum (e.g., "ANG-EX-001")
--   - lens: Perspective filters (e.g., "Body-first approach", "Preference language")
--   - rubric: Evaluation criteria (e.g., "Must not name clinical terms")
--   - section: Book sections from PageIndex (e.g., "Chapter 1: Identity")
--
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🎭 Node identification
  slug text NOT NULL UNIQUE, -- URL-friendly identifier (e.g., "should-statements", "ang-ex-001")
  title text NOT NULL,      -- Human-readable name

  -- 🎯 Node type classification
  node_type text NOT NULL
    CHECK (node_type IN ('concept', 'scenario', 'lens', 'rubric', 'section')),

  -- 📝 Content and metadata
  content text,             -- Full markdown content or description
  description text,          -- Short summary for UI display
  metadata jsonb DEFAULT '{}'::jsonb, -- Extensible metadata

  -- 🔗 Source provenance
  source_file text,          -- Where this came from (e.g., "system_prompt.md", "golden_examples.json")
  source_type text,          -- Type of source: "system_prompt", "golden_example", "book_section"

  -- 🏷️ Wiki-style frontmatter
  tags text[] DEFAULT ARRAY[]::text[], -- Tag array for categorization
  confidence text CHECK (confidence IN ('high', 'medium', 'low')), -- Evidence quality
  contested boolean DEFAULT false, -- Has unresolved contradictions

  -- 🔗 External references
  curriculum_example_id uuid REFERENCES golden_examples(id) ON DELETE SET NULL,
  curriculum_version_id uuid REFERENCES curriculum_versions(id) ON DELETE SET NULL,
  page_number integer,          -- For book sections

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraints
  CONSTRAINT knowledge_nodes_unique_slug_per_type UNIQUE (slug, node_type, deleted_at)
);

-- 📚 Indexes for common query patterns
CREATE INDEX idx_knowledge_nodes_type ON knowledge_nodes (node_type)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_nodes_slug ON knowledge_nodes (slug)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_nodes_tags ON knowledge_nodes USING GIN(tags)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_nodes_confidence ON knowledge_nodes (confidence)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_nodes_contested ON knowledge_nodes (contested)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_nodes_search ON knowledge_nodes USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '')))
  WHERE deleted_at IS NULL;

-- 🧙 Auto-update timestamp trigger
CREATE TRIGGER knowledge_nodes_updated_at
  BEFORE UPDATE ON knowledge_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_curriculum_versions_updated_at();

-- =============================================================================
-- 🔗 TABLE 2: knowledge_edges — The Cosmic Connections ✨
-- =============================================================================
-- Represents relationships between nodes in the knowledge graph.
--
-- Edge types:
--   - applies: Lens applies to concept (e.g., "Body-first" → "Anger")
--   - demonstrates: Scenario demonstrates concept (e.g., "ANG-EX-001" → "Should Statements")
--   - evaluates: Rubric evaluates scenario (e.g., "Body-first ordering" → "ANG-EX-001")
--   - contains: Section contains concept (e.g., "Chapter 1" → "Identity")
--   - related-to: General semantic relationship
--   - contradicts: Node contradicts another (for contested content)
--
CREATE TABLE IF NOT EXISTS knowledge_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 🔗 Node references
  source_id uuid NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES knowledge_nodes(id) ON DELETE CASCADE,

  -- 🎯 Edge type classification
  edge_type text NOT NULL
    CHECK (edge_type IN ('applies', 'demonstrates', 'evaluates', 'contains', 'related-to', 'contradicts')),

  -- 📊 Relationship strength and metadata
  weight numeric DEFAULT 1.0,     -- Connection strength (0.0 to 1.0)
  metadata jsonb DEFAULT '{}'::jsonb,

  -- 📝 Provenance and explanation
  description text,             -- Human-readable explanation of the relationship
  source_file text,             -- Where this relationship was extracted

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraints
  CONSTRAINT knowledge_edges_no_self_loops CHECK (source_id != target_id),
  CONSTRAINT knowledge_edges_unique_edges UNIQUE (source_id, target_id, edge_type, deleted_at)
);

-- 📚 Indexes for graph traversal
CREATE INDEX idx_knowledge_edges_source ON knowledge_edges (source_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_edges_target ON knowledge_edges (target_id)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_edges_type ON knowledge_edges (edge_type)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_edges_weight ON knowledge_edges (weight DESC)
  WHERE deleted_at IS NULL;

-- 🧙 Auto-update timestamp trigger
CREATE TRIGGER knowledge_edges_updated_at
  BEFORE UPDATE ON knowledge_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_curriculum_versions_updated_at();

-- =============================================================================
-- 📊 TABLE 3: page_index_sections — Book Content Index ✨
-- =============================================================================
-- Stores PageIndex results for the Four Blocks book PDF.
-- Enables semantic search across book content.
--
CREATE TABLE IF NOT EXISTS page_index_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 📖 Book section identification
  page_number integer NOT NULL,
  section_title text,
  section_slug text,           -- URL-friendly identifier

  -- 📝 Content
  content text NOT NULL,        -- Extracted text from PDF page
  summary text,                 -- AI-generated summary (optional)

  -- 🔍 Search metadata
  embedding vector(1536),        -- Embedding for semantic search (optional)
  keywords text[],               -- Key concepts extracted from section

  -- 🕰️ Audit timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- 🔗 Soft delete
  deleted_at timestamptz,

  -- 🎨 Constraints
  CONSTRAINT page_index_sections_unique_page UNIQUE (page_number, deleted_at)
);

-- 📚 Indexes for book search
CREATE INDEX idx_page_index_sections_page ON page_index_sections (page_number)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_page_index_sections_keywords ON page_index_sections USING GIN(keywords)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_page_index_sections_search ON page_index_sections USING GIN(to_tsvector('english', content))
  WHERE deleted_at IS NULL;

-- 🧙 Auto-update timestamp trigger
CREATE TRIGGER page_index_sections_updated_at
  BEFORE UPDATE ON page_index_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_curriculum_versions_updated_at();

-- =============================================================================
-- 🧙 Helper Functions for Knowledge Graph Operations
-- =============================================================================

-- 🎯 Function: Get subgraph around a node (BFS traversal)
CREATE OR REPLACE FUNCTION get_knowledge_subgraph(
  p_root_node_id uuid,
  p_max_depth integer DEFAULT 2
)
RETURNS TABLE (
  node_id uuid,
  node_slug text,
  node_title text,
  node_type text,
  edge_id uuid,
  edge_type text,
  source_id uuid,
  target_id uuid,
  distance integer
) AS $$
DECLARE
  -- 🎭 Temporary tables for BFS traversal
  TYPE node_queue AS (
    node_id uuid,
    distance integer
  );
  v_queue node_queue[];
  v_visited uuid[] := ARRAY[p_root_node_id];
  v_current uuid;
  v_current_dist integer;
BEGIN
  -- 🚀 Initialize BFS with root node
  INSERT INTO node_queue VALUES (p_root_node_id, 0);
  v_queue := ARRAY[(p_root_node_id, 0)::node_queue];

  WHILE array_length(v_queue, 1) > 0 LOOP
    -- � Pop next node from queue
    v_current := v_queue[1].node_id;
    v_current_dist := v_queue[1].distance;
    v_queue := v_queue[2:];

    -- 📤 Return node and its edges
    FOR edge IN
      SELECT e.id, e.source_id, e.target_id, e.edge_type,
             n.id, n.slug, n.title, n.node_type, v_current_dist
      FROM knowledge_edges e
      JOIN knowledge_nodes n ON (
        e.target_id = n.id AND e.source_id = v_current
      )
      WHERE e.deleted_at IS NULL AND n.deleted_at IS NULL
    LOOP
      RETURN QUERY;
    END LOOP;

    -- 🌳 Add unvisited neighbors to queue
    FOR neighbor IN
      SELECT DISTINCT e.target_id, v_current_dist + 1
      FROM knowledge_edges e
      WHERE e.source_id = v_current
        AND e.deleted_at IS NULL
        AND NOT (e.target_id = ANY(v_visited))
    LOOP
      v_visited := array_append(v_visited, neighbor.target_id);
      v_queue := array_append(v_queue, (neighbor.target_id, neighbor.distance)::node_queue);

      -- 🛑 Stop if we've reached max depth
      EXIT WHEN v_current_dist >= p_max_depth - 1;
    END LOOP;
  END LOOP;

  -- 📤 Return the root node itself
  FOR n IN
    SELECT n.id, n.slug, n.title, n.node_type,
           NULL::uuid, NULL::text, NULL::uuid, NULL::uuid, 0
    FROM knowledge_nodes n
    WHERE n.id = p_root_node_id AND n.deleted_at IS NULL
  LOOP
    RETURN QUERY;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Search knowledge graph by keyword
CREATE OR REPLACE FUNCTION search_knowledge_graph(
  p_query_text text,
  p_node_types text[] DEFAULT NULL
)
RETURNS TABLE (
  node_id uuid,
  node_slug text,
  node_title text,
  node_type text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.slug,
    n.title,
    n.node_type,
    CASE
      WHEN n.title ILIKE ('%' || p_query_text || '%') THEN 1.0
      WHEN n.content ILIKE ('%' || p_query_text || '%') THEN 0.8
      ELSE ts_rank(to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')), to_tsquery('english', p_query_text))
    END AS rank
  FROM knowledge_nodes n
  WHERE n.deleted_at IS NULL
    AND (
      p_node_types IS NULL OR n.node_type = ANY(p_node_types)
    )
    AND (
      n.title ILIKE ('%' || p_query_text || '%')
      OR n.content ILIKE ('%' || p_query_text || '%')
      OR p_query_text = ANY(n.tags)
    )
  ORDER BY rank DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Find shortest path between two nodes
CREATE OR REPLACE FUNCTION find_knowledge_path(
  p_source_id uuid,
  p_target_id uuid,
  p_max_hops integer DEFAULT 5
)
RETURNS TABLE (
  path_node_id uuid,
  path_node_title text,
  path_edge_id uuid,
  hop_number integer
) AS $$
BEGIN
  -- 🧙‍♂️ This is a simplified path finding using recursive CTEs
  -- For production, consider using pg_routing or specialized graph algorithms
  RETURN QUERY
  WITH RECURSIVE path_search AS (
    -- 🚀 Base case: start from source node
    (
      SELECT
        p_source_id as node_id,
        ARRAY[p_source_id] as path,
        ARRAY[]::uuid[] as edge_path,
        0 as hops
    )
    UNION ALL
    -- 🔄 Recursive case: follow edges toward target
    (
      SELECT
        e.target_id as node_id,
        ps.path || e.target_id,
        ps.edge_path || e.id,
        ps.hops + 1
      FROM knowledge_edges e
      JOIN path_search ps ON e.source_id = ps.node_id
      WHERE e.deleted_at IS NULL
        AND NOT e.target_id = ANY(ps.path)
        AND ps.hops < p_max_hops
    )
  )
  -- 📤 Return path when we reach target or hit hop limit
  SELECT
    UNNEST(path) as path_node_id,
    (SELECT title FROM knowledge_nodes WHERE id = UNNEST(path) AND deleted_at IS NULL) as path_node_title,
    NULL::uuid as path_edge_id,
    ps.hops as hop_number
  FROM path_search ps
  WHERE ps.node_id = p_target_id OR (ps.hops = p_max_hops AND ps.node_id = p_source_id)
  ORDER BY ps.hops
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🎯 Function: Get graph statistics
CREATE OR REPLACE FUNCTION get_knowledge_graph_stats()
RETURNS TABLE (
  total_nodes bigint,
  total_edges bigint,
  nodes_by_type jsonb,
  edges_by_type jsonb,
  connected_components bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH node_counts AS (
    SELECT
      COUNT(*) as total,
      jsonb_object_agg(
        node_type,
        count
      ) as by_type
    FROM knowledge_nodes
    WHERE deleted_at IS NULL
  ),
  edge_counts AS (
    SELECT
      COUNT(*) as total,
      jsonb_object_agg(
        edge_type,
        count
      ) as by_type
    FROM knowledge_edges
    WHERE deleted_at IS NULL
  ),
  components AS (
    -- 🧙‍♂️ Simplified connected component counting
    -- For production, consider using pg_graphql or specialized algorithms
    SELECT COUNT(DISTINCT CASE
      WHEN e.source_id < e.target_id THEN e.source_id
      ELSE e.target_id
    END +
    (SELECT COUNT(*) FROM knowledge_nodes WHERE id NOT IN (
      SELECT DISTINCT source_id FROM knowledge_edges WHERE deleted_at IS NULL
      UNION
      SELECT DISTINCT target_id FROM knowledge_edges WHERE deleted_at IS NULL
    ))
    FROM knowledge_edges e
    WHERE e.deleted_at IS NULL
  )
  SELECT
    nc.total,
    ec.total,
    nc.by_type,
    ec.by_type,
    (SELECT COUNT(*) FROM components) as connected_components
  FROM node_counts nc, edge_counts ec, components;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 🛡️ Row Level Security
-- =============================================================================

ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_index_sections ENABLE ROW LEVEL SECURITY;

-- 📖 Public read access
CREATE POLICYICY "Knowledge nodes are publicly readable"
  ON knowledge_nodes
  FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Knowledge edges are publicly readable"
  ON knowledge_edges
  FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Page index sections are publicly readable"
  ON page_index_sections
  FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- 🔧 Service role has full access
CREATE POLICY "Service role has full access to knowledge_nodes"
  ON knowledge_nodes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to knowledge_edges"
  ON knowledge_edges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to page_index_sections"
  ON page_index_sections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 🚀 Authenticated users can insert (for wiki curation)
CREATE POLICY "Authenticated users can create knowledge nodes"
  ON knowledge_nodes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can create knowledge edges"
  ON knowledge_edges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================================================
-- 🎉 Migration Complete — The Constellation Is Now Open ✨
-- =============================================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL editor
-- 2. Run the ingestion pipeline to populate the graph
-- 3. Test the helper functions in Supabase SQL editor
-- 4. Integrate with /admin panel knowledge graph UI
--
-- The stars are aligned for wisdom! 🎭
-- =============================================================================
