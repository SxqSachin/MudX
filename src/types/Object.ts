export type XID = string;

export type XSerializable = {
  xid: XID;
}

export interface XObject extends XSerializable {
}