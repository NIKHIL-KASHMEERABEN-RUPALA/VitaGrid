"""
VitaGrid GOV - Optimizer & Mathematical Formulations Unit Test
"""

import unittest
from vitagrid_gov_ai.models.optimizer import optimization_engine


class TestOptimizer(unittest.TestCase):

    def test_haversine_distance(self):
        # Nairobi to Mombasa (approx 440-450 km)
        dist = optimization_engine.haversine_distance_km(-1.2921, 36.8219, -4.0435, 39.6682)
        self.assertTrue(430.0 <= dist <= 460.0)

    def test_stock_rebalance_solver(self):
        deficits = [("FAC-MACHAKOS", 3000, -1.5177, 37.2634)]
        surpluses = [("FAC-MOMBASA", 5000, -4.0435, 39.6682), ("FAC-NAIROBI", 2000, -1.2921, 36.8219)]

        moves = optimization_engine.optimize_stock_rebalance("MED-AMX-250", deficits, surpluses)
        self.assertTrue(len(moves) >= 1)
        total_transferred = sum(m.transfer_quantity for m in moves)
        self.assertEqual(total_transferred, 3000)

        # Check Nairobi chosen first due to proximity to Machakos
        self.assertEqual(moves[0].source_facility_id, "FAC-NAIROBI")
        self.assertEqual(moves[0].transfer_quantity, 2000)
        self.assertEqual(moves[1].source_facility_id, "FAC-MOMBASA")
        self.assertEqual(moves[1].transfer_quantity, 1000)

    def test_clinician_surge(self):
        stressed = [("KE-16", 50, 10)]
        donors = [("KE-01", 100, 20)]

        reallocs = optimization_engine.optimize_clinician_surge(stressed, donors)
        self.assertEqual(len(reallocs), 1)
        self.assertEqual(reallocs[0].clinicians_transferred, 10)
        self.assertEqual(reallocs[0].source_county, "KE-01")
        self.assertEqual(reallocs[0].target_county, "KE-16")


if __name__ == "__main__":
    unittest.main()
