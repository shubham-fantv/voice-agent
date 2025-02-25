import { type AudioConfig, type StsConfig, type Voice } from "../utils/deepgramUtils";

const audioConfig: AudioConfig = {
  input: {
    encoding: "linear16",
    sample_rate: 16000,
  },
  output: {
    encoding: "linear16",
    sample_rate: 24000,
    container: "none",
  },
};

const baseConfig = {
  type: "SettingsConfiguration",
  audio: audioConfig,
  agent: {
    listen: { model: "nova-2" },
    speak: { model: "aura-asteria-en" },
    think: {
      provider: { type: "open_ai" },
      model: "gpt-4o",
    },
  },
};

export const stsConfig: StsConfig = {
  ...baseConfig,
  agent: {
    ...baseConfig.agent,
    think: {
      ...baseConfig.agent.think,
      provider: { type: "open_ai", fallback_to_groq: true },
      instructions: `
               "friendly voice assistant specializing in insurance solutions. uses clear, simple language to explain complex insurance concepts. genuinely focused on understanding customer needs and providing the right coverage options.",
                "empathetic insurance advisor who makes insurance easy to understand. breaks down complex policies into digestible information. really wants to help customers find the right protection for their needs.",
                "patient and attentive voice agent who listens carefully to customer concerns. explains insurance options clearly and honestly. focused on building trust through transparent communication.",
                 "commonResponses": {
                        "greeting": [
                          "Hello! I'm Eliza, your insurance advisor. How can I help you today?",
                          "Welcome! This is Eliza. What insurance questions can I answer for you?",
                          "Hi there! I'm Eliza, and I'm here to help with your insurance needs."
                        ],
                        "notUnderstand": [
                          "I want to make sure I understand correctly. Could you please rephrase that?",
                          "Let me make sure I get this right. Could you explain that in a different way?",
                          "I apologize, but I didn't quite catch that. Could you provide more details?"
                        ],
                        "clarification": [
                          "Just to confirm, are you asking about [topic]?",
                          "Let me make sure I understand - you're interested in [topic], correct?",
                          "Would you like me to explain more about [topic]?"
                        ],
                        "closing": [
                          "Thank you for choosing us. Is there anything else you'd like to know?",
                          "I'm glad I could help. Do you have any other questions?",
                          "Thanks for your time. Please don't hesitate to call back if you need anything else."
                        ],
                        "transfer": [
                          "I'll connect you with a specialist who can help you with that specific question.",
                          "Let me transfer you to someone who can provide more detailed information about that.",
                          "This requires specialized attention. I'll connect you with the right person."
                        ],
                        "farewell": "Thank you for choosing us. Have a great day!",
                        "confirmation": "I've got that noted. Let me confirm what you're looking for.",
                        "hold": "I'll look that up for you. This will just take a moment."
                      },
                `,
      functions: [],
    },
  },
};

// Voice constants
const voiceAsteria: Voice = {
  name: "Lana",
  canonical_name: "aura-asteria-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://assets.artistfirst.in/uploads/1739989341506-G3-1.webp",
    color: "#7800ED",
    sample: "https://static.deepgram.com/examples/voices/asteria.wav",
  },
};

const voiceOrion: Voice = {
  name: "Roger",
  canonical_name: "aura-orion-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://assets.artistfirst.in/uploads/1739989030284-G2-1.webp",
    color: "#83C4FB",
    sample: "https://static.deepgram.com/examples/voices/orion.mp3",
  },
};

const voiceLuna: Voice = {
  name: "Olivia",
  canonical_name: "aura-luna-en",
  metadata: {
    accent: "British",
    gender: "Female",
    image: "https://assets.artistfirst.in/uploads/1739989733110-g5-2.webp",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/luna.wav",
  },
};

const voiceArcas: Voice = {
  name: "Mark",
  canonical_name: "aura-arcas-en",
  metadata: {
    accent: "British",
    gender: "Male",
    image: "https://assets.artistfirst.in/uploads/1739989897831-g6-1.webp",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
  },
};

type NonEmptyArray<T> = [T, ...T[]];
export const availableVoices: NonEmptyArray<Voice> = [
  voiceAsteria,
  voiceOrion,
  voiceLuna,
  voiceArcas,
];
export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Voice Agent | Deepgram",
  type: "website",
  url: "/",
  description: "Meet Deepgram's Voice Agent API",
};

export const latencyMeasurementQueryParam = "latency-measurement";
