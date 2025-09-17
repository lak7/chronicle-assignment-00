// Simple in-memory config for AI instructions toggle and text
export type AiConfig = {
  instructionsEnabled: boolean;
  instructionsText: string;
  temperature: number;
  maxTokens: number;
  model: string;
};

const state: AiConfig = {
  instructionsEnabled: false,
  instructionsText: '',
  temperature: 0.8,
  maxTokens: 128,
  model: 'gpt-4o-mini',
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

export function setAiTemperature(value: number) {
  // Clamp between 0 and 2 for OpenAI-compatible temperature
  const clamped = Math.max(0, Math.min(2, value));
  state.temperature = clamped;
}

export function setAiMaxTokens(value: number) {
  // Reasonable guard rails for token count in this app
  const clamped = Math.max(1, Math.min(4096, Math.floor(value)));
  state.maxTokens = clamped;
}

export function setAiModel(model: string) {
  state.model = model;
}


