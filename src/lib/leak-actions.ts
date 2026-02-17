'use server';

import { scanEmailBreaches } from '@/ai/flows/leaked-db-scan';
import type { LeakedDBResult } from '@/lib/types';

export async function checkEmailLeak(email: string): Promise<LeakedDBResult> {
    const analyzedAt = new Date().toISOString();

    try {
        const aiResponse = await scanEmailBreaches({ email });
        
        return {
            email,
            ...aiResponse,
            analyzedAt
        };
    } catch (error) {
        console.error("Leak scan failed:", error);
        throw new Error("Forensic database search failed. Please try again later.");
    }
}
