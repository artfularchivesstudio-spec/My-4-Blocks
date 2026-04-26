"""🎭 Module entrypoint so `python -m four_blocks_runner ...` works directly."""
from .run_evolution import main
import sys

if __name__ == "__main__":
    sys.exit(main())
