'use server';
/**
 * @fileOverview An AI agent for generating creative post ideas or content enhancements.
 *
 * - generatePostIdeas - A function that handles the post idea generation process.
 * - GeneratePostIdeasInput - The input type for the generatePostIdeas function.
 * - GeneratePostIdeasOutput - The return type for the generatePostIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostIdeasInputSchema = z.object({
  topicOrKeywords: z
    .string()
    .describe('The topic or keywords for which to generate post ideas or content enhancements.'),
});
export type GeneratePostIdeasInput = z.infer<typeof GeneratePostIdeasInputSchema>;

const GeneratePostIdeasOutputSchema = z.object({
  ideas: z
    .array(z.string())
    .describe('A list of creative post ideas or content enhancements based on the provided topic/keywords.'),
});
export type GeneratePostIdeasOutput = z.infer<typeof GeneratePostIdeasOutputSchema>;

export async function generatePostIdeas(input: GeneratePostIdeasInput): Promise<GeneratePostIdeasOutput> {
  return generatePostIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostIdeasPrompt',
  input: { schema: GeneratePostIdeasInputSchema },
  output: { schema: GeneratePostIdeasOutputSchema },
  prompt: `You are a creative content assistant. Your goal is to help users overcome writer's block by providing innovative and engaging post ideas or content enhancements.

Based on the following topic or keywords, generate at least 3 to 5 distinct and creative post ideas or content enhancements. Focus on making them engaging, original, and relevant.

Topic/Keywords: {{{topicOrKeywords}}}

Provide the ideas as a JSON array of strings.`,
});

const generatePostIdeasFlow = ai.defineFlow(
  {
    name: 'generatePostIdeasFlow',
    inputSchema: GeneratePostIdeasInputSchema,
    outputSchema: GeneratePostIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
