
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
        contents: `Translate this for a child into ${targetLang}: "${text}"`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
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
      contents: `Create a simple, fun, 4-line rhyme for a 4-year-old in ${lang} about: ${topic}.`,
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

  async generateStory(topic: string, lang: string = 'English') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a very short, bedtime story (6-8 sentences) for a 5-year-old child about: ${topic}. Language: ${lang}. The story must be heartwarming and simple.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            story: { type: Type.STRING },
            imagePrompt: { type: Type.STRING, description: "Prompt for an AI image generator representing this story." },
          },
          required: ["title", "story", "imagePrompt"],
        },
      },
    });
    return JSON.parse(response.text) as { title: string; story: string; imagePrompt: string };
  },

  async textToSpeech(text: string, lang: string = 'English') {
    const ai = getAI();
    try {
      const prompt = lang === 'English' 
        ? `Say cheerfully: ${text}` 
        : `Translate to ${lang} and say it cheerfully: ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
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
      return null;
    }
  },

  async generateImage(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A vibrant, high-quality, 3D animated character illustration of: ${prompt}. Cute, friendly, Pixar-style 3D render, white background.` }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  },

  async generateDailyFact(lang: string = 'English') {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tell one fun science fact for a 5-year-old in ${lang}. One short sentence.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return response.text?.trim() || "Learning is magic!";
    } catch (e) {
      console.error("Fact generation error:", e);
      return "Stars are giant balls of fire!";
    }
  }
};
