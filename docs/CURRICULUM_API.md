# 🎭 GEPA Curriculum CRUD API

The curriculum management endpoints for the Four Blocks Companion system prompt and golden examples.

## 🌟 Overview

This API provides complete CRUD operations for managing curriculum data stored in Supabase:

- **System Prompt Versions**: Track iterations of the Companion's constitution
- **Golden Examples**: Per-block training examples for anger, anxiety, depression, guilt
- **Active Curriculum**: The live version used by GEPA optimization

## 📡 API Endpoints

### Version Management

#### `GET /api/admin/curriculum/versions`
List all curriculum versions with optional filtering.

**Query Params:**
- `status` (optional): Filter by status (`draft`, `active`, `archived`)

**Response:**
```json
{
  "versions": [
    {
      "id": "uuid",
      "version": "v1",
      "status": "draft",
      "system_prompt": "markdown text...",
      "notes": "Initial version...",
      "git_sha": "abc123",
      "created_at": "2026-04-26T14:00:00Z",
      "updated_at": "2026-04-26T14:00:00Z"
    }
  ]
}
```

#### `POST /api/admin/curriculum/versions`
Create a new curriculum version.

**Request Body:**
```json
{
  "version": "v2-beta",
  "system_prompt": "Full markdown text of the system prompt...",
  "notes": "Testing new voice descriptor",
  "git_sha": "def456",
  "python_version": "3.11",
  "dspy_version": "2.5.0",
  "gepa_version": "1.0.0"
}
```

**Response:** 201 Created
```json
{
  "version": { ... }
}
```

#### `GET /api/admin/curriculum/versions/:id`
Get a specific curriculum version by ID.

**Response:**
```json
{
  "version": { ... }
}
```

#### `PUT /api/admin/curriculum/versions/:id`
Update a curriculum version (notes, metadata, system_prompt).

**Request Body:**
```json
{
  "notes": "Updated notes",
  "metadata": { "author": "Ripnrip" },
  "system_prompt": "Revised markdown text..."
}
```

**Response:**
```json
{
  "version": { ... }
}
```

#### `POST /api/admin/curriculum/versions/:id/activate`
Set a curriculum version as active (deactivates all others).

**Response:**
```json
{
  "message": "Version "v1" is now active",
  "version": { ... }
}
```

### Golden Examples

#### `GET /api/admin/curriculum/examples`
List golden examples with optional filtering.

**Query Params:**
- `block` (optional): Filter by block (`anger`, `anxiety`, `depression`, `guilt`)
- `curriculum_version_id` (optional): Filter by curriculum version FK

**Response:**
```json
{
  "examples": [
    {
      "id": "uuid",
      "curriculum_version_id": "version-uuid",
      "example_id": "ANG-EX-001",
      "block": "anger",
      "task_input": "User input text...",
      "expected_behavior": "Expected rubric...",
      "category": "exhibiting",
      "difficulty": "easy",
      "primary_tool": "7IB",
      "notes": "Tests overt Should language...",
      "created_at": "2026-04-26T14:00:00Z"
    }
  ]
}
```

#### `POST /api/admin/curriculum/examples`
Create or update golden examples for a curriculum version.

**Request Body:**
```json
{
  "curriculum_version_id": "version-uuid",
  "examples": [
    {
      "example_id": "ANG-EX-001",
      "block": "anger",
      "task_input": "I can't believe she did this...",
      "expected_behavior": "RESPONSE SHOULD: (1) Acknowledge...",
      "category": "exhibiting",
      "difficulty": "easy",
      "primary_tool": "7IB",
      "notes": "Tests overt Should language..."
    }
  ]
}
```

**Response:** 201 Created
```json
{
  "examples": [ ... ]
}
```

### GEPA Interface

#### `GET /api/admin/curriculum/active`
Get the active curriculum in the exact format four_blocks_runner expects.

**Response:**
```json
{
  "system_prompt": "# Four Blocks Companion — System Prompt v1\n...",
  "golden_examples": {
    "anger": [
      {
        "id": "ANG-EX-001",
        "input": "I can't believe she did this...",
        "output": "RESPONSE SHOULD: (1) Acknowledge..."
      }
    ],
    "anxiety": [ ... ],
    "depression": [ ... ],
    "guilt": [ ... ]
  }
}
```

This endpoint returns data in the exact schema expected by `four_blocks_runner/recorder.py`:

```python
# The format expected by four_blocks_runner
{
    "system_prompt": str,
    "golden_examples": {
        "anger": [{"id": str, "input": str, "output": str}],
        "anxiety": [...],
        "depression": [...],
        "guilt": [...]
    }
}
```

## 🛡️ Security

- **Read operations** use anon key (public but RLS-protected)
- **Write operations** use service role key (bypasses RLS)
- All tables have Row Level Security enabled
- Service role key required for: `POST`, `PUT`, `DELETE`

## 🗃️ Database Schema

### `curriculum_versions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `version` | text | Version identifier (e.g., "v1", "v2-beta") |
| `status` | text | `draft`, `active`, or `archived` |
| `system_prompt` | text | Full markdown system prompt |
| `notes` | text | Version notes/changelog |
| `git_sha` | text | Git commit SHA |
| `python_version` | text | Python version |
| `dspy_version` | text | DSPy version |
| `gepa_version` | text | GEPA version |
| `metadata` | jsonb | Additional metadata |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

**Constraints:**
- `version` must be unique
- Only ONE row can have `status = 'active'` at a time

### `curriculum_examples`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `curriculum_version_id` | uuid | FK to curriculum_versions |
| `example_id` | text | Example ID (e.g., "ANG-EX-001") |
| `block` | text | `anger`, `anxiety`, `depression`, `guilt` |
| `task_input` | text | User input/scenario |
| `expected_behavior` | text | Expected behavior rubric |
| `category` | text | `exhibiting` or `learning` |
| `difficulty` | text | `easy`, `medium`, or `hard` |
| `primary_tool` | text | Primary tool tested |
| `notes` | text | Notes for reviewers |
| `metadata` | jsonb | Additional metadata |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

**Constraints:**
- `curriculum_version_id` must reference valid `curriculum_versions.id`
- `example_id` + `block` + `curriculum_version_id` must be unique

## 🌱️ Seeding Initial Data

A script is provided to seed the initial curriculum v1 from the filesystem:

```bash
# From the repo root
bun scripts/seed_curriculum.ts
```

This script:
1. Reads `docs/GEPA-DSPy-m1/four_blocks_runner/curriculum/system_prompt.md`
2. Reads per-block `golden_examples.json` files
3. Creates curriculum version "v1" in Supabase
4. Seeds all golden examples with proper metadata

## 🎭 Logging Style

All endpoints follow the Spellbinding Museum Director style:
- `🌐` - Request received
- `✨` - Success
- `💥 😭` - Error
- `🎉` - Completion
- `🌙` - Warning
- `📜` - Data operations
- `🛡️` - Security
- `🎭` - Core operations

## 🚀 Usage Flow

1. **Seed the database** (first time only):
   ```bash
   bun scripts/seed_curriculum.ts
   ```

2. **Create a new version**:
   ```bash
   POST /api/admin/curriculum/versions
   ```

3. **Add/modify golden examples**:
   ```bash
   POST /api/admin/curriculum/examples
   ```

4. **Activate the version** for GEPA:
   ```bash
   POST /api/admin/curriculum/versions/:id/activate
   ```

5. **GEPA automatically fetches active curriculum**:
   ```bash
   GET /api/admin/curriculum/active
   ```

## 📚 Notes

- Only ONE version can be active at a time (enforced by database constraint)
- Activating a version automatically archives all other active versions
- The `/active` endpoint is specifically designed for `four_blocks_runner` consumption
- All timestamps are in ISO 8601 format
- IDs are UUIDs generated by PostgreSQL
