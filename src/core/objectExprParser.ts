import { ExprString } from "../types/expr";

export function objectExprParser(expr: ExprString, object: any): any {
  expr = expr.replace(/ /g, '');
  const exprPart = expr.split('.');

  let curRes = object;
  let curKey = '';
  exprPart.every(key => {
    curKey = key;

    if (!curRes[curKey]) {
      curRes = null;
      return false;
    }

    curRes = curRes[curKey];

    return true;
  })

  return curRes;
}

export function SingleObjectExprParser(expr: ExprString, object: any) {
  const exprPart = expr.split('.');

  const k1 = exprPart[0];
  const k2 = exprPart[1];

  if (!object[k1]) {
    return {};
  }

  if (!object[k1][k2]) {
    return {};
  }

  return object[k1][k2];
}
