
'use server';
/**
 * @fileOverview A flow for detecting scams/fraud within message screenshots using vision analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScreenshotAnalysisInputSchema = z.object({
  imageBuffer: z.string().describe("A screenshot as a data URI that must include a MIME type and use Base64 encoding."),
});
export type ScreenshotAnalysisInput = z.infer<typeof ScreenshotAnalysisInputSchema>;

const ScreenshotAnalysisOutputSchema = z.object({
  isScam: z.boolean().describe('Whether the message in the screenshot is a scam or fraud.'),
  riskScore: z.number().min(0).max(100).describe('A risk score from 0 to 100 where 100 is high risk.'),
  explanation: z.string().describe('Detailed explanation of why this is a scam or safe.'),
  extractedText: z.string().describe('The text extracted from the screenshot.'),
  recommendedActions: z.string().describe('What the user should do next.'),
});
export type ScreenshotAnalysisOutput = z.infer<typeof ScreenshotAnalysisOutputSchema>;

export async function analyzeScreenshot(input: ScreenshotAnalysisInput): Promise<ScreenshotAnalysisOutput> {
  return screenshotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'screenshotAnalysisPrompt',
  input: {schema: ScreenshotAnalysisInputSchema},
  output: {schema: ScreenshotAnalysisOutputSchema},
  prompt: `You are an expert fraud investigator and cybersecurity analyst.

Analyze the following screenshot of a message (SMS, WhatsApp, email, or social media). 
1. Extract all readable text from the image.
2. Evaluate the text for signs of scams, phishing, social engineering, or fraudulent requests (e.g., "urgent action required", "win a prize", "your account is locked", "crypto investment opportunity").
3. Determine a risk score from 0 (Safe) to 100 (High Risk).
4. Provide a clear explanation of your findings and recommended actions.

Screenshot: {{media url=imageBuffer}}`,
});

const screenshotAnalysisFlow = ai.defineFlow(
  {
    name: 'screenshotAnalysisFlow',
    inputSchema: ScreenshotAnalysisInputSchema,
    outputSchema: ScreenshotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
