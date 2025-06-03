
'use server';

import type { GenerateInspirationalQuoteInput, GenerateInspirationalQuoteOutput } from '@/ai/flows/generate-inspirational-quote';
import { generateInspirationalQuote as genQuote } from '@/ai/flows/generate-inspirational-quote';

export async function fetchInspirationalQuote(input: GenerateInspirationalQuoteInput): Promise<GenerateInspirationalQuoteOutput> {
  try {
    // The AI flow might have a small chance of returning null or an error,
    // so we provide a fallback.
    const result = await genQuote(input);
    if (result && result.quote && result.author) {
      return result;
    }
    throw new Error("AI flow returned invalid data.");
  } catch (error) {
    console.error("Error fetching inspirational quote:", error);
    // Provide a graceful fallback quote
    return {
      quote: "The best way to predict the future is to create it.",
      author: "Abraham Lincoln / Peter Drucker"
    };
  }
}
