"""
VitaGrid GOV - Multi-Agent Swarm End-to-End Integration Test
Verifies end-to-end execution:
Ingest -> Surveillance -> Supply Chain -> Consensus Verifier -> HITL Authorization -> Cryptographic Execution.
"""

import asyncio
import unittest
from vitagrid_gov_ai.agents.orchestrator import swarm_orchestrator, SwarmExecutionState
from vitagrid_gov_ai.core.hitl import approval_registry, ProposalState
from vitagrid_gov_ai.data.generators import data_generator


class TestSovereignSwarm(unittest.TestCase):

    def test_full_swarm_pipeline_execution(self):
        async def _run():
            # Generate test telemetry
            facilities = data_generator.generate_facilities()
            stocks = data_generator.generate_inventory(facilities)
            cold_readings = data_generator.generate_cold_chain_readings(facilities)
            history = data_generator.generate_syndromic_history(days=21)

            county_series = {}
            for pt in history:
                county_series.setdefault(pt.county_code, []).append(pt.confirmed_cases)

            coords = {f.facility_id: (f.latitude, f.longitude) for f in facilities}

            payload = {
                "facilities": facilities,
                "stocks": stocks,
                "cold_chain_readings": cold_readings,
                "county_case_series": county_series,
                "facility_coords": coords,
                "disease": "Acute Respiratory Infection",
            }

            state = await swarm_orchestrator.run_swarm_pipeline(payload)
            return state

        state = asyncio.run(_run())

        # Assertions
        self.assertIsNotNone(state.run_id)
        self.assertIn(state.current_state, [SwarmExecutionState.HITL_ESCALATION, SwarmExecutionState.COMPLETED])
        self.assertIsNotNone(state.audit_hash)
        self.assertTrue(len(state.execution_trace) >= 4)

        # Check agent outputs
        self.assertIn("surveillance", state.agent_outputs)
        self.assertIn("supply_chain", state.agent_outputs)
        self.assertIn("cold_chain", state.agent_outputs)
        self.assertIn("resource_intel", state.agent_outputs)

        # Check proposal queued for Human-in-the-Loop
        pending_proposals = approval_registry.list_all(state=ProposalState.PENDING)
        self.assertTrue(len(pending_proposals) > 0)

        # Test Ministerial Authorization and Cryptographic Signing
        prop = pending_proposals[0]
        authorized = prop.authorize(authorizer_id="DR_V_RAO", authorizer_role="National Health Director")
        self.assertTrue(authorized)
        self.assertEqual(prop.state, ProposalState.AUTHORIZED)
        self.assertIsNotNone(prop.signature)
        self.assertIsNotNone(prop.rollback_token)

        # Test Execution
        dispatch_res = prop.execute()
        self.assertEqual(dispatch_res["status"], "DISPATCHED")
        self.assertEqual(prop.state, ProposalState.EXECUTED)
        print(f"\n[TEST PASSED] Swarm Pipeline executed successfully: {state.run_id}")
        print(f"             Proposal Authorized: {prop.docket_id} | Signature: {prop.signature[:16]}...")


if __name__ == "__main__":
    unittest.main()
