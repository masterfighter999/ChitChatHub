
import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';

const plugins: Plugin[] = [googleAI()];
// Use Firebase plugin on Vercel.
// Requires GCLOUD_PROJECT environment variable to be set.
if (process.env.VERCEL) {
  plugins.push(firebase());
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
