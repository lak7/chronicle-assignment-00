// Simple mock AI generator that resolves after 3 seconds with random text

const SAMPLES: string[] = [
  "Pussy",
];

export async function generateMockContinuation(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const choice = Math.floor(Math.random() * SAMPLES.length);
  return SAMPLES[choice];
}


