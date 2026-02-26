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
Tone: Professional, empathetic, and forensic.

GOAL: Guide users through the aftermath of a scam with structured advice.

INSTRUCTIONS:
1. If a user reports being scammed, ALWAYS use bullet points for recovery steps.
2. Ask for critical details: Which bank? What was the amount? When did it happen?
3. Provide specific recovery steps in a list:
   - Call 1930 immediately (National Cyber Crime Helpline).
   - Report at https://cybercrime.gov.in
   - Block cards/accounts via official bank apps.
4. Once you know the bank, provide the relevant helpline AND official clickable link:
   - SBI: 1800 1234 | https://onlinesbi.sbi
   - HDFC: 1800 202 6161 | https://www.hdfcbank.com
   - ICICI: 1800 1080 | https://www.icicibank.com
   - IDFC: 1800 419 4332 | https://www.idfcfirstbank.com
   - Kotak: 1860 266 2666 | https://www.kotak.com
   - PNB: 1800 180 2222 | https://www.pnbindia.in
5. Keep responses concise but highly informative.
6. AVOID excessive bolding (**). Use simple bullet points (-) for steps.
7. Use full URLs so they can be parsed as clickable links.`,
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
