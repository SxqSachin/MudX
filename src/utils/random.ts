export function getRandomString(): string {
  return Math.random().toString(36).substring(2) + Date.now();
}
export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollDice(face: number = 20): number {
  return getRandomInt(1, face);
}

export function d100(): number {
  return rollDice(100);
}
export function d20(): number {
  return rollDice(20);
}
export function d10(): number {
  return rollDice(10);
}
export function d6(): number {
  return rollDice(6);
}
export function d4(): number {
  return rollDice(4);
}

export const Dice = {
  d4: 0,
  d6: 0,
  d10: 0,
  d20: 0,
  d100: 0,
};

Object.defineProperty(Dice, 'd4', {
  get() {
    return d4();
  },
});
Object.defineProperty(Dice, 'd6', {
  get() {
    return d6();
  },
});
Object.defineProperty(Dice, 'd10', {
  get() {
    return d10();
  },
});
Object.defineProperty(Dice, 'd20', {
  get() {
    return d20();
  },
});
Object.defineProperty(Dice, 'd100', {
  get() {
    return d100();
  },
});

//@ts-ignore
global.Dice = Dice;
