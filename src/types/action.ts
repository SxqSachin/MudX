import { UnitData } from "./Unit";

export type Action = {
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