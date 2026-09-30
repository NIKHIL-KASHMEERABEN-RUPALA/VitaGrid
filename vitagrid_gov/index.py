"""
VitaGrid GOV - Vercel Serverless Entry Point
Exposes the FastAPI ASGI app for Vercel services deployment.
Handles sys.path dynamically for isolated service execution.
"""

import os
import sys

# Ensure both service root and parent project directory are available on sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)

for _p in (_current_dir, _parent_dir):
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from vitagrid_gov.main import app
except ImportError:
    from main import app

# Standard ASGI server hook for Vercel Serverless Functions
application = app
