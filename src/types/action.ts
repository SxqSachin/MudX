import { UnitData } from "./Unit";

type ActionEffectData = {
  effectTo: keyof UnitData;
  val: number;
} | {
  effectTo: 'item';
  itemID: string;
  val: number;
} | {
  effectTo: 'skill';
  skillID: string;
  val: number;
}

export type Action = {
  target: 'target' | 'self';
} & ActionEffectData;