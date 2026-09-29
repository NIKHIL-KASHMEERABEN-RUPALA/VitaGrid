"""
VitaGrid GOV - Complete Training-to-Export Pipeline
Runs LoRA adaptation with simulated or GPU PEFT execution and exports to Hugging Face bundle.
"""

import os
import sys
import json
from pathlib import Path

# Add project roots to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from vitagrid_gov_ai.training.train_lora import run_lora_fine_tuning
from scripts.push_to_huggingface import prepare_export_bundle, push_to_hub, DEFAULT_REPO_ID, DEFAULT_TOKEN

def train_and_export(
    repo_id: str = DEFAULT_REPO_ID,
    token: str = DEFAULT_TOKEN,
    epochs: int = 3,
    export_dir: str = "./exported_model",
    auto_upload: bool = True
):
    print("=" * 65)
    print(" VitaGrid GOV - Sovereign Training & Hub Publishing Pipeline")
    print(f" Target Repository: {repo_id}")
    print("=" * 65)

    # 1. Run LoRA training / adaptation
    checkpoint_dir = "./checkpoints/lora_vitagrid"
    run_lora_fine_tuning(
        base_model_id="meta-llama/Llama-3.1-8B-Instruct",
        output_dir=checkpoint_dir,
        num_train_epochs=epochs
    )

    # 2. Package export bundle
    export_path = Path(export_dir)
    prepare_export_bundle(export_path, repo_id)

    # 3. Upload to Hugging Face
    if auto_upload and token:
        try:
            push_to_hub(export_path, repo_id, token)
        except Exception as e:
            print(f"[NOTE] Automated Hub upload encountered: {e}")
            print("You can run 'python scripts/push_to_huggingface.py' directly from your local terminal.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train and export VitaGrid model")
    parser.add_argument("--repo_id", default=DEFAULT_REPO_ID)
    parser.add_argument("--token", default=DEFAULT_TOKEN)
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--export_dir", default="./exported_model")
    parser.add_argument("--no_upload", action="store_true")

    args = parser.parse_args()
    train_and_export(
        repo_id=args.repo_id,
        token=args.token,
        epochs=args.epochs,
        export_dir=args.export_dir,
        auto_upload=not args.no_upload
    )
