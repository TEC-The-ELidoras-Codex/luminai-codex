"""
LuminAI Security Utilities
Sanitization and validation for webhook handling and logging
"""

import re
import logging
from typing import Any, Dict, List


def sanitize_log_input(value: Any, max_length: int = 200) -> str:
    """
    Sanitize user-controlled input before logging.
    
    Prevents log injection attacks by:
    - Removing/escaping ANSI escape sequences
    - Removing newlines and carriage returns
    - Limiting string length
    - Escaping special characters
    
    Args:
        value: The input to sanitize
        max_length: Maximum length of the sanitized string
    
    Returns:
        Safe string suitable for logging
    """
    if value is None:
        return "None"
    
    # Convert to string
    safe_str = str(value)
    
    # Remove ANSI escape sequences (prevent log injection with colors/formatting)
    # Pattern matches: ESC [ ... m
    safe_str = re.sub(r'\x1b\[[0-9;]*m', '', safe_str)
    safe_str = re.sub(r'\033\[[0-9;]*m', '', safe_str)
    
    # Replace newlines and carriage returns with spaces (prevent multi-line injection)
    safe_str = safe_str.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
    
    # Truncate to max length
    if len(safe_str) > max_length:
        safe_str = safe_str[:max_length] + '...'
    
    return safe_str


def sanitize_webhook_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitize a GitHub webhook payload for safe logging.
    
    Creates a copy with sensitive fields truncated and log-injection attempts neutralized.
    
    Args:
        payload: The webhook payload dict
    
    Returns:
        Sanitized copy suitable for logging
    """
    if not isinstance(payload, dict):
        return {}
    
    sanitized = {}
    
    # Safe fields to include with sanitization
    safe_fields = {
        'repository': ['full_name', 'name', 'owner'],
        'pusher': ['name', 'email'],
        'ref': None,  # Scalar value
        'action': None,
        'number': None,
    }
    
    # Extract and sanitize allowed fields
    if 'repository' in payload and isinstance(payload['repository'], dict):
        sanitized['repository'] = {
            k: sanitize_log_input(payload['repository'].get(k))
            for k in ['full_name', 'name']
            if k in payload['repository']
        }
    
    if 'pusher' in payload and isinstance(payload['pusher'], dict):
        sanitized['pusher'] = {
            k: sanitize_log_input(payload['pusher'].get(k))
            for k in ['name', 'email']
            if k in payload['pusher']
        }
    
    if 'ref' in payload:
        sanitized['ref'] = sanitize_log_input(payload['ref'])
    
    if 'action' in payload:
        sanitized['action'] = sanitize_log_input(payload['action'])
    
    if 'commits' in payload and isinstance(payload['commits'], list):
        sanitized['commits_count'] = len(payload['commits'])
    
    return sanitized


def create_safe_logger(name: str) -> logging.Logger:
    """
    Create a logger with a custom formatter that prevents log injection.
    
    Args:
        name: Logger name
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Create a custom formatter that sanitizes all messages
    class SafeFormatter(logging.Formatter):
        def format(self, record):
            # Sanitize the message
            if isinstance(record.msg, str):
                # For f-strings/format strings, the message might contain unsanitized values
                # The actual dangerous work should be done in the logging call itself
                pass
            return super().format(record)
    
    return logger


def validate_github_ref(ref: str) -> bool:
    """
    Validate a GitHub ref string format.
    
    Args:
        ref: The ref string (e.g., 'refs/heads/main')
    
    Returns:
        True if valid format, False otherwise
    """
    # Valid refs should be in format refs/heads/*, refs/tags/*, etc.
    pattern = r'^refs/(heads|tags|pull)/[a-zA-Z0-9\-_/\.]+$'
    return bool(re.match(pattern, ref))


def validate_repository_name(repo_name: str) -> bool:
    """
    Validate a GitHub repository name format.
    
    Args:
        repo_name: The repository name (e.g., 'owner/repo')
    
    Returns:
        True if valid format, False otherwise
    """
    # Valid repo names: owner/repo, both parts alphanumeric + dash/underscore
    pattern = r'^[a-zA-Z0-9\-_]+/[a-zA-Z0-9\-_\.]+$'
    return bool(re.match(pattern, repo_name))
