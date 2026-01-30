export type ServerLog = {
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG";
  message: string;
};

export type Server = {
  name: string;
  version: string;
  isActive: boolean;
  last_played: string;
  ram_limit: number;
};

export type Difficulty = "peaceful" | "easy" | "normal" | "hard";

export type GameMode = "survival" | "creative";