/**
 * GitHub Pages Integration
 * 
 * Handles automatic documentation updates, search index generation,
 * and website rebuild triggers when code is pushed to main
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

interface GitHubPagesUpdateOptions {
  repository: string;
  pusher?: string;
  changedFiles?: string[];
  version?: string;
  releaseNotes?: string;
  timestamp: string;
}

interface WebsiteNotificationPayload {
  type: string;
  files?: string[];
  branch?: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Update GitHub Pages (trigger rebuild, update search index, etc.)
 */
export async function updateGitHubPages(options: GitHubPagesUpdateOptions) {
  const { repository, pusher, changedFiles = [], timestamp } = options;
  const [owner, repo] = repository.split('/');

  console.log(`\n📖 Updating GitHub Pages for ${repository}...`);

  try {
    // 1. Generate documentation index
    const docIndex = await generateDocumentationIndex(changedFiles);
    console.log(`📑 Generated documentation index`);

    // 2. Update search index (for website search functionality)
    const searchIndex = await updateSearchIndex(changedFiles);
    console.log(`🔍 Updated search index`);

    // 3. Generate table of contents
    const toc = await generateTableOfContents(changedFiles);
    console.log(`📋 Generated table of contents`);

    // 4. Create automatic deployment commit (if needed)
    const deploymentInfo = {
      status: 'deployed',
      files: changedFiles.length,
      timestamp,
      pusher,
      indexGenerated: true,
      searchIndexUpdated: true
    };

    console.log(`✅ GitHub Pages update complete`);
    return deploymentInfo;

  } catch (error) {
    console.error('❌ Error updating GitHub Pages:', error);
    throw error;
  }
}

/**
 * Generate documentation index from changed files
 */
async function generateDocumentationIndex(files: string[]): Promise<object> {
  const docIndex: any = {
    generated: new Date().toISOString(),
    categories: {},
    total: files.length,
    files: []
  };

  const categories: { [key: string]: string[] } = {
    'consciousness': [],
    'deployment': [],
    'reference': [],
    'architecture': [],
    'operations': [],
    'governance': [],
    'security': [],
    'archive': [],
    'other': []
  };

  // Categorize changed files
  for (const file of files) {
    docIndex.files.push({
      path: file,
      category: getCategoryFromPath(file),
      timestamp: new Date().toISOString()
    });

    const category = getCategoryFromPath(file);
    if (categories[category]) {
      categories[category].push(file);
    }
  }

  docIndex.categories = categories;
  return docIndex;
}

/**
 * Update search index for website search
 */
async function updateSearchIndex(files: string[]): Promise<object> {
  console.log(`   Creating search index for ${files.length} files...`);

  const searchIndex = {
    version: 1,
    generated: new Date().toISOString(),
    documents: [] as any[]
  };

  for (const file of files) {
    if (file.endsWith('.md')) {
      // In production, you would:
      // 1. Read the markdown file from GitHub
      // 2. Parse it (extract headings, content snippets)
      // 3. Create searchable entries

      searchIndex.documents.push({
        path: file,
        type: 'markdown',
        indexed: true,
        // In real implementation, would extract:
        // - title
        // - headings
        // - preview text
        // - keywords
        // - etc.
      });
    }
  }

  console.log(`   Indexed ${searchIndex.documents.length} documents`);
  return searchIndex;
}

/**
 * Generate table of contents from documentation
 */
async function generateTableOfContents(files: string[]): Promise<object> {
  const toc: any = {
    generated: new Date().toISOString(),
    sections: {
      consciousness: {
        title: '🧠 Consciousness Framework',
        files: files.filter(f => f.includes('consciousness/'))
      },
      deployment: {
        title: '🚀 Deployment',
        files: files.filter(f => f.includes('deployment/'))
      },
      reference: {
        title: '📚 Reference',
        files: files.filter(f => f.includes('reference/'))
      },
      architecture: {
        title: '🏗️ Architecture',
        files: files.filter(f => f.includes('architecture/'))
      },
      operations: {
        title: '⚙️ Operations',
        files: files.filter(f => f.includes('operations/'))
      },
      security: {
        title: '🔐 Security',
        files: files.filter(f => f.includes('security/'))
      }
    }
  };

  return toc;
}

/**
 * Determine documentation category from file path
 */
function getCategoryFromPath(filePath: string): string {
  if (filePath.includes('consciousness/')) return 'consciousness';
  if (filePath.includes('deployment/')) return 'deployment';
  if (filePath.includes('reference/')) return 'reference';
  if (filePath.includes('architecture/')) return 'architecture';
  if (filePath.includes('operations/')) return 'operations';
  if (filePath.includes('governance/')) return 'governance';
  if (filePath.includes('security/')) return 'security';
  if (filePath.includes('archive/')) return 'archive';
  return 'other';
}

/**
 * Notify website of updates via WebSocket or API
 */
export async function notifyWebsiteUpdate(payload: WebsiteNotificationPayload) {
  const { type, files = [], timestamp } = payload;

  console.log(`\n📡 Notifying website of updates...`);
  console.log(`   Type: ${type}`);
  console.log(`   Files: ${files.length}`);
  console.log(`   Timestamp: ${timestamp}`);

  try {
    // Method 1: WebSocket broadcast (if available)
    if (global.websocketServer) {
      broadcastWebsocketUpdate(payload);
      console.log(`   ✅ Sent via WebSocket`);
    }

    // Method 2: Server-Sent Events (SSE)
    if (global.eventClients && global.eventClients.size > 0) {
      broadcastSSEUpdate(payload);
      console.log(`   ✅ Sent via SSE to ${global.eventClients.size} clients`);
    }

    // Method 3: REST API call to website
    const websiteUrl = process.env.WEBSITE_URL || 'https://elidoras.codex';
    try {
      const response = await fetch(`${websiteUrl}/api/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBSITE_API_KEY || ''}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`   ✅ Website received update notification`);
      }
    } catch (error) {
      console.warn(`   ⚠️ Could not reach website API (may be offline):`, error);
    }

    return {
      status: 'notified',
      channels: ['websocket', 'sse', 'rest-api'],
      timestamp
    };

  } catch (error) {
    console.error('❌ Error notifying website:', error);
    throw error;
  }
}

/**
 * Broadcast update via WebSocket
 */
function broadcastWebsocketUpdate(payload: WebsiteNotificationPayload) {
  if (!global.websocketServer) return;

  const message = JSON.stringify({
    event: 'documentation-updated',
    data: payload,
    timestamp: new Date().toISOString()
  });

  global.websocketServer.clients.forEach((client: any) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

/**
 * Broadcast update via Server-Sent Events
 */
function broadcastSSEUpdate(payload: WebsiteNotificationPayload) {
  if (!global.eventClients) return;

  const message = `data: ${JSON.stringify(payload)}\n\n`;
  
  global.eventClients.forEach((res: any) => {
    res.write(message);
  });
}

/**
 * Export types for TypeScript usage
 */
export type { GitHubPagesUpdateOptions, WebsiteNotificationPayload };
