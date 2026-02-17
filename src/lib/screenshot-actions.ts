
'use server';

import { analyzeScreenshot } from '@/ai/flows/screenshot-analysis';
import type { ScreenshotAnalysisResult } from '@/lib/types';

export async function scanScreenshot(dataUri: string): Promise<ScreenshotAnalysisResult> {
    const id = Math.random().toString(36).substring(7);
    const analyzedAt = new Date().toISOString();

    try {
        const aiResponse = await analyzeScreenshot({ imageBuffer: dataUri });
        
        return {
            id,
            imageUrl: dataUri,
            isScam: aiResponse.isScam,
            riskScore: aiResponse.riskScore,
            explanation: aiResponse.explanation,
            extractedText: aiResponse.extractedText,
            recommendedActions: aiResponse.recommendedActions,
            analyzedAt
        };
    } catch (error) {
        console.error("Screenshot analysis failed:", error);
        return {
            id,
            imageUrl: dataUri,
            isScam: true,
            riskScore: 90,
            explanation: "Failed to analyze the screenshot due to a system error. If this message contains links or requests for personal info, treat it as high risk.",
            extractedText: "Text extraction failed.",
            recommendedActions: "Do not interact with the sender. Delete the message immediately.",
            analyzedAt,
            error: "System analysis failed. Caution advised."
        };
    }
}
