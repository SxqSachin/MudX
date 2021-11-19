import { Action, } from "./action";
import { XID } from "./Object";

export type StateID = string;
export type State = {
  id: StateID;
  name: string;

  description?: string | (() => string);

  stackable: boolean;

  actions: Action | Action[];
} & Omit<StateData, 'xid'>;

export type StateData = {
  xid: XID;
  id: StateID;
  remainTime: number;
}