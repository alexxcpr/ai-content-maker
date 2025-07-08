// Configuration for API keys
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// AI API Keys
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const CGDREAM_API_KEY = process.env.CGDREAM_API_KEY || '';
export const KLING_API_KEY = process.env.KLING_API_KEY || '';
export const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY || '';

// Check if required API keys are present
export function validateApiKeys(): void {
  const missingKeys: string[] = [];

  if (!GEMINI_API_KEY) missingKeys.push('GEMINI_API_KEY');
  if (!OPENAI_API_KEY) missingKeys.push('OPENAI_API_KEY');

  if (missingKeys.length > 0) {
    console.warn(`WARNING: Missing required API keys: ${missingKeys.join(', ')}`);
    console.warn('Some functionality may be limited or unavailable.');
  }
}