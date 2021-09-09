export type ConditionString = string;
export type ConditionExpr = string;

export type ConditionComparator = '>' | '<' | '>=' | '<=' | '==' | '!=' | '&' | '|';
export type ConditionConnector = '|' | '&';

export type ConditionSimpleCompareVal = number | boolean | string;
export type ConditionCompareVal = ConditionSimpleCompareVal | ConditionAtom;

export type ConditionParseRes = {
  lValue: string | number | boolean,
  rValue: string | number | boolean,
  operator: (a: any, b: any) => boolean,
}

export type ConditionExprUnit = {
  expr: string,
  children?: (ConditionExprUnit | string)[];
}

export type ConditionUnit = {
  expr: string | ConditionAtom,
  children?: (ConditionUnit | ConditionAtom)[];
}

export type ConditionAtom = {
  lVal: ConditionCompareVal;
  rVal: ConditionCompareVal;
  comparator: ConditionComparator;
}

export type ConditionParsedExpr = {
  unitList: ConditionUnit[],
}