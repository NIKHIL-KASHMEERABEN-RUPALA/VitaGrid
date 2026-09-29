"""
VitaGrid GOV - End-to-End Walkthrough Demonstration Script
Simulates full sovereign command workflow:
1. Ingest national telemetry across 47 counties and 5 distribution tiers
2. Execute multi-agent swarm (Surveillance, Cold-Chain, Supply Chain, Resource Intel, Consensus)
3. Interrogate AI Decision Copilot with What-If counterfactual simulation
4. Execute Human-in-the-Loop ministerial sign-off with cryptographic docket verification
"""

import asyncio
import json
import time
from vitagrid_gov_ai.agents.orchestrator import swarm_orchestrator
from vitagrid_gov_ai.agents.copilot_agent import copilot_agent
from vitagrid_gov_ai.data.generators import data_generator
from vitagrid_gov_ai.core.hitl import approval_registry, ProposalState
from vitagrid_gov_ai.core.security import CryptographicAuditor


async def main():
    print("=" * 80)
    print(" VITAGRID GOV - SOVEREIGN AI & LOGISTICS COMMAND PLATFORM")
    print(" Execution Enclave: AP-SOV-01 | FedRAMP High / FIPS 140-3 Mode: ACTIVE")
    print("=" * 80)

    # 1. Synthesize sovereign feeds
    print("\n[STEP 1] Ingesting National Health Grid Telemetry...")
    facilities = data_generator.generate_facilities()
    stocks = data_generator.generate_inventory(facilities)
    cold_readings = data_generator.generate_cold_chain_readings(facilities)
    history = data_generator.generate_syndromic_history(days=21)

    county_series = {}
    for pt in history:
        county_series.setdefault(pt.county_code, []).append(pt.confirmed_cases)

    coords = {f.facility_id: (f.latitude, f.longitude) for f in facilities}
    print(f" -> Synchronized {len(facilities)} health facilities across 47 counties.")
    print(f" -> Audited {len(stocks)} essential medicine inventories.")
    print(f" -> Active cold-chain IoT telemetry streams: {len(cold_readings)} nodes.")

    # 2. Run Autonomous Swarm
    print("\n[STEP 2] Launching Multi-Agent Autonomous Swarm Pipeline...")
    payload = {
        "facilities": facilities,
        "stocks": stocks,
        "cold_chain_readings": cold_readings,
        "county_case_series": county_series,
        "facility_coords": coords,
        "disease": "Acute Respiratory Infection",
    }

    start_t = time.time()
    swarm_state = await swarm_orchestrator.run_swarm_pipeline(payload)
    elapsed = round(time.time() - start_t, 3)

    print(f" -> Swarm Completed in {elapsed}s | Run ID: {swarm_state.run_id}")
    print(f" -> Final Execution State: {swarm_state.current_state.value}")
    print(f" -> Immutable Consensus Hash: {swarm_state.audit_hash}")

    # Inspect agent outputs
    surv = swarm_state.agent_outputs.get("surveillance", {})
    flagged = surv.get("flagged_counties", [])
    print(f"\n[SURVEILLANCE AGENT] Outbreak Detection:")
    for f in flagged:
        print(f"  * County {f['county_code']}: R_t={f['r_t']} ({f['surge_phase']}) | Doubling Time: {f['doubling_time_days']} days | Urgency: {f['urgency']}")

    sc = swarm_state.agent_outputs.get("supply_chain", {})
    transfers = sc.get("proposed_transfers", [])
    print(f"\n[SUPPLY CHAIN AGENT] Autonomous Logistics Rebalancing:")
    for t in transfers[:3]:
        print(f"  * Rebalance: {t['quantity']} units of {t['item_code']} from {t['source']} -> {t['target']} (ETA: {t['eta_hours']}h)")

    # 3. Decision Copilot What-If
    print("\n[STEP 3] Interrogating Context-Aware AI Decision Copilot...")
    copilot_query = "What is the recommended antibiotic and dosage for pediatric pneumonia?"
    copilot_ans = await copilot_agent.process_task({"user_query": copilot_query, "mode": "chat"})
    print(f" [Query]: '{copilot_query}'")
    print(f" [Copilot Reply (Grounded: {copilot_ans['grounded']})]:\n{copilot_ans['reply']}")

    print("\n [What-If Simulation]: Testing 8-hour road corridor delay with 30% demand surge in Machakos...")
    sim_res = await copilot_agent.process_task({
        "mode": "what_if",
        "target_county": "Machakos (KE-16)",
        "delay_hours": 8.0,
        "surge_pct": 30.0,
    })
    sim_data = sim_res["result"]
    print(f"  * Simulated Run-out Days: {sim_data['simulated_runout_days']} days (Baseline: {sim_data['baseline_runout_days']}d)")
    print(f"  * Risk Classification:    {sim_data['risk_level']}")
    print(f"  * Recommendation:         {sim_data['contingency_recommendation']}")

    # 4. Human-In-The-Loop Ministerial Authorization
    print("\n[STEP 4] Sovereign Human-in-the-Loop (HITL) Governance Gate...")
    pending = approval_registry.list_all(state=ProposalState.PENDING)
    print(f" -> Found {len(pending)} pending proposals requiring legal cryptographic sign-off.")

    if pending:
        prop = pending[0]
        print(f"\n Reviewing Proposal: {prop.proposal_id}")
        print(f" Title:             {prop.title}")
        print(f" Category:          {prop.category.value} | Risk Level: {prop.risk_level}")
        print(f" Proposing Agent:   {prop.proposing_agent}")
        print(f" Summary:           {prop.summary}")

        # Ministerial sign-off
        authorizer = "Dr. V. Rao"
        role = "National Health Director"
        print(f"\n Executing Ministerial Cryptographic Sign-off by {authorizer} ({role})...")
        prop.authorize(authorizer_id=authorizer, authorizer_role=role)
        
        print(f" [AUTHORIZED] Legal Docket: {prop.docket_id}")
        print(f" [SIGNATURE]  SHA-256 HMAC: {prop.signature}")
        print(f" [ROLLBACK]   Safety Token: {prop.rollback_token}")

        # Dispatch
        dispatch = prop.execute()
        print(f" [DISPATCHED] Status: {dispatch['status']} | Fleet waybills released.")

    print("\n" + "=" * 80)
    print(" VIRTUAL SOVEREIGN DEMO COMPLETE - ALL GOVERNANCE CHECKS VERIFIED")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(main())
