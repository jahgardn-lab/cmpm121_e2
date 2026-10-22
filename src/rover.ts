export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const headings = ["North", "East", "South", "West"];
const x = { num: 2 };
const y = { num: 2 };
let direction = 0;

const compass = [
  { direction: "North", offset: -1, axis: y },
  { direction: "East", offset: 1, axis: x },
  { direction: "South", offset: 1, axis: y },
  { direction: "West", offset: -1, axis: x },
];

interface Command {
  execute(): void;
}

class rightTurn implements Command {
  execute(): void {
    direction = (direction + 1) % 4;
    drawRover();
  }
}

class forward implements Command {
  execute(): void {
    compass[direction].axis.num = Math.max(
      0,
      Math.min(
        4,
        compass[direction].axis.num + compass[direction].offset,
      ),
    );
    drawRover();
  }
}

const moveForward = new forward();
const turnRight = new rightTurn();

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x.num * 56, 38 + y.num * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x.num}, ${y.num}) · Facing: ${
    headings[direction]
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  drawRover();
  moveForward.execute();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  drawRover();
  turnRight.execute();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x.num = 2;
  y.num = 2;
  direction = 0;
  drawRover();
};
drawRover();
