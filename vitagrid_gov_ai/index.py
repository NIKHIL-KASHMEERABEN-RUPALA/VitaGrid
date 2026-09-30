"""
VitaGrid GOV AI - Vercel Serverless Entry Point
Exposes the FastAPI AI engine app for Vercel services deployment.
Handles sys.path dynamically for isolated service execution.
"""

import os
import sys

_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)

for _p in (_current_dir, _parent_dir):
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from vitagrid_gov_ai.api.main import app
except ImportError:
    from api.main import app

application = app
