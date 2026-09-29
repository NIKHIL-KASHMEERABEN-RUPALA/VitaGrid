"""
VitaGrid GOV - Sovereign Real-Time WebSocket Manager
Manages bi-directional WebSocket connections from React frontend dashboards.
Broadcasts live DEFCON transitions, critical alerts, stockout dockets, and KPI metric changes.
"""

import asyncio
from dataclasses import dataclass
import json
import logging
from typing import Any, Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("vitagrid.websocket")


class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.channel_subscriptions: Dict[str, Set[WebSocket]] = {
            "all": set(),
            "kpis": set(),
            "alerts": set(),
            "defcon": set(),
            "dockets": set(),
            "heatmap": set(),
        }

    async def connect(self, websocket: WebSocket, channel: str = "all"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if channel in self.channel_subscriptions:
            self.channel_subscriptions[channel].add(websocket)
        self.channel_subscriptions["all"].add(websocket)
        logger.info("Client connected to WebSocket (Channel: %s). Total: %d", channel, len(self.active_connections))

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        for ch in self.channel_subscriptions:
            self.channel_subscriptions[ch].discard(websocket)
        logger.info("Client disconnected from WebSocket. Remaining: %d", len(self.active_connections))

    async def broadcast(self, message: Dict[str, Any], channel: str = "all"):
        """Broadcasts a structured JSON payload to subscribers of a channel."""
        target_clients = list(self.channel_subscriptions.get(channel, self.active_connections))
        if not target_clients:
            return

        payload_str = json.dumps(message, default=str)
        dead_sockets: List[WebSocket] = []

        for ws in target_clients:
            try:
                await ws.send_text(payload_str)
            except Exception:
                dead_sockets.append(ws)

        for dead in dead_sockets:
            self.disconnect(dead)


websocket_manager = WebSocketConnectionManager()
