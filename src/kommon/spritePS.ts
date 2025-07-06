// from https://github.com/increpare/PuzzleScript/blob/master/src/js/colors.js
const puzzlescript_palette: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  grey: "#9d9d9d",
  darkgrey: "#697175",
  lightgrey: "#cccccc",
  gray: "#9d9d9d",
  darkgray: "#697175",
  lightgray: "#cccccc",
  red: "#be2633",
  darkred: "#732930",
  lightred: "#e06f8b",
  brown: "#a46422",
  darkbrown: "#493c2b",
  lightbrown: "#eeb62f",
  orange: "#eb8931",
  yellow: "#f7e26b",
  green: "#44891a",
  darkgreen: "#2f484e",
  lightgreen: "#a3ce27",
  blue: "#1d57f7",
  lightblue: "#B2DCEF",
  darkblue: "#1B2632",
  purple: "#342a97",
  pink: "#de65e2"
};

export function canvasFromAscii(colors: string[], ascii: string): HTMLCanvasElement {
  let ascii_lines = ascii.trim().split("\n").map(x => x.trim());
  let spr_h = ascii_lines.length;
  let spr_w = ascii_lines[0].length;
  if (ascii_lines.some(line => line.length !== spr_w)) {
    throw new Error(`The given ascii is not a proper rectangle: ${ascii}`);
  }

  let sprite_canvas = document.createElement("canvas");
  sprite_canvas.width = spr_w;
  sprite_canvas.height = spr_h;
  let sprite_ctx = sprite_canvas.getContext("2d")!;
  sprite_ctx.imageSmoothingEnabled = false;

  for (let j = 0; j < spr_h; j++) {
    for (let i = 0; i < spr_w; i++) {
      let char = ascii_lines[j][i];
      if (char === ".") continue;
      let color_name_or_hex = colors[Number(char)].toLowerCase();
      sprite_ctx.fillStyle = puzzlescript_palette[color_name_or_hex] || color_name_or_hex;
      sprite_ctx.fillRect(i, j, 1, 1);
    }
  }
  return sprite_canvas;
}
