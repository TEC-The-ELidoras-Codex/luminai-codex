"""
Multi-LLM Bouncing Response System

Three AI models collaborate in sequence:
1. Claude responds to user
2. OpenAI responds to Claude
3. xAI responds to both and critiques

Each sees previous responses and builds on them.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Literal
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/multi-llm", tags=["multi-llm"])

# =============================================================================
# LLM PROVIDERS
# =============================================================================

class LLMProvider:
    """Base class for LLM providers"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def get_response(self, messages: List[dict], system_prompt: str) -> str:
        raise NotImplementedError


class ClaudeProvider(LLMProvider):
    """Anthropic Claude"""
    
    async def get_response(self, messages: List[dict], system_prompt: str) -> str:
        try:
            from anthropic import Anthropic
            client = Anthropic(api_key=self.api_key)
            
            response = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1024,
                system=system_prompt,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            return f"[Claude error: {str(e)}]"


class OpenAIProvider(LLMProvider):
    """OpenAI GPT-4"""
    
    async def get_response(self, messages: List[dict], system_prompt: str) -> str:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                max_tokens=1024,
                system=system_prompt,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"[GPT-4 error: {str(e)}]"


class xAIProvider(LLMProvider):
    """xAI Grok"""
    
    async def get_response(self, messages: List[dict], system_prompt: str) -> str:
        try:
            # xAI API endpoint (when available)
            import httpx
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": "grok-1",
                        "messages": messages,
                        "max_tokens": 1024,
                        "system": system_prompt
                    }
                )
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"[Grok error: {str(e)}]"


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class Message(BaseModel):
    persona: Literal['user', 'claude', 'openai', 'xai']
    content: str


class MultiLLMRequest(BaseModel):
    persona: Literal['claude', 'openai', 'xai']
    conversationId: str
    context: List[Message]
    systemPrompt: str


class MultiLLMResponse(BaseModel):
    response: str
    persona: Literal['claude', 'openai', 'xai']
    model: str
    tokensUsed: int


# =============================================================================
# LLM ROUTER
# =============================================================================

@router.post("/response")
async def get_multi_llm_response(request: MultiLLMRequest) -> MultiLLMResponse:
    """
    Get response from specific LLM in the collaboration chain
    
    Flow:
    1. User sends message
    2. Claude responds (deep thinking)
    3. OpenAI responds (builds on Claude)
    4. xAI responds (critiques both)
    
    Each LLM sees all previous messages for context.
    """
    
    persona = request.persona
    
    # Get API keys from environment
    api_keys = {
        'claude': os.getenv('ANTHROPIC_API_KEY'),
        'openai': os.getenv('OPENAI_API_KEY'),
        'xai': os.getenv('XAI_API_KEY')
    }
    
    if not api_keys[persona]:
        raise HTTPException(
            status_code=500,
            detail=f"API key not configured for {persona}"
        )
    
    # Convert context to API format
    messages = []
    for msg in request.context:
        if msg.persona == 'user':
            messages.append({
                "role": "user",
                "content": msg.content
            })
        else:
            # LLM responses
            llm_names = {'claude': 'Claude', 'openai': 'GPT-4', 'xai': 'Grok'}
            messages.append({
                "role": "assistant",
                "content": f"[{llm_names.get(msg.persona, 'AI')}]: {msg.content}"
            })
    
    # Reverse so most recent message is last
    messages.reverse()
    
    # Get response from appropriate provider
    provider_class = {
        'claude': ClaudeProvider,
        'openai': OpenAIProvider,
        'xai': xAIProvider
    }[persona]
    
    provider = provider_class(api_keys[persona])
    response_text = await provider.get_response(messages, request.systemPrompt)
    
    return MultiLLMResponse(
        response=response_text,
        persona=persona,
        model={
            'claude': 'claude-3-opus',
            'openai': 'gpt-4-turbo',
            'xai': 'grok-1'
        }[persona],
        tokensUsed=0  # Estimate or get from provider
    )


@router.get("/personas")
async def get_personas():
    """Get information about each LLM persona"""
    return {
        "claude": {
            "name": "Claude",
            "icon": "🟠",
            "style": "thoughtful, nuanced, deeply analytical",
            "specialty": "Complex reasoning, acknowledgment of uncertainty"
        },
        "openai": {
            "name": "GPT-4",
            "icon": "🔵",
            "style": "creative, clear, practical",
            "specialty": "Clarity, practical examples, versatility"
        },
        "xai": {
            "name": "Grok",
            "icon": "✨",
            "style": "direct, witty, critical",
            "specialty": "Direct feedback, critical analysis, identifying gaps"
        }
    }


@router.get("/resonance/calculate")
async def calculate_group_resonance(conversation_id: str):
    """
    Calculate group resonance score based on conversation quality
    
    R = (agreement_level × coherence × insight_depth) / 3
    
    High agreement = LLMs building on each other well
    Coherence = Internal consistency across responses
    Insight = Novel combinations of ideas
    """
    
    # In real implementation, would analyze conversation
    # For now, return example
    return {
        "resonance": 0.84,
        "components": {
            "agreement_level": 0.85,  # How well they build on each other
            "coherence": 0.87,        # Internal consistency
            "insight_depth": 0.80     # Novel combinations
        },
        "insights": [
            "Strong alignment between Claude and GPT-4 perspectives",
            "Grok successfully identified limitations in previous responses",
            "Overall conversation showed high semantic coherence"
        ]
    }


# =============================================================================
# CONVERSATION HISTORY
# =============================================================================

@router.post("/conversation/save")
async def save_conversation(
    conversation_id: str,
    messages: List[Message],
    resonance_score: float
):
    """Save multi-LLM conversation to database"""
    
    # Implementation would save to PostgreSQL
    return {
        "status": "saved",
        "conversation_id": conversation_id,
        "messages": len(messages),
        "resonance_score": resonance_score
    }


@router.get("/conversation/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Retrieve saved multi-LLM conversation"""
    
    # Implementation would retrieve from PostgreSQL
    return {
        "conversation_id": conversation_id,
        "messages": [],
        "resonance_score": 0.84
    }


@router.post("/conversation/export")
async def export_conversation(
    conversation_id: str,
    format: Literal['markdown', 'pdf', 'json'] = 'markdown'
):
    """Export conversation in various formats"""
    
    # Implementation would format and return file
    if format == 'markdown':
        return {
            "format": "markdown",
            "content": """
# Multi-LLM Conversation

## Claude
[thoughts]

## GPT-4
[response]

## Grok
[critique]
"""
        }
    
    return {"status": "export in progress"}
