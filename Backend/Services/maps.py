# Unified Backend: maps.py now connects and forwards directly to Backend.main
import sys
from pathlib import Path

# Add Backend root to path if not present
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import (
    app,
    getlocation,
    get_location_details,
    convert_coordinates,
    collection,
    database,
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

