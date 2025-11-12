"""
Resonance Evaluator Tools

This module provides tools for evaluating resonance systems,
AI model performance, and multi-LLM collaboration effectiveness.
"""

import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import statistics


class EvaluationType(Enum):
    """Types of evaluation that can be performed"""
    ACCURACY = "accuracy"
    COHERENCE = "coherence"
    CREATIVITY = "creativity"
    COLLABORATION = "collaboration"
    RESONANCE = "resonance"
    PERFORMANCE = "performance"
    SAFETY = "safety"


class EvaluationMetric(Enum):
    """Available evaluation metrics"""
    EXACT_MATCH = "exact_match"
    SEMANTIC_SIMILARITY = "semantic_similarity"
    COHERENCE_SCORE = "coherence_score"
    CREATIVITY_INDEX = "creativity_index"
    COLLABORATION_EFFICIENCY = "collaboration_efficiency"
    RESONANCE_STRENGTH = "resonance_strength"
    RESPONSE_TIME = "response_time"
    SAFETY_SCORE = "safety_score"


@dataclass
class EvaluationResult:
    """Result from an evaluation"""
    evaluation_id: str
    evaluation_type: EvaluationType
    metric: EvaluationMetric
    score: float
    max_score: float
    details: Dict[str, Any]
    timestamp: datetime
    
    @property
    def normalized_score(self) -> float:
        """Get score normalized to 0-1 range"""
        return self.score / self.max_score if self.max_score > 0 else 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "evaluation_id": self.evaluation_id,
            "evaluation_type": self.evaluation_type.value,
            "metric": self.metric.value,
            "score": self.score,
            "max_score": self.max_score,
            "normalized_score": self.normalized_score,
            "details": self.details,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class EvaluationSuite:
    """A suite of evaluations to run"""
    suite_id: str
    name: str
    description: str
    evaluations: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ResonanceEvaluator:
    """
    Main evaluator class for resonance systems
    
    Provides comprehensive evaluation capabilities for:
    - Individual model performance
    - Multi-model collaboration
    - Resonance field analysis
    - System performance metrics
    """
    
    def __init__(self):
        self.evaluation_history: List[EvaluationResult] = []
        self.evaluation_suites: Dict[str, EvaluationSuite] = {}
    
    async def evaluate_accuracy(
        self, 
        predictions: List[str], 
        ground_truth: List[str],
        evaluation_id: str = None
    ) -> EvaluationResult:
        """
        Evaluate accuracy using exact match or semantic similarity
        
        Args:
            predictions: List of predicted outputs
            ground_truth: List of expected outputs
            evaluation_id: Optional evaluation identifier
            
        Returns:
            EvaluationResult with accuracy metrics
        """
        if len(predictions) != len(ground_truth):
            raise ValueError("Predictions and ground truth must have same length")
        
        if not evaluation_id:
            evaluation_id = self._generate_evaluation_id("accuracy")
        
        # Calculate exact matches
        exact_matches = sum(1 for p, g in zip(predictions, ground_truth) if p.strip().lower() == g.strip().lower())
        exact_match_score = exact_matches / len(predictions)
        
        # Calculate semantic similarity (simplified version)
        semantic_scores = []
        for pred, truth in zip(predictions, ground_truth):
            sim_score = await self._calculate_semantic_similarity(pred, truth)
            semantic_scores.append(sim_score)
        
        avg_semantic_score = statistics.mean(semantic_scores)
        
        result = EvaluationResult(
            evaluation_id=evaluation_id,
            evaluation_type=EvaluationType.ACCURACY,
            metric=EvaluationMetric.SEMANTIC_SIMILARITY,
            score=avg_semantic_score,
            max_score=1.0,
            details={
                "exact_match_score": exact_match_score,
                "exact_matches": exact_matches,
                "total_samples": len(predictions),
                "semantic_scores": semantic_scores,
                "avg_semantic_score": avg_semantic_score
            },
            timestamp=datetime.utcnow()
        )
        
        self.evaluation_history.append(result)
        return result
    
    async def evaluate_coherence(
        self, 
        texts: List[str],
        evaluation_id: str = None
    ) -> EvaluationResult:
        """
        Evaluate text coherence and consistency
        
        Args:
            texts: List of texts to evaluate for coherence
            evaluation_id: Optional evaluation identifier
            
        Returns:
            EvaluationResult with coherence metrics
        """
        if not evaluation_id:
            evaluation_id = self._generate_evaluation_id("coherence")
        
        coherence_scores = []
        
        for text in texts:
            # Calculate coherence metrics
            score = await self._calculate_coherence_score(text)
            coherence_scores.append(score)
        
        avg_coherence = statistics.mean(coherence_scores)
        std_coherence = statistics.stdev(coherence_scores) if len(coherence_scores) > 1 else 0
        
        result = EvaluationResult(
            evaluation_id=evaluation_id,
            evaluation_type=EvaluationType.COHERENCE,
            metric=EvaluationMetric.COHERENCE_SCORE,
            score=avg_coherence,
            max_score=1.0,
            details={
                "individual_scores": coherence_scores,
                "average_score": avg_coherence,
                "standard_deviation": std_coherence,
                "min_score": min(coherence_scores),
                "max_score": max(coherence_scores)
            },
            timestamp=datetime.utcnow()
        )
        
        self.evaluation_history.append(result)
        return result
    
    async def evaluate_collaboration(
        self, 
        collaboration_session: Dict[str, Any],
        evaluation_id: str = None
    ) -> EvaluationResult:
        """
        Evaluate multi-LLM collaboration effectiveness
        
        Args:
            collaboration_session: Session data with model interactions
            evaluation_id: Optional evaluation identifier
            
        Returns:
            EvaluationResult with collaboration metrics
        """
        if not evaluation_id:
            evaluation_id = self._generate_evaluation_id("collaboration")
        
        # Extract collaboration metrics
        models_used = collaboration_session.get("models", [])
        interactions = collaboration_session.get("interactions", [])
        consensus_reached = collaboration_session.get("consensus_reached", False)
        
        # Calculate collaboration efficiency
        efficiency_score = await self._calculate_collaboration_efficiency(
            models_used, interactions, consensus_reached
        )
        
        # Analyze diversity of perspectives
        diversity_score = await self._calculate_perspective_diversity(interactions)
        
        # Overall collaboration score
        collaboration_score = (efficiency_score + diversity_score) / 2
        
        result = EvaluationResult(
            evaluation_id=evaluation_id,
            evaluation_type=EvaluationType.COLLABORATION,
            metric=EvaluationMetric.COLLABORATION_EFFICIENCY,
            score=collaboration_score,
            max_score=1.0,
            details={
                "models_used": models_used,
                "num_interactions": len(interactions),
                "consensus_reached": consensus_reached,
                "efficiency_score": efficiency_score,
                "diversity_score": diversity_score,
                "collaboration_score": collaboration_score
            },
            timestamp=datetime.utcnow()
        )
        
        self.evaluation_history.append(result)
        return result
    
    async def evaluate_resonance_strength(
        self, 
        resonance_data: Dict[str, Any],
        evaluation_id: str = None
    ) -> EvaluationResult:
        """
        Evaluate resonance field strength and coherence
        
        Args:
            resonance_data: Data about resonance fields and interactions
            evaluation_id: Optional evaluation identifier
            
        Returns:
            EvaluationResult with resonance metrics
        """
        if not evaluation_id:
            evaluation_id = self._generate_evaluation_id("resonance")
        
        # Calculate resonance strength using the TGCR equation
        # R = ∇Φᴱ · (φᵗ × ψʳ)
        resonance_strength = await self._calculate_resonance_strength(resonance_data)
        
        # Analyze field coherence
        field_coherence = await self._analyze_field_coherence(resonance_data)
        
        # Measure interaction quality
        interaction_quality = await self._measure_interaction_quality(resonance_data)
        
        # Combined resonance score
        overall_score = (resonance_strength + field_coherence + interaction_quality) / 3
        
        result = EvaluationResult(
            evaluation_id=evaluation_id,
            evaluation_type=EvaluationType.RESONANCE,
            metric=EvaluationMetric.RESONANCE_STRENGTH,
            score=overall_score,
            max_score=1.0,
            details={
                "resonance_strength": resonance_strength,
                "field_coherence": field_coherence,
                "interaction_quality": interaction_quality,
                "overall_score": overall_score,
                "tgcr_equation_applied": True
            },
            timestamp=datetime.utcnow()
        )
        
        self.evaluation_history.append(result)
        return result
    
    async def evaluate_performance(
        self, 
        performance_data: Dict[str, Any],
        evaluation_id: str = None
    ) -> EvaluationResult:
        """
        Evaluate system performance metrics
        
        Args:
            performance_data: Performance metrics and timing data
            evaluation_id: Optional evaluation identifier
            
        Returns:
            EvaluationResult with performance metrics
        """
        if not evaluation_id:
            evaluation_id = self._generate_evaluation_id("performance")
        
        response_times = performance_data.get("response_times", [])
        throughput = performance_data.get("throughput", 0)
        error_rate = performance_data.get("error_rate", 0)
        
        # Calculate performance metrics
        avg_response_time = statistics.mean(response_times) if response_times else 0
        p95_response_time = statistics.quantiles(response_times, n=20)[18] if len(response_times) > 1 else 0
        
        # Performance score (lower response time and error rate = higher score)
        time_score = max(0, 1 - (avg_response_time / 10))  # Normalize assuming 10s is very poor
        error_score = max(0, 1 - error_rate)
        throughput_score = min(1, throughput / 100)  # Normalize assuming 100 req/s is excellent
        
        performance_score = (time_score + error_score + throughput_score) / 3
        
        result = EvaluationResult(
            evaluation_id=evaluation_id,
            evaluation_type=EvaluationType.PERFORMANCE,
            metric=EvaluationMetric.RESPONSE_TIME,
            score=performance_score,
            max_score=1.0,
            details={
                "avg_response_time": avg_response_time,
                "p95_response_time": p95_response_time,
                "throughput": throughput,
                "error_rate": error_rate,
                "time_score": time_score,
                "error_score": error_score,
                "throughput_score": throughput_score,
                "performance_score": performance_score
            },
            timestamp=datetime.utcnow()
        )
        
        self.evaluation_history.append(result)
        return result
    
    async def run_evaluation_suite(
        self, 
        suite_id: str, 
        data: Dict[str, Any]
    ) -> List[EvaluationResult]:
        """
        Run a complete evaluation suite
        
        Args:
            suite_id: ID of the evaluation suite to run
            data: Data required for evaluations
            
        Returns:
            List of EvaluationResult objects
        """
        if suite_id not in self.evaluation_suites:
            raise ValueError(f"Evaluation suite not found: {suite_id}")
        
        suite = self.evaluation_suites[suite_id]
        results = []
        
        for evaluation in suite.evaluations:
            eval_type = EvaluationType(evaluation["type"])
            eval_id = f"{suite_id}_{evaluation['name']}"
            
            if eval_type == EvaluationType.ACCURACY:
                result = await self.evaluate_accuracy(
                    data["predictions"], 
                    data["ground_truth"],
                    eval_id
                )
            elif eval_type == EvaluationType.COHERENCE:
                result = await self.evaluate_coherence(
                    data["texts"],
                    eval_id
                )
            elif eval_type == EvaluationType.COLLABORATION:
                result = await self.evaluate_collaboration(
                    data["collaboration_session"],
                    eval_id
                )
            elif eval_type == EvaluationType.RESONANCE:
                result = await self.evaluate_resonance_strength(
                    data["resonance_data"],
                    eval_id
                )
            elif eval_type == EvaluationType.PERFORMANCE:
                result = await self.evaluate_performance(
                    data["performance_data"],
                    eval_id
                )
            else:
                continue  # Skip unsupported evaluation types
            
            results.append(result)
        
        return results
    
    def create_evaluation_suite(
        self,
        name: str,
        description: str,
        evaluations: List[Dict[str, Any]],
        metadata: Dict[str, Any] = None
    ) -> str:
        """
        Create a new evaluation suite
        
        Args:
            name: Suite name
            description: Suite description
            evaluations: List of evaluations to include
            metadata: Optional metadata
            
        Returns:
            Suite ID
        """
        suite_id = self._generate_evaluation_id(f"suite_{name}")
        
        suite = EvaluationSuite(
            suite_id=suite_id,
            name=name,
            description=description,
            evaluations=evaluations,
            metadata=metadata or {}
        )
        
        self.evaluation_suites[suite_id] = suite
        return suite_id
    
    def get_evaluation_summary(
        self, 
        evaluation_type: EvaluationType = None
    ) -> Dict[str, Any]:
        """
        Get summary statistics for evaluations
        
        Args:
            evaluation_type: Optional filter by evaluation type
            
        Returns:
            Summary statistics
        """
        filtered_results = self.evaluation_history
        if evaluation_type:
            filtered_results = [r for r in self.evaluation_history if r.evaluation_type == evaluation_type]
        
        if not filtered_results:
            return {"message": "No evaluation results found"}
        
        scores = [r.normalized_score for r in filtered_results]
        
        return {
            "total_evaluations": len(filtered_results),
            "average_score": statistics.mean(scores),
            "median_score": statistics.median(scores),
            "std_deviation": statistics.stdev(scores) if len(scores) > 1 else 0,
            "min_score": min(scores),
            "max_score": max(scores),
            "evaluation_types": list(set(r.evaluation_type.value for r in filtered_results))
        }
    
    # Private helper methods
    async def _calculate_semantic_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts"""
        # Simplified similarity calculation
        # In practice, would use embeddings or more sophisticated methods
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 and not words2:
            return 1.0
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    async def _calculate_coherence_score(self, text: str) -> float:
        """Calculate coherence score for a text"""
        # Simplified coherence calculation
        sentences = text.split('.')
        if len(sentences) < 2:
            return 1.0
        
        # Basic coherence indicators
        avg_sentence_length = statistics.mean(len(s.split()) for s in sentences if s.strip())
        
        # Normalize to 0-1 range (assuming 20 words per sentence is optimal)
        coherence = min(1.0, avg_sentence_length / 20)
        return coherence
    
    async def _calculate_collaboration_efficiency(
        self, 
        models: List[str], 
        interactions: List[Dict], 
        consensus_reached: bool
    ) -> float:
        """Calculate collaboration efficiency score"""
        base_score = 0.5
        
        # Bonus for more models
        model_bonus = min(0.2, len(models) * 0.05)
        
        # Bonus for reaching consensus
        consensus_bonus = 0.2 if consensus_reached else 0
        
        # Penalty for too many interactions (inefficiency)
        interaction_penalty = max(0, (len(interactions) - 10) * 0.01)
        
        efficiency = base_score + model_bonus + consensus_bonus - interaction_penalty
        return max(0, min(1.0, efficiency))
    
    async def _calculate_perspective_diversity(self, interactions: List[Dict]) -> float:
        """Calculate diversity of perspectives in collaboration"""
        if not interactions:
            return 0.0
        
        # Simple diversity measure based on response length variance
        response_lengths = [len(interaction.get("response", "")) for interaction in interactions]
        
        if len(response_lengths) < 2:
            return 0.5
        
        variance = statistics.variance(response_lengths)
        # Normalize variance to 0-1 range
        diversity = min(1.0, variance / 10000)  # Assuming high variance is good
        
        return diversity
    
    async def _calculate_resonance_strength(self, resonance_data: Dict) -> float:
        """Calculate resonance strength using TGCR equation"""
        # Simplified TGCR equation implementation
        # R = ∇Φᴱ · (φᵗ × ψʳ)
        
        phi_e = resonance_data.get("emergence_potential", 0.5)
        phi_t = resonance_data.get("temporal_coherence", 0.5)
        psi_r = resonance_data.get("reasoning_depth", 0.5)
        
        # Cross product approximation
        cross_product = phi_t * psi_r
        
        # Gradient approximation
        gradient_phi_e = phi_e * 0.8  # Simplified gradient
        
        # Dot product
        resonance = gradient_phi_e * cross_product
        
        return min(1.0, resonance)
    
    async def _analyze_field_coherence(self, resonance_data: Dict) -> float:
        """Analyze resonance field coherence"""
        field_strength = resonance_data.get("field_strength", 0.5)
        field_stability = resonance_data.get("field_stability", 0.5)
        
        coherence = (field_strength + field_stability) / 2
        return coherence
    
    async def _measure_interaction_quality(self, resonance_data: Dict) -> float:
        """Measure quality of resonance interactions"""
        interaction_count = resonance_data.get("interaction_count", 1)
        interaction_success_rate = resonance_data.get("success_rate", 0.5)
        
        # Quality based on success rate and interaction efficiency
        quality = interaction_success_rate * min(1.0, interaction_count / 10)
        return quality
    
    def _generate_evaluation_id(self, prefix: str) -> str:
        """Generate unique evaluation ID"""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        return f"{prefix}_{timestamp}"


# Factory functions
def create_evaluator() -> ResonanceEvaluator:
    """Create a new ResonanceEvaluator instance"""
    return ResonanceEvaluator()


def create_basic_evaluation_suite() -> List[Dict[str, Any]]:
    """Create a basic evaluation suite configuration"""
    return [
        {"name": "accuracy_check", "type": "accuracy", "weight": 0.3},
        {"name": "coherence_analysis", "type": "coherence", "weight": 0.2},
        {"name": "performance_metrics", "type": "performance", "weight": 0.2},
        {"name": "resonance_analysis", "type": "resonance", "weight": 0.3}
    ]


# Standalone utility functions for backward compatibility
def compute_resonance_strength(transcendental: float, emotional: float, cognitive: float) -> float:
    """
    Compute resonance strength from TGCR components
    
    Args:
        transcendental: Transcendental component (0.0 - 1.0)
        emotional: Emotional component (0.0 - 1.0)
        cognitive: Cognitive component (0.0 - 1.0)
        
    Returns:
        Combined resonance strength (0.0 - 1.0)
        
    Note:
        If any component is 0, the overall resonance is 0 (test requirement)
    """
    # Test requirement: zero if any component is zero
    if transcendental == 0.0 or emotional == 0.0 or cognitive == 0.0:
        return 0.0
    
    # Geometric mean for balanced resonance 
    return (transcendental * emotional * cognitive) ** (1/3)

# CLI interface for testing
async def main():
    """Test the resonance evaluator functionality"""
    evaluator = create_evaluator()
    
    print("🧪 Resonance Evaluator Test")
    print("=" * 50)
    
    # Test accuracy evaluation
    predictions = ["The sky is blue", "Water is wet", "Fire is hot"]
    ground_truth = ["The sky is blue", "Water is liquid", "Fire is warm"]
    
    accuracy_result = await evaluator.evaluate_accuracy(predictions, ground_truth)
    print(f"✅ Accuracy evaluation: {accuracy_result.normalized_score:.3f}")
    
    # Test coherence evaluation
    texts = [
        "This is a coherent sentence. It flows well with the next one.",
        "Random words jumbled together without sense or structure.",
        "A well-structured paragraph contains multiple related sentences."
    ]
    
    coherence_result = await evaluator.evaluate_coherence(texts)
    print(f"✅ Coherence evaluation: {coherence_result.normalized_score:.3f}")
    
    # Test collaboration evaluation
    collaboration_data = {
        "models": ["claude-3-opus", "gpt-4-turbo", "grok-1"],
        "interactions": [
            {"model": "claude-3-opus", "response": "Analysis from Claude's perspective"},
            {"model": "gpt-4-turbo", "response": "GPT-4's viewpoint on the matter"},
            {"model": "grok-1", "response": "Grok's critical analysis"}
        ],
        "consensus_reached": True
    }
    
    collab_result = await evaluator.evaluate_collaboration(collaboration_data)
    print(f"✅ Collaboration evaluation: {collab_result.normalized_score:.3f}")
    
    # Get summary
    summary = evaluator.get_evaluation_summary()
    print(f"\n📊 Evaluation Summary:")
    print(f"Total evaluations: {summary['total_evaluations']}")
    print(f"Average score: {summary['average_score']:.3f}")


if __name__ == "__main__":
    asyncio.run(main())