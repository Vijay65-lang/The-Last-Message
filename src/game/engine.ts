import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoryNodes } from './story';
import { playNotification, startSuspenseMusic, stopSuspenseMusic, playExplosion, playHeartbeat, playError, startBGM, stopBGM } from './audio';

export type Message = {
  id: string;
  sender: 'char' | 'player' | 'system';
  text: string;
  image?: string;
  timestamp: Date;
  status?: 'sent' | 'read';
};

export type GameState = {
  playerGender: 'male' | 'female' | null;
  charName: string;
  charGender: 'male' | 'female';
  difficulty: 'easy' | 'normal' | 'hard';
  language: 'English' | 'Telugu' | 'Hindi' | 'Tamil';
};

export function useStoryEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<{text: string, nextNode: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timeTotal, setTimeTotal] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    playerGender: null,
    charName: 'Maya',
    charGender: 'female',
    difficulty: 'normal',
    language: 'English'
  });

  // We use a ref to track if a node is currently playing to prevent overlaps
  const isPlayingRef = useRef(false);
  const currentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastMessageSave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages.map((m: any) => ({...m, timestamp: new Date(m.timestamp)})));
        setCurrentNodeId(parsed.currentNodeId);
        setHasStarted(true);
        if (parsed.gameState) {
          setGameState(parsed.gameState);
        }
        
        const nodes = getStoryNodes(parsed.gameState?.charName || 'Maya', parsed.gameState?.charGender || 'female', parsed.gameState?.language || 'English');
        const node = nodes[parsed.currentNodeId];
        if (node) {
          setChoices(node.choices || []);
          if (!node.choices || node.choices.length === 0) {
            setIsGameOver(true);
          }
          if (node.music === 'suspense') startSuspenseMusic();
          else startBGM();
          // We don't restore timers on load to avoid unfair deaths
        }
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  const playNode = useCallback(async (nodeId: string, currentState: GameState) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimeRemaining(null);
    setTimeTotal(null);
    setCurrentNodeId(nodeId);
    setChoices([]);
    setIsGameOver(false);
    
    const nodes = getStoryNodes(currentState.charName, currentState.charGender, currentState.language);
    const node = nodes[nodeId];
    
    if (!node) {
      console.error(`Node ${nodeId} not found`);
      isPlayingRef.current = false;
      return;
    }

    if (node.music === 'suspense') {
      stopBGM();
      startSuspenseMusic();
    } else if (node.music === 'none') {
      stopSuspenseMusic();
      stopBGM();
    } else {
      stopSuspenseMusic();
      startBGM();
    }
    
    if (node.soundEffect) {
      if (node.soundEffect === 'explosion') playExplosion();
      if (node.soundEffect === 'heartbeat') playHeartbeat();
      if (node.soundEffect === 'error') playError();
    }

    for (let i = 0; i < node.messages.length; i++) {
      const msgDef = node.messages[i];
      const sender = msgDef.sender || 'char';
      
      if (sender === 'char') {
        // Mark player messages as read when character starts typing
        setMessages(prev => prev.map(m => m.sender === 'player' && m.status !== 'read' ? { ...m, status: 'read' } : m));
        setIsTyping(true);
        // Dynamic typing delay based on message length for realism
        const dynamicDelay = Math.max(1500, Math.min(msgDef.text.length * 40, 5000));
        await new Promise(r => {
          currentTimeoutRef.current = setTimeout(r, msgDef.delay || dynamicDelay);
        });
        setIsTyping(false);
        playNotification();
      } else {
        await new Promise(r => {
          currentTimeoutRef.current = setTimeout(r, msgDef.delay || 1000);
        });
        if (sender === 'system') {
          playError();
        }
      }
      
      setMessages(prev => {
        const newMsgs = [...prev, {
          id: Math.random().toString(),
          sender,
          text: msgDef.text,
          image: msgDef.image,
          timestamp: new Date()
        }];
        setIsSaving(true);
        localStorage.setItem('lastMessageSave', JSON.stringify({
          messages: newMsgs,
          currentNodeId: nodeId,
          gameState: currentState
        }));
        setTimeout(() => setIsSaving(false), 1000);
        return newMsgs;
      });
    }
    
    if (node.choices && node.choices.length > 0) {
      setChoices(node.choices);
      if (node.timedChoice) {
        const multiplier = currentState.difficulty === 'easy' ? 1.5 : currentState.difficulty === 'hard' ? 0.6 : 1.0;
        const duration = node.timedChoice.duration * multiplier;
        
        setTimeRemaining(duration);
        setTimeTotal(duration);
        const startTime = Date.now();
        const defaultNext = node.timedChoice.defaultNextNode;
        
        timerIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, duration - elapsed);
          setTimeRemaining(remaining);
          
          if (remaining <= 0) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setTimeRemaining(null);
            setTimeTotal(null);
            // Auto-make choice
            isPlayingRef.current = false; // Allow next node to play
            makeChoice({ text: '...', nextNode: defaultNext }, currentState);
          }
        }, 100);
      }
    } else {
      setIsGameOver(true);
    }
    
    isPlayingRef.current = false;
  }, []);

  const startGame = useCallback((playerGender: 'male' | 'female', difficulty: 'easy' | 'normal' | 'hard' = 'normal', language: 'English' | 'Telugu' | 'Hindi' | 'Tamil' = 'English') => {
    const newState: GameState = {
      playerGender,
      charName: playerGender === 'male' ? 'Maya' : 'Mark',
      charGender: playerGender === 'male' ? 'female' : 'male',
      difficulty,
      language
    };
    setGameState(newState);
    setHasStarted(true);
    setMessages([]);
    setChoices([]);
    setIsGameOver(false);
    // Initialize audio context on first user interaction
    playNotification(); 
    startBGM();
    playNode('start', newState);
  }, [playNode]);

  const makeChoice = useCallback((choice: {text: string, nextNode: string}, stateOverride?: GameState) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimeRemaining(null);
    setTimeTotal(null);
    
    const activeState = stateOverride || gameState;
    
    setMessages(prev => {
      const newMsgs = [...prev, {
        id: Math.random().toString(),
        sender: 'player' as const,
        text: choice.text,
        timestamp: new Date(),
        status: 'sent' as const
      }];
      setIsSaving(true);
      localStorage.setItem('lastMessageSave', JSON.stringify({
        messages: newMsgs,
        currentNodeId: choice.nextNode,
        gameState: activeState
      }));
      setTimeout(() => setIsSaving(false), 1000);
      return newMsgs;
    });
    setChoices([]);
    playNode(choice.nextNode, activeState);
  }, [playNode, gameState]);

  const manualSave = useCallback(() => {
    setIsSaving(true);
    // The game is already auto-saved in localStorage, we just trigger the visual indicator
    // to give the user confidence that their completed game state is saved.
    setTimeout(() => setIsSaving(false), 1500);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem('lastMessageSave');
    stopSuspenseMusic();
    stopBGM();
    if (currentTimeoutRef.current) clearTimeout(currentTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    isPlayingRef.current = false;
    setIsTyping(false);
    setMessages([]);
    setChoices([]);
    setCurrentNodeId(null);
    setHasStarted(false);
    setTimeRemaining(null);
    setTimeTotal(null);
    setIsGameOver(false);
    setGameState({
      playerGender: null,
      charName: 'Maya',
      charGender: 'female',
      difficulty: 'normal',
      language: 'English'
    });
  }, []);

  return { messages, choices, isTyping, makeChoice, startGame, resetGame, hasStarted, gameState, isSaving, timeRemaining, timeTotal, isGameOver, manualSave };
}
