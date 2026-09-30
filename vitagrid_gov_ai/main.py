"""
VitaGrid GOV AI - Root Application Entry Point
Exposes the FastAPI AI engine app for Vercel services deployment and ASGI runners.
"""

from vitagrid_gov_ai.api.main import app

application = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
