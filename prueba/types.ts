
export enum AgentRole {
  ARCHITECT = 'ARCHITECT',
  SKEPTIC = 'SKEPTIC',
  MODERATOR = 'MODERATOR'
}

export interface Message {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
}

export interface DebateState {
  id: string;
  sourceText: string;
  fileName: string | null;
  history: Message[];
  isGenerating: boolean;
  hasConcluded: boolean;
}

export interface SavedDebate {
  id: string;
  title: string;
  date: number;
  history: Message[];
  sourceText: string;
}
