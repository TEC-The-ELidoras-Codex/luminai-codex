"use client";

import { useEffect, useRef, useState } from "react";

import { connectChatStream } from "@/lib/api-client";
import type {
  ChatMessagePayload,
  ChatStatusPayload,
  ShadowTerritoryKey,
} from "@/lib/types/resonance";

export interface UseChatStreamOptions {
  readonly territory?: ShadowTerritoryKey;
  readonly enabled?: boolean;
}

export function useChatStream({ territory, enabled = true }: UseChatStreamOptions) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [status, setStatus] = useState<ChatStatusPayload | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const streamRef = useRef<EventSource | undefined>();

  useEffect(() => {
    if (!enabled) {
      streamRef.current?.close();
      setStatus(undefined);
      setMessages([]);
      return;
    }

    streamRef.current?.close();
    setError(undefined);
    const source = connectChatStream({
      territory,
      onPayload: (payload) => {
        if (payload.kind === "message") {
          setMessages((prev) => [...prev.slice(-49), payload]);
        } else {
          setStatus(payload);
        }
      },
      onError: () => {
        setError(new Error("Stream disconnected"));
      },
    });

    streamRef.current = source;

    return () => {
      source?.close();
    };
  }, [territory, enabled]);

  return { messages, status, error } as const;
}
