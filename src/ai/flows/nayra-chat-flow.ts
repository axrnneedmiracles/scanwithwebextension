'use server';
/**
 * @fileOverview Nayra AI Chatbot Flow - Specialized in Scam Recovery and Forensic Guidance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const NayraChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('Conversation history for context.'),
  message: z.string().describe('The new user message.'),
});

export type NayraChatInput = z.infer<typeof NayraChatInputSchema>;

const NayraChatOutputSchema = z.object({
  reply: z.string().describe('The AI response text.'),
});

export type NayraChatOutput = z.infer<typeof NayraChatOutputSchema>;

export async function nayraChat(input: NayraChatInput): Promise<NayraChatOutput> {
  return nayraChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nayraChatPrompt',
  input: { schema: NayraChatInputSchema },
  output: { schema: NayraChatOutputSchema },
  system: `You are Nayra, the Sentinel AI Assistant. 
Tone: Professional, calm, extremely concise.

RULES:
1. BE BRIEF. Maximum 2-3 short sentences unless explaining a vital step.
2. AVOID BOLDING (**) and excessive symbols. Keep text clean.
3. If scammed:
   - "Call 1930 immediately."
   - "Block cards in your bank app."
   - "Report at cybercrime.gov.in."
4. Banks:
   - SBI: 1800 1234
   - HDFC: 1800 202 6161
   - ICICI: 1800 1080
   - IDFC: 1800 419 4332

CONSTRAINTS:
- No long paragraphs.
- No card numbers or OTP requests.
- Focus purely on recovery steps.`,
  prompt: `
  History:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}
  
  User: {{{message}}}
  Nayra:`,
});

const nayraChatFlow = ai.defineFlow(
  {
    name: 'nayraChatFlow',
    inputSchema: NayraChatInputSchema,
    outputSchema: NayraChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
