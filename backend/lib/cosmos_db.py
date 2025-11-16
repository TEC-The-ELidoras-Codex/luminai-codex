"""Azure Cosmos DB integration layer for LuminAI Platform.

Singleton-style client providing simple session/message persistence.
Gracefully degrades (no exceptions) if credentials are absent.

Data Model (container: sessions):
  Partition Key: /sessionId
  Item:
    {
      "id": "<sessionId>:<iso timestamp>",
      "sessionId": "<sessionId>",
      "role": "user" | "assistant",
      "content": "<message text>",
      "timestamp": "<ISO8601 UTC>",
      "metrics": { ... resonance metrics ... }
    }

Best Practices Applied:
- Single CosmosClient instance (avoid re-instantiation overhead)
- High-cardinality partition key (sessionId) to distribute load
- Defensive retries on transient 429 / network issues (basic loop) — could be
  replaced with SDK built-in retry policies if needed
- Lazy creation of database & container (idempotent)
"""
from __future__ import annotations

import os
import logging
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

try:
    from azure.cosmos import CosmosClient, PartitionKey, exceptions
except ImportError:  # azure-cosmos may not be installed in some minimal envs yet
    CosmosClient = None  # type: ignore
    PartitionKey = None  # type: ignore
    exceptions = None  # type: ignore

logger = logging.getLogger(__name__)

_DEFAULT_DB = os.getenv("COSMOS_DB_DATABASE", "luminai_codex")
_DEFAULT_CONTAINER = os.getenv("COSMOS_DB_CONTAINER", "sessions")

class CosmosDB:
    def __init__(self):
        self.endpoint = os.getenv("COSMOS_DB_ENDPOINT")
        self.key = os.getenv("COSMOS_DB_KEY")
        self.database_name = _DEFAULT_DB
        self.container_name = _DEFAULT_CONTAINER
        self.client = None
        self.database = None
        self.container = None
        self.connected = False
        self._last_latency_ms: Optional[float] = None
        self._last_status: Optional[int] = None

        if not (self.endpoint and self.key and CosmosClient):
            logger.info("CosmosDB not configured (missing endpoint/key or library). Running in degraded mode.")
            return
        try:
            start = time.time()
            self.client = CosmosClient(self.endpoint, credential=self.key)
            self.database = self._get_or_create_db(self.database_name)
            self.container = self._get_or_create_container(self.container_name)
            self.connected = True
            self._last_latency_ms = (time.time() - start) * 1000.0
            logger.info(
                f"✅ CosmosDB connected: db={self.database_name} container={self.container_name} "
                f"(latency={self._last_latency_ms:.1f}ms)"
            )
        except Exception as e:
            logger.warning(f"⚠️ CosmosDB initialization failed: {e}")
            self.connected = False

    # ------------------------------------------------------------------
    def _get_or_create_db(self, name: str):
        try:
            return self.client.create_database_if_not_exists(id=name)
        except Exception as e:
            logger.error(f"Failed to create/get database '{name}': {e}")
            raise

    def _get_or_create_container(self, name: str):
        try:
            return self.database.create_container_if_not_exists(
                id=name,
                partition_key=PartitionKey(path="/sessionId"),
                offer_throughput=400  # starter RU; adjust based on telemetry
            )
        except Exception as e:
            logger.error(f"Failed to create/get container '{name}': {e}")
            raise

    # ------------------------------------------------------------------
    def store_message(self, session_id: str, role: str, content: str, metrics: Dict[str, Any]):
        if not self.connected:
            return
        item = {
            "id": f"{session_id}:{datetime.utcnow().isoformat()}",
            "sessionId": session_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "metrics": metrics,
        }
        for attempt in range(3):
            try:
                self.container.create_item(body=item)
                self._last_status = 201
                return
            except Exception as e:
                if hasattr(e, 'status_code') and getattr(e, 'status_code') == 429 and attempt < 2:
                    logger.warning("CosmosDB RU throttled (429). Retrying...")
                    time.sleep(0.5 * (attempt + 1))
                else:
                    logger.warning(f"CosmosDB store_message failed: {e}")
                    self._last_status = getattr(e, 'status_code', None)
                    return

    def get_session_history(self, session_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        if not self.connected:
            return []
        query = "SELECT * FROM c WHERE c.sessionId = @sid ORDER BY c.timestamp DESC"
        parameters = [
            {"name": "@sid", "value": session_id}
        ]
        try:
            items = list(self.container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=False
            ))
            # Return in chronological order (oldest first)
            items_sorted = sorted(items, key=lambda x: x.get("timestamp", ""))
            # Map to messages expected by build_message_history (role/content)
            messages = [{"role": i.get("role", "user"), "content": i.get("content", "")} for i in items_sorted[-limit:]]
            return messages
        except Exception as e:
            logger.warning(f"CosmosDB get_session_history failed: {e}")
            return []

    # ------------------------------------------------------------------
    def health(self) -> Dict[str, Any]:
        """Return lightweight health diagnostics for readiness endpoint."""
        return {
            "configured": bool(self.endpoint and self.key),
            "connected": self.connected,
            "database": self.database_name if self.connected else None,
            "container": self.container_name if self.connected else None,
            "last_latency_ms": self._last_latency_ms,
            "last_status": self._last_status,
        }

    def ready(self) -> bool:
        """Boolean readiness check (container exists & client instantiated)."""
        return self.connected and self.container is not None

# Global instance
db_instance = CosmosDB()
cosmos_db = db_instance

__all__ = ["CosmosDB", "cosmos_db"]
