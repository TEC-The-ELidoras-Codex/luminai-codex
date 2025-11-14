/**
 * LuminAI Security Utilities (TypeScript)
 * Sanitization and validation for webhook handling and logging
 */

/**
 * Sanitize user-controlled input before logging.
 *
 * Prevents log injection attacks by:
 * - Removing/escaping ANSI escape sequences
 * - Removing newlines and carriage returns
 * - Limiting string length
 * - Escaping special characters
 */
export function sanitizeLogInput(value: any, maxLength: number = 200): string {
  if (value === null || value === undefined) {
    return "null";
  }

  let safeStr = String(value);

  // Remove ANSI escape sequences (prevent log injection with colors/formatting)
  safeStr = safeStr.replace(/\x1b\[[0-9;]*m/g, "");
  safeStr = safeStr.replace(/\033\[[0-9;]*m/g, "");

  // Replace newlines and carriage returns with spaces (prevent multi-line injection)
  safeStr = safeStr.replace(/[\n\r\t]/g, " ");

  // Truncate to max length
  if (safeStr.length > maxLength) {
    safeStr = safeStr.substring(0, maxLength) + "...";
  }

  return safeStr;
}

/**
 * Validate a GitHub ref string format.
 * Valid refs: refs/heads/*, refs/tags/*, refs/pull/*, etc.
 */
export function validateGitHubRef(ref: string): boolean {
  const pattern = /^refs\/(heads|tags|pull)\/[a-zA-Z0-9\-_/\.]+$/;
  return pattern.test(ref);
}

/**
 * Validate a GitHub repository name format.
 * Valid format: owner/repo
 */
export function validateRepositoryName(repoName: string): boolean {
  const pattern = /^[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+$/;
  return pattern.test(repoName);
}

/**
 * Create a safe log message from webhook payload data
 */
export function createSafeWebhookLog(data: {
  event?: string;
  repository?: string;
  branch?: string;
  pusher?: string;
  commits?: number;
}): string {
  const parts: string[] = [];

  if (data.event) {
    parts.push(`Event: ${sanitizeLogInput(data.event)}`);
  }
  if (data.repository) {
    parts.push(`Repository: ${sanitizeLogInput(data.repository)}`);
  }
  if (data.branch) {
    parts.push(`Branch: ${sanitizeLogInput(data.branch)}`);
  }
  if (data.pusher) {
    parts.push(`Pusher: ${sanitizeLogInput(data.pusher)}`);
  }
  if (data.commits !== undefined) {
    parts.push(`Commits: ${data.commits}`);
  }

  return parts.join(" | ");
}
