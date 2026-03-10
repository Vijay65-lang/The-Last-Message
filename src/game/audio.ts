let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playNotification = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playExplosion = () => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter to make it sound like an explosion
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    console.error("Explosion sound failed", e);
  }
};

export const playHeartbeat = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime + 0.4);
    gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch (e) {
    console.error("Heartbeat sound failed", e);
  }
};

export const playError = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(100, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Error sound failed", e);
  }
};

let suspenseOsc: OscillatorNode | null = null;
let suspenseGain: GainNode | null = null;
let lfo: OscillatorNode | null = null;

export const startSuspenseMusic = () => {
  try {
    if (suspenseOsc) return;
    const ctx = getAudioContext();
    
    suspenseOsc = ctx.createOscillator();
    suspenseGain = ctx.createGain();
    
    suspenseOsc.type = 'triangle';
    suspenseOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
    
    // LFO for eerie effect
    lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // slow modulation
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 5;
    
    lfo.connect(lfoGain);
    lfoGain.connect(suspenseOsc.frequency);
    lfo.start();
    
    suspenseGain.gain.setValueAtTime(0, ctx.currentTime);
    suspenseGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 5); // Fade in slowly
    
    suspenseOsc.connect(suspenseGain);
    suspenseGain.connect(ctx.destination);
    
    suspenseOsc.start();
  } catch (e) {
    console.error("Suspense music failed", e);
  }
};

export const stopSuspenseMusic = () => {
  try {
    if (suspenseGain && suspenseOsc && audioCtx) {
      const ctx = audioCtx;
      suspenseGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3);
      suspenseOsc.stop(ctx.currentTime + 3);
      if (lfo) lfo.stop(ctx.currentTime + 3);
      
      setTimeout(() => {
        suspenseOsc = null;
        suspenseGain = null;
        lfo = null;
      }, 3100);
    }
  } catch (e) {
    console.error("Stop suspense failed", e);
  }
};

let bgmOsc: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;

export const startBGM = () => {
  try {
    if (bgmOsc) return;
    const ctx = getAudioContext();
    
    bgmOsc = ctx.createOscillator();
    bgmGain = ctx.createGain();
    
    bgmOsc.type = 'sine';
    bgmOsc.frequency.setValueAtTime(110, ctx.currentTime); // Low A
    
    // Add some slow modulation
    const bgmLfo = ctx.createOscillator();
    bgmLfo.type = 'sine';
    bgmLfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    bgmLfo.connect(lfoGain);
    lfoGain.connect(bgmOsc.frequency);
    bgmLfo.start();

    bgmGain.gain.setValueAtTime(0, ctx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    
    bgmOsc.connect(bgmGain);
    bgmGain.connect(ctx.destination);
    
    bgmOsc.start();
  } catch (e) {
    console.error("BGM failed", e);
  }
};

export const stopBGM = () => {
  if (bgmGain && bgmOsc && audioCtx) {
    bgmGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    bgmOsc.stop(audioCtx.currentTime + 2);
    setTimeout(() => {
      bgmOsc = null;
      bgmGain = null;
    }, 2100);
  }
};
