export type XID = string;
export const EMPTY_XID = "__EMPTY_XID__";
export function isEmptyXID(xid: XID): boolean {
  return xid === EMPTY_XID;
}

export type XSerializable = {
  xid: XID;
}

export interface XObject extends XSerializable {
  serialize(): string;
}