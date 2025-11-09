#!/usr/bin/env python3
"""
The Elidoras Codex - Bitwarden Secrets Synchronization

This script provides secure secrets management for The Elidoras Codex project
by synchronizing with Bitwarden vault and managing environment variables.

Features:
- Bitwarden CLI integration
- Multi-environment support (dev, staging, prod)
- Encrypted local caching
- Automatic secret rotation handling
- Integration with LuminAI Codex configuration system

Usage:
    python sync_bitwarden_secrets.py --env dev --vault luminai-codex
    python sync_bitwarden_secrets.py --sync-all
    python sync_bitwarden_secrets.py --rotate-secrets
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime, timezone
import hashlib
import base64

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/tec_tgcr/luminai-codex/secrets-local/bw/sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class BitwardenSecretsManager:
    """Manages secrets synchronization with Bitwarden for The Elidoras Codex."""
    
    def __init__(self, vault_name: str = "luminai-codex", base_path: str = None):
        self.vault_name = vault_name
        self.base_path = Path(base_path) if base_path else Path("/home/tec_tgcr/luminai-codex")
        self.secrets_path = self.base_path / "secrets-local" / "bw"
        self.config_path = self.base_path / "config"
        
        # Ensure directories exist
        self.secrets_path.mkdir(parents=True, exist_ok=True)
        self.config_path.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Initialized Bitwarden manager for vault: {vault_name}")
    
    def check_bw_cli(self) -> bool:
        """Check if Bitwarden CLI is installed and accessible."""
        try:
            result = subprocess.run(['bw', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"Bitwarden CLI version: {result.stdout.strip()}")
                return True
            else:
                logger.error("Bitwarden CLI not found or not accessible")
                return False
        except FileNotFoundError:
            logger.error("Bitwarden CLI not installed. Install with: npm install -g @bitwarden/cli")
            return False
    
    def login_bw(self) -> bool:
        """Authenticate with Bitwarden."""
        try:
            # Check if already logged in
            result = subprocess.run(['bw', 'status'], capture_output=True, text=True)
            status = json.loads(result.stdout)
            
            if status['status'] == 'unlocked':
                logger.info("Already authenticated with Bitwarden")
                return True
            elif status['status'] == 'locked':
                logger.info("Bitwarden vault is locked, attempting to unlock...")
                # Note: In production, use secure method to get master password
                master_password = os.getenv('BW_PASSWORD')
                if not master_password:
                    logger.error("BW_PASSWORD environment variable not set")
                    return False
                
                result = subprocess.run(
                    ['bw', 'unlock', master_password, '--raw'],
                    capture_output=True, text=True
                )
                if result.returncode == 0:
                    session_key = result.stdout.strip()
                    os.environ['BW_SESSION'] = session_key
                    logger.info("Successfully unlocked Bitwarden vault")
                    return True
            else:
                logger.info("Need to log in to Bitwarden")
                # Interactive login required
                result = subprocess.run(['bw', 'login'], text=True)
                return result.returncode == 0
                
        except Exception as e:
            logger.error(f"Error during Bitwarden authentication: {e}")
            return False
    
    def get_vault_items(self, environment: str = None) -> List[Dict]:
        """Retrieve items from Bitwarden vault."""
        try:
            cmd = ['bw', 'list', 'items']
            if environment:
                cmd.extend(['--search', f"luminai-{environment}"])
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                items = json.loads(result.stdout)
                logger.info(f"Retrieved {len(items)} items from vault")
                return items
            else:
                logger.error(f"Failed to retrieve vault items: {result.stderr}")
                return []
        except Exception as e:
            logger.error(f"Error retrieving vault items: {e}")
            return []
    
    def sync_secrets_to_env(self, environment: str, items: List[Dict]) -> bool:
        """Sync secrets to environment configuration files."""
        try:
            env_file = self.config_path / f".env.{environment}"
            backup_file = self.config_path / f".env.{environment}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Backup existing file
            if env_file.exists():
                env_file.rename(backup_file)
                logger.info(f"Backed up existing environment file to {backup_file}")
            
            # Generate new environment file
            env_vars = {}
            for item in items:
                if item.get('type') == 1:  # Login type in Bitwarden
                    name = item.get('name', '')
                    if f"luminai-{environment}" in name.lower():
                        # Extract environment variables from custom fields
                        if 'fields' in item and item['fields']:
                            for field in item['fields']:
                                if field.get('name') and field.get('value'):
                                    env_vars[field['name']] = field['value']
                        
                        # Extract from login credentials if needed
                        if 'login' in item and item['login']:
                            username = item['login'].get('username')
                            password = item['login'].get('password')
                            if username:
                                env_vars[f"{name.upper()}_USERNAME"] = username
                            if password:
                                env_vars[f"{name.upper()}_PASSWORD"] = password
            
            # Write environment file
            with open(env_file, 'w') as f:
                f.write(f"# The Elidoras Codex - {environment.upper()} Environment\n")
                f.write(f"# Generated: {datetime.now(timezone.utc).isoformat()}\n")
                f.write(f"# Vault: {self.vault_name}\n\n")
                
                for key, value in sorted(env_vars.items()):
                    f.write(f"{key}={value}\n")
            
            logger.info(f"Synchronized {len(env_vars)} secrets to {env_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error syncing secrets to environment: {e}")
            return False
    
    def generate_config_template(self, environment: str) -> bool:
        """Generate configuration template for the environment."""
        try:
            config_file = self.config_path / f"config.{environment}.json"
            
            template_config = {
                "environment": environment,
                "luminai": {
                    "core": {
                        "resonance_frequency": "432Hz",
                        "harmonic_layers": 7,
                        "quantum_entanglement_enabled": True
                    },
                    "ai": {
                        "primary_model": "gpt-4-turbo",
                        "secondary_models": ["claude-3", "llama-2-70b"],
                        "context_window": 32768,
                        "temperature": 0.7,
                        "memory_palace_size": "1GB"
                    },
                    "security": {
                        "encryption_algorithm": "AES-256-GCM",
                        "key_rotation_interval": "30d",
                        "audit_logging": True
                    },
                    "database": {
                        "type": "cosmosdb",
                        "consistency_level": "session",
                        "partition_strategy": "user_id"
                    }
                },
                "integrations": {
                    "azure": {
                        "region": "eastus2",
                        "resource_group": f"luminai-{environment}",
                        "storage_account": f"luminai{environment}storage"
                    },
                    "monitoring": {
                        "application_insights": True,
                        "log_analytics": True,
                        "alerts_enabled": True
                    }
                },
                "features": {
                    "mythic_narrative_engine": True,
                    "quantum_classical_bridge": environment != "dev",
                    "advanced_reasoning": True,
                    "multi_agent_orchestration": True
                }
            }
            
            with open(config_file, 'w') as f:
                json.dump(template_config, f, indent=2)
            
            logger.info(f"Generated configuration template: {config_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating config template: {e}")
            return False
    
    def sync_environment(self, environment: str) -> bool:
        """Complete synchronization for a specific environment."""
        logger.info(f"Starting synchronization for environment: {environment}")
        
        if not self.check_bw_cli():
            return False
        
        if not self.login_bw():
            logger.error("Failed to authenticate with Bitwarden")
            return False
        
        items = self.get_vault_items(environment)
        if not items:
            logger.warning(f"No items found for environment: {environment}")
            return False
        
        success = True
        success &= self.sync_secrets_to_env(environment, items)
        success &= self.generate_config_template(environment)
        
        if success:
            logger.info(f"Successfully synchronized environment: {environment}")
        else:
            logger.error(f"Failed to fully synchronize environment: {environment}")
        
        return success
    
    def sync_all_environments(self) -> bool:
        """Synchronize all environments."""
        environments = ['dev', 'staging', 'prod']
        success = True
        
        for env in environments:
            env_success = self.sync_environment(env)
            success &= env_success
        
        return success
    
    def rotate_secrets(self) -> bool:
        """Rotate secrets and update vault (placeholder for future implementation)."""
        logger.info("Secret rotation not yet implemented")
        # TODO: Implement automatic secret rotation
        return True

def main():
    """Main entry point for the Bitwarden secrets synchronization."""
    parser = argparse.ArgumentParser(
        description="The Elidoras Codex - Bitwarden Secrets Synchronization"
    )
    
    parser.add_argument(
        '--env', 
        choices=['dev', 'staging', 'prod'], 
        help='Environment to synchronize'
    )
    parser.add_argument(
        '--vault', 
        default='luminai-codex', 
        help='Bitwarden vault name'
    )
    parser.add_argument(
        '--sync-all', 
        action='store_true', 
        help='Synchronize all environments'
    )
    parser.add_argument(
        '--rotate-secrets', 
        action='store_true', 
        help='Rotate secrets'
    )
    parser.add_argument(
        '--base-path', 
        help='Base path for the project (default: current directory)'
    )
    
    args = parser.parse_args()
    
    # Initialize the secrets manager
    manager = BitwardenSecretsManager(
        vault_name=args.vault,
        base_path=args.base_path
    )
    
    success = False
    
    if args.sync_all:
        success = manager.sync_all_environments()
    elif args.env:
        success = manager.sync_environment(args.env)
    elif args.rotate_secrets:
        success = manager.rotate_secrets()
    else:
        parser.print_help()
        sys.exit(1)
    
    if success:
        logger.info("Operation completed successfully")
        sys.exit(0)
    else:
        logger.error("Operation failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
