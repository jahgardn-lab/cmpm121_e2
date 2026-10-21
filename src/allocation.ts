export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

interface shiftMaker {
  production: number;
  consume: number;
  producers: number;
}
const shiftOutput: shiftMaker = {
  production: producers * 3,
  consume: 6,
  producers: 2,
};

interface barGraph {
  text: string;
  fontY: number;
  color: string;
  y: number;
}

const barShow: barGraph[] = [{
  text: `Production: ${shiftOutput.production}`,
  fontY: 102,
  color: "#27766b",
  y: 110,
}, {
  text: `Consumption: ${shiftOutput.consume}`,
  fontY: 154,
  color: "#a44d23",
  y: 162,
}];

function update(shiftOutput: shiftMaker) {
  const balance = shiftOutput.production - shiftOutput.consume;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);
  for (let j = 0; j < barShow.length; j++) {
    makeBar(barShow[j]);
  }

  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${shiftOutput.production} · Consumption: ${shiftOutput.consume} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function makeBar(barShow: barGraph) {
  ctx.fillStyle = barShow.color;
  ctx.fillRect(18, barShow.y, shiftOutput.consume * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(barShow.text, 18, barShow.fontY);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  update(shiftOutput);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  update(shiftOutput);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    update(shiftOutput);
  };
update(shiftOutput);
