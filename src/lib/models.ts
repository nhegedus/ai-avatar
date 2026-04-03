export const MODELS = {
  "nano-banana": {
    label: "Nano Banana 2",
    provider: "fal",
    description: "~$0.08/image",
  },
  "gemini-flash": {
    label: "Gemini Flash",
    provider: "gemini",
    description: "~$0.039/image",
  },
  "kling-o1": {
    label: "Kling O1",
    provider: "fal",
    description: "~$0.028/image",
  },
} as const;

export type ModelId = keyof typeof MODELS;
export const DEFAULT_MODEL: ModelId = "nano-banana";
