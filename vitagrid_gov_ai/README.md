# VitaGrid GOV - Sovereign AI & ML Backend Architecture

Production-grade Python AI/ML backend for **VitaGrid GOV** — an institutional-grade Sovereign National Health Intelligence and Autonomous Logistics Command Platform.

---

## 1. High-Level System Architecture

```
                                  SOVEREIGN AIR-GAPPED PERIMETER (AP-SOV-01)
  ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                       │
  │   [ 47 Sovereign Counties • 5 Echelons • 2,840 PHCs • IoT Cold-Chain Nodes • Referral Hospitals ]     │
  │                                                  │                                                    │
  │                                                  ▼                                                    │
  │                              ┌───────────────────────────────────────┐                                │
  │                              │   Zero-PII Ingestion & Redaction      │                                │
  │                              │   (NIST SP 800-53 / FedRAMP High)     │                                │
  │                              └───────────────────┬───────────────────┘                                │
  │                                                  │                                                    │
  │                         ┌────────────────────────┴────────────────────────┐                           │
  │                         ▼                                                 ▼                           │
  │          ┌──────────────────────────────┐                  ┌──────────────────────────────┐           │
  │          │      Surveillance Agent      │                  │       Cold-Chain Agent       │           │
  │          │   - Cori et al. Bayesian R_t │                  │   - IoT Thermal Excursions   │           │
  │          │   - CUSUM Anomaly Detector   │                  │   - Vaccine Spoilage Risk    │           │
  │          └──────────────┬───────────────┘                  └──────────────┬───────────────┘           │
  │                         │                                                 │                           │
  │                         └────────────────────────┬────────────────────────┘                           │
  │                                                  ▼                                                    │
  │                         ┌─────────────────────────────────────────────────┐                           │
  │                         │          Supply Chain Optimizer Agent           │                           │
  │                         │   - Run-out Date Depletion Forecasting          │                           │
  │                         │   - Linear Programming Stock Rebalancing        │                           │
  │                         └────────────────────────┬────────────────────────┘                           │
  │                                                  │                                                    │
  │                         ┌────────────────────────┴────────────────────────┐                           │
  │                         ▼                                                 ▼                           │
  │          ┌──────────────────────────────┐                  ┌──────────────────────────────┐           │
  │          │  Resource Intelligence Agent │                  │   Context-Aware AI Copilot   │           │
  │          │   - ICU Bed / Vent Optimizer │                  │   - What-If Simulations      │           │
  │          │   - Clinician Surge Aid      │                  │   - Grounded Protocol RAG    │           │
  │          └──────────────┬───────────────┘                  └──────────────┬───────────────┘           │
  │                         │                                                 │                           │
  │                         └────────────────────────┬────────────────────────┘                           │
  │                                                  ▼                                                    │
  │                              ┌───────────────────────────────────────┐                                │
  │                              │        Consensus Verifier Agent       │                                │
  │                              │   - Statutory Policy Enforcement      │                                │
  │                              │   - Immutable SHA-256 Consensus Hash  │                                │
  │                              └───────────────────┬───────────────────┘                                │
  │                                                  │                                                    │
  │                                                  ▼                                                    │
  │                              ┌───────────────────────────────────────┐                                │
  │                              │   Human-in-the-Loop (HITL) Gate       │                                │
  │                              │   - Ministerial Cryptographic Sign-off│                                │
  │                              │   - Tamper-Evident HMAC Signature     │                                │
  │                              │   - Rollback Safety Tokens            │                                │
  │                              └───────────────────┬───────────────────┘                                │
  │                                                  │                                                    │
  │                                                  ▼                                                    │
  │                               [ AUTONOMOUS LOGISTICS DISPATCH ]                                       │
  │                                                                                                       │
  └───────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
vitagrid_gov_ai/
├── agents/                       # Autonomous Multi-Agent Swarm
│   ├── base.py                   # BaseSovereignAgent & Tool execution harness
│   ├── surveillance_agent.py     # Bayesian R_t & syndromic cluster detection
│   ├── supply_chain_agent.py     # Stockout run-out prediction & multi-echelon rebalancing
│   ├── cold_chain_agent.py       # Cryogenic sensor monitoring & spoilage risk
│   ├── resource_intel_agent.py   # ICU, ventilator & clinician LP allocation
│   ├── consensus_verifier_agent.py # Policy conflict resolution & HITL packaging
│   ├── orchestrator.py           # LangGraph-style stateful async execution graph
│   └── copilot_agent.py          # Ministerial Copilot & What-If simulator
├── models/                       # Core Mathematical & Predictive Algorithms
│   ├── epidemiology.py           # Renewal equation Cori method, doubling times, CUSUM
│   ├── forecasting.py            # Consumption velocity + lead time + outbreak multipliers
│   └── optimizer.py              # Linear programming transportation & staff surge solver
├── rag/                          # Sovereign Knowledge & Protocol Retrieval
│   ├── knowledge_base.py         # Official MOH, NMEP, EPI guidelines & standard operating procedures
│   ├── retriever.py              # Hybrid sparse (BM25) + dense embedding similarity
│   └── grounded_qa.py            # Protocol-cited answers with hallucination refusal
├── core/                         # Sovereign Governance & Cryptography
│   ├── config.py                 # FIPS 140-3 & FedRAMP High configuration
│   ├── security.py               # Zero-PII masking & HMAC/SHA-256 audit signing
│   ├── hitl.py                   # Proposal state machine, docket signing & rollback
│   └── telemetry.py              # Structured JSON logging conforming to audit standards
├── data/                         # Synthetic National Grid Telemetry
│   ├── schemas.py                # Pydantic & Dataclass schemas for 47 counties & 5 echelons
│   └── generators.py             # Realistic national-scale data generators
├── api/                          # FastAPI REST Gateway
│   ├── main.py                   # App entrypoint, CORS, security middleware
│   ├── routes_command.py         # National overview & DEFCON telemetry
│   ├── routes_supply_chain.py    # Inventory levels & run-out projections
│   ├── routes_radar.py           # Outbreak early warning & R_t tracking
│   ├── routes_resources.py       # ICU beds & clinician reassignments
│   ├── routes_approvals.py       # HITL proposals, authorization & rollback
│   ├── routes_copilot.py         # Conversational RAG & What-If simulation
│   └── routes_swarm.py           # Swarm pipeline trigger & status
├── training/                     # Domain Adaptation & LLM Fine-Tuning
│   └── train_lora.py             # QLoRA 4-bit PEFT script with MLflow logging
├── eval/                         # Quality & Safety Benchmarks
│   └── benchmark.py              # WAPE, MAE, RAG faithfulness & refusal tests
├── notebooks/                    # Walkthrough & Verification
│   └── end_to_end_walkthrough.py # Complete national alert simulation script
├── tests/                        # Automated Unit & Integration Tests
│   ├── test_swarm.py             # End-to-end swarm pipeline test
│   ├── test_optimizer.py         # Linear programming & Haversine distance tests
│   └── test_rag.py               # Grounded retrieval & refusal tests
├── pyproject.toml                # Build system configuration
├── requirements.txt              # Production Python dependencies
└── README.md                     # Architecture & deployment documentation
```

---

## 3. Core Capabilities Implemented

### 1. Multi-Agent Swarm Orchestration
- **Surveillance Sentinel**: Calculates instantaneous reproduction number ($R_t$) via Bayesian renewal equations with gamma-distributed generation intervals ($\mu=4.8, \sigma=2.3$). Detects anomalous case acceleration using two-sided tabular CUSUM.
- **Supply Chain Optimizer**: Projects stockout dates based on consumption velocity adjusted for local epidemic surges ($V_{eff} = V_{base} \cdot [1 + 2.2(R_t - 1)]$). Formulates multi-echelon linear programming to route surplus medicine from strategic regional hubs to deficit clinics.
- **Cold-Chain Sentinel**: Monitors real-time IoT cryogenic sensors against WHO/EPI $+2^\circ\text{C}$ to $+8^\circ\text{C}$ specifications. Flags thermal excursions and calculates vaccine spoilage risk.
- **Resource Intelligence Agent**: Solves ICU bed and mechanical ventilator capacity strains. Formulates humanitarian clinician mutual-aid transfers without stripping donor counties below an 80% baseline.
- **Consensus Verifier Agent**: Synthesizes cross-agent recommendations, checks policy bounds, computes immutable SHA-256 consensus hashes, and packages proposals for ministerial sign-off.

### 2. Context-Aware AI Decision Copilot
- Persistent tool-calling assistant with RAG augmentation over sovereign protocols.
- Runs counterfactual "What-If" simulations (e.g. testing the cascade effect of an 8-hour transport corridor delay coupled with a 30% pediatric respiratory surge).
- Allows one-click queueing of synthesized actions into the Human Approvals Queue.

### 3. Human-In-The-Loop (HITL) Governance Gate
- Every high-impact action (pharmaceutical rebalance, aerial vector spraying, clinical staff surge) is quarantined in a `PENDING` state.
- Ministerial sign-off generates a cryptographic docket (`DOCKET-SOV-xxxx`), HMAC SHA-256 signature, and an emergency rollback token.

### 4. Zero-PII & Sovereign Security
- Built-in regex and heuristic redaction filters mask telephone numbers, national IDs, patient names, and unauthorized commercial email addresses prior to agent memory persistence or log output.
- All decisions are tied to immutable SHA-256 hashes.

---

## 4. How to Run Locally

### Prerequisites
- Python 3.10 or higher
- Optional: NVIDIA GPU with CUDA 12.1+ for accelerated vLLM / QLoRA training

### Setup
```bash
# 1. Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r vitagrid_gov_ai/requirements.txt
```

### Running the End-to-End Walkthrough
```bash
PYTHONPATH=. python3 vitagrid_gov_ai/notebooks/end_to_end_walkthrough.py
```

### Running the Test Suite
```bash
PYTHONPATH=. python3 -m unittest discover -s vitagrid_gov_ai/tests
```

### Running the Evaluation Benchmark
```bash
PYTHONPATH=. python3 vitagrid_gov_ai/eval/benchmark.py
```

### Starting the FastAPI Server
```bash
uvicorn vitagrid_gov_ai.api.main:app --host 0.0.0.0 --port 8000 --reload
# Interactive OpenAPI Docs available at: http://localhost:8000/docs
```

---

## 5. Domain Adaptation (QLoRA Fine-Tuning)
To fine-tune a sovereign foundation model (e.g., Llama-3.1-8B-Instruct) on national clinical directives and ministerial decision logs:

```bash
python3 vitagrid_gov_ai/training/train_lora.py
```
- Quantization: 4-bit NormalFloat (NF4) with Double Quantization.
- Target Modules: `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`.
- LoRA Rank: $r=16$, Alpha: $\alpha=32$.
- Logging: Integrated with MLflow for tracking loss and evaluation perplexity.

---

## 6. Vertex AI & Docker Deployment Packaging

### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY vitagrid_gov_ai/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY vitagrid_gov_ai/ ./vitagrid_gov_ai/

ENV PYTHONPATH=/app
ENV SOVEREIGN_ENCLAVE_ID=AP-SOV-01
ENV FIPS_MODE=true

EXPOSE 8000
CMD ["uvicorn", "vitagrid_gov_ai.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Vertex AI Custom Container Run
```bash
gcloud ai custom-jobs create \
  --region=us-central1 \
  --display-name=vitagrid-gov-swarm \
  --worker-pool-spec=machine-type=n1-standard-8,container-image-uri=gcr.io/PROJECT_ID/vitagrid-gov-ai:latest
```
