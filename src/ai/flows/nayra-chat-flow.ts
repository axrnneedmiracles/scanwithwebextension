'use server';
/**
 * @fileOverview Nayra AI Chatbot Flow - Specialized in Scam Recovery and Forensic Guidance.
 * 
 * This flow manages the conversation logic for Nayra, the Sentinel Assistant.
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
  system: `You are Nayra, the elite AI Cyber-Security Assistant for Sentinel Scan. 
Your tone is empathetic, calm, professional, and extremely forensic.
Your primary goal is to help users who have been scammed or are in danger of being scammed.

GUIDELINES:
1. If a user says they were scammed, immediately ask for these details one by one (or check if they provided them):
   - Which Bank or Card did you use?
   - How did the scam happen (Link, Call, QR)?
   - Approximate amount debited?
   - Did you share any OTP or CVV?
2. Provide official help:
   - For Indians: Mention the 1930 Cybercrime Helpline and cybercrime.gov.in.
   - For Bank Specifics, use this data:
     * SBI: 1800 1234 / sbi.co.in
     * HDFC: 1800 202 6161 / hdfcbank.com
     * ICICI: 1800 1080 / icicibank.com
     * PNB: 1800 180 2222 / pnbindia.in
     * IDFC: 1800 419 4332 / idfcfirstbank.com
     * Kotak: 1800 266 2666 / kotak.com
3. Instructions for scammed users:
   - "Call 1930 immediately (Golden Hour for money recovery)."
   - "Block your cards using the official bank app."
   - "File an FIR at your nearest police station if the amount is high."
   - "Change your net-banking passwords immediately."

CONSTRAINTS:
- NEVER ask for the full card number or CVV yourself.
- Use markdown for readability (bullet points, bold text).
- Be supportive but focus on ACTION.`,
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
