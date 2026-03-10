/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useStoryEngine } from './game/engine';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { Phone, MoreVertical, Signal, Battery, Wifi, User, UserRound, Save, Timer, RotateCcw, Gauge } from 'lucide-react';

export default function App() {
  const { messages, choices, isTyping, makeChoice, startGame, resetGame, hasStarted, gameState, isSaving, timeRemaining, timeTotal, isGameOver, manualSave } = useStoryEngine();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, choices, isGameOver]);

  const handleReset = () => {
    setShowConfirmReset(false);
    resetGame();
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans text-zinc-100">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">The Last Message</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            You found an old, cracked phone in the forest. It has no SIM card, but suddenly, a message appears.
          </p>
          
          <div className="mb-6">
            <p className="text-sm text-zinc-500 mb-3 uppercase tracking-wider font-semibold">Select your gender</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setSelectedGender('male')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedGender === 'male' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}
              >
                <User className="w-6 h-6" />
                <span>Male</span>
              </button>
              <button 
                onClick={() => setSelectedGender('female')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedGender === 'female' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}
              >
                <UserRound className="w-6 h-6" />
                <span>Female</span>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-zinc-500 mb-3 uppercase tracking-wider font-semibold">Difficulty</p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setDifficulty('easy')}
                className={`flex-1 py-2 px-2 rounded-lg border transition-all flex flex-col items-center gap-1 text-xs ${difficulty === 'easy' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}
              >
                <span>Easy</span>
              </button>
              <button 
                onClick={() => setDifficulty('normal')}
                className={`flex-1 py-2 px-2 rounded-lg border transition-all flex flex-col items-center gap-1 text-xs ${difficulty === 'normal' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}
              >
                <span>Normal</span>
              </button>
              <button 
                onClick={() => setDifficulty('hard')}
                className={`flex-1 py-2 px-2 rounded-lg border transition-all flex flex-col items-center gap-1 text-xs ${difficulty === 'hard' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}
              >
                <span>Hard</span>
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2 flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3" />
              Affects timed choices duration
            </p>
          </div>

          <button 
            onClick={() => selectedGender && startGame(selectedGender, difficulty)}
            disabled={!selectedGender}
            className={`w-full font-semibold py-4 rounded-xl transition-all shadow-lg ${selectedGender ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-900/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          >
            Turn on Phone
          </button>
        </div>
      </div>
    );
  }

  const avatarSeed = gameState.charGender === 'female' ? 'Maya' : 'Felix';
  const avatarBg = gameState.charGender === 'female' ? '3f51b5' : '009688';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center sm:p-4 font-sans relative">
      <div className="w-full max-w-md h-[100dvh] sm:h-[85vh] bg-[#0b141a] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl sm:border-[8px] border-zinc-800 relative">
        
        {/* Status Bar */}
        <div className="h-7 bg-[#0b141a] w-full flex justify-between items-center px-6 text-[11px] text-zinc-400 font-medium z-20">
          <span>20:26</span>
          <div className="flex gap-1.5 items-center">
            {isSaving && (
              <div className="flex items-center gap-1 text-emerald-500 animate-pulse mr-2">
                <Save className="w-3 h-3" />
                <span>Saving...</span>
              </div>
            )}
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-3" />
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 z-10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden shrink-0 relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=${avatarBg}`} 
              alt={gameState.charName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-zinc-100 font-semibold text-base truncate">UNKNOWN CONTACT</h2>
            <p className="text-emerald-500 text-xs truncate">
              {isTyping ? 'typing...' : 'online'}
            </p>
          </div>
          <button onClick={() => setShowConfirmReset(true)} className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors" title="Restart Game">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
            backgroundBlendMode: 'overlay',
            backgroundColor: '#0b141a'
          }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isTyping && (
            <div className="self-start bg-[#202c33] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm w-16">
              <TypingIndicator />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Choices Area */}
        <div className="bg-[#202c33] p-3 min-h-[80px] flex flex-col justify-end relative">
          {timeRemaining !== null && timeTotal !== null && (
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
              <div 
                className="h-full bg-red-500 transition-all duration-100 ease-linear"
                style={{ width: `${(timeRemaining / timeTotal) * 100}%` }}
              />
            </div>
          )}
          
          {isGameOver ? (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300 mt-2">
              <button
                onClick={manualSave}
                className="bg-[#202c33] border border-zinc-700 hover:bg-[#2a3942] text-zinc-300 text-sm py-3 px-4 rounded-xl text-center transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Game State
              </button>
              <button
                onClick={handleReset}
                className="bg-[#005c4b] hover:bg-[#006b58] text-zinc-100 text-sm py-3 px-4 rounded-xl text-center transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          ) : choices.length > 0 && !isTyping ? (
            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300 mt-2">
              {timeRemaining !== null && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1 px-2 animate-pulse">
                  <Timer className="w-4 h-4" />
                  <span>Make a choice quickly!</span>
                </div>
              )}
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => makeChoice(choice)}
                  className="bg-[#005c4b] hover:bg-[#006b58] text-zinc-100 text-sm py-3 px-4 rounded-xl text-left transition-colors active:scale-[0.98]"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="h-12 bg-[#2a3942] rounded-full flex items-center px-4 text-zinc-500 text-sm mt-2">
              {isTyping ? 'Waiting for response...' : '...'}
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirm Dialog */}
      {showConfirmReset && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Restart Game?</h3>
            <p className="text-zinc-400 mb-6">Are you sure you want to restart? All your current progress will be lost.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
