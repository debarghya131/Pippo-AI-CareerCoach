import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "pippo-ai", // Unique app ID
  name: "PippoAI",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
