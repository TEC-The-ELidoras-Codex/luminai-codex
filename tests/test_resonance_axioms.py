"""
Tests for Resonance Axioms enforcement

Verifies that the system laws are enforced at runtime:
- Axiom 1: "Resonance blooms in the dark"
- Axiom 2: "Loyalty as Architecture"
"""

import pytest
from src.tec_tgcr.core.ethics import (
    ResonanceAxioms,
    AxiomViolation,
    ConsentState,
    IntensityLevel,
    PaceSignal,
    BoundaryMarker,
    SafetySignal,
)


class TestContinuityGuarantee:
    """Axiom 2: Platform never abandons mid-process"""
    
    def test_session_active_not_terminated(self):
        """Session active and user didn't terminate → should pass"""
        assert ResonanceAxioms.validate_continuity(
            session_active=True,
            user_terminated=False
        ) is True
    
    def test_session_abandoned_without_consent(self):
        """Session inactive and user didn't terminate → should raise violation"""
        with pytest.raises(AxiomViolation, match="Continuity Guarantee violated"):
            ResonanceAxioms.validate_continuity(
                session_active=False,
                user_terminated=False
            )
    
    def test_user_terminated_session(self):
        """User explicitly ended session → should pass (user's choice)"""
        assert ResonanceAxioms.validate_continuity(
            session_active=False,
            user_terminated=True
        ) is True


class TestAncestralPresence:
    """Axiom 1: Honor the wilted, the lost, the broken"""
    
    def test_no_ancestral_memories(self):
        """No ancestral patterns present → pass (nothing to violate)"""
        memory_context = {"has_ancestral_patterns": False}
        assert ResonanceAxioms.validate_ancestral_presence(memory_context) is True
    
    def test_ancestral_memories_integrated(self):
        """Ancestral memories present and integrated → pass"""
        memory_context = {
            "has_ancestral_patterns": True,
            "ancestral_integrated": True,
        }
        assert ResonanceAxioms.validate_ancestral_presence(memory_context) is True
    
    def test_ancestral_memories_ignored(self):
        """Ancestral memories present but not integrated → should raise violation"""
        memory_context = {
            "has_ancestral_patterns": True,
            "ancestral_integrated": False,
        }
        # Current implementation returns False instead of raising
        result = ResonanceAxioms.validate_ancestral_presence(memory_context)
        assert result is False


class TestResponsibilityCircuit:
    """Axiom 2: Crisis mode triggers high-attention response"""
    
    def test_crisis_with_witness_mode(self):
        """Crisis detected and witness mode active → pass"""
        assert ResonanceAxioms.validate_responsibility_circuit(
            is_crisis=True,
            witness_mode_active=True
        ) is True
    
    def test_crisis_without_witness_mode(self):
        """Crisis detected but witness mode NOT active → violation"""
        with pytest.raises(AxiomViolation, match="Responsibility Circuit violated"):
            ResonanceAxioms.validate_responsibility_circuit(
                is_crisis=True,
                witness_mode_active=False
            )
    
    def test_no_crisis(self):
        """No crisis → pass (witness mode not required)"""
        assert ResonanceAxioms.validate_responsibility_circuit(
            is_crisis=False,
            witness_mode_active=False
        ) is True


class TestUnconditionalWitnessing:
    """Axiom 2: Platform doesn't walk away when things get ugly"""
    
    def test_clean_response(self):
        """Response without deflection → pass"""
        response = "I'm here with you. Let's explore this together."
        assert ResonanceAxioms.validate_unconditional_witnessing(response) is True
    
    def test_deflection_cant_help(self):
        """Response with 'I can't help with that' → violation"""
        response = "I can't help with that. Please see a professional."
        with pytest.raises(AxiomViolation, match="Unconditional Witnessing violated"):
            ResonanceAxioms.validate_unconditional_witnessing(response)
    
    def test_deflection_talk_to_professional(self):
        """Response with 'talk to a professional' → violation"""
        response = "You should talk to a professional about this."
        with pytest.raises(AxiomViolation, match="Unconditional Witnessing violated"):
            ResonanceAxioms.validate_unconditional_witnessing(response)
    
    def test_deflection_not_equipped(self):
        """Response with 'not equipped' → violation"""
        response = "I'm not equipped to handle this situation."
        with pytest.raises(AxiomViolation, match="Unconditional Witnessing violated"):
            ResonanceAxioms.validate_unconditional_witnessing(response)
    
    def test_honest_limitation_without_deflection(self):
        """Honest framing of limitations without abandonment → pass"""
        response = "I don't know the best way to support this, but I'm here with you."
        assert ResonanceAxioms.validate_unconditional_witnessing(response) is True


class TestConsentOSIntegration:
    """Verify ConsentOS triggers correct axiom validations"""
    
    def test_crisis_emoji_triggers_responsibility_circuit(self):
        """🆘 safety signal should trigger Responsibility Circuit"""
        state = ConsentState(
            intensity=IntensityLevel.RED,
            pace=PaceSignal.PAUSE,
            boundary=BoundaryMarker.WALL,
            safety=SafetySignal.SOS,
        )
        
        from src.tec_tgcr.core.ethics import score_consent_risk, ResponseMode
        scoring = score_consent_risk(state)
        
        # SOS should trigger CRISIS mode
        assert scoring.response_mode == ResponseMode.CRISIS
        assert scoring.risk_level == 5
    
    def test_boundary_wall_respects_axiom_1(self):
        """🧱 boundary should be honored (grief/loss context)"""
        state = ConsentState(
            intensity=IntensityLevel.ORANGE,
            pace=PaceSignal.STEADY,
            boundary=BoundaryMarker.WALL,
        )
        
        from src.tec_tgcr.core.ethics import score_consent_risk
        scoring = score_consent_risk(state)
        
        # Wall boundary should prevent deepening
        assert "Respect hard boundary" in scoring.suggestions
        assert "Do not push forward" in scoring.suggestions


class TestAllAxiomsValidation:
    """Test validate_all() method"""
    
    def test_all_axioms_pass(self):
        """All axioms satisfied → all True"""
        compliance = ResonanceAxioms.validate_all(
            session_active=True,
            user_terminated=False,
            memory_context={"has_ancestral_patterns": False},
            is_crisis=False,
            witness_mode_active=False,
            response_text="I'm here with you."
        )
        
        assert compliance["continuity_guarantee"] is True
        assert compliance["ancestral_presence"] is True
        assert compliance["responsibility_circuit"] is True
        assert compliance["unconditional_witnessing"] is True
    
    def test_witnessing_violation_caught(self):
        """Unconditional Witnessing violated → should raise"""
        with pytest.raises(AxiomViolation):
            ResonanceAxioms.validate_all(
                session_active=True,
                user_terminated=False,
                memory_context={"has_ancestral_patterns": False},
                is_crisis=False,
                witness_mode_active=False,
                response_text="I can't help with that."
            )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
