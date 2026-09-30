# 🚀 VitaGrid GOV - Complete Production Deployment & Hosting Guide

This guide covers hosting the entire stack:
1. **Frontend Web App** (React 19, Tailwind CSS, Recharts Command Center)
2. **Backend API Gateway & Agent Swarm** (FastAPI, WebSockets, Redis Event Bus, FIPS 140-3 Zero-PII Enclaves)
3. **AI/ML Model Ecosystem** (Hugging Face Model Hub, LoRA Adapter, Stockout Predictor, SEIR Epidemic Engine)

---

## Architecture Blueprint

```text
┌────────────────────────────────────────────────────────┐
│             User / Government Stakeholder              │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / WSS
                           ▼
┌────────────────────────────────────────────────────────┐
│          1. FRONTEND COMMAND CENTER (Port 80/443)      │
│  • React 19 Single Page Application                    │
│  • Served via Nginx Reverse Proxy or Global CDN (Vercel)│
└──────────────────────────┬─────────────────────────────┘
                           │ /api/* and /ws/*
                           ▼
┌────────────────────────────────────────────────────────┐
│          2. BACKEND API GATEWAY (Port 8000)            │
│  • FastAPI ASGI Microservice                           │
│  • Multi-Agent Swarm Orchestrator (Triage, Logistics)  │
│  • Zero-PII Cryptographic Hasher (HMAC-SHA256)        │
│  • In-Memory / PostgreSQL Audit Ledger                 │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│   REDIS MESSAGE BUS       │  │ 3. AI/ML MODEL ECOSYSTEM │
│  • Pub/Sub Event Stream   │  │  • Hugging Face Hub     │
│  • Telemetry Ingestion    │  │    (NIKHILPATEL00212/   │
│  • Agent Consensus State  │  │     vitaGridProtocol)   │
└───────────────────────────┘  │  • LoRA PEFT Adapters   │
                               │  • GPU/CPU Inference    │
                               └─────────────────────────┘
```

---

## Hosting Method 1: Self-Hosted on Any Cloud VPS (Docker Compose) - Recommended

Use this method if you have a Virtual Private Server (VPS) from **DigitalOcean, Hetzner, AWS EC2, Google Cloud Compute Engine, or Linode**.

### Prerequisites
- Any Linux VPS (Ubuntu 22.04 LTS or 24.04 LTS recommended, 2GB+ RAM)
- Docker & Docker Compose installed:
  ```bash
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  ```

### Step 1: Clone Your Repository & Setup Environment
```bash
git clone <YOUR_GIT_REPO_URL> vitagrid
cd vitagrid

# Create production environment configuration
cat << 'EOF' > .env
VITAGRID_ENV=production
DEBUG=false
HF_MODEL_REPO=NIKHILPATEL00212/vitaGridProtocol
HF_TOKEN=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
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://your-domain.com,https://your-domain.com
EOF
```

### Step 2: Start All Services with One Command
```bash
docker compose up -d --build
```

### Step 3: Verify Running Services
```bash
docker compose ps
docker compose logs -f
```
Your app will be live at:
- **Frontend Command Center**: `http://your-server-ip:3000` (or Port 80)
- **Backend API Docs**: `http://your-server-ip:8000/docs`
- **Health Check**: `http://your-server-ip:8000/health`

---

## Hosting Method 2: Modern Cloud PaaS (Zero Server Management)

If you don't want to manage a Linux server:

### A. Deploy Frontend on Vercel or Cloudflare Pages (Free)
1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com).
3. Import your GitHub repository.
4. Set Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your frontend is instantly hosted with a worldwide CDN and free SSL.

### B. Deploy Backend on Render, Railway, or Google Cloud Run
#### On Render (render.com):
1. Create a **New Web Service** connected to your repo.
2. Select **Docker** environment (or Python):
   - **Dockerfile Path**: `vitagrid_gov/Dockerfile`
   - **Port**: `8000`
3. Add Environment Variables:
   - `HF_TOKEN`: `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`
   - `HF_MODEL_REPO`: `NIKHILPATEL00212/vitaGridProtocol`
4. Click **Create Web Service**.

#### On Google Cloud Run:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/vitagrid-backend -f vitagrid_gov/Dockerfile
gcloud run deploy vitagrid-backend \
  --image gcr.io/YOUR_PROJECT_ID/vitagrid-backend \
  --platform managed \
  --allow-unauthenticated \
  --port 8000
```

---

## Hosting Method 3: Hosting the AI / ML Ecosystem

You have three options for hosting the ML model ecosystem:

### Option A: Hugging Face Dedicated Inference Endpoint (Production Scale)
1. Go to your model repository: [https://huggingface.co/NIKHILPATEL00212/vitaGridProtocol](https://huggingface.co/NIKHILPATEL00212/vitaGridProtocol)
2. Click the **Deploy** button (top right) ➔ Select **Inference Endpoints**.
3. Choose:
   - Cloud Provider: **AWS** or **GCP**
   - Hardware: **NVIDIA T4** ($0.60/hr) or **CPU** ($0.06/hr)
4. Click **Create Endpoint**.
5. Copy the generated Endpoint URL and set it in your backend:
   ```bash
   HF_INFERENCE_ENDPOINT=https://your-endpoint-id.us-east-1.aws.endpoints.huggingface.cloud
   ```

### Option B: Hugging Face Spaces (Free / ZeroGPU)
Run our automated script from your project directory:
```bash
pip install huggingface_hub
python scripts/deploy_huggingface_space.py
```
This deploys an interactive inference sandbox and REST API directly to your Hugging Face profile under:
`https://huggingface.co/spaces/NIKHILPATEL00212/vitaGrid-Inference-Engine`

### Option C: RunPod / Modal / Vast.ai (Ultra Cheap Dedicated GPU)
If you want low cost ($0.20/hr) dedicated GPU hosting for high-throughput LLaMA LoRA batching:
1. Deploy a container template on [RunPod](https://www.runpod.io) using `pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime`.
2. Run:
   ```bash
   git clone https://huggingface.co/NIKHILPATEL00212/vitaGridProtocol /model
   pip install vllm peft
   python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-3.1-8B-Instruct --enable-lora --lora-modules vitagrid=/model
   ```

---

## Post-Deployment Verification Checklist

Once hosted, test the complete pipeline:

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-domain.com/health
   # Expected: {"status":"healthy","enclave":"operational"}
   ```

2. **Hugging Face Model Connection**:
   ```bash
   curl https://your-backend-domain.com/api/hf-inference/status
   # Expected: {"status":"connected","repo_id":"NIKHILPATEL00212/vitaGridProtocol"}
   ```

3. **Multi-Agent Simulation**:
   Navigate to `/supply-chain` on your hosted domain and click **Run Rebalance Directives**.
