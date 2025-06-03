// 'use server';

/**
 * @fileOverview A flow to generate inspirational graduation quotes from famous leaders and persons in history.
 *
 * - generateInspirationalQuote - A function that generates an inspirational quote.
 * - GenerateInspirationalQuoteInput - The input type for the generateInspirationalQuote function.
 * - GenerateInspirationalQuoteOutput - The return type for the generateInspirationalQuote function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationalQuoteInputSchema = z.object({
  topic: z.string().describe('The topic of the quote.'),
});

export type GenerateInspirationalQuoteInput = z.infer<typeof GenerateInspirationalQuoteInputSchema>;

const GenerateInspirationalQuoteOutputSchema = z.object({
  quote: z.string().describe('An inspirational quote related to graduation.'),
  author: z.string().describe('The author of the quote.'),
});

export type GenerateInspirationalQuoteOutput = z.infer<typeof GenerateInspirationalQuoteOutputSchema>;

export async function generateInspirationalQuote(
  input: GenerateInspirationalQuoteInput
): Promise<GenerateInspirationalQuoteOutput> {
  return generateInspirationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspirationalQuotePrompt',
  input: {schema: GenerateInspirationalQuoteInputSchema},
  output: {schema: GenerateInspirationalQuoteOutputSchema},
  prompt: `You are a graduation quote generator. Generate an inspirational quote from a famous leader or person in history related to the topic: {{{topic}}}. Return the quote and the author of the quote.

      Make sure the answer is suitable for young students, and is encouraging for them to graduate.
      Do not include any violent, sexual, or otherwise inappropriate content.
`,
});

const generateInspirationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateInspirationalQuoteFlow',
    inputSchema: GenerateInspirationalQuoteInputSchema,
    outputSchema: GenerateInspirationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
