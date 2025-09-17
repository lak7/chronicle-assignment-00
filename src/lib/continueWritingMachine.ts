import { fromPromise, setup } from 'xstate';
import { generateMockContinuation } from './aiMock';
import { generateContinuationWithOpenAI } from './openaiWriter';

export interface ContinueWritingContext {
  generatedText: string;
  errorMessage?: string;
}

export type ContinueWritingEvents =
  | { type: 'GENERATE'; input: { existingText: string } }
  | { type: 'RESET' };

export const continueWritingMachine = setup({
  types: {
    context: {} as ContinueWritingContext,
    events: {} as ContinueWritingEvents,
  },
  actors: {
    generateText: fromPromise(async ({ input }: { input: { existingText: string } }) => {
      return generateContinuationWithOpenAI(input.existingText);
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7ALgS3QVzAHUAnbHdKAOmwgBswBiAcQFEA5FgJQEEAVFgNoAGALqJQAB1Swy2DOJAAPRAGYAHAFZKGjQBYAbAE4A7MYNCAjCpMAaEAE9V+-ZSHG1F3RbVDD+tSoaKgC+wXZoWLgEJLIUlDDoYMQAhuRQDBAYYNToAG6oANbZEeTRpGnxYIkpaQi4+cipcujCIq0KUjI48khKiMZBrgFqxoYWo5redo4IgSqU3rqGukEjFkK6Qhqh4RilROW4VAlJTRQMScSoxJQStKkAZtcAtpQlUQexx1WntfWojW6LVE7V6nVkPVAylmmm0eiMpnMVlsDkQHm0QkxQjUaiMOgsRh2IHe+E+FVgeGQyDgsAYnBYAGUWLxQZJpBD0ApobiAEzaAxqPxCFQWQweXTTRAGebuQzYgkabwiokkspfSgUqk05jsLh8QSiDrsoFctEqeb6YzeYwqfQ80Y6NSShA8lS6SheTymMZmEUaYwqvYfGIVB7JbC0PDERj0pksw1g43NU0ICwaFzrNP6JY8y2W7HOwIWBY8nleDQjW1GEJhYlB0kho6UMMRqOMVgcHj8VkgcEm3rQrMLSzpnN54wF1EulaUFQ8jzWdQebHqUK19CoCBwBSqslHI1dZMDxAAWn0zrPrixWw8ucFVh5gciDcOcRo9APHJTPJMrnhJltLwvB5DRCzMShnC9XxdBgkU1CffZGziE4an3RND0hPoEH9PlhQsMtFWWZx02dUt3TUec0xtEx9CCCwLAQ4NXyoTVqVgeB0K-Y8EBMd07Q0TF9CEWi50MQxC2EyhDAEnRdBFUwVHcRiX3VFtI2jT9+yhKUeWdejizGTZTBxEU7TtNdgiAA */
  id: 'continueWriting',
  context: {
    generatedText: '',
    errorMessage: undefined,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        GENERATE: 'generating',
      },
    },
    generating: {
      invoke: {
        src: 'generateText',
        input: ({ event }) => ({ existingText: (event as any).input?.existingText ?? '' }),
        onDone: {
          target: 'success',
          actions: ({ event, context }) => {
            context.generatedText = event.output as string;
            context.errorMessage = undefined;
          },
        },
        onError: {
          target: 'failure',
          actions: ({ event, context }) => {
            context.errorMessage = (event.error as Error)?.message || 'Failed to generate text';
            context.generatedText = '';
          },
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'idle',
          actions: ({ context }) => {
            context.generatedText = '';
            context.errorMessage = undefined;
          },
        },
        GENERATE: 'generating',
      },
    },
    failure: {
      on: {
        RESET: {
          target: 'idle',
          actions: ({ context }) => {
            context.generatedText = '';
            context.errorMessage = undefined;
          },
        },
        GENERATE: 'generating',
      },
    },
  },
});


