import { Grid2D } from "./kommon/grid2D";
import { cameraTransform, deepcopy, last, rotateCtxAroundPoint, single } from "./kommon/kommon";
import { Rect } from "./kommon/rect";
import { Vec2 } from "./kommon/vec2";

const canvas = document.querySelector<HTMLCanvasElement>("#game_canvas")!;
const ctx = canvas.getContext("2d")!;

// actual game logic
class Crate {
  constructor(
    public pos: Vec2,
    public in_water: boolean,
  ) { }
}
class Target {
  constructor(
    public pos: Vec2,
    public index: number,
  ) { }
}
class GameState {
  constructor(
    public trees: Grid2D<boolean>,
    public land: Grid2D<boolean>,
    public crates: Crate[],
    public doors: Grid2D<number | null>,
    public targets: Target[],
    public elephant_butt: Vec2,
    public elephant_dir: Vec2,
  ) { }

  static fromAscii(ascii: string): GameState {
    const chars = Grid2D.fromAscii(ascii);
    const trees = chars.map((_, c) => c == '#');
    const land = chars.map((_, c) => c != 'x');
    const crates = chars.find((_, c) => c == 'c' || "❶❷❸❹".includes(c)).map(({ pos }) => new Crate(pos, false));
    const doors = chars.map((_, c) => "1234".indexOf(c)).map((_, i) => i < 0 ? null : i + 1);
    const targets = chars.map((_, c) => Math.max("①②③④".indexOf(c), "❶❷❸❹".indexOf(c))).find((p, i) => i >= 0).map(({ pos, element }) => new Target(pos, element + 1));
    const elephant_pos = single(chars.find((_, c) => c == 'e')).pos;
    const elephant_head_pos = single(chars.find((_, c) => c == 'f')).pos;
    const elephant_dir = elephant_head_pos.sub(elephant_pos);
    return new GameState(trees, land, crates, doors, targets, elephant_pos, elephant_dir);
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
      this.doors,
      this.targets,
      this.elephant_butt.add(dir),
      this.elephant_dir,
    ).checkElephantPos();
  }

  onlyRotateElephant(new_dir: Vec2): GameState | null {
    return new GameState(
      this.trees,
      this.land,
      this.crates,
      this.doors,
      this.targets,
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
      if (this.crates[k].in_water) continue;
      if (this.crates[k].pos.equal(pos)) {
        const new_pos = pos.add(dir);
        // no multipush in this game; making it multipush 
        // would be as easy as calling again .pushAt here
        if (this.obstacleAt(new_pos) || this.anyCrateAt(new_pos)) return null;
        new_crates[k] = new Crate(new_pos, this.waterAt(new_pos));
      }
    }

    return new GameState(
      this.trees,
      this.land,
      new_crates,
      this.doors,
      this.targets,
      this.elephant_butt,
      this.elephant_dir,
    );
  }

  anyCrateAt(pos: Vec2): boolean {
    for (let crate of this.crates) {
      if (crate.in_water) continue;
      if (crate.pos.equal(pos)) return true;
    }
    return false;
  }

  // out of bounds positions count as no obstacle
  obstacleAt(pos: Vec2): boolean {
    return this.trees.getV(pos, false) || this.closedDoorAt(pos);
  }

  // out of bounds positions count as water
  waterAt(pos: Vec2): boolean {
    return !this.land.getV(pos, false) && !this.crates.some(crate => crate.pos.equal(pos) && crate.in_water);
  }

  closedDoorAt(pos: Vec2): boolean {
    const door_id = this.doors.getV(pos, null);
    if (door_id == null) return false;
    return this.doorsClosed(door_id);
  }

  doorsClosed(door_id: number): boolean {
    for (let target of this.targets) {
      if (target.index != door_id) continue;
      if (!this.anyCrateAt(target.pos)) return true;
    }
    return false;
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

  static drawClosedDoor(): void {
    ctx.beginPath();
    ctx.rect(0, 0.4, 0.12, 0.6);
    ctx.rect(0.88, 0.4, 0.12, 0.6);
    ctx.fillStyle = "#525753";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(0.12, 0.4, 0.76, 0.6);
    ctx.fillStyle = "#bb6746";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0.5, 0.5179, 0.5137, 3.3674, 6.0461);
    ctx.fillStyle = "#525753";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0.5, 0.5179, 0.3979, 3.4366, 5.9769);
    ctx.fillStyle = "#bb6746";
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 0.05;
    ctx.moveTo(0.25, 1);
    ctx.lineTo(0.25, 0.2084);
    ctx.moveTo(0.4167, 1);
    ctx.lineTo(0.4167, 0.1288);
    ctx.moveTo(0.5833, 1);
    ctx.lineTo(0.5833, 0.1288);
    ctx.moveTo(0.75, 1);
    ctx.lineTo(0.75, 0.2084);
    ctx.strokeStyle = "#803512";
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(0.12, 0.46, 0.76, 0.08);
    ctx.rect(0.12, 0.76, 0.76, 0.08);
    ctx.fillStyle = "#bb6746";
    ctx.fill();
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = "#803512";
    ctx.stroke();
  }

  draw() {
    ctx.resetTransform();

    // clear background
    ctx.fillStyle = "#26c7d7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'butt';

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

    this.doors.forEachV((pos, door) => {
      if (door == null) return;
      cameraTransform(ctx, camera_bounds);
      ctx.translate(pos.x, pos.y);

      if (this.doorsClosed(door)) {
        GameState.drawClosedDoor();
      } else {
        ctx.beginPath();
        ctx.rect(0, 0.4, 0.12, 0.6);
        ctx.rect(0.88, 0.4, 0.12, 0.6);
        ctx.fillStyle = "#525753";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0.5, 0.5179, 0.4555, 3.3977, 6.0158);
        ctx.lineWidth = 0.12;
        ctx.strokeStyle = "#525753";
        ctx.stroke();
      }
    });

    this.targets.forEach(target => {
      cameraTransform(ctx, camera_bounds);
      ctx.translate(target.pos.x, target.pos.y);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 1, 1);
      ctx.clip();

      ctx.beginPath();
      ctx.lineDashOffset
      ctx.lineWidth = 0.222;
      ctx.moveTo(0.25, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, 0.25);
      ctx.moveTo(0.75, 0);
      ctx.lineTo(1, 0);
      ctx.lineTo(1, 0.25);
      ctx.moveTo(0.25, 1);
      ctx.lineTo(0, 1);
      ctx.lineTo(0, 0.75);
      ctx.moveTo(0.75, 1);
      ctx.lineTo(1, 1);
      ctx.lineTo(1, 0.75);
      ctx.strokeStyle = "#8b5723";
      ctx.stroke();

      ctx.restore();
    });

    this.crates.forEach(crate => {
      cameraTransform(ctx, camera_bounds);
      ctx.translate(crate.pos.x, crate.pos.y);

      ctx.beginPath();
      ctx.rect(0.15, 0.15, 0.7, 0.7);
      ctx.fillStyle = crate.in_water ? "#655e39" : "#ca6e43";
      ctx.fill();

      ctx.beginPath();
      ctx.rect(0.25, 0.25, 0.5, 0.5);
      ctx.fillStyle = crate.in_water ? "#778952" : "#eea160";
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(0.2, 0.2);
      ctx.lineTo(0.8, 0.8);
      ctx.strokeStyle = crate.in_water ? "#655e39" : "#ca6e43";
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(0.2, 0.8);
      ctx.lineTo(0.8, 0.2);
      ctx.fillStyle = crate.in_water ? "#655e39" : "#ca6e43";
      ctx.stroke();
    })

    this.drawElephant(camera_bounds);
  }


}

const cur_level_index = 0;

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


type InputKind = { type: 'dir', dir: Vec2 } | { type: 'undo' } | { type: 'reset' };
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
      case "reset":
        if (game_states_history.length > 1) game_states_history.push(GameState.fromAscii(levels_ascii[cur_level_index]))
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
    case "KeyR":
      input_queue.push({ type: 'reset' });
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
