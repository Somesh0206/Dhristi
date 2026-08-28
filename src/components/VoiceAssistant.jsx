'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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








  Trash2,
  Lock } from

'lucide-react';










export default function VoiceAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isVoiceAssistantOpen,
    closeVoiceAssistant,
    openVoiceAssistant,
    openSosModal,
    language,
    setLanguage,
    userCoordinates,
    t
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat history from the persistent database on mount
  useEffect(() => {
    async function loadDatabaseChats() {
      try {
        const res = await fetch('/api/vaani/chats');
        const data = await res.json();
        if (data.success && Array.isArray(data.chats) && data.chats.length > 0) {
          setMessages(
            data.chats.map((c) => ({
              id: c.id,
              sender: c.sender,
              text: c.text,
              time: c.time,
              actionRoute: c.actionRoute,
              actionModal: c.actionModal
            }))
          );
        } else {
          // Initialize initial greeting (Natural female voice without mentioning it in text)
          const initialGreeting = {
            sender: 'assistant',
            text:
            language === 'hi' ?
            'नमस्ते! मैं दृष्टि एआई वॉयस असिस्टेंट (वाणी) हूँ। आप मुझसे निकटतम सुरक्षित आश्रय, भूस्खलन रेड-ज़ोन, निकासी मार्ग, मौसम, सुरक्षित चैट या आपातकालीन SOS के बारे में पूछ सकते हैं।' :
            'Namaste! I am Dhristi AI Voice Assistant (Vaani). You can ask me to find nearest safe shelters, inspect hazard red-zones, guide evacuation road routes, check weather, open encrypted staff chat, or trigger emergency SOS.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages([initialGreeting]);
          saveMessageToDb(initialGreeting);
        }
      } catch (err) {
        console.warn('Could not load database chats:', err);
      } finally {
        setIsDbLoaded(true);
      }
    }

    loadDatabaseChats();
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist message to database
  const saveMessageToDb = async (msg) => {
    try {
      await fetch('/api/vaani/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: msg.sender,
          text: msg.text,
          time: msg.time,
          language,
          actionRoute: msg.actionRoute,
          actionModal: msg.actionModal
        })
      });
    } catch (e) {
      console.warn('Failed to save to database API:', e);
    }
  };

  // Clear chat history in database
  const handleClearHistory = async () => {
    try {
      await fetch('/api/vaani/chats', { method: 'DELETE' });
      const resetGreeting = {
        sender: 'assistant',
        text:
        language === 'hi' ?
        'चैट इतिहास साफ़ कर दिया गया है। मैं आपकी क्या मदद कर सकती हूँ?' :
        'Chat database cleared. How may I assist you with disaster safety today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([resetGreeting]);
      saveMessageToDb(resetGreeting);
      speakFemaleText(resetGreeting.text);
    } catch (e) {
      console.error('Failed to clear database chats:', e);
    }
  };

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event) => {
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

  // Helper: Find natural Female Voice across browsers
  const getFemaleVoice = (lang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'hi') {
      const hiFemale = voices.find(
        (v) =>
        (v.lang.startsWith('hi') || v.lang.includes('IN')) && (
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('kavya') ||
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('google हिन्दी'))
      );
      if (hiFemale) return hiFemale;

      const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
      if (hiVoice) return hiVoice;
    }

    const enFemale = voices.find(
      (v) =>
      (v.lang.startsWith('en') || v.lang.includes('en')) && (
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('tessa') ||
      v.name.toLowerCase().includes('moira') ||
      v.name.toLowerCase().includes('google us english') ||
      v.name.toLowerCase().includes('google uk english female'))
    );
    if (enFemale) return enFemale;

    const genericFemale = voices.find(
      (v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')
    );
    if (genericFemale) return genericFemale;

    return voices.find((v) => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en')) || voices[0] || null;
  };

  // Speak text aloud using female acoustic resonance
  const speakFemaleText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const targetVoice = getFemaleVoice(language);
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.pitch = 1.24;
      utterance.rate = 1.02;
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
  const handleUserQuery = async (query) => {
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: query, time };

    const lower = query.toLowerCase();
    let assistantReply = '';
    let actionRoute = undefined;
    let actionModal = undefined;

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
    lower.includes('संकट'))
    {
      if (lower.includes('police') || lower.includes('पुलिस')) {
        assistantReply =
        language === 'hi' ?
        'पुलिस स्टेशन और पीसीआर वैन (112) के लिए आपातकालीन SOS स्क्रीन खोली जा रही है।' :
        'Opening Police 112 emergency dispatch beacon. Connecting your location directly to nearest police control.';
        actionModal = 'police';
      } else {
        assistantReply =
        language === 'hi' ?
        'तत्काल नागरिक आपातकालीन SOS फॉर्म खोला जा रहा है। जीपीएस निर्देशांक स्वतः लॉक कर दिए गए हैं।' :
        'Triggering Emergency Citizen SOS beacon. Transmitting GPS coordinates directly to State Emergency Operations Center.';
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
    lower.includes('सुरक्षित जगह'))
    {
      assistantReply =
      language === 'hi' ?
      'निकटतम प्रमाणित सुरक्षित आश्रय: मेप्पाडी हायर सेकेंडरी स्कूल और सेंट जोसेफ अस्पताल। सुरक्षित आश्रय वहन क्षमता पृष्ठ खोला जा रहा है।' :
      'Nearest verified safe shelters include Meppadi Govt Higher Secondary School (Capacity: 850) and St. Joseph Hospital. Loading Safe Shelters matrix.';
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
    lower.includes('जोखिम'))
    {
      assistantReply =
      language === 'hi' ?
      'चेतावनी: मुंडक्कई एवं वायनाड ढलान सक्रिय रेड ज़ोन में हैं। मिट्टी का जल दबाव 142 केपीए पर है। 3D जीआईएस मानचित्र खोला जा रहा है।' :
      'Warning: Wayanad Escarpment and Mundakkai sectors are designated Critical Red Zones with high pore pressure. Opening 3D GIS hazard viewer.';
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
    lower.includes('सड़क'))
    {
      assistantReply =
      language === 'hi' ?
      'सड़क निकासी मार्ग तैयार है: स्टेट हाईवे 59 से जाएं और क्षतिग्रस्त पुल से बचें। मोड़-दर-मोड़ नेविगेशन पृष्ठ पर ले जा रहे हैं।' :
      'Safe road evacuation corridor computed via State Highway 59. Navigating to turn-by-turn road navigation guidance.';
      actionRoute = '/relocation';
    }
    // 5. Predictions / Weather
    else if (
    lower.includes('predict') ||
    lower.includes('forecast') ||
    lower.includes('weather') ||
    lower.includes('rain') ||
    lower.includes('पूर्वानुमान') ||
    lower.includes('मौसम') ||
    lower.includes('बारिश') ||
    lower.includes('सिमुलेशन'))
    {
      assistantReply =
      language === 'hi' ?
      'एआई मौसम विश्लेषण: 52.4 मिमी/घंटा वर्षा दर्ज की गई है। सुरक्षा कारक 0.88 है। एआई पूर्वानुमान सिमुलेटर खोल रहे हैं।' :
      'AI predictive models show cumulative rainfall of 52.4 mm/hr with slope Factor of Safety at 0.88. Loading AI Predictions sandbox.';
      actionRoute = '/predictions';
    }
    // 6. Encrypted Chat with Staff / Admin
    else if (
    lower.includes('chat') ||
    lower.includes('message') ||
    lower.includes('staff') ||
    lower.includes('admin') ||
    lower.includes('बात') ||
    lower.includes('चैट') ||
    lower.includes('संदेश') ||
    lower.includes('अधिकारी'))
    {
      assistantReply =
      language === 'hi' ?
      'प्रशासक एवं फील्ड राहत दल के साथ 1-ऑन-1 एंड-टू-एंड एन्क्रिप्टेड सिक्योर चैट रूम खोला जा रहा है।' :
      'Opening Encrypted 1-on-1 Disaster Support Chat with online SEOC Admin and NDRF Staff.';
      actionRoute = '/chat';
    }
    // 7. Helplines
    else if (
    lower.includes('number') ||
    lower.includes('helpline') ||
    lower.includes('contact') ||
    lower.includes('call') ||
    lower.includes('नंबर') ||
    lower.includes('हेल्पलाइन') ||
    lower.includes('संपर्क'))
    {
      assistantReply =
      language === 'hi' ?
      'आपातकालीन नंबर: पुलिस 112, एनडीआरएफ 1078, राज्य आपदा नियंत्रण 1070, एम्बुलेंस 108। हेल्पलाइन निर्देशिका खोली जा रही है।' :
      'Emergency Hotlines: Police 112 | NDRF 1078 | State EOC 1070 | Ambulance 108. Opening Helplines directory.';
      actionModal = 'helplines';
    }
    // Default fallback
    else {
      assistantReply =
      language === 'hi' ?
      `मैंने आपका प्रश्न समझा: "${query}"। आप सुरक्षित आश्रय, रेड-ज़ोन स्थिति, निकासी सड़क मार्ग, एन्क्रिप्टेड चैट या SOS के बारे में पूछ सकते हैं।` :
      `I understood: "${query}". You can ask me for safe shelters, red-zone status, evacuation road routes, encrypted staff chat, or to send SOS.`;
    }

    const assistantMsg = {
      sender: 'assistant',
      text: assistantReply,
      time,
      actionRoute,
      actionModal
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText('');
    setTranscript('');

    saveMessageToDb(userMsg);
    saveMessageToDb(assistantMsg);

    speakFemaleText(assistantReply);

    if (actionRoute) {
      setTimeout(() => {
        router.push(actionRoute);
      }, 1800);
    } else if (actionModal) {
      setTimeout(() => {
        closeVoiceAssistant();
        openSosModal(actionModal);
      }, 1600);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserQuery(inputText);
    }
  };

  const samplePrompts =
  language === 'hi' ?
  [
  '🚨 तत्काल नागरिक SOS भेजो',
  '🏫 निकटतम सुरक्षित आश्रय खोजो',
  '🗺️ रेड-ज़ोन का खतरा दिखाओ',
  '🚗 सुरक्षित निकासी सड़क मार्ग',
  '💬 अधिकारी से एन्क्रिप्टेड चैट',
  '🌦️ मौसम एवं भूस्खलन का हाल'] :

  [
  '🚨 Send Emergency SOS',
  '🏫 Find Nearest Safe Haven',
  '🗺️ Show Hazard Red-Zones',
  '🚗 Evacuation Road Route',
  '💬 Encrypted Staff Chat',
  '🌦️ Weather & Landslide Risk'];


  if (!isVoiceAssistantOpen) {
    return (
      /* Floating Bottom-Right Dock: VAANI AI Voice Button + Encrypted Chat Button Stacked */
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        {/* VAANI AI Voice Trigger */}
        <button
          onClick={openVoiceAssistant}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-full shadow-2xl shadow-purple-500/40 border border-purple-400/40 transition-all hover:scale-105 active:scale-95 animate-bounce-subtle"
          title="Open Dhristi AI Voice Assistant (VAANI)">
          
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Mic className="w-5 h-5 text-white animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="font-black text-xs tracking-wider uppercase">
              {language === 'hi' ? 'वाणी AI (VOICE)' : 'VAANI AI (VOICE)'}
            </span>
          </div>
        </button>

        {/* Encrypted 1-on-1 Chat Trigger (Hidden when already on /chat) */}
        {pathname !== '/chat' && (
          <Link
            href="/chat"
            className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95"
            title="Open Encrypted 1-on-1 Disaster Support Chat">
            
            <Lock className="w-4 h-4 text-emerald-200" />
            <span className="font-black text-xs tracking-wider uppercase">
              {language === 'hi' ? 'सुरक्षित चैट' : 'SECURE CHAT'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          </Link>
        )}
      </div>);

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
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
                <span className="text-[10px] bg-purple-950/70 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/40 font-bold flex items-center space-x-1">
                  <span>🎙️ BILINGUAL AI</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-xs text-purple-100/90 font-medium">
                  {language === 'hi' ?
                  'आवाज से सुरक्षित आश्रय, रेड ज़ोन, सड़क मार्ग, एन्क्रिप्टेड चैट व SOS निर्देश दें' :
                  'Speak naturally for Safe Shelters, Red-Zone Risk, Road Routes, Chat & SOS'}
                </p>
                <span className="text-[10px] text-purple-200 bg-white/15 px-1.5 py-0.2 rounded font-mono">
                  💾 DB SYNCED
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
              title="Toggle Language">
              
              🌐 {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Clear Database history */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-colors"
              title="Clear Saved Chat Database">
              
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeaking();
                closeVoiceAssistant();
              }}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Close Voice Assistant">
              
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
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                
                {!isUser &&
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                }
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                  isUser ?
                  'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-purple-600/20' :
                  'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'}`
                  }>
                  
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-between font-mono ${
                    isUser ? 'text-purple-200' : 'text-slate-400'}`
                    }>
                    
                    <span>{msg.time}</span>
                    {!isUser &&
                    <button
                      onClick={() => speakFemaleText(msg.text)}
                      className="hover:text-purple-500 transition-colors ml-2 flex items-center space-x-1"
                      title="Replay Voice Audio">
                      
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[9px]">Replay</span>
                      </button>
                    }
                  </div>
                </div>
              </div>);

          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Live Audio Visualizer / Pulse Bar when listening */}
        {isListening &&
        <div className="px-4 py-3 bg-purple-50 dark:bg-purple-950/40 border-t border-purple-200 dark:border-purple-800/60 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <div className="flex space-x-1 items-center">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-10 bg-purple-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                <span className="w-1.5 h-7 bg-pink-500 rounded-full animate-bounce [animation-delay:0.45s]"></span>
              </div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {language === 'hi' ? 'आपकी आवाज सुनी जा रही है... बोलिए' : 'Listening to your voice... Speak now'}
              </span>
            </div>
            {transcript &&
          <span className="text-xs italic text-slate-600 dark:text-slate-300 max-w-xs truncate font-mono">
                "{transcript}"
              </span>
          }
          </div>
        }

        {/* Quick Suggestion Voice Chips */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
          {samplePrompts.map((prompt, i) =>
          <button
            key={i}
            onClick={() => handleUserQuery(prompt)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all shrink-0 hover:scale-105">
            
              {prompt}
            </button>
          )}
        </div>

        {/* Input & Microphone Action Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
            {/* Big Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isListening ?
              'bg-rose-600 shadow-rose-600/30 animate-pulse' :
              'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30'}`
              }
              title={isListening ? 'Stop Listening' : 'Start Voice Input'}>
              
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={
              language === 'hi' ?
              'माइक दबाकर बोलें या यहाँ लिखें (उदा. निकटतम सुरक्षित आश्रय)...' :
              'Tap Mic to speak or type here (e.g. Find nearest shelter)...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            

            {/* Audio Speech Stop / Play Indicator */}
            {isSpeaking &&
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 transition-colors animate-pulse"
              title="Mute Voice Output">
              
                <VolumeX className="w-5 h-5" />
              </button>
            }

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold shadow-md transition-all hover:scale-105 active:scale-95">
              
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>);

}