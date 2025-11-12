"""
Resonance Notebook Module

This module provides Jupyter notebook-like functionality for the 
resonance system, enabling interactive exploration of AI models,
data analysis, and collaborative research workflows.

Features:
- Interactive cell execution with multiple LLM backends
- Resonance field visualization and analysis
- Multi-model collaborative exploration
- Data visualization and charting
- Export to various formats (HTML, PDF, Markdown)
"""

import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum
import asyncio


class CellType(Enum):
    """Types of notebook cells"""
    CODE = "code"
    MARKDOWN = "markdown"
    RESONANCE = "resonance"  # Special cells for resonance analysis
    VISUALIZATION = "visualization"
    COLLABORATION = "collaboration"  # Multi-LLM cells


class ExecutionStatus(Enum):
    """Execution status for cells"""
    NOT_EXECUTED = "not_executed"
    EXECUTING = "executing"
    COMPLETED = "completed"
    ERROR = "error"
    CANCELLED = "cancelled"


@dataclass
class CellOutput:
    """Output from cell execution"""
    output_type: str  # text, image, html, json, error
    content: Any
    timestamp: datetime
    execution_count: int
    mime_type: str = "text/plain"
    
    def to_dict(self) -> Dict:
        return {
            "output_type": self.output_type,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "execution_count": self.execution_count,
            "mime_type": self.mime_type
        }


@dataclass
class NotebookCell:
    """A single notebook cell"""
    cell_id: str
    cell_type: CellType
    source: str  # Cell content/code
    metadata: Dict[str, Any]
    outputs: List[CellOutput]
    execution_count: Optional[int] = None
    execution_status: ExecutionStatus = ExecutionStatus.NOT_EXECUTED
    
    def to_dict(self) -> Dict:
        return {
            "cell_id": self.cell_id,
            "cell_type": self.cell_type.value,
            "source": self.source,
            "metadata": self.metadata,
            "outputs": [output.to_dict() for output in self.outputs],
            "execution_count": self.execution_count,
            "execution_status": self.execution_status.value
        }


@dataclass
class ResonanceNotebook:
    """A resonance notebook containing multiple cells"""
    notebook_id: str
    name: str
    description: str
    cells: List[NotebookCell]
    metadata: Dict[str, Any]
    created_at: datetime
    modified_at: datetime
    version: str = "1.0.0"
    
    def to_dict(self) -> Dict:
        return {
            "notebook_id": self.notebook_id,
            "name": self.name,
            "description": self.description,
            "cells": [cell.to_dict() for cell in self.cells],
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "modified_at": self.modified_at.isoformat(),
            "version": self.version
        }
    
    def save_to_file(self, filepath: str) -> None:
        """Save notebook to JSON file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, indent=2)
    
    @classmethod
    def load_from_file(cls, filepath: str) -> 'ResonanceNotebook':
        """Load notebook from JSON file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return cls.from_dict(data)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'ResonanceNotebook':
        """Create notebook from dictionary"""
        cells = []
        for cell_data in data.get("cells", []):
            outputs = []
            for output_data in cell_data.get("outputs", []):
                outputs.append(CellOutput(
                    output_type=output_data["output_type"],
                    content=output_data["content"],
                    timestamp=datetime.fromisoformat(output_data["timestamp"]),
                    execution_count=output_data["execution_count"],
                    mime_type=output_data.get("mime_type", "text/plain")
                ))
            
            cell = NotebookCell(
                cell_id=cell_data["cell_id"],
                cell_type=CellType(cell_data["cell_type"]),
                source=cell_data["source"],
                metadata=cell_data.get("metadata", {}),
                outputs=outputs,
                execution_count=cell_data.get("execution_count"),
                execution_status=ExecutionStatus(cell_data.get("execution_status", "not_executed"))
            )
            cells.append(cell)
        
        return cls(
            notebook_id=data["notebook_id"],
            name=data["name"],
            description=data["description"],
            cells=cells,
            metadata=data.get("metadata", {}),
            created_at=datetime.fromisoformat(data["created_at"]),
            modified_at=datetime.fromisoformat(data["modified_at"]),
            version=data.get("version", "1.0.0")
        )


class ResonanceNotebookKernel:
    """
    Kernel for executing notebook cells with resonance capabilities
    
    This kernel can execute different types of cells:
    - Code cells using Python or other interpreters
    - Resonance cells for AI model interactions
    - Collaboration cells for multi-LLM sessions
    """
    
    def __init__(self):
        self.execution_count = 0
        self.namespace = {}  # Shared execution namespace
        self.llm_clients = {}  # LLM client connections
        self.active_sessions = {}  # Active collaboration sessions
    
    async def execute_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """
        Execute a notebook cell and return outputs
        
        Args:
            cell: The cell to execute
            
        Returns:
            List of outputs from cell execution
        """
        cell.execution_status = ExecutionStatus.EXECUTING
        self.execution_count += 1
        cell.execution_count = self.execution_count
        
        outputs = []
        
        try:
            if cell.cell_type == CellType.CODE:
                outputs = await self._execute_code_cell(cell)
            elif cell.cell_type == CellType.RESONANCE:
                outputs = await self._execute_resonance_cell(cell)
            elif cell.cell_type == CellType.COLLABORATION:
                outputs = await self._execute_collaboration_cell(cell)
            elif cell.cell_type == CellType.VISUALIZATION:
                outputs = await self._execute_visualization_cell(cell)
            elif cell.cell_type == CellType.MARKDOWN:
                outputs = await self._execute_markdown_cell(cell)
            else:
                raise ValueError(f"Unsupported cell type: {cell.cell_type}")
            
            cell.execution_status = ExecutionStatus.COMPLETED
            
        except Exception as e:
            error_output = CellOutput(
                output_type="error",
                content=str(e),
                timestamp=datetime.utcnow(),
                execution_count=self.execution_count,
                mime_type="text/plain"
            )
            outputs = [error_output]
            cell.execution_status = ExecutionStatus.ERROR
        
        cell.outputs = outputs
        return outputs
    
    async def _execute_code_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """Execute a Python code cell"""
        import io
        import sys
        from contextlib import redirect_stdout, redirect_stderr
        
        # Capture stdout and stderr
        stdout_buffer = io.StringIO()
        stderr_buffer = io.StringIO()
        
        outputs = []
        
        try:
            # Execute the code in the shared namespace
            with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
                exec(cell.source, self.namespace)
            
            # Capture stdout output
            stdout_content = stdout_buffer.getvalue()
            if stdout_content:
                outputs.append(CellOutput(
                    output_type="stream",
                    content=stdout_content,
                    timestamp=datetime.utcnow(),
                    execution_count=self.execution_count,
                    mime_type="text/plain"
                ))
            
            # Capture stderr output
            stderr_content = stderr_buffer.getvalue()
            if stderr_content:
                outputs.append(CellOutput(
                    output_type="stream",
                    content=stderr_content,
                    timestamp=datetime.utcnow(),
                    execution_count=self.execution_count,
                    mime_type="text/plain"
                ))
        
        except Exception as e:
            outputs.append(CellOutput(
                output_type="error",
                content=str(e),
                timestamp=datetime.utcnow(),
                execution_count=self.execution_count,
                mime_type="text/plain"
            ))
        
        return outputs
    
    async def _execute_resonance_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """Execute a resonance analysis cell"""
        # Parse resonance cell commands
        lines = cell.source.strip().split('\n')
        command = lines[0].strip()
        
        outputs = []
        
        if command.startswith("%%analyze"):
            # Analyze resonance patterns
            model = cell.metadata.get("model", "gpt-4")
            query = '\n'.join(lines[1:])
            
            result = await self._analyze_with_llm(model, query)
            
            outputs.append(CellOutput(
                output_type="text",
                content=result,
                timestamp=datetime.utcnow(),
                execution_count=self.execution_count,
                mime_type="text/markdown"
            ))
        
        elif command.startswith("%%visualize"):
            # Create resonance visualization
            viz_type = cell.metadata.get("visualization", "field_map")
            
            viz_data = await self._generate_visualization(viz_type, lines[1:])
            
            outputs.append(CellOutput(
                output_type="display_data",
                content=viz_data,
                timestamp=datetime.utcnow(),
                execution_count=self.execution_count,
                mime_type="application/json"
            ))
        
        return outputs
    
    async def _execute_collaboration_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """Execute a multi-LLM collaboration cell"""
        models = cell.metadata.get("models", ["claude-3-opus", "gpt-4-turbo", "grok-1"])
        query = cell.source.strip()
        
        outputs = []
        
        # Get responses from each model
        tasks = []
        for model in models:
            tasks.append(self._analyze_with_llm(model, query))
        
        responses = await asyncio.gather(*tasks)
        
        # Format collaborative output
        collaboration_result = {
            "query": query,
            "models": models,
            "responses": {},
            "synthesis": ""
        }
        
        for model, response in zip(models, responses):
            collaboration_result["responses"][model] = response
        
        # Simple synthesis (in practice would be more sophisticated)
        collaboration_result["synthesis"] = "Multi-model analysis completed. See individual responses above."
        
        outputs.append(CellOutput(
            output_type="display_data",
            content=collaboration_result,
            timestamp=datetime.utcnow(),
            execution_count=self.execution_count,
            mime_type="application/json"
        ))
        
        return outputs
    
    async def _execute_visualization_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """Execute a visualization cell"""
        viz_code = cell.source
        
        # In a real implementation, this would use matplotlib, plotly, etc.
        # For now, return a placeholder
        viz_result = {
            "type": "chart",
            "title": "Resonance Visualization",
            "data": [1, 2, 3, 4, 5],
            "labels": ["A", "B", "C", "D", "E"]
        }
        
        return [CellOutput(
            output_type="display_data",
            content=viz_result,
            timestamp=datetime.utcnow(),
            execution_count=self.execution_count,
            mime_type="application/json"
        )]
    
    async def _execute_markdown_cell(self, cell: NotebookCell) -> List[CellOutput]:
        """Execute a markdown cell (render to HTML)"""
        # In a real implementation, would use a markdown processor
        html_content = f"<div class='markdown-cell'>{cell.source}</div>"
        
        return [CellOutput(
            output_type="display_data",
            content=html_content,
            timestamp=datetime.utcnow(),
            execution_count=self.execution_count,
            mime_type="text/html"
        )]
    
    async def _analyze_with_llm(self, model: str, query: str) -> str:
        """Analyze text with a specified LLM model"""
        # This would integrate with the multi-LLM system
        # For now, return a placeholder response
        return f"[{model}] Analysis of: {query[:50]}..."
    
    async def _generate_visualization(self, viz_type: str, data: List[str]) -> Dict:
        """Generate a visualization based on type and data"""
        return {
            "type": viz_type,
            "config": {"title": "Resonance Field Visualization"},
            "data": data
        }


class ResonanceNotebookManager:
    """
    Manager for creating and managing resonance notebooks
    """
    
    def __init__(self):
        self.notebooks: Dict[str, ResonanceNotebook] = {}
        self.kernel = ResonanceNotebookKernel()
    
    def create_notebook(
        self, 
        name: str, 
        description: str = "",
        template: str = "basic"
    ) -> ResonanceNotebook:
        """
        Create a new resonance notebook
        
        Args:
            name: Notebook name
            description: Notebook description
            template: Template type (basic, research, collaboration)
            
        Returns:
            New ResonanceNotebook instance
        """
        notebook_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        
        # Create initial cells based on template
        cells = self._create_template_cells(template)
        
        notebook = ResonanceNotebook(
            notebook_id=notebook_id,
            name=name,
            description=description,
            cells=cells,
            metadata={
                "template": template,
                "created_by": "resonance_system",
                "tags": []
            },
            created_at=timestamp,
            modified_at=timestamp
        )
        
        self.notebooks[notebook_id] = notebook
        return notebook
    
    def _create_template_cells(self, template: str) -> List[NotebookCell]:
        """Create initial cells based on template"""
        cells = []
        
        if template == "basic":
            # Basic notebook with welcome cell
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.MARKDOWN,
                source="# Welcome to Resonance Notebook\n\nThis is an interactive notebook for AI exploration and analysis.",
                metadata={},
                outputs=[]
            ))
            
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.CODE,
                source="# Your first code cell\nprint('Hello, Resonance!')",
                metadata={},
                outputs=[]
            ))
        
        elif template == "research":
            # Research-focused notebook
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.MARKDOWN,
                source="# Research Notebook\n\n## Objective\n[Describe your research objective here]",
                metadata={},
                outputs=[]
            ))
            
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.RESONANCE,
                source="%%analyze\nWhat are the key aspects of [your research topic]?",
                metadata={"model": "claude-3-opus"},
                outputs=[]
            ))
        
        elif template == "collaboration":
            # Multi-LLM collaboration notebook
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.MARKDOWN,
                source="# Multi-LLM Collaboration\n\nThis notebook enables collaboration between multiple AI models.",
                metadata={},
                outputs=[]
            ))
            
            cells.append(NotebookCell(
                cell_id=str(uuid.uuid4()),
                cell_type=CellType.COLLABORATION,
                source="Analyze this problem from different perspectives: [your problem statement]",
                metadata={"models": ["claude-3-opus", "gpt-4-turbo", "grok-1"]},
                outputs=[]
            ))
        
        return cells
    
    async def execute_notebook(self, notebook_id: str) -> Dict[str, Any]:
        """Execute all cells in a notebook"""
        if notebook_id not in self.notebooks:
            raise ValueError(f"Notebook not found: {notebook_id}")
        
        notebook = self.notebooks[notebook_id]
        results = {"notebook_id": notebook_id, "execution_results": []}
        
        for cell in notebook.cells:
            if cell.cell_type != CellType.MARKDOWN:  # Skip markdown cells
                outputs = await self.kernel.execute_cell(cell)
                results["execution_results"].append({
                    "cell_id": cell.cell_id,
                    "outputs": [output.to_dict() for output in outputs]
                })
        
        notebook.modified_at = datetime.utcnow()
        return results
    
    def get_notebook(self, notebook_id: str) -> Optional[ResonanceNotebook]:
        """Get a notebook by ID"""
        return self.notebooks.get(notebook_id)
    
    def list_notebooks(self) -> List[Dict[str, str]]:
        """List all notebooks"""
        return [
            {
                "notebook_id": nb.notebook_id,
                "name": nb.name,
                "description": nb.description,
                "created_at": nb.created_at.isoformat()
            }
            for nb in self.notebooks.values()
        ]


# Factory functions
def create_notebook_manager() -> ResonanceNotebookManager:
    """Create a new notebook manager"""
    return ResonanceNotebookManager()


def create_notebook(name: str, description: str = "", template: str = "basic") -> ResonanceNotebook:
    """Create a new notebook (convenience function)"""
    manager = create_notebook_manager()
    return manager.create_notebook(name, description, template)


# CLI interface for testing
async def main():
    """Test the resonance notebook functionality"""
    manager = create_notebook_manager()
    
    # Create a test notebook
    notebook = manager.create_notebook("Test Notebook", "Testing resonance notebook features")
    
    print(f"✅ Created notebook: {notebook.name}")
    print(f"Notebook ID: {notebook.notebook_id}")
    print(f"Number of cells: {len(notebook.cells)}")
    
    # Execute the notebook
    results = await manager.execute_notebook(notebook.notebook_id)
    print(f"✅ Executed notebook with {len(results['execution_results'])} cells")


# Ingestion module for backward compatibility
class ingest:
    """Ingest functionality for resonance notebooks"""
    
    @staticmethod
    def find_latest_ingest():
        """Find the latest ingestion file"""
        import os
        from pathlib import Path
        
        ingest_dir = Path("data/digital_assets/brand/ingests")
        if not ingest_dir.exists():
            return None
        
        json_files = list(ingest_dir.glob("*.json"))
        if not json_files:
            return None
        
        # Return the newest file by modification time
        latest = max(json_files, key=lambda f: f.stat().st_mtime)
        return str(latest)
    
    @staticmethod
    def load_ingest(filepath: str):
        """Load an ingest file"""
        import json
        with open(filepath, 'r') as f:
            return json.load(f)

if __name__ == "__main__":
    asyncio.run(main())