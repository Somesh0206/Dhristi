'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  Compass,
  AlertOctagon,
  Shield,
  PhoneCall,
  MapPin,
  LifeBuoy,
  RefreshCw,
} from 'lucide-react';

interface VoiceMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionRoute?: string;
  actionModal?: 'citizen' | 'police' | 'helplines' | 'responder';
}

export default function VoiceAssistant() {
  const router = useRouter();
  const {
    isVoiceAssistantOpen,
    closeVoiceAssistant,
    openSosModal,
    language,
    setLanguage,
    userCoordinates,
    t,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting when opened
  useEffect(() => {
    if (isVoiceAssistantOpen && messages.length === 0) {
      const initialGreeting: VoiceMessage = {
        sender: 'assistant',
        text:
          language === 'hi'
            ? 'नमस्ते! मैं दृष्टि एआई वॉयस असिस्टेंट (वाणी) हूँ। आप मुझसे निकटतम सुरक्षित आश्रय, भूस्खलन रेड-ज़ोन, निकासी मार्ग, मौसम या आपातकालीन SOS भेजने के बारे में पूछ सकते हैं।'
            : 'Hello! I am Dhristi AI Voice Assistant (Vaani). You can ask me to find nearest safe shelters, inspect hazard red-zones, guide evacuation routes, check weather, or trigger emergency SOS.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialGreeting]);
      speakText(initialGreeting.text);
    }
  }, [isVoiceAssistantOpen, language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleUserQuery(transcript);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, [language, transcript]);

  // Speak text aloud
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          recognitionRef.current.start();
        } else {
          alert('Speech recognition is not supported in this browser. You can type below!');
        }
      } catch (err) {
        console.error('Could not start recognition:', err);
      }
    }
  };

  // Natural Language Understanding & Query Processing
  const handleUserQuery = (query: string) => {
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: VoiceMessage = { sender: 'user', text: query, time };

    const lower = query.toLowerCase();
    let assistantReply = '';
    let actionRoute: string | undefined = undefined;
    let actionModal: 'citizen' | 'police' | 'helplines' | 'responder' | undefined = undefined;

    // 1. SOS / Police / Emergency
    if (
      lower.includes('sos') ||
      lower.includes('help') ||
      lower.includes('police') ||
      lower.includes('emergency') ||
      lower.includes('rescue') ||
      lower.includes('बचाओ') ||
      lower.includes('मदद') ||
      lower.includes('पुलिस') ||
      lower.includes('एसओएस') ||
      lower.includes('संकट')
    ) {
      if (lower.includes('police') || lower.includes('पुलिस')) {
        assistantReply =
          language === 'hi'
            ? 'पुलिस स्टेशन और पीसीआर वैन के लिए आपातकालीन SOS स्क्रीन खोली जा रही है। आप 112 पर भी तुरंत कॉल कर सकते हैं।'
            : 'Opening Police 112 emergency dispatch beacon. You can also dial 112 directly for immediate police escort.';
        actionModal = 'police';
      } else {
        assistantReply =
          language === 'hi'
            ? 'तत्काल नागरिक आपातकालीन SOS फॉर्म खोला जा रहा है। कृपया अपने जीपीएस निर्देशांक की पुष्टि करें।'
            : 'Triggering Emergency Citizen SOS beacon. Connecting your GPS coordinates directly to the State Emergency Operations Center.';
        actionModal = 'citizen';
      }
    }
    // 2. Safe Shelters
    else if (
      lower.includes('shelter') ||
      lower.includes('camp') ||
      lower.includes('hospital') ||
      lower.includes('school') ||
      lower.includes('stadium') ||
      lower.includes('आश्रय') ||
      lower.includes('शिविर') ||
      lower.includes('अस्पताल') ||
      lower.includes('स्कूल') ||
      lower.includes('स्टेडियम') ||
      lower.includes('सुरक्षित जगह')
    ) {
      assistantReply =
        language === 'hi'
          ? 'निकटतम सुरक्षित आश्रय स्थल: मेप्पाडी हायर सेकेंडरी स्कूल और सेंट जोसेफ हॉस्पिटल। ये स्थल भूस्खलन रेड-ज़ोन से 3.8 किमी दूर सुरक्षित ऊंचाई पर स्थित हैं। सुरक्षित आश्रय पृष्ठ पर जा रहे हैं।'
          : 'Nearest verified safe shelters include Meppadi Govt Higher Secondary School (Capacity: 850) and St. Joseph Multi-Specialty Hospital. Navigating to Safe Shelters matrix.';
      actionRoute = '/shelters';
    }
    // 3. Red Zones / Hazards
    else if (
      lower.includes('red zone') ||
      lower.includes('hazard') ||
      lower.includes('landslide') ||
      lower.includes('flood') ||
      lower.includes('danger') ||
      lower.includes('रेड ज़ोन') ||
      lower.includes('खतरा') ||
      lower.includes('भूस्खलन') ||
      lower.includes('बाढ़') ||
      lower.includes('जोखिम')
    ) {
      assistantReply =
        language === 'hi'
          ? 'चेतावनी: वायनाड वेस्टर्न एस्कैपमेंट और मुंडक्कई बस्तियां सक्रिय रेड ज़ोन में हैं। मिट्टी का जल दबाव 142 केपीए के क्रिटिकल थ्रेशोल्ड पर है। 3D जीआईएस मैप खोल रहे हैं।'
          : 'Warning: Wayanad Escarpment and Mundakkai slope sectors are designated Critical Red Zones due to heavy rainfall and 142 kPa pore-water pressure. Loading 3D GIS hazard viewer.';
      actionRoute = '/red-zones';
    }
    // 4. Evacuation Routes / Relocation
    else if (
      lower.includes('route') ||
      lower.includes('evacuate') ||
      lower.includes('relocat') ||
      lower.includes('directions') ||
      lower.includes('road') ||
      lower.includes('रास्ता') ||
      lower.includes('मार्ग') ||
      lower.includes('निकासी') ||
      lower.includes('सड़क')
    ) {
      assistantReply =
        language === 'hi'
          ? 'सुरक्षित सड़क निकासी मार्ग सक्रिय है: स्टेट हाईवे 59 से होकर जाएं और मलबे से अवरुद्ध पुल से बचें। लाइव मोड़-दर-मोड़ नेविगेशन पृष्ठ पर ले जा रहे हैं।'
          : 'Safe evacuation road corridor active via State Highway 59, bypassing damaged valley crossings. Opening turn-by-turn road navigation guidance.';
      actionRoute = '/relocation';
    }
    // 5. Predictions / Simulation / Weather
    else if (
      lower.includes('predict') ||
      lower.includes('forecast') ||
      lower.includes('weather') ||
      lower.includes('rain') ||
      lower.includes('पूर्वानुमान') ||
      lower.includes('मौसम') ||
      lower.includes('बारिश') ||
      lower.includes('सिमुलेशन')
    ) {
      assistantReply =
        language === 'hi'
          ? 'एआई मौसम विश्लेषण: अगले 24 घंटों में 52.4 मिमी/घंटा वर्षा का अनुमान है। ढलान स्थिरता का सुरक्षा कारक 0.88 (अस्थिर) है। पूर्वानुमान डैशबोर्ड खोल रहे हैं।'
          : 'AI predictive models show cumulative rainfall of 52.4 mm/hr with slope Factor of Safety at 0.88 (Unstable). Loading AI Predictions & Simulation sandbox.';
      actionRoute = '/predictions';
    }
    // 6. Helplines / Emergency Contacts
    else if (
      lower.includes('number') ||
      lower.includes('helpline') ||
      lower.includes('contact') ||
      lower.includes('call') ||
      lower.includes('नंबर') ||
      lower.includes('हेल्पलाइन') ||
      lower.includes('संपर्क') ||
      lower.includes('फ़ोन')
    ) {
      assistantReply =
        language === 'hi'
          ? 'राष्ट्रीय आपातकालीन नंबर: पुलिस 112, एनडीआरएफ 1078, राज्य आपदा नियंत्रण 1070, एम्बुलेंस 108। आपातकालीन संपर्क सूची खोली जा रही है।'
          : 'Emergency Hotlines: Police & General Emergency: 112 | NDRF Disaster Rescue: 1078 | State EOC: 1070 | Ambulance: 108. Opening Helplines directory.';
      actionModal = 'helplines';
    }
    // 7. Resources / Go-Bag
    else if (
      lower.includes('bag') ||
      lower.includes('resource') ||
      lower.includes('kit') ||
      lower.includes('sop') ||
      lower.includes('गो-बैग') ||
      lower.includes('सामग्री') ||
      lower.includes('दस्तावेज़')
    ) {
      assistantReply =
        language === 'hi'
          ? '72-घंटे का इमरजेंसी गो-बैग तैयार रखें: पीने का पानी, ओआरएस, टॉर्च, पावर बैंक, ज़रूरी दवाएं और महत्वपूर्ण दस्तावेज। आपदा प्रबंधन गाइड खोल रहे हैं।'
          : 'Keep your 72-Hour Evacuation Go-Bag ready: Potable water, dry rations, first-aid, waterproof pouch for IDs, and battery torch. Navigating to NDMA Resources.';
      actionRoute = '/resources';
    }
    // Default fallback
    else {
      assistantReply =
        language === 'hi'
          ? `मैंने आपका संदेश समझा: "${query}"। आप सुरक्षित आश्रय, रेड-ज़ोन स्थिति, निकासी सड़क मार्ग या SOS के बारे में पूछ सकते हैं।`
          : `Understood your query: "${query}". You can ask to find safe shelters, view red-zone hazards, get evacuation road routes, or send an emergency SOS.`;
    }

    const assistantMsg: VoiceMessage = {
      sender: 'assistant',
      text: assistantReply,
      time,
      actionRoute,
      actionModal,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText('');
    setTranscript('');
    speakText(assistantReply);

    // If there's an action, execute it after a short delay
    if (actionRoute) {
      setTimeout(() => {
        router.push(actionRoute!);
      }, 1800);
    } else if (actionModal) {
      setTimeout(() => {
        closeVoiceAssistant();
        openSosModal(actionModal);
      }, 1600);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserQuery(inputText);
    }
  };

  // Sample prompt chips
  const samplePrompts =
    language === 'hi'
      ? [
          '🚨 तत्काल नागरिक SOS भेजो',
          '🏫 निकटतम सुरक्षित आश्रय खोजो',
          '🗺️ रेड-ज़ोन का खतरा दिखाओ',
          '🚗 सुरक्षित निकासी सड़क मार्ग',
          '🌦️ मौसम एवं भूस्खलन का हाल',
          '🚓 पुलिस 112 को बुलाओ',
        ]
      : [
          '🚨 Send Emergency SOS',
          '🏫 Find Nearest Safe Haven',
          '🗺️ Show Hazard Red-Zones',
          '🚗 Evacuation Road Route',
          '🌦️ Weather & Landslide Risk',
          '🚓 Call Police PCR 112',
        ];

  if (!isVoiceAssistantOpen) {
    return (
      /* Floating Voice Assistant Trigger Pill */
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            const { openVoiceAssistant } = useApp();
            openVoiceAssistant();
          }}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-full shadow-2xl shadow-indigo-500/40 border border-violet-400/40 transition-all hover:scale-105 active:scale-95 animate-bounce-subtle"
          title="Open Dhristi AI Voice Assistant (Vaani)"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Mic className="w-5 h-5 text-white animate-pulse" />
          <span className="font-black text-xs tracking-wider uppercase">
            {language === 'hi' ? 'वाणी एआई (वॉयस)' : 'VAANI AI (Voice)'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-violet-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Bot className="w-7 h-7 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide">
                  {language === 'hi' ? 'दृष्टि एआई वॉयस असिस्टेंट (वाणी)' : 'DHRISTI AI VOICE ASSISTANT (VAANI)'}
                </h2>
                <span className="text-[10px] bg-violet-950/60 text-violet-200 px-2 py-0.5 rounded-full border border-violet-400/30 font-bold">
                  BILINGUAL AI
                </span>
              </div>
              <p className="text-xs text-violet-200/90 font-medium">
                {language === 'hi'
                  ? 'आवाज से सुरक्षित आश्रय, रेड ज़ोन, निकासी मार्ग एवं आपातकालीन SOS निर्देश दें'
                  : 'Speak naturally for Safe Shelters, Red-Zone Risk, Road Routes & SOS Action'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
              title="Toggle Language"
            >
              🌐 {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeaking();
                closeVoiceAssistant();
              }}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950/50 space-y-3.5 max-h-[380px]">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-violet-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-between font-mono ${
                      isUser ? 'text-violet-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-violet-500 transition-colors ml-2"
                        title="Replay Voice Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Live Audio Visualizer / Pulse Bar when listening */}
        {isListening && (
          <div className="px-4 py-3 bg-violet-50 dark:bg-violet-950/40 border-t border-violet-200 dark:border-violet-800/60 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <div className="flex space-x-1 items-center">
                <span className="w-1.5 h-6 bg-violet-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-10 bg-purple-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                <span className="w-1.5 h-7 bg-pink-500 rounded-full animate-bounce [animation-delay:0.45s]"></span>
              </div>
              <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                {language === 'hi' ? 'आपकी आवाज सुनी जा रही है...' : 'Listening to your voice... Speak now'}
              </span>
            </div>
            {transcript && (
              <span className="text-xs italic text-slate-600 dark:text-slate-300 max-w-xs truncate font-mono">
                "{transcript}"
              </span>
            )}
          </div>
        )}

        {/* Quick Suggestion Voice Chips */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleUserQuery(prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-violet-500 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all shrink-0 hover:scale-105"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input & Microphone Action Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
            {/* Big Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${
                isListening
                  ? 'bg-rose-600 shadow-rose-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-600/30'
              }`}
              title={isListening ? 'Stop Listening' : 'Start Voice Input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={
                language === 'hi'
                  ? 'माइक दबाकर बोलें या यहाँ लिखें (उदा. निकटतम सुरक्षित आश्रय)...'
                  : 'Tap Mic to speak or type here (e.g. Find nearest shelter)...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-violet-500 outline-none"
            />

            {/* Audio Speech Stop / Play Indicator */}
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 transition-colors animate-pulse"
                title="Mute Voice Output"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
