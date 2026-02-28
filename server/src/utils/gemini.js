import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// ─── Singleton Gemini client ───────────────────────────────────────────────────
// One instance, shared across all controllers — avoids duplicate init overhead.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Default model — gemini-2.5-flash-lite has the highest free-tier RPM
const DEFAULT_MODEL = "gemini-2.5-flash-lite";

// ─── Retry with exponential backoff ────────────────────────────────────────────
// Handles 429 (quota) and 503 (overloaded) automatically with up to 3 retries.
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2s, 4s, 8s

/**
 * Call Gemini with automatic retry on 429/503.
 * @param {object} options - Same options as genAI.models.generateContent
 * @param {string} [options.model] - Model name (defaults to gemini-2.5-flash-lite)
 * @param {string|object} options.contents - Prompt contents
 * @param {object} [options.config] - Optional config (tools, etc.)
 * @returns {Promise<import("@google/genai").GenerateContentResponse>}
 */
export async function generateWithRetry(options) {
    const opts = {
        model: DEFAULT_MODEL,
        ...options,
    };

    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await genAI.models.generateContent(opts);
            return result;
        } catch (error) {
            lastError = error;
            const msg = error.message || "";
            const isRetryable =
                msg.includes("429") ||
                msg.includes("quota") ||
                msg.includes("exceeded") ||
                msg.includes("503") ||
                msg.includes("overloaded") ||
                msg.includes("RESOURCE_EXHAUSTED");

            if (!isRetryable || attempt === MAX_RETRIES) {
                throw error;
            }

            const delay = BASE_DELAY_MS * Math.pow(2, attempt);
            console.log(
                `⏳ Gemini rate limited (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

export { genAI, DEFAULT_MODEL };
