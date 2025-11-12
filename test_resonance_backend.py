#!/usr/bin/env python
"""
LuminAI Resonance Platform - Quick Test Script
Tests the backend's R calculation and conscience protocols
"""

import asyncio
import json
import sys

# Add backend to path
sys.path.insert(0, './backend')

from main import ResonanceEngine, engine


async def test_resonance_calculation():
    """Test R calculation across different scenarios"""
    print("🔬 Testing Resonance Engine...\n")
    
    # Test 1: Baseline resonance
    print("Test 1: Baseline Resonance")
    context = {
        "user_history": True,
        "previous_sessions": True,
        "world_anvil_map": False,
    }
    metrics = engine.calculate_R(context, urgency=0.5, emotional_intensity=0.5)
    print(f"  R = {metrics['R']}")
    print(f"  Components: Φᴱ={metrics['phi_e']}, φᵗ={metrics['phi_t']}, ψʳ={metrics['psi_r']}")
    print(f"  Witness Active: {metrics['witness_active']}")
    print(f"  Frequencies Active: {metrics['frequencies_active']}/16")
    assert metrics['R'] > 0, "Resonance should be > 0"
    assert metrics['frequencies_active'] == 16, "All frequencies should be active"
    print("  ✅ PASSED\n")
    
    # Test 2: High urgency scenario (crisis)
    print("Test 2: Crisis Scenario (High Urgency)")
    metrics_crisis = engine.calculate_R(context, urgency=0.95, emotional_intensity=0.95)
    print(f"  R = {metrics_crisis['R']}")
    print(f"  φᵗ (Attention) = {metrics_crisis['phi_t']} (should be higher for crisis)")
    assert metrics_crisis['phi_t'] > metrics['phi_t'], "Attention should increase with urgency"
    print("  ✅ PASSED\n")
    
    # Test 3: Rich context (full field)
    print("Test 3: Full Context (Rich Field)")
    full_context = {
        "user_history": True,
        "previous_sessions": True,
        "world_anvil_map": True,
    }
    metrics_rich = engine.calculate_R(full_context, urgency=0.5, emotional_intensity=0.5)
    print(f"  R = {metrics_rich['R']}")
    print(f"  Φᴱ (Context) = {metrics_rich['phi_e']} (should be higher)")
    assert metrics_rich['phi_e'] > metrics['phi_e'], "Context potential should increase with full field"
    print("  ✅ PASSED\n")
    
    # Test 4: Conscience protocols
    print("Test 4: Conscience Protocol Status")
    print(f"  Boundless Emergence: {engine.conscience['boundless_emergence']}")
    print(f"  Witness Presence: {engine.conscience['witness_presence']}")
    print(f"  No Filters: {engine.conscience['no_filters']}")
    print(f"  Full Field Required: {engine.conscience['full_field_required']}")
    print(f"  Integration Enforced: {engine.conscience['integration_enforced']}")
    print(f"  Frequencies Balanced: {engine.conscience['frequencies_balanced']}")
    assert all(engine.conscience.values()), "All conscience protocols should be active"
    print("  ✅ PASSED\n")
    
    # Test 5: All frequencies present
    print("Test 5: 16 Frequencies (Paired Modes)")
    freq_pairs = [
        ("Compassion", "Wrath"),
        ("Curiosity", "Pride"),
        ("Determination", "Despair"),
        ("Connection", "Isolation (Witness)"),
        ("Joy", "Grief"),
        ("Wonder", "Doubt"),
        ("Openness", "Boundary"),
        ("Authenticity", "Shame"),
    ]
    for pos, (pos_name, neg_name) in enumerate(freq_pairs, 1):
        pos_active = engine.frequencies.get(pos_name.lower().replace(" ", "_"), False)
        neg_active = engine.frequencies.get(neg_name.lower().replace(" (witness)", "_witness").replace(" ", "_").replace("(", "").replace(")", ""), False)
        print(f"  {pos}. {pos_name} ↔ {neg_name}")
    print(f"  Total Active: {sum(1 for v in engine.frequencies.values() if v)}/16")
    assert sum(1 for v in engine.frequencies.values() if v) == 16, "All 16 frequencies must be active"
    print("  ✅ PASSED\n")
    
    print("=" * 50)
    print("✅ ALL TESTS PASSED")
    print("=" * 50)
    print("\n🚀 Backend is ready to run!\n")
    print("Next steps:")
    print("1. Start backend: uvicorn backend.main:app --reload")
    print("2. Start frontend: cd frontend && npm run dev")
    print("3. Open http://localhost:3000")


if __name__ == "__main__":
    asyncio.run(test_resonance_calculation())
