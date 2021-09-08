export type ConditionString = string;
export type ConditionExpr = string;

export type ConditionComparator = '>' | '<' | '>=' | '<=' | '==' | '!=' | '&' | '|';
export type ConditionConnector = '|' | '&';

export type ConditionParseRes = {
  lValue: string | number | boolean,
  rValue: string | number | boolean,
  operator: (a: any, b: any) => boolean,
}

export type ConditionExprUnit = {
  expr: string | ConditionExprUnit,
}

export type ConditionAtom = {
  lVal: number | string | ConditionAtom;
  rVal: number | string | ConditionAtom;
  comparator: ConditionComparator;
}

export type ConditionUnit = {
  atom: ConditionAtom;
}

export type ConditionParsedExpr = {
  unitList: ConditionUnit[],
}