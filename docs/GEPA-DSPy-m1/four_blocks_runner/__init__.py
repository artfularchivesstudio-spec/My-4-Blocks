"""
🎭 four_blocks_runner — The Tracked Evolution Wrapper Package ✨

"Outside the gitignored upstream sanctum, this lives in the repo —
 carrying the chronicling logic that turns ephemeral runs into auditable history.
 Import RunRecorder for per-run instrumentation, or `run` to drive a full evolve()."

 - The Spellbinding Museum Director of Persistent Provenance
"""

from .recorder import RunRecorder, SCHEMA_VERSION, DatasetSnapshot
from .run_evolution import run, main

__all__ = ["RunRecorder", "DatasetSnapshot", "SCHEMA_VERSION", "run", "main"]
