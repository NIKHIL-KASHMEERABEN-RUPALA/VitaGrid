# VitaGrid GOV - Sovereign National Health Intelligence & Autonomous Logistics Command Platform

Production-grade real-time multi-agent architecture operating across **47 health zones** and **2,840 primary health centers (PHCs)**.

---

## 🏛 Multi-Agent Architecture Overview

```mermaid
graph TD
    subgraph INGESTION["1. Ingestion & Zero-PII Enclave"]
        IoT["IoT Cold-Chain Sensors (LoRaWAN)"]
        DHIS2["HMIS / DHIS2 & eLMIS"]
        Sanitizer["Zero-PII Sanitization Enclave"]
        FeatureStore["28+ Feature Store"]
    end

    subgraph SWARM["2. Autonomous Specialist Swarm"]
        Orchestrator["Commander Orchestrator (Central Brain)"]
        EpidemicAgent["Epidemic Prediction (Cori Rt & Waves)"]
        LogisticsAgent["Logistics & Multi-Echelon Supply"]
        XAIAgent["Explainability (TreeSHAP)"]
        WhatIfAgent["Counterfactual What-If Sandbox"]
        DigitalTwinAgent["Geospatial & Facility Digital Twin"]
        RAGAgent["Clinical Protocol & Document Intelligence"]
        MLOpsAgent["MLOps & Concept Drift Guard"]
    end

    subgraph GOVERNANCE["3. Sovereign HITL Governance & Ledger"]
        HITLAgent["Security & HITL Governance Agent"]
        AuditLedger["Append-Only SHA-256 / HMAC Ledger"]
        ECDSA["Ministerial ECDSA Sign-Off & Rollback"]
    end

    subgraph INTERFACE["4. Real-Time Presentation (React 19)"]
        WebSockets["WebSocket Stream (/ws/live)"]
        CommandCenter["National Command Center Dashboard"]
        Heatmap["MapLibre Geospatial Heatmap"]
        ApprovalDocket["14-Day Action Docket Inbox"]
    end

    IoT --> Sanitizer
    DHIS2 --> Sanitizer
    Sanitizer --> FeatureStore
    FeatureStore --> Orchestrator

    Orchestrator <--> EpidemicAgent
    Orchestrator <--> LogisticsAgent
    Orchestrator <--> XAIAgent
    Orchestrator <--> WhatIfAgent
    Orchestrator <--> DigitalTwinAgent
    Orchestrator <--> RAGAgent
    Orchestrator <--> MLOpsAgent

    LogisticsAgent --> HITLAgent
    EpidemicAgent --> HITLAgent
    HITLAgent --> AuditLedger
    HITLAgent --> ECDSA

    Orchestrator --> WebSockets
    DigitalTwinAgent --> WebSockets
    WebSockets --> CommandCenter
    WebSockets --> Heatmap
    ECDSA --> ApprovalDocket
```

---

## 🚀 Quickstart: Running the Python Backend

### 1. Requirements
- Python 3.11+
- (Optional) Redis server for distributed multi-worker bus (resilient in-memory fallback included)

### 2. Installation
```bash
# In repository root
pip install -r vitagrid_gov/requirements.txt
```

### 3. Start the Server
```bash
# Launch Uvicorn ASGI server on port 8000
PYTHONPATH=. uvicorn vitagrid_gov.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI Swagger UI is available at:
👉 `http://localhost:8000/docs`

---

## 📡 Connecting the React Frontend

### 1. WebSockets Stream
Connect to `ws://localhost:8000/ws/live` or channel-specific endpoints like `ws://localhost:8000/ws/kpis`.

```typescript
const socket = new WebSocket("ws://localhost:8000/ws/live");

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "KPI_PULSE") {
    console.log("Updated National KPIs:", message.data);
  }
};
```

### 2. REST Endpoints Summary
| Endpoint | Method | Description |
|---|---|---|
| `/command-center/kpis` | `GET` | 4 National Command Center KPI cards |
| `/command-center/defcon` | `POST` | Update DEFCON level (1 to 5) |
| `/predictions/epidemic/{county}` | `GET` | Bayesian Cori Rt & 14/30/60/90-day trajectories |
| `/predictions/explain/{facility}` | `GET` | TreeSHAP attribution & plain-language "Why At Risk?" |
| `/predictions/what-if` | `POST` | Counterfactual simulation (stock & staffing) |
| `/approvals/dockets` | `GET` | List pending dockets awaiting ministerial sign-off |
| `/approvals/authorize` | `POST` | Apply ministerial cryptographic signature & rollback token |
| `/digital-twin/corridor-heatmap`| `GET` | GeoJSON FeatureCollection for MapLibre / Leaflet |
| `/health` | `GET` | Liveness probe & audit ledger chain integrity |
| `/system/status` | `GET` | Health statuses of all 10 specialist agents |
