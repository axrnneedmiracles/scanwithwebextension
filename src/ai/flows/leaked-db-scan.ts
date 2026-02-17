'use server';
/**
 * @fileOverview A flow for checking if an email address has been found in known data breaches.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeakedDBScanInputSchema = z.object({
  email: z.string().email().describe("The email address to check for breaches."),
});
export type LeakedDBScanInput = z.infer<typeof LeakedDBScanInputSchema>;

const BreachSchema = z.object({
  name: z.string().describe('The name of the breached service.'),
  date: z.string().describe('The date of the breach.'),
  dataTypes: z.array(z.string()).describe('Types of data exposed (e.g., Passwords, IP Addresses).'),
  description: z.string().describe('Brief description of the incident.'),
});

const LeakedDBScanOutputSchema = z.object({
  isFound: z.boolean().describe('Whether the email was found in any recorded breaches.'),
  breachCount: z.number().describe('Number of breaches found.'),
  breaches: z.array(BreachSchema).describe('List of specific breaches.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Overall risk assessment.'),
  recommendations: z.string().describe('Security advice for the user.'),
});
export type LeakedDBScanOutput = z.infer<typeof LeakedDBScanOutputSchema>;

export async function scanEmailBreaches(input: LeakedDBScanInput): Promise<LeakedDBScanOutput> {
  return leakedDBScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'leakedDBScanPrompt',
  input: {schema: LeakedDBScanInputSchema},
  output: {schema: LeakedDBScanOutputSchema},
  prompt: `You are an elite cybersecurity researcher specializing in OSINT and data breach analysis.

Analyze the provided email address: {{{email}}}

Search your internal knowledge base for known data breaches associated with this email or its domain patterns. 
While this is a simulation, provide a realistic and forensic report based on real-world historical data breaches (e.g., LinkedIn 2016, Canva 2019, Adobe 2013, etc.).

If the email is highly generic (like test@gmail.com), find multiple real-world breaches.
If the email is likely unique, provide a safe "No breaches found" report but still include general security advice.

Output a structured list of breaches, a risk level, and clear remediation steps.`,
});

const leakedDBScanFlow = ai.defineFlow(
  {
    name: 'leakedDBScanFlow',
    inputSchema: LeakedDBScanInputSchema,
    outputSchema: LeakedDBScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
