
import { config } from 'dotenv';
config();

import '@/ai/flows/unified-link-analysis.ts';
import '@/ai/flows/malicious-link-detection.ts';
import '@/ai/flows/link-safety-feedback.ts';
import '@/ai/flows/image-analysis-flow.ts';
import '@/ai/flows/screenshot-analysis.ts';
import '@/ai/flows/call-analysis.ts';
import '@/ai/flows/leaked-db-scan.ts';
