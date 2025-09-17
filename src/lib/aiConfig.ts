// Simple in-memory config for AI instructions toggle and text
export type AiConfig = {
  instructionsEnabled: boolean;
  instructionsText: string;
};

const state: AiConfig = {
  instructionsEnabled: false,
  instructionsText: '',
};

export function setAiInstructionsEnabled(enabled: boolean) {
  state.instructionsEnabled = enabled;
}

export function setAiInstructionsText(text: string) {
  state.instructionsText = text;
}

export function getAiConfig(): AiConfig {
  return state;
}


