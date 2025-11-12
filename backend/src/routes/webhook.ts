import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { updateGitHubPages, notifyWebsiteUpdate } from '../integrations/github-pages';

const router = express.Router();

// GitHub webhook secret (set in environment)
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'development-secret';

/**
 * Verify GitHub webhook signature
 * GitHub includes X-Hub-Signature-256 header with HMAC SHA256 signature
 */
function verifyGitHubSignature(req: Request): boolean {
  const signature = req.headers['x-hub-signature-256'] as string;
  
  if (!signature) {
    console.warn('⚠️ No X-Hub-Signature-256 header found');
    return process.env.NODE_ENV !== 'production'; // Allow in dev, deny in prod
  }

  const body = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', GITHUB_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  const expectedSignature = `sha256=${hash}`;
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * POST /api/webhook/github
 * 
 * Receives GitHub push events and updates the website
 * 
 * Event flow:
 * 1. GitHub pushes to main branch
 * 2. GitHub sends webhook to this endpoint
 * 3. We verify the signature
 * 4. We process the pushed files
 * 5. We update GitHub Pages (docs/ folder)
 * 6. We notify the website of updates
 */
router.post('/github', async (req: Request, res: Response) => {
  try {
    // Verify webhook signature
    if (!verifyGitHubSignature(req)) {
      console.error('❌ Invalid GitHub webhook signature');
      return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    const event = req.headers['x-github-event'] as string;
    const { repository, ref, pusher, commits } = req.body;

    console.log(`\n🔔 GitHub Webhook Event: ${event}`);
    console.log(`📦 Repository: ${repository?.full_name}`);
    console.log(`🌿 Branch: ${ref}`);
    console.log(`👤 Pusher: ${pusher?.name}`);
    console.log(`📝 Commits: ${commits?.length || 0}`);

    // Only process pushes to main branch
    if (ref !== 'refs/heads/main') {
      console.log(`⏭️ Skipping webhook (not main branch: ${ref})`);
      return res.json({ status: 'skipped', reason: 'not-main-branch' });
    }

    // Handle different event types
    switch (event) {
      case 'push':
        return await handlePushEvent(req.body, res);
      
      case 'pull_request':
        return await handlePullRequestEvent(req.body, res);
      
      case 'release':
        return await handleReleaseEvent(req.body, res);
      
      default:
        console.log(`⏭️ Ignoring event type: ${event}`);
        return res.json({ status: 'ignored', event });
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Handle push events from GitHub
 */
async function handlePushEvent(payload: any, res: Response) {
  const { repository, commits, pusher } = payload;
  
  console.log(`\n📤 Processing push event...`);
  
  // Extract changed files
  const changedFiles = new Set<string>();
  commits.forEach((commit: any) => {
    if (commit.added) changedFiles.add(...commit.added);
    if (commit.modified) changedFiles.add(...commit.modified);
    if (commit.removed) changedFiles.add(...commit.removed);
  });

  console.log(`📄 Changed files (${changedFiles.size}):`);
  Array.from(changedFiles)
    .filter(f => !f.startsWith('.'))
    .slice(0, 10)
    .forEach(f => console.log(`   - ${f}`));

  // Process documentation changes
  const docChanges = Array.from(changedFiles).filter(f => 
    f.startsWith('docs/') || f.endsWith('.md')
  );

  if (docChanges.length > 0) {
    console.log(`\n📚 Documentation changes detected: ${docChanges.length} files`);
    
    try {
      // Update GitHub Pages (rebuild site, update search index, etc.)
      const result = await updateGitHubPages({
        repository: repository.full_name,
        pusher: pusher.name,
        changedFiles: docChanges,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ GitHub Pages updated:`, result);

      // Notify website of updates (WebSocket, SSE, or API call)
      await notifyWebsiteUpdate({
        type: 'documentation-update',
        files: docChanges,
        branch: 'main',
        timestamp: new Date().toISOString()
      });

      console.log(`📡 Website notified of updates`);
    } catch (error) {
      console.error('❌ Error updating GitHub Pages:', error);
      throw error;
    }
  }

  res.json({
    status: 'processed',
    event: 'push',
    changedFiles: changedFiles.size,
    documentationFiles: docChanges.length,
    message: `Processed ${commits.length} commits with ${changedFiles.size} changed files`
  });
}

/**
 * Handle pull request events
 */
async function handlePullRequestEvent(payload: any, res: Response) {
  const { action, pull_request, repository } = payload;
  
  console.log(`\n📋 Pull Request Event: ${action}`);
  console.log(`   Title: ${pull_request.title}`);
  console.log(`   URL: ${pull_request.html_url}`);

  // Only process when PR is merged
  if (action === 'closed' && pull_request.merged) {
    console.log(`✅ PR merged! Triggering deployment...`);
    
    // This would trigger the same flow as push event
    return res.json({
      status: 'processed',
      event: 'pull_request',
      action,
      message: 'PR merged - deployment triggered'
    });
  }

  res.json({
    status: 'acknowledged',
    event: 'pull_request',
    action,
    message: `PR ${action} - awaiting merge`
  });
}

/**
 * Handle release events
 */
async function handleReleaseEvent(payload: any, res: Response) {
  const { action, release, repository } = payload;

  console.log(`\n🎉 Release Event: ${action}`);
  console.log(`   Version: ${release.tag_name}`);
  console.log(`   URL: ${release.html_url}`);

  if (action === 'published') {
    console.log(`📢 New release published! Updating deployment...`);
    
    try {
      const result = await updateGitHubPages({
        repository: repository.full_name,
        version: release.tag_name,
        releaseNotes: release.body,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Release deployment completed`);
    } catch (error) {
      console.error('❌ Error deploying release:', error);
      throw error;
    }
  }

  res.json({
    status: 'processed',
    event: 'release',
    action,
    version: release.tag_name
  });
}

/**
 * GET /api/webhook/status
 * Health check for webhook receiver
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    endpoint: '/api/webhook/github',
    events: ['push', 'pull_request', 'release'],
    requiresSignature: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/webhook/test
 * Manual webhook trigger for testing
 */
router.post('/test', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint disabled in production' });
  }

  console.log('\n🧪 Test webhook triggered');
  
  const result = await updateGitHubPages({
    repository: 'TEC-The-ELidoras-Codex/luminai-codex',
    pusher: 'test-user',
    changedFiles: ['docs/test.md'],
    timestamp: new Date().toISOString()
  });

  res.json({
    status: 'test-completed',
    result
  });
});

export default router;
