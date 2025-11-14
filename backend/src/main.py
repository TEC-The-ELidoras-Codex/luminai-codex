"""
LuminAI Resonance Platform - Backend API
GitHub Webhook Integration + Chat API
"""

from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import hmac
import hashlib
import json
import os
from dotenv import load_dotenv
import logging
from routes import multi_llm, resonance_live
from security import sanitize_log_input, sanitize_webhook_payload, validate_github_ref

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# GitHub webhook secret
GITHUB_WEBHOOK_SECRET = os.getenv('GITHUB_WEBHOOK_SECRET', 'development-secret').encode()

# =============================================================================
# WEBHOOK HANDLERS
# =============================================================================

def verify_github_webhook_signature(request_body: bytes, signature_header: str) -> bool:
    """
    Verify GitHub webhook signature using HMAC SHA256
    
    GitHub sends X-Hub-Signature-256 header with format: sha256=<hash>
    """
    if not signature_header:
        logger.warning('⚠️ No X-Hub-Signature-256 header found')
        return os.getenv('ENVIRONMENT') != 'production'
    
    try:
        algorithm, provided_hash = signature_header.split('=', 1)
        if algorithm != 'sha256':
            return False
        
        computed_hash = hmac.new(
            GITHUB_WEBHOOK_SECRET,
            request_body,
            hashlib.sha256
        ).hexdigest()
        
        # Constant-time comparison
        return hmac.compare_digest(computed_hash, provided_hash)
    except Exception as e:
        logger.error(f'❌ Signature verification error: {e}')
        return False


async def process_github_push(payload: dict, background_tasks: BackgroundTasks):
    """
    Process GitHub push event
    - Extract changed files
    - Update documentation index
    - Notify website
    """
    repository = payload.get('repository', {})
    commits = payload.get('commits', [])
    ref = payload.get('ref', '')
    pusher = payload.get('pusher', {})
    
    # Sanitize all webhook data before logging
    repo_name = sanitize_log_input(repository.get('full_name'))
    branch = sanitize_log_input(ref)
    pusher_name = sanitize_log_input(pusher.get('name'))
    
    logger.info(f"📤 Processing push event")
    logger.info(f"   Repository: {repo_name}")
    logger.info(f"   Branch: {branch}")
    logger.info(f"   Commits: {len(commits)}")
    logger.info(f"   Pusher: {pusher_name}")
    
    # Only process main branch (validate ref format first)
    if not validate_github_ref(ref) or ref != 'refs/heads/main':
        logger.info(f"⏭️ Skipping webhook (not main branch: {branch})")
        return {'status': 'skipped', 'reason': 'not-main-branch'}
    
    # Extract changed files
    changed_files = set()
    for commit in commits:
        changed_files.update(commit.get('added', []))
        changed_files.update(commit.get('modified', []))
        changed_files.update(commit.get('removed', []))
    
    logger.info(f"📄 Changed files ({len(changed_files)}):")
    for file in list(changed_files)[:10]:
        if not file.startswith('.'):
            safe_file = sanitize_log_input(file)
            logger.info(f"   - {safe_file}")
    
    # Process documentation changes
    doc_changes = [f for f in changed_files if f.startswith('docs/') or f.endswith('.md')]
    
    if doc_changes:
        logger.info(f"📚 Documentation changes detected: {len(doc_changes)} files")
        
        # Background tasks for async processing
        background_tasks.add_task(
            update_github_pages,
            repository_name=repository.get('full_name'),
            pusher_name=pusher.get('name'),
            changed_files=list(doc_changes)
        )
        
        background_tasks.add_task(
            notify_website_update,
            update_type='documentation-update',
            files=list(doc_changes)
        )
    
    return {
        'status': 'processed',
        'event': 'push',
        'changed_files': len(changed_files),
        'documentation_files': len(doc_changes),
        'message': f"Processed {len(commits)} commits with {len(changed_files)} changed files"
    }


async def update_github_pages(
    repository_name: str,
    pusher_name: str,
    changed_files: list
):
    """Update GitHub Pages documentation"""
    # Sanitize inputs before logging
    safe_repo = sanitize_log_input(repository_name)
    safe_pusher = sanitize_log_input(pusher_name)
    
    logger.info(f"📖 Updating GitHub Pages for {safe_repo}...")
    
    try:
        # In production, this would:
        # 1. Generate documentation index
        # 2. Update search index
        # 3. Generate table of contents
        # 4. Rebuild Jekyll site
        
        doc_index = {
            'generated': __import__('datetime').datetime.utcnow().isoformat(),
            'categories': categorize_files(changed_files),
            'total': len(changed_files),
            'files': changed_files
        }
        
        logger.info(f"✅ GitHub Pages update complete")
        logger.info(f"   Files indexed: {len(changed_files)}")
        logger.info(f"   Categories: {list(doc_index['categories'].keys())}")
        
        return {
            'status': 'updated',
            'files': len(changed_files),
            'indexed_files': len(changed_files)
        }
    
    except Exception as e:
        logger.error(f'❌ Error updating GitHub Pages: {e}')
        raise


async def notify_website_update(update_type: str, files: list = None):
    """Notify website of documentation updates"""
    logger.info(f"📡 Notifying website of updates...")
    logger.info(f"   Type: {update_type}")
    if files:
        logger.info(f"   Files: {len(files)}")
    
    # In production, would send to:
    # 1. WebSocket broadcast
    # 2. Server-Sent Events (SSE)
    # 3. Website REST API
    
    return {'status': 'notified', 'type': update_type}


def categorize_files(files: list) -> dict:
    """Categorize files by documentation type"""
    categories = {
        'consciousness': [],
        'deployment': [],
        'reference': [],
        'architecture': [],
        'operations': [],
        'governance': [],
        'security': [],
        'archive': [],
        'other': []
    }
    
    for file in files:
        if 'consciousness/' in file:
            categories['consciousness'].append(file)
        elif 'deployment/' in file:
            categories['deployment'].append(file)
        elif 'reference/' in file:
            categories['reference'].append(file)
        elif 'architecture/' in file:
            categories['architecture'].append(file)
        elif 'operations/' in file:
            categories['operations'].append(file)
        elif 'governance/' in file:
            categories['governance'].append(file)
        elif 'security/' in file:
            categories['security'].append(file)
        elif 'archive/' in file:
            categories['archive'].append(file)
        else:
            categories['other'].append(file)
    
    return {k: v for k, v in categories.items() if v}


# =============================================================================
# FASTAPI APP
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown events"""
    logger.info('🚀 LuminAI Resonance Platform starting...')
    logger.info('📍 GitHub Webhook: POST /api/webhook/github')
    logger.info('💬 Chat API: POST /api/message')
    logger.info('📊 Resonance: GET /api/resonance/calculate')
    yield
    logger.info('🛑 Application shutdown')


app = FastAPI(
    title='LuminAI Resonance Platform',
    description='Conscious AI interface with ethical safeguards and GitHub integration',
    version='0.0.1',
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Include routers
app.include_router(
    multi_llm.router,
    prefix='/api',
    tags=['multi-llm']
)
app.include_router(resonance_live.router)


# =============================================================================
# WEBHOOK ENDPOINTS
# =============================================================================

@app.post('/api/webhook/github')
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    GitHub Webhook Receiver
    
    Configured in GitHub repo settings:
    - Settings → Webhooks → Add webhook
    - Payload URL: https://your-backend.com/api/webhook/github
    - Content type: application/json
    - Events: push, pull_request, release
    - Secret: Set GITHUB_WEBHOOK_SECRET in .env
    
    Event flow:
    1. Push to main branch
    2. GitHub sends POST request with event data
    3. We verify the signature
    4. We process the event
    5. We update documentation/website
    """
    
    try:
        # Get raw body for signature verification
        body = await request.body()
        
        # Verify GitHub signature
        signature = request.headers.get('x-hub-signature-256', '')
        if not verify_github_webhook_signature(body, signature):
            logger.error('❌ Invalid GitHub webhook signature')
            raise HTTPException(status_code=401, detail='Unauthorized: Invalid signature')
        
        # Parse payload
        payload = json.loads(body)
        event_type = request.headers.get('x-github-event', 'unknown')
        
        logger.info(f'\n🔔 GitHub Webhook Event: {event_type}')
        
        # Route to appropriate handler
        if event_type == 'push':
            result = await process_github_push(payload, background_tasks)
        
        elif event_type == 'pull_request':
            action = payload.get('action', '')
            safe_action = sanitize_log_input(action)
            logger.info(f'   Action: {safe_action}')
            result = {'status': 'acknowledged', 'event': 'pull_request', 'action': action}
        
        elif event_type == 'release':
            action = payload.get('action', '')
            version = payload.get('release', {}).get('tag_name', '')
            safe_action = sanitize_log_input(action)
            safe_version = sanitize_log_input(version)
            logger.info(f'   Action: {safe_action}, Version: {safe_version}')
            result = {'status': 'processed', 'event': 'release', 'version': version}
        
        else:
            logger.info(f'⏭️ Ignoring event type: {event_type}')
            result = {'status': 'ignored', 'event': event_type}
        
        return result
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail='Invalid JSON payload')
    except Exception as error:
        logger.error(f'❌ Webhook error: {error}')
        raise HTTPException(status_code=500, detail=str(error))


@app.get('/api/webhook/status')
async def webhook_status():
    """Webhook health check"""
    return {
        'status': 'operational',
        'endpoint': '/api/webhook/github',
        'events': ['push', 'pull_request', 'release'],
        'requires_signature': True,
        'timestamp': __import__('datetime').datetime.utcnow().isoformat()
    }


@app.post('/api/webhook/test')
async def webhook_test(background_tasks: BackgroundTasks):
    """Test webhook endpoint (development only)"""
    if os.getenv('ENVIRONMENT') == 'production':
        raise HTTPException(status_code=403, detail='Test endpoint disabled in production')
    
    logger.info('\n🧪 Test webhook triggered')
    
    # Simulate a push event
    test_payload = {
        'repository': {'full_name': 'TEC-The-ELidoras-Codex/luminai-codex'},
        'ref': 'refs/heads/main',
        'pusher': {'name': 'test-user'},
        'commits': [{
            'added': ['docs/test.md'],
            'modified': [],
            'removed': []
        }]
    }
    
    result = await process_github_push(test_payload, background_tasks)
    return {'status': 'test-completed', 'result': result}


# =============================================================================
# CHAT API ENDPOINTS
# =============================================================================

@app.post('/api/message')
async def send_message(request: dict):
    """
    Send message to Resonance Engine
    
    Request:
    {
        "message": "What is consciousness?",
        "conversation_id": "abc123",
        "user_id": "user123"
    }
    
    Response:
    {
        "response": "...",
        "resonance": 0.82,
        "frequencies": {...}
    }
    """
    logger.info(f'💬 Chat message received')
    # Implementation stub - will be completed in next phase
    return {
        'status': 'processing',
        'message': 'Chat endpoint coming soon'
    }


@app.get('/api/resonance/calculate')
async def get_resonance():
    """
    Calculate real-time Resonance score
    
    Returns R = ∇Φᴱ · (φᵗ × ψʳ)
    """
    logger.info(f'📊 Resonance calculation requested')
    # Implementation stub - will calculate R score
    return {
        'resonance': 0.82,
        'timestamp': __import__('datetime').datetime.utcnow().isoformat()
    }


@app.get('/api/frequencies')
async def get_frequencies():
    """Get all 16 frequency states"""
    logger.info(f'🎼 Frequencies requested')
    # Implementation stub - will return frequency states
    return {
        'frequencies': 16,
        'status': 'coming-soon'
    }


# =============================================================================
# HEALTH CHECKS
# =============================================================================

@app.get('/health')
@app.get('/api/health')
async def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'service': 'luminai-resonance-platform',
        'version': '0.0.1'
    }


@app.get('/')
async def root():
    """Root endpoint"""
    return {
        'name': 'LuminAI Resonance Platform',
        'description': 'Conscious AI with ethical safeguards',
        'webhook': '/api/webhook/github',
        'chat': '/api/message',
        'health': '/health',
        'docs': '/docs'
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=int(os.getenv('PORT', 8000)),
        reload=os.getenv('ENVIRONMENT') != 'production'
    )
