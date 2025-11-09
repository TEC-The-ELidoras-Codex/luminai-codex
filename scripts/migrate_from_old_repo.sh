#!/bin/bash
# The Elidoras Codex - Migration Script
# This script helps migrate components from the old tec-tgcr repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="luminai-codex"
OLD_REPO_PATH="${OLD_REPO_PATH:-../tec-tgcr}"
BASE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}The Elidoras Codex - Migration Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create directory structure
create_directory_structure() {
    print_status "Creating directory structure..."
    
    directories=(
        "src/core/resonance"
        "src/core/memory"
        "src/core/narrative"
        "src/core/quantum"
        "src/agents/orchestrator"
        "src/agents/specialists"
        "src/agents/personas"
        "src/integrations/azure"
        "src/integrations/openai"
        "src/integrations/anthropic"
        "src/integrations/databases"
        "src/interfaces/web"
        "src/interfaces/cli"
        "src/interfaces/api"
        "src/interfaces/mobile"
        "src/data/ingestion"
        "src/data/processing"
        "src/data/storage"
        "src/data/validation"
        "src/utils"
        "tests/unit"
        "tests/integration"
        "tests/e2e"
        "tests/performance"
        "tests/fixtures"
        "docs/architecture/ADR"
        "docs/architecture/diagrams"
        "docs/architecture/specifications"
        "docs/api"
        "docs/development"
        "docs/deployment"
        "docs/user"
        "docs/research"
        "scripts/deployment"
        "scripts/migration"
        "scripts/maintenance"
        "scripts/development"
        "infrastructure/terraform"
        "infrastructure/bicep"
        "infrastructure/docker"
        "infrastructure/kubernetes"
        "research/prototypes"
        "research/benchmarks"
        "research/experiments"
        "research/notebooks"
        "tools/generators"
        "tools/validators"
        "tools/analyzers"
        "config/environments"
        "config/models"
        "config/services"
        "config/schemas"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$BASE_PATH/$dir"
        echo "Created: $dir"
    done
    
    print_status "Directory structure created successfully."
}

# Function to check if old repository exists
check_old_repository() {
    if [ ! -d "$OLD_REPO_PATH" ]; then
        print_error "Old repository not found at: $OLD_REPO_PATH"
        print_warning "Please set OLD_REPO_PATH environment variable or place the old repository at $OLD_REPO_PATH"
        return 1
    fi
    
    print_status "Old repository found at: $OLD_REPO_PATH"
    return 0
}

# Function to migrate configuration files
migrate_configurations() {
    print_status "Migrating configuration files..."
    
    # Check for common configuration files in old repository
    config_files=(
        "config.json"
        "app.config.json"
        ".env.example"
        "docker-compose.yml"
        "requirements.txt"
        "package.json"
        "pyproject.toml"
    )
    
    for file in "${config_files[@]}"; do
        if [ -f "$OLD_REPO_PATH/$file" ]; then
            print_status "Copying $file..."
            cp "$OLD_REPO_PATH/$file" "$BASE_PATH/"
        else
            print_warning "$file not found in old repository"
        fi
    done
}

# Function to migrate core AI components
migrate_ai_components() {
    print_status "Migrating AI components..."
    
    # List of potential AI component directories
    ai_dirs=(
        "ai"
        "src/ai"
        "core"
        "src/core"
        "agents"
        "src/agents"
        "models"
        "src/models"
        "ml"
        "src/ml"
    )
    
    for dir in "${ai_dirs[@]}"; do
        if [ -d "$OLD_REPO_PATH/$dir" ]; then
            print_status "Found AI components in: $dir"
            cp -r "$OLD_REPO_PATH/$dir"/* "$BASE_PATH/src/core/" 2>/dev/null || print_warning "Failed to copy some files from $dir"
        fi
    done
}

# Function to migrate documentation
migrate_documentation() {
    print_status "Migrating documentation..."
    
    doc_dirs=(
        "docs"
        "documentation"
        "README.md"
        "CONTRIBUTING.md"
        "CHANGELOG.md"
    )
    
    for item in "${doc_dirs[@]}"; do
        if [ -e "$OLD_REPO_PATH/$item" ]; then
            if [ -d "$OLD_REPO_PATH/$item" ]; then
                print_status "Copying documentation directory: $item"
                cp -r "$OLD_REPO_PATH/$item"/* "$BASE_PATH/docs/" 2>/dev/null || print_warning "Failed to copy some documentation files"
            else
                print_status "Copying documentation file: $item"
                cp "$OLD_REPO_PATH/$item" "$BASE_PATH/"
            fi
        fi
    done
}

# Function to migrate scripts
migrate_scripts() {
    print_status "Migrating scripts..."
    
    script_dirs=(
        "scripts"
        "tools"
        "utilities"
        "bin"
    )
    
    for dir in "${script_dirs[@]}"; do
        if [ -d "$OLD_REPO_PATH/$dir" ]; then
            print_status "Found scripts in: $dir"
            find "$OLD_REPO_PATH/$dir" -type f -name "*.py" -o -name "*.sh" -o -name "*.js" | while read -r file; do
                filename=$(basename "$file")
                if [ "$filename" != "sync_bitwarden_secrets.py" ]; then  # Skip if already exists
                    cp "$file" "$BASE_PATH/scripts/"
                    print_status "Copied script: $filename"
                fi
            done
        fi
    done
}

# Function to migrate infrastructure code
migrate_infrastructure() {
    print_status "Migrating infrastructure code..."
    
    infra_dirs=(
        "infrastructure"
        "infra"
        "terraform"
        "bicep"
        "kubernetes"
        "k8s"
        "docker"
    )
    
    for dir in "${infra_dirs[@]}"; do
        if [ -d "$OLD_REPO_PATH/$dir" ]; then
            print_status "Found infrastructure code in: $dir"
            cp -r "$OLD_REPO_PATH/$dir"/* "$BASE_PATH/infrastructure/" 2>/dev/null || print_warning "Failed to copy some infrastructure files"
        fi
    done
}

# Function to migrate test files
migrate_tests() {
    print_status "Migrating test files..."
    
    test_dirs=(
        "tests"
        "test"
        "testing"
        "__tests__"
    )
    
    for dir in "${test_dirs[@]}"; do
        if [ -d "$OLD_REPO_PATH/$dir" ]; then
            print_status "Found tests in: $dir"
            cp -r "$OLD_REPO_PATH/$dir"/* "$BASE_PATH/tests/" 2>/dev/null || print_warning "Failed to copy some test files"
        fi
    done
}

# Function to create essential files
create_essential_files() {
    print_status "Creating essential files..."
    
    # Create .env.example if it doesn't exist
    if [ ! -f "$BASE_PATH/.env.example" ]; then
        cat > "$BASE_PATH/.env.example" << 'EOF'
# The Elidoras Codex - Environment Variables Template

# Bitwarden Configuration
BW_PASSWORD=your_bitwarden_master_password
BW_SESSION=your_bitwarden_session_token

# Azure Configuration
AZURE_SUBSCRIPTION_ID=your_azure_subscription_id
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id

# Database Configuration
COSMOS_DB_ENDPOINT=your_cosmos_db_endpoint
COSMOS_DB_KEY=your_cosmos_db_key
COSMOS_DB_DATABASE=luminai_codex

# AI Model Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key

# Application Configuration
ENVIRONMENT=development
LOG_LEVEL=info
DEBUG=false

# Security Configuration
SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
EOF
        print_status "Created .env.example"
    fi
    
    # Create basic requirements.txt if it doesn't exist
    if [ ! -f "$BASE_PATH/requirements.txt" ]; then
        cat > "$BASE_PATH/requirements.txt" << 'EOF'
# The Elidoras Codex - Python Dependencies

# Core framework
fastapi>=0.104.1
uvicorn>=0.24.0
pydantic>=2.5.0
python-dotenv>=1.0.0

# Azure integrations
azure-cosmos>=4.5.1
azure-identity>=1.15.0
azure-storage-blob>=12.19.0
azure-keyvault-secrets>=4.7.0

# AI/ML libraries
openai>=1.3.9
anthropic>=0.7.8
langchain>=0.0.350
numpy>=1.24.3
pandas>=2.1.4
scikit-learn>=1.3.2

# Database
pymongo>=4.6.0
redis>=5.0.1

# Web framework
jinja2>=3.1.2
python-multipart>=0.0.6

# Development tools
pytest>=7.4.3
black>=23.11.0
flake8>=6.1.0
mypy>=1.7.1

# Utilities
requests>=2.31.0
click>=8.1.7
rich>=13.7.0
loguru>=0.7.2
EOF
        print_status "Created requirements.txt"
    fi
    
    # Create basic Dockerfile if it doesn't exist
    if [ ! -f "$BASE_PATH/Dockerfile" ]; then
        cat > "$BASE_PATH/Dockerfile" << 'EOF'
# The Elidoras Codex - Container Definition
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV ENVIRONMENT=production

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF
        print_status "Created Dockerfile"
    fi
}

# Function to set up git configuration
setup_git() {
    print_status "Setting up Git configuration..."
    
    # Update .gitignore
    cat >> "$BASE_PATH/.gitignore" << 'EOF'

# The Elidoras Codex specific ignores
secrets-local/
*.key
*.pem
*.p12
.env.*
!.env.example

# AI/ML artifacts
*.model
*.pkl
*.joblib
models/
checkpoints/

# Development
.pytest_cache/
.coverage
htmlcov/
.tox/
.cache/

# OS specific
.DS_Store
Thumbs.db

# IDE specific
.vscode/settings.json
.idea/workspace.xml
*.swp
*.swo

# Build artifacts
build/
dist/
*.egg-info/
EOF
    
    print_status "Updated .gitignore"
}

# Function to run post-migration setup
post_migration_setup() {
    print_status "Running post-migration setup..."
    
    # Make scripts executable
    find "$BASE_PATH/scripts" -name "*.sh" -exec chmod +x {} \;
    
    # Create Python __init__.py files
    find "$BASE_PATH/src" -type d -exec touch {}/__init__.py \;
    find "$BASE_PATH/tests" -type d -exec touch {}/__init__.py \;
    
    print_status "Post-migration setup completed."
}

# Function to display migration summary
display_migration_summary() {
    echo ""
    echo -e "${BLUE}Migration Summary${NC}"
    echo -e "${BLUE}=================${NC}"
    echo ""
    
    # Count migrated files
    total_files=$(find "$BASE_PATH" -type f | wc -l)
    python_files=$(find "$BASE_PATH" -name "*.py" | wc -l)
    config_files=$(find "$BASE_PATH" -name "*.json" -o -name "*.yml" -o -name "*.yaml" | wc -l)
    
    echo -e "Total files: ${GREEN}$total_files${NC}"
    echo -e "Python files: ${GREEN}$python_files${NC}"
    echo -e "Configuration files: ${GREEN}$config_files${NC}"
    echo ""
    
    print_status "Migration completed successfully!"
    print_warning "Next steps:"
    echo "  1. Review migrated files and resolve any conflicts"
    echo "  2. Set up your environment: python -m venv venv && source venv/bin/activate"
    echo "  3. Install dependencies: pip install -r requirements.txt"
    echo "  4. Configure Bitwarden: python scripts/sync_bitwarden_secrets.py --env dev"
    echo "  5. Run tests: pytest tests/"
    echo ""
}

# Main migration function
main() {
    echo "Starting migration process..."
    echo ""
    
    # Check if we should create directory structure
    if [ "$1" = "--create-structure" ] || [ ! -d "$BASE_PATH/src" ]; then
        create_directory_structure
    fi
    
    # Check if old repository is available for migration
    if check_old_repository; then
        migrate_configurations
        migrate_ai_components
        migrate_documentation
        migrate_scripts
        migrate_infrastructure
        migrate_tests
    else
        print_warning "Skipping file migration - old repository not available"
    fi
    
    # Always create essential files and setup
    create_essential_files
    setup_git
    post_migration_setup
    
    display_migration_summary
}

# Run main function with all arguments
main "$@"