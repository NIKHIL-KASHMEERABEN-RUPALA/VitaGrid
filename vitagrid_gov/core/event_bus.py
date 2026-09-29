"""
VitaGrid GOV - Sovereign Multi-Agent Event Bus
Provides high-throughput async event dispatching across distributed specialist agents.
Supports Redis Pub/Sub with automatic in-memory fallback for containerized/standalone modes.
"""

import asyncio
from dataclasses import dataclass, field, asdict
import json
import logging
import time
from typing import Any, Callable, Coroutine, Dict, List, Optional
from vitagrid_gov.core.security import security
from vitagrid_gov.core.config import settings

logger = logging.getLogger("vitagrid.event_bus")


@dataclass
class VitaGridEvent:
    topic: str
    event_type: str
    source_agent: str
    payload: Dict[str, Any]
    trace_id: str = field(default_factory=lambda: f"TRC-{int(time.time()*1000)}-{security.sha256_hash(str(time.time()))[:8]}")
    timestamp: float = field(default_factory=time.time)
    signature: Optional[str] = None

    def __post_init__(self):
        if not self.signature:
            self.signature = security.compute_hmac(f"{self.topic}:{self.event_type}:{self.trace_id}")

    def to_json(self) -> str:
        return json.dumps(asdict(self), default=str)

    @classmethod
    def from_json(cls, raw: str) -> "VitaGridEvent":
        data = json.loads(raw)
        return cls(**data)


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[VitaGridEvent], Coroutine[Any, Any, None]]]] = {}
        self._history: List[VitaGridEvent] = []
        self._history_limit = 500
        self._redis_client = None
        self._use_redis = False

    async def initialize(self):
        """Attempts to connect to Redis; falls back to pure asyncio queue if unavailable."""
        try:
            import redis.asyncio as aioredis
            self._redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await self._redis_client.ping()
            self._use_redis = True
            logger.info("Connected to Redis Event Bus at %s", settings.REDIS_URL)
        except Exception as e:
            logger.warning("Redis unavailable (%s). Running resilient in-memory async event mesh.", str(e))
            self._use_redis = False

    async def subscribe(self, topic: str, handler: Callable[[VitaGridEvent], Coroutine[Any, Any, None]]):
        """Subscribes an async callback handler to a specific topic."""
        if topic not in self._subscribers:
            self._subscribers[topic] = []
        self._subscribers[topic].append(handler)
        logger.debug("Handler registered for topic '%s'", topic)

    async def publish(self, event: VitaGridEvent):
        """Publishes an event to all interested agent subscribers."""
        self._history.append(event)
        if len(self._history) > self._history_limit:
            self._history.pop(0)

        # Distribute locally
        # 1. Exact match
        handlers = list(self._subscribers.get(event.topic, []))
        # 2. Wildcard matches (e.g. "telemetry.*")
        for registered_topic, topic_handlers in self._subscribers.items():
            if registered_topic.endswith("*") and event.topic.startswith(registered_topic[:-1]):
                handlers.extend(topic_handlers)

        tasks = []
        for handler in handlers:
            tasks.append(asyncio.create_task(self._safe_execute(handler, event)))

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

        # If Redis is active, broadcast to Redis channels
        if self._use_redis and self._redis_client:
            try:
                await self._redis_client.publish(event.topic, event.to_json())
            except Exception as e:
                logger.error("Failed to forward event to Redis: %s", str(e))

    async def _safe_execute(self, handler: Callable[[VitaGridEvent], Coroutine[Any, Any, None]], event: VitaGridEvent):
        try:
            await handler(event)
        except Exception as e:
            logger.error("Error executing subscriber for topic '%s': %s", event.topic, str(e), exc_info=True)

    def get_history(self, topic: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Returns recent events from the in-memory ring buffer."""
        filtered = self._history
        if topic:
            filtered = [e for e in filtered if e.topic == topic or (topic.endswith("*") and e.topic.startswith(topic[:-1]))]
        return [asdict(e) for e in reversed(filtered[-limit:])]


event_bus = EventBus()
