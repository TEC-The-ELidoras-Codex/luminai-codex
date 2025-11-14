export type PersonaStatus = "online" | "away" | "offline" | "escalating";

export interface PersonaPresence {
  readonly id: string;
  readonly label: string;
  readonly status: PersonaStatus;
  readonly frequency: string;
  readonly usage: {
    readonly sessions: number;
    readonly uptimeMinutes: number;
  };
  readonly lastSeen: string;
  readonly notes?: string;
}

export interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly trend: string;
  readonly descriptor: string;
}

export interface DashboardQueueItem {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly actions: readonly string[];
}

export interface DashboardPayload {
  readonly metrics: readonly DashboardMetric[];
  readonly queue: readonly DashboardQueueItem[];
  readonly systemStatus: readonly string[];
  readonly witnessFeed: readonly string[];
  readonly resonanceScore: number;
  readonly personaPresence: readonly PersonaPresence[];
}

export interface ChatMessage {
  readonly id: string;
  readonly role: string;
  readonly tone?: string;
  readonly content: string;
  readonly timestamp: string;
  readonly citationIds?: readonly string[];
  readonly territory?: ShadowTerritoryKey;
}

export interface ChatStatusPayload {
  readonly kind: "status";
  readonly label: string;
  readonly value: string;
}

export interface ChatMessagePayload extends ChatMessage {
  readonly kind: "message";
}

export type ChatStreamPayload = ChatMessagePayload | ChatStatusPayload;

export interface NotebookEntry {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly lastUpdated: string;
}

export interface EquationVariable {
  readonly symbol: string;
  readonly value: string;
  readonly meaning: string;
}

export interface NotebookTrace {
  readonly equation: string;
  readonly confidence: number;
  readonly variables: readonly EquationVariable[];
  readonly recommendation: string;
}

export interface NotebookPayload {
  readonly entries: readonly NotebookEntry[];
  readonly researchPulse: readonly string[];
  readonly trace: NotebookTrace;
  readonly composeHints: readonly string[];
}

export interface ShadowContextPackage {
  readonly purpose: string;
  readonly intent: string;
  readonly memoryPolicy: string;
  readonly resources: readonly string[];
  readonly redLines: readonly string[];
  readonly escalation: readonly {
    readonly label: string;
    readonly guidance: string;
  }[];
  readonly references: readonly string[];
}

export type ShadowTerritoryKey =
  | "sexual_complexity"
  | "suicidal_ideation"
  | "rage_violence"
  | "taboo_emotions"
  | "ai_relationships";

export interface ShadowTerritorySpec {
  readonly key: ShadowTerritoryKey;
  readonly title: string;
  readonly summary: string;
  readonly contextPackage: ShadowContextPackage;
}
