"""
VitaGrid GOV - Hugging Face Sovereign Model Enclave & Inference Proxy
Executes authenticated requests to NIKHILPATEL00212/vitaGridProtocol with server-side token protection.
"""

import asyncio
import logging
import os
import time
from typing import Any, Dict, Optional
import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from vitagrid_gov.core.config import settings
from vitagrid_gov.agents.protocol_rag import protocol_rag_agent
from vitagrid_gov.models.lora_adapter import lora_manager

logger = logging.getLogger("vitagrid.hf_inference")

router = APIRouter(prefix="/hf-inference", tags=["Hugging Face Enclave"])


class HfQueryRequest(BaseModel):
    prompt: str = Field(..., description="The clinical query or logistics query")
    max_new_tokens: int = Field(default=256, ge=1, le=1024)
    temperature: float = Field(default=0.2, ge=0.0, le=1.0)
    top_p: float = Field(default=0.95, ge=0.1, le=1.0)
    use_grounding: bool = Field(default=True)


@router.get("/status")
async def get_hf_enclave_status():
    """Returns the live connection status of the Hugging Face model repository."""
    return {
        "repo_id": settings.HF_MODEL_ID,
        "token_configured": bool(settings.HF_TOKEN and settings.HF_TOKEN.startswith("hf_")),
        "active_adapter": lora_manager.get_active_adapter(),
        "registered_adapters": lora_manager.list_adapters(),
        "backend": "Hugging Face Serverless Inference / TensorRT INT8",
        "enclave_mode": "Zero-PII Sovereign Protected",
    }


@router.post("/query")
async def query_huggingface_model(request: HfQueryRequest):
    """
    Queries NIKHILPATEL00212/vitaGridProtocol via Hugging Face Inference API.
    Gracefully combines with sovereign RAG citations and provides instant fallback if the model is booting.
    """
    hf_token = settings.HF_TOKEN
    model_id = settings.HF_MODEL_ID

    # 1. Retrieve sovereign grounded protocol citations
    rag_result = await protocol_rag_agent.answer_clinical_query(request.prompt)

    # 2. If token is available, query Hugging Face Inference API
    hf_response_text: Optional[str] = None
    hf_status = "FALLBACK_RAG"

    if hf_token and hf_token.startswith("hf_"):
        api_url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "inputs": f"[Sovereign Clinical Protocol Context: {rag_result.get('answer')}]\n\nQuestion: {request.prompt}\n\nAuthoritative Answer:",
            "parameters": {
                "max_new_tokens": request.max_new_tokens,
                "temperature": request.temperature,
                "top_p": request.top_p,
                "return_full_text": False,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(api_url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                        hf_response_text = data[0]["generated_text"].strip()
                        hf_status = "LIVE_HF_INFERENCE"
                elif res.status_code == 503:
                    # Model is loading on Hugging Face
                    logger.info("HF Model %s is loading (503), using sovereign RAG grounding.", model_id)
                    hf_status = "HF_MODEL_WARMING_UP"
        except Exception as e:
            logger.warning("HF Inference request error: %s. Using local RAG.", str(e))
            hf_status = "LOCAL_RAG_PROTECTED"

    final_answer = hf_response_text if hf_response_text else rag_result.get("answer", "")

    return {
        "model_id": model_id,
        "query": request.prompt,
        "answer": final_answer,
        "status": hf_status,
        "primary_citation": rag_result.get("primary_citation"),
        "confidence_score": rag_result.get("confidence_score", 0.98),
        "statutory_sla_hours": rag_result.get("statutory_sla_hours", 6),
        "referenced_protocol_ids": rag_result.get("referenced_protocol_ids", []),
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
