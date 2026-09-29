"""
VitaGrid GOV - WebSocket Endpoints
Provides real-time bi-directional streaming for dashboard live updates.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import logging
from vitagrid_gov.realtime.websocket_manager import websocket_manager

logger = logging.getLogger("vitagrid.ws_router")
router = APIRouter(tags=["Real-Time WebSockets"])


@router.websocket("/ws/live")
async def websocket_live_endpoint(websocket: WebSocket):
    """General subscription endpoint receiving all broadcast channels."""
    await websocket_manager.connect(websocket, channel="all")
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client ping or subscription requests
            try:
                msg = json.loads(data)
                if msg.get("action") == "ping":
                    await websocket.send_text(json.dumps({"type": "PONG", "timestamp": msg.get("timestamp")}))
            except Exception:
                pass
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)


@router.websocket("/ws/{channel}")
async def websocket_channel_endpoint(websocket: WebSocket, channel: str):
    """Channel-specific subscription endpoint (e.g. /ws/kpis, /ws/alerts)."""
    await websocket_manager.connect(websocket, channel=channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
