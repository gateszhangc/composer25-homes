const palette = {
  ink: "#f5f5f5",
  dark: "#0a0a0a",
  panel: "#111111",
  red: "#ef4444",
  crimson: "#b91c1c",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  olive: "#65a30d",
  green: "#22c55e",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  gray: "#6b7280",
  muted: "#888888",
};

function scaleCanvas(canvas, logicalWidth, logicalHeight) {
  const ratio = window.devicePixelRatio || 1;
  const w = Math.round(logicalWidth * ratio);
  const h = Math.round(logicalHeight * ratio);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function drawComposerLogo(ctx, x, y, size) {
  const unit = size / 72;
  ctx.save();
  ctx.translate(x, y);

  const cx = 36 * unit;
  const cy = 36 * unit;
  const radius = 34 * unit;

  // Outer ring - dark circle with subtle border
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = palette.dark;
  ctx.fill();

  // Gradient ring
  const grad = ctx.createLinearGradient(0, 0, 72 * unit, 72 * unit);
  grad.addColorStop(0, palette.blue);
  grad.addColorStop(0.5, palette.violet);
  grad.addColorStop(1, palette.cyan);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5 * unit;
  ctx.stroke();

  // Inner decorative ring
  ctx.beginPath();
  ctx.arc(cx, cy, 26 * unit, 0, Math.PI * 2);
  ctx.strokeStyle = palette.gray;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1 * unit;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // "C" letter shape - stylized
  ctx.beginPath();
  ctx.arc(cx + 4 * unit, cy, 16 * unit, -Math.PI * 0.25, Math.PI * 0.85);
  ctx.strokeStyle = palette.blue;
  ctx.lineWidth = 4 * unit;
  ctx.stroke();

  // Small digital dots around the ring
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const dotR = 30 * unit;
    const dx = cx + Math.cos(angle) * dotR;
    const dy = cy + Math.sin(angle) * dotR;
    ctx.beginPath();
    ctx.arc(dx, dy, 1.2 * unit, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? palette.cyan : palette.violet;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // "2.5" text
  ctx.fillStyle = palette.ink;
  ctx.font = `bold ${10 * unit}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("2.5", cx + 4 * unit, cy + 22 * unit);

  // Small sparkle / accent near top-right
  ctx.beginPath();
  ctx.arc(54 * unit, 12 * unit, 2 * unit, 0, Math.PI * 2);
  ctx.fillStyle = palette.cyan;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(54 * unit, 12 * unit, 4 * unit, 0, Math.PI * 2);
  ctx.strokeStyle = palette.cyan;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1 * unit;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawBrandLogo() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 22, 22);
  ctx.clearRect(0, 0, 22, 22);
  drawComposerLogo(ctx, 0, 0, 22);
}

function drawBrandLogoFooter() {
  const canvas = document.getElementById("brand-canvas-footer");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 20, 20);
  ctx.clearRect(0, 0, 20, 20);
  drawComposerLogo(ctx, 0, 0, 20);
}

function drawHeroLogo() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 96, 96);
  ctx.clearRect(0, 0, 96, 96);
  drawComposerLogo(ctx, 0, 0, 96);
}

function installCanvasFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  drawComposerLogo(ctx, 0, 0, 72);

  const link = document.querySelector("link[rel='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = canvas.toDataURL("image/png");
  document.head.appendChild(link);
}

function drawAll() {
  drawBrandLogo();
  drawBrandLogoFooter();
  drawHeroLogo();
}

function initCanvas() {
  drawAll();
  installCanvasFavicon();
}

function safeInit() {
  const brandCanvas = document.getElementById("brand-canvas");
  if (brandCanvas && brandCanvas.getContext) {
    initCanvas();
  } else {
    requestAnimationFrame(safeInit);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInit);
} else {
  safeInit();
}
