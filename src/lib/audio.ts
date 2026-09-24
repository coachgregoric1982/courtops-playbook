/** Short sideline beep — not a siren. */
export function playBeep(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 784;
    gain.gain.value = 0.07;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    osc.start(t);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.stop(t + 0.18);
    osc.onended = () => {
      void ctx.close();
    };
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }
  } catch {
    /* ignore autoplay / unsupported */
  }
}

type AudioCtx = AudioContext;

let splashCtx: AudioCtx | null = null;
let splashMaster: GainNode | null = null;
let splashActive = false;
let splashCancelled = false;

function getSplashCtx(): AudioCtx | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!splashCtx || splashCtx.state === "closed") {
    splashCtx = new Ctor();
  }
  return splashCtx;
}

function noiseBuffer(ctx: AudioCtx, seconds: number): AudioBuffer {
  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function playNoise(
  ctx: AudioCtx,
  dest: AudioNode,
  t: number,
  dur: number,
  peak: number,
  fromHz: number,
  toHz: number,
  q = 0.8,
) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur + 0.04);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;
  filter.frequency.setValueAtTime(fromHz, t);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, toHz), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.03, dur * 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function playTone(
  ctx: AudioCtx,
  dest: AudioNode,
  t: number,
  dur: number,
  peak: number,
  freq: number,
  freqEnd = freq,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqEnd !== freq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + dur);
  }
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function cueMark(ctx: AudioCtx, dest: AudioNode, t: number) {
  playTone(ctx, dest, t, 0.11, 0.11, 98, 62);
  playNoise(ctx, dest, t, 0.07, 0.05, 900, 420, 0.5);
}

function cueTick(ctx: AudioCtx, dest: AudioNode, t: number, hz: number) {
  playNoise(ctx, dest, t, 0.045, 0.045, hz, hz * 1.4, 1.2);
  playTone(ctx, dest, t, 0.04, 0.03, hz, hz * 0.9, "triangle");
}

function cueSweep(ctx: AudioCtx, dest: AudioNode, t: number) {
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(-0.7, t);
  panner.pan.linearRampToValueAtTime(0.7, t + 0.32);
  panner.connect(dest);
  playNoise(ctx, panner, t, 0.32, 0.055, 400, 2200, 0.55);
}

function cuePop(ctx: AudioCtx, dest: AudioNode, t: number) {
  playTone(ctx, dest, t, 0.07, 0.07, 620, 340, "triangle");
}

function cuePass(ctx: AudioCtx, dest: AudioNode, t: number) {
  playNoise(ctx, dest, t, 0.2, 0.07, 280, 1600, 0.7);
}

function cueSwish(ctx: AudioCtx, dest: AudioNode, t: number) {
  playNoise(ctx, dest, t, 0.22, 0.08, 1800, 4200, 0.9);
  playTone(ctx, dest, t + 0.02, 0.16, 0.035, 1640, 880);
}

function cueStamp(ctx: AudioCtx, dest: AudioNode, t: number) {
  playTone(ctx, dest, t, 0.12, 0.09, 196, 130);
  playNoise(ctx, dest, t, 0.08, 0.04, 700, 280, 0.6);
}

function cueExit(ctx: AudioCtx, dest: AudioNode, t: number) {
  playNoise(ctx, dest, t, 0.28, 0.05, 1400, 220, 0.5);
  playTone(ctx, dest, t, 0.18, 0.04, 220, 90);
}

const SPLASH_CUES: { at: number; play: (ctx: AudioCtx, dest: AudioNode, t: number) => void }[] = [
  { at: 120, play: cueMark },
  { at: 180, play: (c, d, t) => cueTick(c, d, t, 1400) },
  { at: 320, play: (c, d, t) => cueTick(c, d, t, 1600) },
  { at: 460, play: (c, d, t) => cueTick(c, d, t, 1800) },
  { at: 550, play: cueSweep },
  { at: 720, play: cuePop },
  { at: 860, play: cuePass },
  { at: 1000, play: cueSwish },
  { at: 1120, play: cueStamp },
  { at: 2550, play: cueExit },
];

/** Board ticks, pass, and net swish timed to the splash. Not music. */
export function playSplashSfx(startedAtMs: number): void {
  if (splashActive) return;
  splashCancelled = false;
  try {
    const ctx = getSplashCtx();
    if (!ctx) return;
    const start = () => {
      if (splashCancelled || splashActive) return;
      if (ctx.state !== "running") return;
      splashActive = true;
      if (splashMaster) {
        try {
          splashMaster.disconnect();
        } catch {
          /* already gone */
        }
      }
      const master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(ctx.destination);
      splashMaster = master;
      const elapsedMs = Date.now() - startedAtMs;
      const now = ctx.currentTime;
      for (const cue of SPLASH_CUES) {
        const wait = (cue.at - elapsedMs) / 1000;
        if (wait < -0.04) continue;
        cue.play(ctx, master, now + Math.max(0, wait));
      }
    };
    if (ctx.state === "running") start();
    else void ctx.resume().then(start);
  } catch {
    splashActive = false;
  }
}

export function cutSplashSfx(whoosh = false): void {
  splashCancelled = true;
  const ctx = splashCtx;
  const master = splashMaster;
  splashActive = false;
  splashMaster = null;
  if (master && ctx) {
    try {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      window.setTimeout(() => {
        try {
          master.disconnect();
        } catch {
          /* ignore */
        }
      }, 80);
    } catch {
      try {
        master.disconnect();
      } catch {
        /* ignore */
      }
    }
  }
  if (whoosh) {
    try {
      const live = getSplashCtx();
      if (!live) return;
      void live.resume();
      const g = live.createGain();
      g.gain.value = 0.7;
      g.connect(live.destination);
      cueExit(live, g, live.currentTime);
      window.setTimeout(() => {
        try {
          g.disconnect();
        } catch {
          /* ignore */
        }
      }, 400);
    } catch {
      /* ignore */
    }
  }
}
