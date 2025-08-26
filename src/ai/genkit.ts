'use server';

import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: Plugin[] = [googleAI()];

export const ai = genkit({
  plugins,
  // Note: The model name might be 'gemini-1.5-flash' depending on availability.
  // 'gemini-2.0-flash' is not a standard model identifier.
  model: 'googleai/gemini-1.5-flash',
});
