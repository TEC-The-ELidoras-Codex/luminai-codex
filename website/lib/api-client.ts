import type {
  ChatStreamPayload,
  DashboardPayload,
  NotebookPayload,
  PersonaPresence,
} from "@/lib/types/resonance";

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ResonanceApiClient {
  readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private resolve(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (!path.startsWith("/")) {
      return `${this.baseUrl}/${path}`;
    }
    return `${this.baseUrl}${path}`;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(this.resolve(path), {
      ...init,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${path}`);
    }
    return (await response.json()) as T;
  }

  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const response = await fetch(this.resolve(path), {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      body: JSON.stringify(body ?? {}),
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${path}`);
    }
    return (await response.json()) as T;
  }

  createEventSource(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): EventSource {
    if (typeof window === "undefined") {
      throw new Error("EventSource can only be created in the browser context");
    }
    const url = new URL(this.resolve(path));
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return new EventSource(url.toString());
  }
}

export const apiClient = new ResonanceApiClient();

export function fetchDashboardPayload() {
  return apiClient.get<DashboardPayload>("/api/resonance/dashboard");
}

export function fetchNotebookPayload() {
  return apiClient.get<NotebookPayload>("/api/codex/notebook");
}

export function fetchPersonaPresence() {
  return apiClient.get<{ personas: PersonaPresence[] }>("/api/harmony/persona-presence");
}

export function updatePersonaPresence(payload: {
  personaId: string;
  status: PersonaPresence["status"];
  sessionsDelta?: number;
}) {
  return apiClient.post<{ personas: PersonaPresence[] }>("/api/harmony/persona-presence", payload);
}

export interface ChatStreamOptions {
  readonly territory?: string;
  readonly onPayload: (payload: ChatStreamPayload) => void;
  readonly onError?: (event: Event) => void;
}

export function connectChatStream(options: ChatStreamOptions) {
  if (typeof window === "undefined") return undefined;
  const source = apiClient.createEventSource("/api/harmony/chat/stream", {
    territory: options.territory,
  });

  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as ChatStreamPayload;
      options.onPayload(payload);
    } catch (error) {
      console.error("Failed to parse chat payload", error);
    }
  };

  source.onerror = (event) => {
    source.close();
    options.onError?.(event);
  };

  return source;
}
