"""
🔧 AGENT CONFIGURATION

Configuration management for TEC TGCR agents
Handles settings, credentials, and agent behavior parameters
"""

import os
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List
from pathlib import Path
import json
import logging

logger = logging.getLogger(__name__)

@dataclass
class AgentConfig:
    """
    Configuration for TEC TGCR agents
    
    This class manages all configuration aspects for agents including:
    - API credentials and endpoints
    - Agent behavior parameters  
    - Tool configurations
    - Memory and storage settings
    """
    
    # Agent Identity
    agent_name: str = "AirthResearchGuard"
    agent_version: str = "1.0.0"
    agent_description: str = "Advanced research and analysis agent"
    
    # API Configuration
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    xai_api_key: Optional[str] = None
    
    # Model Settings
    default_llm_provider: str = "openai"
    default_model: str = "gpt-4"
    max_tokens: int = 4096
    temperature: float = 0.7
    
    # Agent Behavior
    max_research_depth: int = 3
    research_timeout: int = 30
    enable_web_search: bool = True
    enable_memory: bool = True
    enable_rag: bool = True
    
    # Tool Configuration
    available_tools: List[str] = field(default_factory=lambda: [
        "web_research",
        "document_analysis", 
        "data_extraction",
        "spotify_analysis",
        "memory_search"
    ])
    
    # Storage Settings
    memory_storage_path: str = "./data/memory"
    rag_storage_path: str = "./data/rag"
    cache_directory: str = "./data/cache"
    
    # Logging
    log_level: str = "INFO"
    log_file: Optional[str] = None
    
    # RAG Settings
    rag_chunk_size: int = 1000
    rag_chunk_overlap: int = 200
    rag_max_results: int = 10
    rag_similarity_threshold: float = 0.7
    
    # Research Settings
    research_sources: List[str] = field(default_factory=lambda: [
        "web",
        "academic", 
        "news",
        "social"
    ])
    
    # Memory Settings
    memory_max_entries: int = 10000
    memory_cleanup_interval: int = 86400  # 24 hours
    
    def __post_init__(self):
        """Initialize configuration after creation"""
        # Load environment variables
        self._load_from_environment()
        
        # Ensure directories exist
        self._create_directories()
        
        # Setup logging
        self._setup_logging()
    
    def _load_from_environment(self):
        """Load configuration from environment variables"""
        
        # API Keys
        self.openai_api_key = os.getenv('OPENAI_API_KEY', self.openai_api_key)
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY', self.anthropic_api_key)
        self.xai_api_key = os.getenv('XAI_API_KEY', self.xai_api_key)
        
        # Model settings
        self.default_llm_provider = os.getenv('DEFAULT_LLM_PROVIDER', self.default_llm_provider)
        self.default_model = os.getenv('DEFAULT_MODEL', self.default_model)
        
        # Paths
        self.memory_storage_path = os.getenv('MEMORY_STORAGE_PATH', self.memory_storage_path)
        self.rag_storage_path = os.getenv('RAG_STORAGE_PATH', self.rag_storage_path)
        self.cache_directory = os.getenv('CACHE_DIRECTORY', self.cache_directory)
        
        # Behavioral settings
        if os.getenv('ENABLE_WEB_SEARCH'):
            self.enable_web_search = os.getenv('ENABLE_WEB_SEARCH').lower() == 'true'
        if os.getenv('ENABLE_MEMORY'):
            self.enable_memory = os.getenv('ENABLE_MEMORY').lower() == 'true'
        if os.getenv('ENABLE_RAG'):
            self.enable_rag = os.getenv('ENABLE_RAG').lower() == 'true'
        
        # Numeric settings
        self.max_tokens = int(os.getenv('MAX_TOKENS', self.max_tokens))
        self.temperature = float(os.getenv('TEMPERATURE', self.temperature))
        self.max_research_depth = int(os.getenv('MAX_RESEARCH_DEPTH', self.max_research_depth))
        
        logger.info(f"🔧 Configuration loaded from environment")
    
    def _create_directories(self):
        """Create necessary directories"""
        directories = [
            self.memory_storage_path,
            self.rag_storage_path,
            self.cache_directory
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
            logger.debug(f"📁 Ensured directory exists: {directory}")
    
    def _setup_logging(self):
        """Setup logging configuration"""
        level = getattr(logging, self.log_level.upper(), logging.INFO)
        
        # Configure root logger
        logging.basicConfig(
            level=level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            filename=self.log_file
        )
        
        logger.info(f"📝 Logging configured at {self.log_level} level")
    
    def save_to_file(self, filepath: str):
        """Save configuration to JSON file"""
        config_dict = self.to_dict()
        
        # Remove sensitive information
        sensitive_keys = ['openai_api_key', 'anthropic_api_key', 'xai_api_key']
        for key in sensitive_keys:
            if key in config_dict and config_dict[key]:
                config_dict[key] = "[REDACTED]"
        
        with open(filepath, 'w') as f:
            json.dump(config_dict, f, indent=2)
        
        logger.info(f"💾 Configuration saved to {filepath}")
    
    @classmethod
    def load_from_file(cls, filepath: str) -> 'AgentConfig':
        """Load configuration from JSON file"""
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        return cls.from_dict(data)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary"""
        return {
            field.name: getattr(self, field.name)
            for field in self.__dataclass_fields__.values()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AgentConfig':
        """Create configuration from dictionary"""
        # Filter out keys that aren't valid field names
        valid_keys = {field.name for field in cls.__dataclass_fields__.values()}
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        
        return cls(**filtered_data)
    
    def get_llm_config(self) -> Dict[str, Any]:
        """Get LLM-specific configuration"""
        return {
            'provider': self.default_llm_provider,
            'model': self.default_model,
            'max_tokens': self.max_tokens,
            'temperature': self.temperature,
            'api_keys': {
                'openai': self.openai_api_key,
                'anthropic': self.anthropic_api_key,
                'xai': self.xai_api_key
            }
        }
    
    def get_rag_config(self) -> Dict[str, Any]:
        """Get RAG-specific configuration"""
        return {
            'storage_path': self.rag_storage_path,
            'chunk_size': self.rag_chunk_size,
            'chunk_overlap': self.rag_chunk_overlap,
            'max_results': self.rag_max_results,
            'similarity_threshold': self.rag_similarity_threshold,
            'enabled': self.enable_rag
        }
    
    def get_memory_config(self) -> Dict[str, Any]:
        """Get memory-specific configuration"""
        return {
            'storage_path': self.memory_storage_path,
            'max_entries': self.memory_max_entries,
            'cleanup_interval': self.memory_cleanup_interval,
            'enabled': self.enable_memory
        }
    
    def validate(self) -> List[str]:
        """
        Validate configuration and return list of issues
        
        Returns:
            List of validation error messages (empty if valid)
        """
        issues = []
        
        # Check required API keys based on default provider
        if self.default_llm_provider == 'openai' and not self.openai_api_key:
            issues.append("OpenAI API key required for OpenAI provider")
        elif self.default_llm_provider == 'anthropic' and not self.anthropic_api_key:
            issues.append("Anthropic API key required for Anthropic provider")
        elif self.default_llm_provider == 'xai' and not self.xai_api_key:
            issues.append("xAI API key required for xAI provider")
        
        # Check numeric ranges
        if self.temperature < 0 or self.temperature > 2:
            issues.append("Temperature must be between 0 and 2")
        
        if self.max_tokens < 1:
            issues.append("Max tokens must be positive")
        
        if self.max_research_depth < 1:
            issues.append("Research depth must be positive")
        
        # Check paths exist
        for path_name, path_value in [
            ("memory_storage_path", self.memory_storage_path),
            ("rag_storage_path", self.rag_storage_path),
            ("cache_directory", self.cache_directory)
        ]:
            if not os.path.exists(path_value):
                issues.append(f"Path does not exist: {path_name} = {path_value}")
        
        return issues
    
    def is_valid(self) -> bool:
        """Check if configuration is valid"""
        return len(self.validate()) == 0
    
    @property
    def name(self) -> str:
        """Get agent name (for backward compatibility with tests)"""
        return self.agent_name
    
    def __str__(self) -> str:
        """String representation of configuration"""
        return f"AgentConfig(name={self.agent_name}, provider={self.default_llm_provider}, model={self.default_model})"

# Factory functions
def create_default_config() -> AgentConfig:
    """Create default agent configuration"""
    return AgentConfig()

def create_config_from_env() -> AgentConfig:
    """Create configuration loading all settings from environment"""
    config = AgentConfig()
    return config

def create_test_config() -> AgentConfig:
    """Create configuration optimized for testing"""
    return AgentConfig(
        agent_name="TestAgent",
        enable_web_search=False,  # Disable external calls in tests
        enable_memory=False,
        enable_rag=False,
        max_research_depth=1,
        research_timeout=5,
        memory_storage_path="./test_data/memory",
        rag_storage_path="./test_data/rag",
        cache_directory="./test_data/cache"
    )

# Global configuration instance
_global_config: Optional[AgentConfig] = None

def get_global_config() -> AgentConfig:
    """Get or create global configuration instance"""
    global _global_config
    if _global_config is None:
        _global_config = create_default_config()
    return _global_config

def set_global_config(config: AgentConfig):
    """Set global configuration instance"""
    global _global_config
    _global_config = config

# Example usage and testing
if __name__ == "__main__":
    # Create and test configuration
    config = create_default_config()
    
    print(f"🔧 Agent Config: {config}")
    print(f"📊 LLM Config: {config.get_llm_config()}")
    print(f"🧠 RAG Config: {config.get_rag_config()}")
    print(f"💭 Memory Config: {config.get_memory_config()}")
    
    # Validate configuration
    issues = config.validate()
    if issues:
        print(f"⚠️ Configuration issues:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print(f"✅ Configuration is valid")
    
    # Test serialization
    config_dict = config.to_dict()
    print(f"📄 Config dict keys: {list(config_dict.keys())}")
    
    # Test creation from dict
    new_config = AgentConfig.from_dict(config_dict)
    print(f"🔄 Recreated config: {new_config}")