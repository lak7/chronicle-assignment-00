// Simple mock AI generator that resolves after 3 seconds with random text

const SAMPLES: string[] = [
  "In a world where ideas shape reality, the smallest spark can ignite change.",
  "As the rain tapered off, the city exhaled, neon reflections stitching streets together.",
  "What happens next is not fate but choice, written one deliberate line at a time.",
  "She paused, letting silence do the heavy lifting before the truth arrived.",
  "Meanwhile, distant thunder rehearsed a promise no one could ignore any longer.",
  "Momentum is built quietly, accumulating in the margins until it becomes obvious.",
  "There was a rhythm to the work—draft, refine, repeat—like tides learning the shore.",
];

export async function generateMockContinuation(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const choice = Math.floor(Math.random() * SAMPLES.length);
  return SAMPLES[choice];
}


