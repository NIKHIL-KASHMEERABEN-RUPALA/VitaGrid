"""
VitaGrid GOV - High-Throughput Sentinel Telemetry Ingestor
Simulates live real-time streams from LoRaWAN cold-chain nodes, eLMIS registers,
and syndromic surveillance across 47 health zones. Dispatches to EventBus and WebSockets.
"""

import asyncio
import logging
import random
import time
from typing import Any, Dict
from vitagrid_gov.core.event_bus import event_bus, VitaGridEvent
from vitagrid_gov.core.feature_store import feature_store
from vitagrid_gov.core.config import settings
from vitagrid_gov.realtime.websocket_manager import websocket_manager

logger = logging.getLogger("vitagrid.telemetry_ingestor")


class RealtimeTelemetryIngestor:
    def __init__(self):
        self._running = False
        self._task: asyncio.Task = None

    async def start(self):
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._ingestion_loop())
        logger.info("Real-time Sentinel Telemetry Ingestor started.")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("Real-time Sentinel Telemetry Ingestor stopped.")

    async def _ingestion_loop(self):
        """Continuous background tick pushing real-time telemetry to the mesh."""
        tick = 0
        while self._running:
            try:
                await asyncio.sleep(4.0)  # Sentinel interval
                tick += 1

                # Select a random county to fluctuate
                target_county = random.choice(settings.COUNTIES)
                code = target_county["code"]
                fac_id = f"PHC-{code}-001"

                # Generate telemetry packet
                temp = round(random.uniform(3.2, 5.8), 2)
                admissions = random.randint(10, 48)
                bed_occ = round(random.uniform(0.65, 0.88), 2)

                telemetry_packet = {
                    "source": "LORA_COLD_CHAIN_GATEWAY",
                    "facility_id": fac_id,
                    "county_code": code,
                    "county_name": target_county["name"],
                    "timestamp": time.time(),
                    "cold_chain_temp_celsius": temp,
                    "occupied_beds": int(120 * bed_occ),
                    "total_beds": 120,
                    "daily_admissions": admissions,
                    "active_clinicians": random.randint(18, 35),
                }

                # Publish onto Event Bus
                evt = VitaGridEvent(
                    topic="telemetry.iot.sentinel",
                    event_type="SENTINEL_TICK",
                    source_agent="AGENT-TELEMETRY-INGESTOR",
                    payload=telemetry_packet
                )
                await event_bus.publish(evt)

                # Broadcast KPI pulse to WebSocket subscribers every 8 seconds
                if tick % 2 == 0:
                    kpi_update = {
                        "type": "KPI_PULSE",
                        "data": {
                            "availability_index": round(94.2 + random.uniform(-0.4, 0.6), 1),
                            "surge_bed_capacity_pct": round(78.2 + random.uniform(-0.8, 1.2), 1),
                            "clinician_rostering_pct": round(98.4 + random.uniform(-0.2, 0.4), 1),
                            "active_critical_alerts": 3,
                            "sync_seconds_ago": 0,
                            "timestamp": time.time(),
                        }
                    }
                    await websocket_manager.broadcast(kpi_update, channel="kpis")

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Error in telemetry loop: %s", str(e))
                await asyncio.sleep(2.0)


telemetry_ingestor = RealtimeTelemetryIngestor()
