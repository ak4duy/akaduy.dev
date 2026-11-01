import { STEP_SECONDS, clock, hits, sinceLast, strum } from "@/src/scripts/audio";
import { CRUSH } from "@/src/scripts/crush";
import { LES_PAUL } from "@/src/scripts/lespaul";
import { PEDALBOARD } from "@/src/scripts/pedalboard";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const FRAME_MS = 1000 / 30;
const ALPHA_LEVELS = 5;
const EQ_RAMP = "▁▂▃▄▅▆▇█";
const NOTES = "♪♫♬♩";
// Block glyphs drawn as rects (x, y, w, h as cell fractions) so rows join without gaps.
const BLOCKS: Record<string, [number, number, number, number]> = {
  ...Object.fromEntries([...EQ_RAMP].map((glyph, i) => [glyph, [0, 1 - (i + 1) / 8, 1, (i + 1) / 8]])),
  "▀": [0, 0, 1, 0.5],
  "▌": [0, 0, 0.5, 1],
  "▐": [0.5, 0, 0.5, 1],
};
const FOREGROUND = 0;
const BAND = [1, 2, 3, 4];

type Cell = { glyph: string; color: number } | null;
const SPRITE_COLORS: Record<string, number> = { "1": 1, "2": FOREGROUND, "3": 2, "4": 5, "5": 4, "6": 6, "7": 7, "8": 8, "9": 3, "0": 9 };
const parseSprite = (art: string): Cell[][] => art.split("\n").filter(Boolean).map((line) => {
  const row: Cell[] = [];
  let color = FOREGROUND;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "$" && line[i + 1] in SPRITE_COLORS) {
      color = SPRITE_COLORS[line[++i]];
      continue;
    }
    row.push(line[i] === " " ? null : { glyph: line[i], color });
  }
  return row;
});
const sprite = parseSprite(LES_PAUL);
const SPRITE_W = Math.max(...sprite.map((row) => row.length));
const SPRITE_H = sprite.length;
const amp = parseSprite(CRUSH);
const AMP_W = Math.max(...amp.map((row) => row.length));
const AMP_H = amp.length;
const GRILLE = "▒";
const board = parseSprite(PEDALBOARD);
const BOARD_W = Math.max(...board.map((row) => row.length));
const BOARD_H = board.length;

function hash(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function readPalette(element: Element) {
  const style = getComputedStyle(element);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return [token("--foreground"), token("--bocchi"), token("--nijika"), token("--ryo"), token("--kita"), "#8a6a52", "#ee8a2e", "#b8611c", "#4a4552", token("--muted-foreground")];
}

class Surface {
  ctx: CanvasRenderingContext2D;
  width = 0;
  height = 0;
  cols = 0;
  rows = 0;
  cw = 7;
  ch = 15;
  dpr = 1;
  palette: string[];
  private buckets = new Map<number, Array<[number, number, string]>>();

  constructor(public canvas: HTMLCanvasElement, private fontSize: number) {
    this.ctx = canvas.getContext("2d")!;
    this.palette = readPalette(canvas);
    this.resize();
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const dpr = (this.dpr = Math.min(window.devicePixelRatio || 1, 2));
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.font = `${this.fontSize}px ${getComputedStyle(this.canvas).fontFamily}`;
    this.ctx.textBaseline = "top";
    this.cw = this.ctx.measureText("M").width || this.fontSize * 0.6;
    this.ch = Math.round(this.fontSize * 1.25);
    this.width = width;
    this.height = height;
    this.cols = Math.ceil(width / this.cw);
    this.rows = Math.ceil(height / this.ch);
  }

  put(col: number, row: number, glyph: string, color: number, alpha: number) {
    if (alpha < 0.03 || col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    const key = color * 10 + Math.min(ALPHA_LEVELS, Math.ceil(alpha * ALPHA_LEVELS));
    let cells = this.buckets.get(key);
    if (!cells) this.buckets.set(key, (cells = []));
    cells.push([col, row, glyph]);
  }

  flush() {
    const { ctx, palette, dpr } = this;
    const snap = (value: number) => Math.round(value * dpr) / dpr;
    ctx.clearRect(0, 0, this.width, this.height);
    for (const [key, cells] of this.buckets) {
      ctx.fillStyle = palette[Math.floor(key / 10)];
      ctx.globalAlpha = (key % 10) / ALPHA_LEVELS;
      for (const [col, row, glyph] of cells) {
        const block = BLOCKS[glyph];
        if (block) {
          const left = snap((col + block[0]) * this.cw);
          const top = snap((row + block[1]) * this.ch);
          ctx.fillRect(left, top, snap((col + block[0] + block[2]) * this.cw) - left, snap((row + block[1] + block[3]) * this.ch) - top);
        } else {
          ctx.fillText(glyph, col * this.cw, row * this.ch);
        }
      }
      cells.length = 0;
    }
    ctx.globalAlpha = 1;
  }
}

function drawRoom(s: Surface, t: number, kick: number, snare: number) {
  const floor = s.rows - 1;
  const isFan = (col: number) => hash(col, 7) <= 0.35;
  for (let row = 0; row < floor - 2; row++) {
    for (let col = 0; col < s.cols; col++) {
      const h = hash(col, row);
      if (h > 0.992) s.put(col, row, "·", FOREGROUND, 0.12 + 0.08 * Math.sin(t * 1.5 + h * 50));
    }
  }

  for (let col = 0; col < s.cols; col++) {
    if (!isFan(col)) continue;
    const jump = kick > 0.45 && hash(col, 3) < 0.5 ? 1 : 0;
    const handsUp = snare > 0.3 && hash(col, 5) < 0.35;
    s.put(col, floor - 1 - jump, "o", FOREGROUND, 0.3);
    s.put(col, floor - jump, handsUp ? "Y" : "|", FOREGROUND, 0.22);
  }
}

type Note = { x: number; y: number; seed: number; glyph: string; color: number; born: number };
type Rig = { surface: Surface; notes: Note[]; strumAt: number; lastStep: number };

const createRig = (canvas: HTMLCanvasElement | null, fontSize = 9): Rig | null =>
  canvas ? { surface: new Surface(canvas, fontSize), notes: [], strumAt: -Infinity, lastStep: -1 } : null;

function spawnNotes(g: Rig, t: number, count: number, x: number, y: number) {
  for (let i = 0; i < count; i++) {
    g.notes.push({
      x: x + (Math.random() - 0.5) * 12 * g.surface.cw,
      y,
      seed: Math.random() * 10,
      glyph: NOTES[Math.floor(Math.random() * NOTES.length)],
      color: BAND[Math.floor(Math.random() * BAND.length)],
      born: t,
    });
  }
}

function drawNotes(g: Rig, t: number, x: number, y: number) {
  const s = g.surface;
  const step = Math.floor(t / STEP_SECONDS);
  if (step !== g.lastStep) {
    g.lastStep = step;
    if (hits("kick", step)) spawnNotes(g, t, 1, x, y);
  }
  g.notes = g.notes.filter((note) => {
    const age = t - note.born;
    if (age > 3) return false;
    const nx = note.x + Math.sin(age * 3 + note.seed) * 10;
    const ny = note.y - age * 32;
    s.put(Math.floor(nx / s.cw), Math.floor(ny / s.ch), note.glyph, note.color, 1 - age / 3);
    return ny > 0;
  });
}

function guitarOrigin(s: Surface) {
  return { x: s.width / 2, y: s.height * 0.62 };
}

function drawGuitar(g: Rig, t: number, kick: number) {
  const s = g.surface;
  const strumming = Math.exp(-(t - g.strumAt) * 3);
  const shake = Math.round(strumming * Math.sin(t * 40));
  const cx = s.cols / 2;
  const cy = (s.rows - 2) / 2;
  const tick = Math.floor(t * 16) % 2 === 0;

  for (let row = 0; row < s.rows - 1; row++) {
    for (let col = 0; col < s.cols; col++) {
      const sx = Math.floor(col - cx + SPRITE_W / 2) - shake;
      const sy = Math.floor(row - cy + SPRITE_H / 2);
      const cell = sprite[sy]?.[sx];
      if (!cell) continue;
      let glyph = cell.glyph;
      if (tick && glyph === "│") glyph = "╎";
      s.put(col, row, glyph, cell.color, 1);
    }
  }

  const origin = guitarOrigin(s);
  drawNotes(g, t, origin.x, origin.y);

  const energy = 0.5 + 0.5 * strumming;
  for (let col = 0; col < s.cols; col++) {
    const center = 1 - Math.abs(col - cx) / cx;
    const level = energy * (0.15 + 0.55 * kick * center + 0.3 * hash(col, Math.floor(t * 12)));
    const glyph = EQ_RAMP[Math.max(0, Math.min(EQ_RAMP.length - 1, Math.floor(level * EQ_RAMP.length)))];
    s.put(col, s.rows - 1, glyph, BAND[Math.floor((col / s.cols) * BAND.length)], 0.7);
  }
}

function drawAmp(g: Rig, t: number, kick: number) {
  const s = g.surface;
  const left = Math.floor((s.cols - AMP_W) / 2);
  const top = s.rows - AMP_H;
  const cx = AMP_W / 2;
  const cy = AMP_H / 2;
  const ring = sinceLast("kick", t) * 24;
  const rumble = kick > 0.7 ? Math.round(Math.sin(t * 55)) : 0;
  amp.forEach((row, y) => row.forEach((cell, x) => {
    if (!cell) return;
    let alpha = 1;
    if (cell.glyph === GRILLE) {
      const distance = Math.hypot((x - cx) / 2, y - cy);
      const cone = Math.max(0, 1 - distance / 5) * kick;
      const wave = Math.max(0, 1 - Math.abs(distance - ring)) * Math.exp(-ring / 8);
      alpha = 0.6 + 0.4 * Math.min(1, cone + wave * 0.7);
    } else if (cell.color === FOREGROUND) {
      alpha = 0.75 + 0.25 * kick;
    }
    s.put(left + x + rumble, top + y, cell.glyph, cell.color, alpha);
  }));
  drawNotes(g, t, (left + cx) * s.cw, (top + cy) * s.ch);
}

function drawPedalboard(g: Rig, t: number, kick: number, snare: number) {
  const s = g.surface;
  const left = Math.floor((s.cols - BOARD_W) / 2);
  const top = Math.floor((s.rows - BOARD_H) / 2);
  board.forEach((row, y) => row.forEach((cell, x) => {
    if (!cell) return;
    let alpha = 1;
    if (cell.glyph === "•") alpha = 0.25 + 0.75 * kick;
    else if (cell.glyph === GRILLE) alpha = 0.55 + 0.45 * snare;
    s.put(left + x, top + y, cell.glyph, cell.color, alpha);
  }));
  drawNotes(g, t, (left + BOARD_W / 2) * s.cw, top * s.ch);
}

let room: Surface | null = null;
let guitar: Rig | null = null;
let ampRig: Rig | null = null;
let pedalRig: Rig | null = null;
let resizeObserver: ResizeObserver | null = null;
let raf = 0;
let lastFrame = 0;
let frames = 0;

function render(t: number) {
  const kick = Math.exp(-sinceLast("kick", t) * 7);
  const snare = Math.exp(-sinceLast("snare", t) * 9);
  const surfaces = [room, guitar?.surface, ampRig?.surface, pedalRig?.surface];
  // React islands can replace the canvas after mount; reader themes change colors.
  if (surfaces.some((s) => s && !s.canvas.isConnected)) return mount();
  if (frames++ % 30 === 0) surfaces.forEach((s) => s && (s.palette = readPalette(s.canvas)));
  if (room) {
    drawRoom(room, t, kick, snare);
    room.flush();
  }
  if (guitar) {
    drawGuitar(guitar, t, kick);
    guitar.surface.flush();
  }
  if (ampRig) {
    drawAmp(ampRig, t, kick);
    ampRig.surface.flush();
  }
  if (pedalRig) {
    drawPedalboard(pedalRig, t, kick, snare);
    pedalRig.surface.flush();
  }
}

function frame(now: number) {
  raf = requestAnimationFrame(frame);
  if (now - lastFrame < FRAME_MS) return;
  lastFrame = now;
  render(clock());
}

function start() {
  cancelAnimationFrame(raf);
  if (reducedMotion.matches) render(1.3);
  else raf = requestAnimationFrame(frame);
}

function mount() {
  resizeObserver?.disconnect();
  const roomCanvas = document.querySelector<HTMLCanvasElement>("[data-live-house]");
  const guitarCanvas = document.querySelector<HTMLCanvasElement>("[data-guitar] canvas");
  room = roomCanvas ? new Surface(roomCanvas, 12) : null;
  guitar = createRig(guitarCanvas);
  ampRig = createRig(document.querySelector<HTMLCanvasElement>("[data-amp] canvas"));
  pedalRig = createRig(document.querySelector<HTMLCanvasElement>("[data-pedalboard] canvas"), 8);
  const surfaces = [room, guitar?.surface, ampRig?.surface, pedalRig?.surface].filter((s): s is Surface => Boolean(s));
  resizeObserver = new ResizeObserver(() => {
    surfaces.forEach((s) => s.resize());
    if (reducedMotion.matches) render(1.3);
  });
  surfaces.forEach((s) => resizeObserver!.observe(s.canvas));
  start();
}

document.addEventListener("click", (event) => {
  if ((event.target as Element).closest?.("[data-guitar]") && guitar) {
    strum();
    const t = clock();
    guitar.strumAt = t;
    const origin = guitarOrigin(guitar.surface);
    spawnNotes(guitar, t, 5, origin.x, origin.y);
  }
});

reducedMotion.addEventListener("change", start);
document.fonts?.ready.then(() => {
  room?.resize();
  guitar?.surface.resize();
  ampRig?.surface.resize();
  pedalRig?.surface.resize();
});
document.addEventListener("astro:page-load", mount);
mount();
