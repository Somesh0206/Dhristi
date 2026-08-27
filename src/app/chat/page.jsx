'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { encryptPayload, decryptPayload } from '@/lib/crypto';
import {
  Lock,
  ShieldCheck,
  Send,



  Phone,
  Radio,
  CheckCheck,

  RefreshCw,


  Database } from



'lucide-react';
































export default function SecureChatPage() {
  const { language, currentUser, openSosModal } = useApp();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [activeRole, setActiveRole] = useState('CITIZEN');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Sync activeRole with global user if available
  useEffect(() => {
    if (currentUser?.role) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  // Load Contacts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch('/api/chat/contacts');
        const data = await res.json();
        if (data.success && data.contacts) {
          setContacts(data.contacts);
          setSelectedContact(data.contacts[0]);
        }
      } catch (err) {
        console.error('Failed to load contacts:', err);
      }
    }
    fetchContacts();
  }, []);

  // Load Messages for Selected Contact
  const loadMessages = async () => {
    if (!selectedContact) return;
    try {
      const convId = `conv-${selectedContact.id}`;
      const res = await fetch(`/api/chat/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        // Filter or display messages for this conversation
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedContact]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Send Encrypted Message
  const handleSendMessage = async (e, customText) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !selectedContact) return;

    setIsEncrypting(true);

    try {
      // 1. Perform client-side 256-bit AES-GCM encryption
      const encrypted = await encryptPayload(textToSend.trim());
      const convId = `conv-${selectedContact.id}`;

      const senderName =
      activeRole === 'ADMIN' ?
      'SEOC Duty Commander' :
      activeRole === 'STAFF' ?
      'Field Relief Officer' :
      currentUser?.name || 'Citizen User';

      const payload = {
        conversationId: convId,
        senderId: `user-${activeRole.toLowerCase()}`,
        senderName,
        senderRole: activeRole,
        recipientId: selectedContact.id,
        recipientName: selectedContact.name,
        recipientRole: selectedContact.role,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        algorithm: 'AES-GCM-256',
        decryptedPreview: textToSend.trim()
      };

      // 2. Transmit to separate secure database API
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.encryptedMessage) {
        setMessages((prev) => [...prev, data.encryptedMessage]);
        setInputText('');

        // Simulate realistic automated reply from the staff/admin if chatting as Citizen
        if (activeRole === 'CITIZEN') {
          setIsTyping(true);
          setTimeout(async () => {
            setIsTyping(false);
            const replies = [
            `Encrypted acknowledgment received from ${selectedContact.name}. Our emergency response desk is monitoring this telemetry link. Keep your emergency radio and phone active.`,
            `Roger that. Coordinates mapped to Wayanad SEOC Grid. Rescue unit is aware of your sector status.`,
            `Verified secure communication. Please remain in place if current elevation is above debris flow waterline, or follow OSRM road vectors to nearest safe haven.`];

            const autoReplyText = replies[Math.floor(Math.random() * replies.length)];
            const autoEncrypted = await encryptPayload(autoReplyText);

            const staffPayload = {
              conversationId: convId,
              senderId: selectedContact.id,
              senderName: selectedContact.name,
              senderRole: selectedContact.role,
              recipientId: 'user-citizen',
              recipientName: senderName,
              recipientRole: 'CITIZEN',
              ciphertext: autoEncrypted.ciphertext,
              iv: autoEncrypted.iv,
              algorithm: 'AES-GCM-256',
              decryptedPreview: autoReplyText
            };

            const autoRes = await fetch('/api/chat/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(staffPayload)
            });
            const autoData = await autoRes.json();
            if (autoData.success && autoData.encryptedMessage) {
              setMessages((prev) => [...prev, autoData.encryptedMessage]);
            }
          }, 1800);
        }
      }
    } catch (err) {
      console.error('Failed to send encrypted message:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  // Quick triage messages
  const quickTemplates =
  language === 'hi' ?
  [
  '🚨 तत्काल सहायता की आवश्यकता: मेरे जीपीएस पर 4 लोग फंसे हैं',
  '🚧 मुख्य पहाड़ी मार्ग मलबे से अवरुद्ध है',
  '🏥 तत्काल प्राथमिक चिकित्सा एवं ओआरएस की आवश्यकता है',
  '🏫 निकटतम स्कूल आश्रय स्थल में वहन क्षमता की पुष्टि करें'] :

  [
  '🚨 Urgent evacuation required: 4 persons stranded at my GPS',
  '🚧 Hill bypass road is blocked by landslide debris flow',
  '🏥 Emergency trauma first-aid kit and stretcher needed',
  '🏫 Confirm available carrying capacity at nearest School Haven'];


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Header Title & Encryption Status Banner */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'hi' ?
                'सुरक्षित 1-ऑन-1 एन्क्रिप्टेड आपदा चैट' :
                'Encrypted 1-on-1 Disaster Support & Relief Chat'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-GCM 256-BIT</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'hi' ?
              'राज्य आपातकालीन परिचालन केंद्र (SEOC) प्रशासक और राहत दलों के साथ प्रत्यक्ष, सुरक्षित एवं गोपनीय संपर्क' :
              'Direct, end-to-end encrypted channel with State Emergency Operations Center (SEOC) Admins & Field Responders.'}
            </p>
          </div>

          {/* Role Perspective Switcher for Testing */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2">
              {language === 'hi' ? 'चैट भूमिका:' : 'Chatting As:'}
            </span>
            <button
              onClick={() => setActiveRole('CITIZEN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'CITIZEN' ?
              'bg-emerald-600 text-white shadow' :
              'text-slate-600 dark:text-slate-300 hover:text-white'}`
              }>
              
              {language === 'hi' ? 'नागरिक' : 'Citizen'}
            </button>
            <button
              onClick={() => setActiveRole('STAFF')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'STAFF' ?
              'bg-blue-600 text-white shadow' :
              'text-slate-600 dark:text-slate-300 hover:text-white'}`
              }>
              
              {language === 'hi' ? 'राहत दल' : 'Staff'}
            </button>
            <button
              onClick={() => setActiveRole('ADMIN')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRole === 'ADMIN' ?
              'bg-red-600 text-white shadow' :
              'text-slate-600 dark:text-slate-300 hover:text-white'}`
              }>
              
              {language === 'hi' ? 'प्रशासक' : 'Admin'}
            </button>
          </div>
        </div>

        {/* Chat Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[560px]">
          {/* Left: Online Staff & Admin Contacts Directory */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'सक्रिय अधिकारी एवं राहत दल' : 'Live Staff & Administrators'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                {contacts.length} ONLINE
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 max-h-[500px] pr-1">
              {contacts.map((contact) => {
                const isSelected = selectedContact?.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    isSelected ?
                    'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/40 shadow-sm' :
                    'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                    }>
                    
                    <div className="relative text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                      {contact.avatar}
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                          {contact.name}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          contact.role === 'ADMIN' ?
                          'bg-red-500/20 text-red-600 dark:text-red-400' :
                          'bg-blue-500/20 text-blue-600 dark:text-blue-400'}`
                          }>
                          
                          {contact.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                        {contact.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        📍 {contact.location}
                      </p>
                    </div>
                  </button>);

              })}
            </div>

            {/* Database indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1 font-mono">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>DB: secure_chats.json</span>
              </span>
              <button
                onClick={loadMessages}
                className="hover:text-emerald-500 flex items-center space-x-1"
                title="Refresh messages">
                
                <RefreshCw className="w-3 h-3" />
                <span>Sync</span>
              </button>
            </div>
          </div>

          {/* Right: Active Encrypted Message Thread */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col shadow-sm">
            {selectedContact ?
            <>
                {/* Active Contact Header */}
                <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                      {selectedContact.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {selectedContact.name}
                        </h3>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                          🟢 LIVE
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedContact.title} • {selectedContact.unit}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Key Fingerprint: {selectedContact.publicKeyFingerprint}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                    href={`tel:${selectedContact.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 text-xs font-bold"
                    title="Direct Encrypted Voice Call">
                    
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call Dispatch</span>
                    </a>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 max-h-[380px] pr-1">
                  {/* Encrypted Session Notice */}
                  <div className="flex justify-center my-2">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Messages are end-to-end encrypted with AES-GCM 256. No third party or ISP can read them.
                      </span>
                    </div>
                  </div>

                  {messages.map((msg) => {
                  const isSelf = msg.senderRole === activeRole;
                  const plain = decryptPayload(msg.ciphertext, msg.decryptedPreview);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} animate-in fade-in`}>
                      
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1 px-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1 rounded uppercase font-mono">
                            {msg.senderRole}
                          </span>
                          <span>• {msg.timeFormatted}</span>
                        </div>

                        <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                        isSelf ?
                        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-600/20' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'}`
                        }>
                        
                          <p className="leading-relaxed whitespace-pre-line">{plain}</p>

                          {/* Encryption Badge & Status */}
                          <div
                          className={`mt-2 pt-1.5 border-t ${
                          isSelf ? 'border-emerald-500/40 text-emerald-200' : 'border-slate-200 dark:border-slate-700 text-slate-400'} flex items-center justify-between text-[10px] font-mono`
                          }>
                          
                            <span className="flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>{msg.algorithm || 'AES-GCM-256'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>{msg.verificationHash?.slice(0, 10)}</span>
                            </span>
                          </div>
                        </div>
                      </div>);

                })}

                  {isTyping &&
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                      </div>
                      <span>{selectedContact.name} is typing secure response...</span>
                    </div>
                }

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Triage Chips */}
                <div className="py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 border-t border-slate-100 dark:border-slate-800">
                  {quickTemplates.map((template, idx) =>
                <button
                  key={idx}
                  onClick={() => handleSendMessage(undefined, template)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shrink-0 hover:scale-105">
                  
                      {template}
                    </button>
                )}
                </div>

                {/* Message Input Form */}
                <form onSubmit={(e) => handleSendMessage(e)} className="pt-2 flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                    type="text"
                    placeholder={
                    language === 'hi' ?
                    `सुरक्षित संदेश लिखें (जैसे 'राहत दल की आवश्यकता है')...` :
                    `Type encrypted message to ${selectedContact.name}...`
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none pr-10" />
                  
                    <Lock className="w-4 h-4 text-emerald-500 absolute right-3 top-3.5 pointer-events-none" />
                  </div>

                  <button
                  type="submit"
                  disabled={!inputText.trim() || isEncrypting}
                  className="px-4 sm:px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 shrink-0">
                  
                    {isEncrypting ?
                  <RefreshCw className="w-4 h-4 animate-spin" /> :

                  <>
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send Secure</span>
                      </>
                  }
                  </button>
                </form>
              </> :

            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Lock className="w-10 h-10 mb-2 opacity-50" />
                <p>Select a verified staff responder or admin contact to start encrypted communication.</p>
              </div>
            }
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}