export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

const shieldChanger = new EventTarget();

interface shield {
  health: number;
  max: number;
  damage: number;
}

function shieldTracker(): shield {
  return {
    health: count,
    max: 10,
    damage: 10 - count,
  };
}

shieldChanger.addEventListener("shield-changed", (event) => {
  const shield = (event as CustomEvent<shield>).detail;
  drawMeter(shield);
});

function drawMeter(tracker: shield) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < tracker.health ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${tracker.health} / ${tracker.max} shield`, 12, 100);
  readout.textContent = `Shield charge: ${tracker.health} / 10`;
}

function updateStats(shieldChange: Event) {
  const eventTracker = (shieldChange as CustomEvent<shield>).detail;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(eventTracker);
}

function renderStats(tracker: shield) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${tracker.health} · Missing charge: ${tracker.damage}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  shieldChanger.dispatchEvent(
    new CustomEvent<shield>("shield-changed", {
      detail: shieldTracker(),
    }),
  );
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(shieldTracker());
  shieldChanger.addEventListener("shield-changed", updateStats);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldChanger.removeEventListener("shield-changed", updateStats);
  panel.remove();
  panel = null;
};
drawMeter(shieldTracker());
