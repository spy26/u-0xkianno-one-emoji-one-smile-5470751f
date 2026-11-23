// One Emoji, One Smile — make.fun competition entry.
// The entry is exactly one emoji: 😄 (U+1F604, Grinning Face with Smiling Eyes).
// Why this one: a big open grin with smiling eyes is the warmest hello a
// stranger can send — pure joy at first glance, universal, with no irony,
// no intimacy, and no flirtation. It is warm without being the first smiley
// that comes to mind, so it reads as chosen, not default.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EMOJI = "😄";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 8 characters, not
// only whitespace. One codepoint, four bytes — the smallest a full emoji gets,
// which also wins the size tie-break against any longer text.
const chars = [...EMOJI];
if (chars.length !== 1 || EMOJI.trim().length === 0) {
  throw new Error("entry must be exactly one emoji");
}
if (Buffer.byteLength(EMOJI, "utf8") !== 4) {
  throw new Error("entry must be a single 4-byte emoji");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. No trailing newline: the file is the emoji, byte for byte.
const targets = [process.env.MAKEFUN_OUTPUT_DIR, "/output"].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), EMOJI, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the emoji, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== EMOJI) {
  throw new Error("entry.txt does not contain exactly the chosen emoji");
}

console.log(EMOJI);
