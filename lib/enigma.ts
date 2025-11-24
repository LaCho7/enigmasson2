export type RotorSpec = {
  wiring: string; // Câblage du rotor : correspondance A..Z
  notch: string; // Lettre(s) déclenchant l'avance du rotor suivant
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
  position: number; // Position actuelle du rotor (0..25)

  constructor(spec: RotorSpec, position = 0) {
    this.wiring = spec.wiring;
    this.notch = spec.notch;
    this.position = position % 26;
  }

  step() {
    // Avancer le rotor d'une position
    this.position = (this.position + 1) % 26;
  }

  atNotch() {
    // Vérifie si le rotor est à la position d'encliquetage
    return this.notch.split("").some(n => A(n) === this.position);
  }

  forward(c: number) {
    // Passage du signal dans le rotor (avant)
    const shifted = (c + this.position) % 26;
    const mapped = A(this.wiring[shifted]);
    return (mapped - this.position + 26) % 26;
  }

  backward(c: number) {
    // Passage du signal dans le rotor (retour)
    const shifted = (c + this.position) % 26;
    const idx = this.wiring.indexOf(C(shifted));
    return (idx - this.position + 26) % 26;
  }
}

export class Plugboard {
  map: number[];
  constructor(pairs: Array<[string, string]>) {
    // Initialiser la permutation comme identité
    this.map = Array.from({ length: 26 }, (_, i) => i);
    // Appliquer les échanges de paires
    pairs.slice(0, 3).forEach(([a, b]) => {
      const ia = A(a.toUpperCase());
      const ib = A(b.toUpperCase());
      this.map[ia] = ib;
      this.map[ib] = ia;
    });
  }
  swap(n: number) {
    // Appliquer la permutation du tableau
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
    // Mécanisme de double-step d'Enigma
    const right = this.rotors[2];
    const middle = this.rotors[1];
    const left = this.rotors[0];

    // Si le rotor central est à l'encliquetage, avancer le central et le gauche
    if (middle.atNotch()) {
      middle.step();
      left.step();
    }
    // Si le rotor droit est à l'encliquetage, avancer le central
    if (right.atNotch()) {
      middle.step();
    }
    // Toujours avancer le rotor droit
    right.step();
  }

  encodeChar(ch: string) {
    // Traitement d'un caractère unique
    if (!/[A-Z]/.test(ch)) return ch;
    this.stepRotors();
    let c = A(ch);
    // Signal passe par le tableau de connexions
    c = this.plugboard.swap(c);
    // Passage dans les rotors (droite vers gauche)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    // Passage par le reflecteur
    c = A(this.reflector[c]);
    // Retour par les rotors (gauche vers droite)
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }
    // Passage final par le tableau de connexions
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
