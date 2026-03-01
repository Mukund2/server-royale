import { createMistral } from '@ai-sdk/mistral';

export function getMistralClient() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || apiKey === 'your_mistral_api_key_here') {
    return null;
  }
  return createMistral({ apiKey });
}
