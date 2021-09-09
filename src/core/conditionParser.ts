import { ConditionAtom, ConditionComparator, ConditionCompareVal, ConditionExpr, ConditionExprUnit, ConditionSimpleCompareVal, ConditionUnit } from '../types/condition';
import { objectExprParser } from './objectExprParser';

const SINGLE_OPERATOR_CHAR = ['>', '<', '=', '!'];
// const CONDITION_CONNECTOR_CHAR = ['&', '|'];

function pureExpr(expr: string): string {
  return expr.replace(/ /g, '');
}

export function parseToExprAtom(expr: ConditionExpr) {
  expr = pureExpr(expr);

  const exprCharArr = expr.split('');

  let exprStack: ConditionExprUnit[] = [];
  for (const char of exprCharArr) {
    if (!exprStack.length) {
      exprStack[0] = { expr: '', children: [] };
    }

    if (char === '(') {
      exprStack.push({expr: '', children: []});
      continue;
    }
    if (char === ')') {
      const lastExprBlock = exprStack.pop();
      if (lastExprBlock) {
        exprStack[exprStack.length - 1].children?.push(lastExprBlock);
      }

      continue;
    }
    exprStack[exprStack.length - 1].expr += char;
  }

  const runSplit = (unit: ConditionExprUnit) => {
    if (!unit.expr) {
      return unit;
    }
    if (unit.expr.includes('&')) {
      unit.children?.push(...splitConditionExpr(unit.expr));
      unit.expr = '&';
    } else if (unit.expr.includes('|')) {
      unit.children?.push(...splitConditionExpr(unit.expr));
      unit.expr = '|';
    }

    return unit;
  };

  const findC = (unit: ConditionExprUnit) => {
    unit = runSplit(unit)
    if (!unit.children) {
      return unit;
    }

    unit.children = unit.children.map((subUnit: any) => {
      return findC(subUnit);
    });

    return unit;
  };

  let outUnit = exprStack[0];
  outUnit = findC(outUnit)

  let outU = parseSimpleConditionExprUnit(outUnit);

  return outU;
}

export function parseSimpleConditionExprUnit(conditionExprUnit: ConditionExprUnit): ConditionUnit {
  // 表达式不是连接符，直接就是一个表达式
  if (isConditionExpr(conditionExprUnit.expr)) {
    return {
      expr: parseSimpleConditionExprToAtom(conditionExprUnit.expr),
    }
  }

  return {
    expr: conditionExprUnit.expr,
    children: conditionExprUnit.children?.map(expr => {
      if (typeof expr === 'string') {
        return parseSimpleConditionExprToAtom(expr);
      }
      return parseSimpleConditionExprUnit(expr);
    })
  }
}

export function isConditionExpr(expr: string): boolean {
  const atom = parseSimpleConditionExprToAtom(expr);
  return !!atom.lVal && !!atom.rVal;
}

export function parseSimpleConditionExprToAtom(conditionExpr: ConditionExpr): ConditionAtom {
  const comparator = parseSimpleConditionComparator(conditionExpr);

  const exprPart = conditionExpr.split(comparator);

  return {
    lVal: exprPart[0],
    rVal: exprPart[1],
    comparator,
  };
}

export function runConditionAtom({ lVal, rVal, comparator}: ConditionAtom, object: any): boolean {
  const normalizeVal = (val: ConditionCompareVal): ConditionSimpleCompareVal => {
    let res: ConditionSimpleCompareVal = 0;
    switch (typeof lVal) {
      case 'boolean':
      case 'number':
        res = lVal;
        break;
      case 'string':
        res = objectExprParser(lVal, object);
        break;
      default:
        break;
    }

    return res;
  }

  lVal = normalizeVal(lVal);
  rVal = normalizeVal(rVal);

  let res: boolean = false;

  switch (comparator) {
    case '!=':
      res = lVal != rVal;
      break;
    case '==':
      res = lVal == rVal;
      break;
    case '>=':
      res = lVal >= rVal;
      break;
    case '<=':
      res = lVal <= rVal;
      break;
    case '==':
      res = lVal == rVal;
      break;
    case '>':
      res = lVal > rVal;
      break;
    case '<':
      res = lVal < rVal;
      break;
    case '&':
      res = !!(lVal && rVal);
      break;
    case '|':
      res = !!(lVal || rVal);
      break;
  }

  return res;
}

// 将复合条件表达式拆分为单个条件表达式
export function splitConditionExpr(expr: ConditionExpr): ConditionExpr[] {
  const exprArr: ConditionExpr[] = [];
  expr = pureExpr(expr);

  exprArr.push(...expr.split(/[\|\&]/g));

  return exprArr.filter(expr => !!expr);
}

// 解析单个条件表达式的比较运算符
export function parseSimpleConditionComparator(expr: ConditionExpr): ConditionComparator {
  expr = expr.replace(/ /g, '');

  let lastChar: string = '';
  let operator: string = '';

  expr.split('').forEach(char => {
    switch (char) {
      case '>':
      case '<':
      case '!':
        lastChar = char;
        break;
      case '=':
        if (SINGLE_OPERATOR_CHAR.includes(lastChar)) {
          operator = (lastChar + char);
        } else {
          lastChar = char;
        }
        break;
      default:
        if (!operator && SINGLE_OPERATOR_CHAR.includes(lastChar)) {
          operator = lastChar;
        }
        break;
    }
    lastChar = char;
  });

  return operator as ConditionComparator;
}