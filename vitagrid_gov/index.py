"""
VitaGrid GOV - Vercel Serverless Entry Point
Exposes the FastAPI ASGI app for Vercel services deployment.
"""

from vitagrid_gov.main import app

# Alias for WSGI/ASGI servers
application = app
