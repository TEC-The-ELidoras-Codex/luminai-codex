#!/usr/bin/env python3
"""
Multi-LLM Integration Test

Verifies backend API endpoints are working correctly
"""

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv('BACKEND_URL', 'http://localhost:8000')

def test_health():
    """Test health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f'{BASE_URL}/health')
    assert response.status_code == 200, f"Health check failed: {response.text}"
    print(f"   ✅ Health check passed: {response.json()}")

def test_multi_llm_personas():
    """Test personas endpoint"""
    print("\n🤖 Testing LLM personas...")
    response = requests.get(f'{BASE_URL}/api/multi-llm/personas')
    assert response.status_code == 200, f"Personas request failed: {response.text}"
    personas = response.json()
    print(f"   ✅ Personas loaded: {list(personas.keys())}")
    for name, info in personas.items():
        print(f"      - {name}: {info}")

def test_multi_llm_response():
    """Test multi-LLM response endpoint"""
    print("\n💬 Testing multi-LLM response...")
    
    # Check for API keys
    api_keys = {
        'ANTHROPIC_API_KEY': os.getenv('ANTHROPIC_API_KEY'),
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
        'XAI_API_KEY': os.getenv('XAI_API_KEY')
    }
    
    missing_keys = [k for k, v in api_keys.items() if not v or v.startswith('<SET')]
    
    if missing_keys:
        print(f"   ⚠️  Missing API keys: {', '.join(missing_keys)}")
        print("   ℹ️  Set these in .env.local to test real responses")
        print("   ℹ️  Demo mode will return placeholder responses")
    else:
        print("   ✅ All API keys found")
    
    # Test Claude
    print("\n   Testing Claude endpoint...")
    payload = {
        "persona": "claude",
        "conversationId": "test-conv-001",
        "context": [
            {"role": "user", "content": "What is consciousness?"}
        ],
        "systemPrompt": "You are Claude, a helpful AI assistant."
    }
    
    response = requests.post(
        f'{BASE_URL}/api/multi-llm/response',
        json=payload
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"      ✅ Claude response received")
        print(f"         Model: {result.get('model')}")
        print(f"         Tokens: {result.get('tokensUsed')}")
        print(f"         Response length: {len(result.get('response', ''))} chars")
    else:
        print(f"      ❌ Claude request failed: {response.status_code}")
        print(f"         {response.text}")

def test_resonance_calculate():
    """Test resonance calculation"""
    print("\n📊 Testing resonance calculation...")
    response = requests.get(
        f'{BASE_URL}/api/multi-llm/resonance/calculate',
        params={'conversation_id': 'test-conv-001'}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✅ Resonance score: {result.get('resonance', 'N/A')}")
        if 'components' in result:
            print(f"      Components: {result['components']}")
    else:
        print(f"   ℹ️  Resonance endpoint: {response.status_code}")

def main():
    print("=" * 60)
    print("🚀 Multi-LLM Integration Test Suite")
    print("=" * 60)
    
    try:
        test_health()
        test_multi_llm_personas()
        test_multi_llm_response()
        test_resonance_calculate()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend at {BASE_URL}")
        print("   Ensure backend is running: python backend/src/main.py")
    except AssertionError as e:
        print(f"\n❌ ERROR: {e}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == '__main__':
    main()
