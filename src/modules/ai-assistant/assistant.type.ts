export interface AssistantChatInput {
  sessionId?: string;
  message: string;
}

export interface AssistantContext {
  profile: {
    name: string;
    title: string;
    bio: string;
    shortBio: string;
    location?: string;
    availableForWork: boolean;
    socials: Record<string, string | null | undefined>;
  } | null;
  projects: Array<{
    title: string;
    slug: string;
    shortDesc: string;
    technologies: string[];
    liveUrl?: string | null;
    repoUrl?: string | null;
  }>;
  skills: Record<string, string[]>;
  services: Array<{ title: string; slug: string; description: string }>;
}

export interface AssistantReply {
  sessionId: string;
  answer: string;
  provider: string;
  tokensIn: number;
  tokensOut: number;
  contextUsed: {
    projects: number;
    skills: number;
    services: number;
    hasProfile: boolean;
  };
}
