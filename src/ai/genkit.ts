import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase/plugin';

const plugins: Plugin[] = [googleAI()];
// Use Firebase plugin on Vercel.
// Requires GCLOUD_PROJECT environment variable to be set.
if (process.env.VERCEL) {
  plugins.push(firebase());
}

export const ai = genkit({
  plugins,
  // Note: The model name might be 'gemini-1.5-flash' depending on availability.
  // 'gemini-2.0-flash' is not a standard model identifier.
  model: 'googleai/gemini-1.5-flash',
});
