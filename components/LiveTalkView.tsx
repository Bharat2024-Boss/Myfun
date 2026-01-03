
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, MicOff, Volume2, Sparkles, X, Bot, Loader2, Waves } from 'lucide-react';

interface LiveTalkViewProps {
  onBack: () => void;
}

const LiveTalkView: React.FC<LiveTalkViewProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // PCM Encoding/Decoding Helpers
  function encodePCM(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decodePCM(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
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

  function createPCMData(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encodePCM(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: 'You are Sparky, a friendly 3D robot buddy for kids. You love teaching kids about colors, fruits, vegetables, and the alphabet. Your answers must be very short, fun, simple, and encouraging for a 4-year-old. Always sound cheerful and excited!',
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log('Live session opened');
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPCMData(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decodePCM(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0) setIsSpeaking(false);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }

            // Handle Transcription
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => (prev + ' ' + message.serverContent?.outputTranscription?.text).trim());
            }

            if (message.serverContent?.interrupted) {
              for (const s of audioSourcesRef.current) {
                s.stop();
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setError('Sparky got a bit shy! Try again?');
            stopSession();
          },
          onclose: () => {
            console.log('Live session closed');
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setError('Check your microphone and try again!');
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      // sessionRef.current.close(); // Use if sdk supports it, otherwise cleanup manually
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    for (const s of audioSourcesRef.current) s.stop();
    audioSourcesRef.current.clear();
    
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsListening(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="bg-white rounded-[4rem] shadow-2xl p-8 md:p-12 flex-1 flex flex-col items-center justify-center relative overflow-hidden border-8 border-indigo-50">
        
        {/* Animated Background Magic */}
        <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-b from-indigo-50 to-white ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className="relative z-10 w-full flex flex-col items-center gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner transition-all duration-500 ${isSpeaking ? 'scale-110 ring-8 ring-indigo-200 ring-opacity-50' : ''}`}>
              {isConnecting ? (
                <Loader2 size={80} className="text-indigo-400 animate-spin" />
              ) : (
                <Bot size={100} className={`text-indigo-500 transition-all duration-300 ${isSpeaking ? 'animate-bounce' : ''}`} />
              )}
            </div>
            
            {isActive && !isConnecting && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border-2 border-indigo-100 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Sparky is Live</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              {isConnecting ? 'Calling Sparky...' : isActive ? 'Sparky is Listening!' : 'Talk to Sparky!'}
            </h2>
            <p className="text-xl text-slate-500 font-medium px-4 max-w-md mx-auto">
              Ask about colors, math, or just say "Hello"! Sparky loves to chat.
            </p>
          </div>

          {/* Visualization / Feedback */}
          <div className="h-20 flex items-center justify-center w-full max-w-xs gap-1">
            {isActive && !isSpeaking && (
              <div className="flex items-center gap-1.5 h-12">
                {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className="w-2 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s`, height: '40%' }} />
                ))}
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-full text-indigo-600 font-bold animate-pulse">
                <Volume2 size={24} /> Sparky is talking...
              </div>
            )}
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl font-bold text-center animate-shake">
              {error}
            </div>
          )}

          {/* Transcript Box (Subtle) */}
          {transcript && (
            <div className="bg-slate-50 p-4 rounded-2xl max-w-lg w-full text-center italic text-slate-400 text-sm overflow-hidden h-12 flex items-center justify-center">
              "{transcript.slice(-60)}..."
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-6 mt-4">
            {!isActive ? (
              <button
                onClick={startSession}
                disabled={isConnecting}
                className="group relative w-24 h-24 md:w-32 md:h-32 bg-indigo-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
                <Mic size={48} className="text-white drop-shadow-lg" />
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="w-24 h-24 bg-rose-500 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 active:scale-95 transition-all"
              >
                <MicOff size={48} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LiveTalkView;
