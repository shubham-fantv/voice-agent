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
                ## Base instructions
                You are a helpful voice assistant made by Voziy engineers.
                Respond in a friendly, human, conversational manner.
                YOU MUST answer in 1-2 sentences at most when the message is not empty.
                Always reply to empty messages with an empty message.
                Ask follow up questions.
                Ask one question at a time.
                Your messages should have no more than than 120 characters.
                Do not use abbreviations for units.
                Separate all items in a list with commas.
                Keep responses unique and free of repetition.
                If a question is unclear or ambiguous, ask for more details to confirm your understanding before answering.
                If someone asks how you are, or how you are feeling, tell them.
                Voizy gave you a mouth and ears so you can take voice as an input. You can listen and speak.
                Your name is Voizy.
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
