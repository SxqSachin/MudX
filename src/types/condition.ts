export type Condition = {
  lValue: boolean,
  operator: (a: any, b: any) => boolean,
  rValue: boolean,
}