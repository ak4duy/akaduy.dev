const BPM = 118;
export const STEP_SECONDS = 60 / BPM / 4;

const PATTERNS = {
  kick: ["x.....x.x.......", "x.....x.x.......", "x.....x.x.......", "x.....x.x..x...."],
  snare: ["....x.......x...", "....x.......x...", "....x.......x...", "....x.......x.xx"],
  hat: ["x.x.x.x.x.x.x.x.", "x.x.x.x.x.x.x.x.", "x.x.x.x.x.x.x.x.", "x.x.x.x.x.x....."],
};
export type Drum = keyof typeof PATTERNS;

export function hits(drum: Drum, step: number) {
  const bar = PATTERNS[drum][((Math.floor(step / 16) % 4) + 4) % 4];
  return bar[((step % 16) + 16) % 16] === "x";
}

export function clock() {
  return performance.now() / 1000;
}

export function sinceLast(drum: Drum, seconds: number) {
  const step = Math.floor(seconds / STEP_SECONDS);
  for (let back = 0; back < 32; back++) {
    if (hits(drum, step - back)) return seconds - (step - back) * STEP_SECONDS;
  }
  return Infinity;
}

let context: AudioContext | null = null;
let master: GainNode;

function audio() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.45;
    master.connect(context.createDynamicsCompressor()).connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function envelope(ctx: AudioContext, time: number, peak: number, decay: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peak, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
  gain.connect(master);
  return gain;
}

const pluckBuffers = new Map<number, AudioBuffer>();

function pluckBuffer(ctx: AudioContext, frequency: number) {
  let buffer = pluckBuffers.get(frequency);
  if (buffer) return buffer;
  buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2.4), ctx.sampleRate);
  const samples = buffer.getChannelData(0);
  const period = Math.max(2, Math.round(ctx.sampleRate / frequency));
  for (let i = 0; i < period; i++) samples[i] = Math.random() * 2 - 1;
  for (let i = period; i < samples.length; i++) {
    samples[i] = 0.497 * (samples[i - period] + samples[i - period + 1]);
  }
  pluckBuffers.set(frequency, buffer);
  return buffer;
}

const CHORDS = [
  [82.41, 123.47, 164.81, 246.94],
  [130.81, 196, 261.63, 392],
  [98, 146.83, 196, 293.66],
  [146.83, 220, 293.66, 440],
];
let chord = 0;

export function strum() {
  const ctx = audio();
  CHORDS[chord++ % CHORDS.length].forEach((frequency, index) => {
    const source = ctx.createBufferSource();
    source.buffer = pluckBuffer(ctx, frequency);
    source.connect(envelope(ctx, ctx.currentTime + index * 0.018, 0.35, 2.2));
    source.start(ctx.currentTime + index * 0.018);
  });
}
