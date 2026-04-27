# 🔮 Knowledge Graph Visualization System

## 📖 Overview

The Knowledge Graph Visualization System provides an interactive interface for exploring the relationships between concepts, scenarios, lenses, rubrics, and curriculum sections in the Four Blocks emotional intelligence curriculum.

## 🎨 Components

### Core Visualization Components

#### `/components/admin/knowledge/KnowledgeGraphView.tsx`
**Main graph visualization container with force-directed layout**

- Implements force-directed layout algorithm for positioning nodes
- Manages zoom, pan, and drag interactions
- Handles node selection and path highlighting
- Provides statistics panel and search integration
- **Key Features:**
  - Real-time graph rendering with SVG
  - Force-directed layout algorithm (100 iterations)
  - Interactive zoom and pan controls
  - Node selection with detail panel
  - Shortest path highlighting between nodes

#### `/components/admin/knowledge/GraphNode.tsx`
**Individual node rendering with type-specific styling**

- Renders nodes as different shapes based on type:
  - **Concepts (Lenses)**: Circles, Blue (#3b82f6)
  - **Scenarios**: Diamonds, Green (#10b981)
  - **Lenses**: Circles, Purple (#8b5cf6)
  - **Rubrics**: Squares, Orange (#f59e0b)
  - **Sections**: Rectangles, Red (#ef4444)
- Hover effects with glow filters
- Type indicator letter overlay
- Responsive label display

#### `/components/admin/knowledge/GraphEdge.tsx`
**Relationship rendering with labels**

- Color-coded edges by relationship type:
  - `applies`: Purple (#8b5cf6)
  - `demonstrates`: Green (#10b981)
  - `evaluates`: Orange (#f59e0b)
  - `contains`: Red (#ef4444)
  - `related-to`: Slate (#64748b)
- Arrow markers for directionality
- Edge labels on highlighted paths
- Glow effects for active edges

#### `/components/admin/knowledge/GraphSearch.tsx`
**Search interface with path highlighting**

- Real-time search across nodes
- Highlights matching nodes
- Shows shortest path from search result to clicked node
- Search tips tooltip
- Clear search functionality

#### `/components/admin/knowledge/GraphFilters.tsx`
**Filter by node type**

- Toggle visibility of each node type
- Shows count of selected types (e.g., "3/5")
- Select all / Clear all quick actions
- Color-coded type indicators
- Prevents deselecting all types

## 🌐 API Endpoints

### `GET /api/admin/knowledge/graph`
**Returns the knowledge graph as nodes and edges**

**Query Parameters:**
- `types`: Comma-separated node types to filter (e.g., "concept,lens")
- `limit`: Maximum number of nodes to return (default: 500)
- `root`: Start traversal from this node ID (optional)
- `depth`: Traversal depth from root (default: 2)

**Response:**
```typescript
{
  nodes: Array<{
    id: string;
    label: string;
    type: 'concept' | 'scenario' | 'lens' | 'rubric' | 'section';
    description?: string;
    metadata?: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: 'applies' | 'demonstrates' | 'evaluates' | 'contains' | 'related-to';
    weight?: number;
    metadata?: Record<string, any>;
  }>;
  statistics: {
    totalNodes: number;
    totalEdges: number;
    connectedComponents: number;
    nodeTypes: Record<NodeType, number>;
    edgeTypes: Record<EdgeType, number>;
  };
}
```

### `GET /api/admin/knowledge/export`
**Export the complete knowledge graph**

**Response:**
```typescript
{
  version: string;
  exportedAt: string;
  graph: KnowledgeGraph;
  formats: {
    json: string;
    gephi: string;
    cytoscape: string;
    d3: string;
  };
}
```

## 🎮 Interactivity Features

### Node Interactions
- **Single Click**: Select node and show details
- **Double Click**: Expand to show 2-hop neighbors
- **Hover**: Highlight incoming/outgoing edges
- **Drag**: Reposition nodes manually

### Navigation
- **Zoom**: +/- 10% increments (10% to 500%)
- **Pan**: Click and drag the canvas
- **Reset**: Refresh button reloads the graph

### Search & Filter
- **Search**: Find nodes by name or content
- **Path Highlighting**: Shows shortest path between nodes
- **Type Filters**: Show/hide node types
- **Real-time Updates**: Changes apply immediately

## 🎨 Visualization Design

### Node Types & Colors
| Type | Shape | Color | Description |
|------|-------|-------|-------------|
| Concept/Lens | Circle | Blue | Emotional concepts and lenses |
| Scenario | Diamond | Green | Example scenarios |
| Lens | Circle | Purple | Perspectives |
| Rubric | Square | Orange | Evaluation criteria |
| Section | Rectangle | Red | Curriculum sections |

### Edge Types & Colors
| Type | Color | Description |
|------|-------|-------------|
| applies | Purple | Lens applies to concept |
| demonstrates | Green | Scenario demonstrates concept |
| evaluates | Orange | Rubric evaluates scenario |
| contains | Red | Section contains content |
| related-to | Slate | General relationship |

## 📊 Graph Statistics

The system provides real-time statistics:
- **Total Nodes**: Number of nodes in the graph
- **Total Edges**: Number of relationships
- **Connected Components**: Number of separate graph components
- **Node Types**: Count by node type
- **Edge Types**: Count by edge type

## 🔧 Technical Implementation

### Force-Directed Layout Algorithm
```typescript
- Repulsion: F = 5000 / distance²
- Attraction: F = (distance - 150) * 0.05
- Center Gravity: F = -position * 0.01
- Iterations: 100
- Time Complexity: O(nodes² × iterations)
```

### Shortest Path Algorithm
- **Algorithm**: BFS (Breadth-First Search)
- **Time Complexity**: O(nodes + edges)
- **Space Complexity**: O(nodes)
- Returns: Set of node and edge IDs along the path

## 📂 Data Sources

The graph automatically aggregates from:
1. `docs/WIKI/concepts/` - Emotional concepts
2. `docs/WIKI/scenarios/` - Example scenarios
3. `docs/WIKI/lenses/` - Perspective lenses
4. `docs/WIKI/rubrics/` - Evaluation rubrics
5. `docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/` - Curriculum sections

## 🚀 Usage Example

```typescript
import KnowledgeGraphView from '@/components/admin/knowledge/KnowledgeGraphView';

function MyAdminPage() {
  return (
    <div className="w-full h-screen">
      <KnowledgeGraphView />
    </div>
  );
}
```

## 🎯 Future Enhancements

Potential improvements:
- [ ] Add clustering algorithm for large graphs
- [ ] Implement 3D force-directed layout
- [ ] Add graph layout presets (circular, hierarchical, etc.)
- [ ] Export to multiple formats (GEXF, GraphML, DOT)
- [ ] Add node grouping and collapsing
- [ ] Implement time-based graph evolution
- [ ] Add collaborative filtering
- [ ] Create graph templates for different views

---

**✨ Built with cosmic precision by The Spellbinding Museum Director ✨**
