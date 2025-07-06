import { Grid2D } from "./kommon/grid2D";
import { cameraTransform, deepcopy, last, rotateCtxAroundPoint, single } from "./kommon/kommon";
import { Rect } from "./kommon/rect";
import { Vec2 } from "./kommon/vec2";

const canvas = document.querySelector<HTMLCanvasElement>("#game_canvas")!;
const ctx = canvas.getContext("2d")!;

// actual game logic
class GameState {
  constructor(
    public trees: Grid2D<boolean>,
    public land: Grid2D<boolean>,
    public crates: Vec2[],
    public elephant_butt: Vec2,
    public elephant_dir: Vec2,
  ) { }

  static fromAscii(ascii: string): GameState {
    const chars = Grid2D.fromAscii(ascii);
    const trees = chars.map((_, c) => c == '#');
    const land = chars.map((_, c) => c != 'x');
    const crates = chars.find((_, c) => c == 'c').map(({ pos }) => pos);
    const elephant_pos = single(chars.find((_, c) => c == 'e')).pos;
    const elephant_head_pos = single(chars.find((_, c) => c == 'f')).pos;
    const elephant_dir = elephant_head_pos.sub(elephant_pos);
    return new GameState(trees, land, crates, elephant_pos, elephant_dir);
  }

  get elephant_head(): Vec2 {
    return this.elephant_butt.add(this.elephant_dir);
  }

  // General philosophy: many small functions that modify part of the game state,
  // returning null if it's not a valid modification. In TypeScript, "foo?.bar()"
  // means "if foo is null, return undefined; else, return foo.bar()", and we use
  // "xxx ?? null" to convert undefineds to null (javascript is quirky like that)
  afterInput(dir: Vec2): GameState | null {
    if (dir.equal(this.elephant_dir)) {
      // move elephant forward
      return this.
        pushAt(this.elephant_head.add(dir), dir)?.
        onlyMoveElephant(dir) ?? null;
    }
    if (dir.equal(this.elephant_dir.neg())) {
      // move elephant backward
      return this.
        pushAt(this.elephant_butt.add(dir), dir)?.
        onlyMoveElephant(dir) ?? null;
    }

    // rotating elephant
    return this.
      pushAt(this.elephant_head.add(dir), dir)?.
      pushAt(this.elephant_butt.add(dir), this.elephant_dir.neg())?.
      onlyRotateElephant(dir) ?? null;
  }

  onlyMoveElephant(dir: Vec2): GameState | null {
    return new GameState(
      this.trees,
      this.land,
      this.crates,
      this.elephant_butt.add(dir),
      this.elephant_dir,
    ).checkElephantPos();
  }

  onlyRotateElephant(new_dir: Vec2): GameState | null {
    return new GameState(
      this.trees,
      this.land,
      this.crates,
      this.elephant_butt,
      new_dir,
    ).checkElephantPos();
  }

  checkElephantPos(): GameState | null {
    if (this.waterAt(this.elephant_butt)) return null;
    if (this.obstacleAt(this.elephant_butt)) return null;
    if (this.obstacleAt(this.elephant_head)) return null;
    return this;
  }

  // TODO: crates in water
  pushAt(pos: Vec2, dir: Vec2): GameState | null {
    // can't push obstacles!
    if (this.obstacleAt(pos)) return null;

    const new_crates = deepcopy(this.crates);
    for (let k = 0; k < this.crates.length; k++) {
      if (this.crates[k].equal(pos)) {
        const new_pos = pos.add(dir);
        // no multipush in this game; making it multipush 
        // would be as easy as calling again .pushAt here
        if (this.obstacleAt(new_pos)) return null;
        new_crates[k] = new_pos;
      }
    }

    return new GameState(
      this.trees,
      this.land,
      new_crates,
      this.elephant_butt,
      this.elephant_dir,
    );
  }

  // out of bounds positions count as non trees
  obstacleAt(pos: Vec2): boolean {
    return this.trees.getV(pos, false);
  }

  // out of bounds positions count as water
  waterAt(pos: Vec2): boolean {
    return !this.land.getV(pos, false);
  }

  drawElephant(camera_bounds: Rect): void {
    cameraTransform(ctx, camera_bounds);
    ctx.translate(this.elephant_butt.x, this.elephant_butt.y);
    // a bit hacky to work with the commands as they originally were
    rotateCtxAroundPoint(ctx, new Vec2(-0.5, -0.5), this.elephant_dir.turns() + 0.5);

    // tail
    ctx.beginPath();
    ctx.moveTo(0.8765, 0.4422);
    ctx.lineTo(0.8765, 0.5578);
    ctx.lineTo(0.98, 0.5);
    ctx.closePath();
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // body
    ctx.beginPath();
    ctx.arc(0.4, 0.5, 0.48, -2.5559, 2.5559);
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.04;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.translate(-1, 0);

    // TUSK (upper)
    ctx.beginPath();
    ctx.moveTo(0.3128, 0.4);
    ctx.lineTo(0.2, 0.3457);
    ctx.lineWidth = 0.1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.lineWidth = 0.06;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f9f9f9";
    ctx.stroke();

    // TUSK (lower)
    ctx.beginPath();
    ctx.moveTo(0.3128, 0.6);
    ctx.lineTo(0.2, 0.6543);
    ctx.lineWidth = 0.1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.lineWidth = 0.06;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f9f9f9";
    ctx.stroke();

    // TRUNK
    ctx.beginPath();
    ctx.rect(0.02, 0.4, 0.3, 0.2);
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.04;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Trunk lines
    ctx.beginPath();
    ctx.moveTo(0.11, 0.4);
    ctx.lineTo(0.11, 0.6);
    ctx.moveTo(0.18, 0.4);
    ctx.lineTo(0.18, 0.6);
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // BODY
    ctx.beginPath();
    ctx.arc(0.7, 0.5, 0.4, 0.7227, 5.5590);
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.04;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // EARS (upper)
    ctx.beginPath();
    ctx.arc(0.7, 0.2, 0.18, 2.4674, 6.4728);
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // EARS (lower)
    ctx.beginPath();
    ctx.arc(0.7, 0.8, 0.18, -6.4728, -2.4674);
    ctx.fillStyle = "#949eae";
    ctx.fill();
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // EYES (upper)
    ctx.beginPath();
    ctx.arc(0.45, 0.375, 0.125, 0, 7);
    ctx.fillStyle = "#f9f9f9";
    ctx.fill();
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // EYES (lower)
    ctx.beginPath();
    ctx.arc(0.45, 0.625, 0.125, 0, 7);
    ctx.fillStyle = "#f9f9f9";
    ctx.fill();
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Eye pupils
    ctx.beginPath();
    ctx.arc(0.4, 0.4, 0.025, 0, 7);
    ctx.arc(0.4, 0.6, 0.025, 0, 7);
    ctx.fillStyle = "#000";
    ctx.fill();
  }

  draw() {
    ctx.resetTransform();

    // clear background
    ctx.fillStyle = "#26c7d7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const level_bounds = new Rect(Vec2.zero, this.land.size);
    const camera_bounds = level_bounds.withAspectRatio(canvas.width / canvas.height, "grow", "center");

    this.land.forEachV((pos, is_land) => {
      if (is_land) {
        cameraTransform(ctx, camera_bounds);
        ctx.translate(pos.x, pos.y);

        ctx.fillStyle = "#92ad10";
        ctx.fillRect(0.001, 0.001, 0.998, 0.998);
        ctx.fillStyle = "#4d9929";
        ctx.fillRect(0.08, 0.08, 0.84, 0.84);
      }
    });

    this.trees.forEachV((pos, is_tree) => {
      if (is_tree) {
        cameraTransform(ctx, camera_bounds);
        ctx.translate(pos.x, pos.y);

        ctx.beginPath();
        ctx.moveTo(0.5, 0.5);
        ctx.lineTo(0.3, 1);
        ctx.lineTo(0.7, 1);
        ctx.closePath();
        ctx.fillStyle = "#5c2c06";
        ctx.fill();

        ctx.fillStyle = "#06402b";
        ctx.beginPath();
        ctx.arc(0.35, 0.55, 0.3, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.65, 0.55, 0.3, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0.5, 0.3, 0.3, 0, 7);
        ctx.fill();
      }
    })

    this.crates.forEach(pos => {
      cameraTransform(ctx, camera_bounds);
      ctx.translate(pos.x, pos.y);

      ctx.beginPath();
      ctx.rect(0.15, 0.15, 0.7, 0.7);
      ctx.fillStyle = "#ca6e43";
      ctx.fill();

      ctx.beginPath();
      ctx.rect(0.25, 0.25, 0.5, 0.5);
      ctx.fillStyle = "#eea160";
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(0.2, 0.2);
      ctx.lineTo(0.8, 0.8);
      ctx.strokeStyle = "#ca6e43";
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(0.2, 0.8);
      ctx.lineTo(0.8, 0.2);
      ctx.strokeStyle = "#ca6e43";
      ctx.stroke();
    })

    this.drawElephant(camera_bounds);
  }


}

const levels_ascii = [
  `
####xxx
#.①#xxx
#..####
#①..fe#
#c.c..1
#..####
xxxxxxx
`,
];

type InputKind = { type: 'dir', dir: Vec2 } | { type: 'undo' };
const input_queue: InputKind[] = [];

const game_states_history: GameState[] = [GameState.fromAscii(levels_ascii[0])];

let last_timestamp = 0;
// main loop; engine logic lives here
function every_frame(cur_timestamp: number) {
  // in seconds
  let delta_time = (cur_timestamp - last_timestamp) / 1000;
  last_timestamp = cur_timestamp;

  // handle resize
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    // .clientWidth is the element's real size, .width is a canvas-specific property: the rendering size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  // update
  while (input_queue.length > 0) {
    const cur_input = input_queue.shift()!;
    switch (cur_input.type) {
      case "dir":
        const new_state = last(game_states_history).afterInput(cur_input.dir);
        if (new_state != null) {
          game_states_history.push(new_state);
        }
        break;
      case "undo":
        if (game_states_history.length > 1) game_states_history.pop();
        break;
    }
  }

  // draw
  last(game_states_history).draw();

  requestAnimationFrame(every_frame);
}

document.addEventListener("keydown", event => {
  if (event.repeat) return;
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      input_queue.push({ type: 'dir', dir: Vec2.yneg });
      break;
    case "ArrowDown":
    case "KeyS":
      input_queue.push({ type: 'dir', dir: Vec2.ypos });
      break;
    case "ArrowLeft":
    case "KeyA":
      input_queue.push({ type: 'dir', dir: Vec2.xneg });
      break;
    case "ArrowRight":
    case "KeyD":
      input_queue.push({ type: 'dir', dir: Vec2.xpos });
      break;
    case "KeyZ":
      input_queue.push({ type: 'undo' });
      break;
    default:
      break;
  }
});

// The loading screen is done in HTML so it loads instantly
const loading_screen_element = document.querySelector<HTMLDivElement>("#loading_screen")!;

// By the time we run this code, everything's loaded and we're ready to start
loading_screen_element.innerText = "Press to start!";
// It's good practice to wait for user input, and also required if your game has sound
document.addEventListener("pointerdown", _event => {
  loading_screen_element.style.opacity = "0";
  requestAnimationFrame(every_frame);
}, { once: true });
