import { ExprString } from "../types/expr";

export function SingleObjectExprParser(expr: ExprString, object: any) {
  const exprPart = expr.split('.');

  const key = exprPart[1];

  return object[key];
}