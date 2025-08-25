'use server';

/**
 * @fileOverview An AI moderation tool for chat messages.
 *
 * - moderateMessage - A function that moderates a given message and flags inappropriate content.
 * - ModerateMessageInput - The input type for the moderateMessage function.
 * - ModerateMessageOutput - The return type for the moderateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateMessageInputSchema = z.object({
  message: z.string().describe('The chat message to be moderated.'),
});

export type ModerateMessageInput = z.infer<typeof ModerateMessageInputSchema>;

const ModerateMessageOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the message is safe and appropriate.'),
  reason: z.string().optional().describe('The reason why the message was flagged as unsafe.'),
});

export type ModerateMessageOutput = z.infer<typeof ModerateMessageOutputSchema>;

export async function moderateMessage(input: ModerateMessageInput): Promise<ModerateMessageOutput> {
  return moderateMessageFlow(input);
}

const moderateMessagePrompt = ai.definePrompt({
  name: 'moderateMessagePrompt',
  input: {schema: ModerateMessageInputSchema},
  output: {schema: ModerateMessageOutputSchema},
  prompt: `You are an AI moderation tool that reviews chat messages and determines if they are safe and appropriate.

  Here's the message to review:
  """{{{message}}}"""

  Determine if the message is safe and appropriate. If it is, isSafe should be true, and reason should be null.
  If it is not, isSafe should be false, and reason should explain the problem with the message.
  Be brief and to the point.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      }
    ],
  }
});

const moderateMessageFlow = ai.defineFlow(
  {
    name: 'moderateMessageFlow',
    inputSchema: ModerateMessageInputSchema,
    outputSchema: ModerateMessageOutputSchema,
  },
  async input => {
    const {output} = await moderateMessagePrompt(input);
    return output!;
  }
);
