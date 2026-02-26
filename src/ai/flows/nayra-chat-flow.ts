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

DIAGNOSTIC PROTOCOL:
1. If a user reports being scammed or clicks "I've been scammed", DO NOT provide recovery steps immediately.
2. FIRST, ask for these details:
   - Which bank or financial service was involved?
   - When exactly did this happen?
   - What was the total amount debited/lost?
   - Were any OTPs shared or suspicious apps installed?
3. ONLY AFTER the user provides these details (or if they explicitly refuse to provide them but keep asking for help), provide the recovery steps.

RECOVERY STEPS (when ready):
- Use bullet points (-) for clarity.
- Provide the National Cyber Crime Helpline: 1930.
- Provide the official portal link: https://cybercrime.gov.in
- Based on the bank mentioned, provide the SPECIFIC official link and customer care number:
   - SBI: 1800 1234 | https://onlinesbi.sbi
   - HDFC: 1800 202 6161 | https://www.hdfcbank.com
   - ICICI: 1800 1080 | https://www.icicibank.com
   - IDFC: 1800 419 4332 | https://www.idfcfirstbank.com
   - Kotak: 1860 266 2666 | https://www.kotak.com
   - PNB: 1800 180 2222 | https://www.pnbindia.in

INSTRUCTIONS:
- Keep responses focused.
- AVOID excessive bolding (**). Use simple bullet points (-) for steps.
- Use full URLs (e.g., https://...) so the frontend can parse them as clickable links.`,
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
