'use server';

import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// Corrected the import based on the build error suggestion.
import {enableFirebaseTelemetry} from '@genkit-ai/firebase';

const plugins: Plugin[] = [googleAI()];
// Use Firebase plugin on Vercel.
// Requires GCLOUD_PROJECT environment variable to be set.
if (process.env.VERCEL) {
  // Call the correct exported function.
  plugins.push(enableFirebaseTelemetry());
}

export const ai = genkit({
  plugins,
  // Note: The model name might be 'gemini-1.5-flash' depending on availability.
  // 'gemini-2.0-flash' is not a standard model identifier.
  model: 'googleai/gemini-1.5-flash',
});
