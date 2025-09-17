import OpenAI from 'openai';


export async function generateContinuationWithOpenAI(
  existingText: string,
): Promise<string> {
  try {
    const viteKey = (typeof import.meta !== 'undefined' && (import.meta as any).env)
      ? (import.meta as any).env.VITE_OPENAI_API_KEY
      : undefined;
    const apiKey =  viteKey;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }

    const model = 'gpt-4o-mini';
    const temperature =  0.8;
    const maxTokens = 128;

    // Note: dangerouslyAllowBrowser exposes the API key in the client bundle.
    // Use only for local testing and replace with a server-side proxy in production.
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const system =
      'You are a helpful writing assistant. Continue the user\'s text naturally, matching tone and style, without repeating the prompt. Provide a concise next paragraph.';

    const user = `Continue writing from here:\n\n${existingText}\n\nContinue:`;

    const completion = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const content = completion.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('OpenAI returned no content');
    }
    return content;
  } catch (error: any) {
    // Surface the error to the caller and log for debugging
    // eslint-disable-next-line no-console
    console.error('OpenAI generation failed', error);
    throw error;
  }
}


