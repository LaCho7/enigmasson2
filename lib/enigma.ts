export type RotorSpec = {
  wiring: string; // 26-letter mapping A..Z
  notch: string; // letter(s) that cause next rotor to step
};

const A = (c: string) => c.charCodeAt(0) - 65;
const C = (n: number) => String.fromCharCode((n % 26) + 65);

function rotateString(s: string, n: number) {
  const shift = ((n % 26) + 26) % 26;
  return s.slice(shift) + s.slice(0, shift);
}

export class Rotor {
  wiring: string;
  notch: string;
  position: number; // 0..25 representing ring setting offset

  constructor(spec: RotorSpec, position = 0) {
    this.wiring = spec.wiring;
    this.notch = spec.notch;
    this.position = position % 26;
  }

  step() {
    this.position = (this.position + 1) % 26;
  }

  atNotch() {
    return this.notch.split("").some(n => A(n) === this.position);
  }

  forward(c: number) {
    // input 0..25
    const shifted = (c + this.position) % 26;
    const mapped = A(this.wiring[shifted]);
    return (mapped - this.position + 26) % 26;
  }

  backward(c: number) {
    const shifted = (c + this.position) % 26;
    const idx = this.wiring.indexOf(C(shifted));
    return (idx - this.position + 26) % 26;
  }
}

export class Plugboard {
  map: number[];
  constructor(pairs: Array<[string, string]>) {
    this.map = Array.from({ length: 26 }, (_, i) => i);
    pairs.slice(0, 3).forEach(([a, b]) => {
      const ia = A(a.toUpperCase());
      const ib = A(b.toUpperCase());
      this.map[ia] = ib;
      this.map[ib] = ia;
    });
  }
  swap(n: number) {
    return this.map[n];
  }
}

export class Enigma {
  rotors: Rotor[];
  reflector: string;
  plugboard: Plugboard;

  constructor(rotorSpecs: RotorSpec[], positions: number[], plugPairs: Array<[string, string]> = []) {
    this.rotors = rotorSpecs.map((r, i) => new Rotor(r, positions[i] ?? 0));
    this.reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; // Reflector B
    this.plugboard = new Plugboard(plugPairs);
  }

  stepRotors() {
    // Implement double-step mechanism
    // If middle rotor is at notch, it and left rotor step (double-step)
    const right = this.rotors[2];
    const middle = this.rotors[1];
    const left = this.rotors[0];

    // If middle at notch, step middle and left
    if (middle.atNotch()) {
      middle.step();
      left.step();
    }
    // If right at notch, step middle
    if (right.atNotch()) {
      middle.step();
    }
    // Always step rightmost
    right.step();
  }

  encodeChar(ch: string) {
    if (!/[A-Z]/.test(ch)) return ch;
    this.stepRotors();
    let c = A(ch);
    c = this.plugboard.swap(c);
    // forward through rotors right->left
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    // reflector
    c = A(this.reflector[c]);
    // back through rotors left->right
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }
    c = this.plugboard.swap(c);
    return C(c);
  }

  encodeText(text: string) {
    const up = text.toUpperCase();
    let out = "";
    for (const ch of up) {
      out += this.encodeChar(ch);
    }
    return out;
  }
}

export const DEFAULT_ROTORS: RotorSpec[] = [
  { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" }, // I
  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" }, // II
  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }, // III
];

export const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
