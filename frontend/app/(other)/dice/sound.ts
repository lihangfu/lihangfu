// 扩展全局 Window 接口以支持 webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Simple audio synthesizer to avoid external assets
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.error("Web Audio API is not supported in this browser");
      return null;
    }
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playDiceSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;

  // 1. Shake/Rattle noise (White noise burst)
  const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();

  // Filter to make it sound more like plastic tumbling
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.setValueAtTime(800, t);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noiseGain.gain.setValueAtTime(0.5, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
  noise.start(t);

  // 2. Impact sound (Multiple hits for realism)
  const createKnock = (delay: number, volume: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(200, t + delay);
    osc.frequency.exponentialRampToValueAtTime(50, t + delay + 0.1);

    gain.gain.setValueAtTime(volume, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t + delay);
    osc.stop(t + delay + 0.1);
  };

  createKnock(0.1, 0.3);
  createKnock(0.25, 0.2);
  createKnock(0.4, 0.1);
};
