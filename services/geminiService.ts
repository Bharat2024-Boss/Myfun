
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const geminiService = {
  async translateText(text: string, targetLang: string) {
    if (targetLang === 'English') return text;
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text for a child into ${targetLang}. Keep the tone friendly and simple: "${text}"`,
      });
      return response.text?.trim() || text;
    } catch (e) {
      console.error("Translation error:", e);
      return text;
    }
  },

  async generateRhyme(topic: string, lang: string = 'English') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a simple, fun, 4-line rhyme for a 4-year-old child in ${lang} about: ${topic}. If the topic is in English but the target language is ${lang}, translate the concept.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["title", "content"],
        },
      },
    });
    return JSON.parse(response.text) as { title: string; content: string };
  },

  async textToSpeech(text: string) {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `You are a warm, cheerful parent reading to a child. Speak this text naturally and with expression: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("TTS API Error:", error);
      throw error;
    }
  },

  async generateImage(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A vibrant, high-quality, 3D animated character style illustration of: ${prompt}. Cute, friendly, Pixar-style 3D render, bright studio lighting, white background, masterpiece.` }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Added generateDailyFact to fix the error in KiddoBot.tsx
  async generateDailyFact(lang: string = 'English') {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tell me one amazing, fun science or nature fact for a 5-year-old child in ${lang}. Keep it to one sentence. Make it sound very exciting!`,
      });
      return response.text?.trim() || "Learning something new is always a magic adventure!";
    } catch (e) {
      console.error("Fact generation error:", e);
      return "Did you know that stars are giant balls of fire?";
    }
  }
};
