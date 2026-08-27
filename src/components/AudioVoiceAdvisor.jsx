'use client';

import React, { useState } from 'react';
import { Volume2, Play } from 'lucide-react';






export default function AudioVoiceAdvisor({
  textToSpeak,
  label = 'Listen to Emergency Audio Briefing'
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
      isPlaying ?
      'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 animate-pulse' :
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 border border-slate-200 dark:border-slate-700'}`
      }
      title={isPlaying ? 'Stop Voice Broadcast' : 'Play Voice Broadcast'}>
      
      {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      <span>{isPlaying ? 'Broadcasting Voice...' : label}</span>
    </button>);

}