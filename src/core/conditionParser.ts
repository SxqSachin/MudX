import { ConditionAtom, ConditionComparator, ConditionExpr } from '../types/condition';
import { objectExprParser } from './objectExprParser';

const SINGLE_OPERATOR_CHAR = ['>', '<', '=', '!'];
const CONDITION_CONNECTOR_CHAR = ['&', '|'];

function pureExpr(expr: string): string {
  return expr.replace(/ /g, '');
}

export function parseToExprAtom(expr: ConditionExpr) {
  expr = pureExpr(expr);

  const exprCharArr = expr.split('');
  const exprBracketBlock: any[] = [];

  let exprStack: any[] = [{expr: '', child: []}];
  let lastExpr = '';
  for (const char of exprCharArr) {
    if (char === '(') {
      exprStack.push({expr: '', child: []});
      continue;
    }
    
    if (char === ')') {
      const lastExprBlock = exprStack.pop();
      exprStack[exprStack.length - 1].child.push(lastExprBlock);
      continue;
    }
    exprStack[exprStack.length - 1].expr += char;
  }

  const runSplit = (unit: any) => {
    if (!unit.expr) {
      return unit;
    }
    if (unit.expr.includes('&')) {
      unit.child.push(...splitConditionExpr(unit.expr));
      unit.expr = '&';
    } else if (unit.expr.includes('|')) {
      unit.child.push(...splitConditionExpr(unit.expr));
      unit.expr = '|';
    }

    return unit;
  };

  const findC = (unit: any) => {
    unit = runSplit(unit)
    if (!unit.child) {
      return unit;
    }

    unit.child = unit.child.map((subUnit: any) => {
      return findC(subUnit);
      // runSplit(exprE);
      // if (exprE.child.length) {
      //   unit.child = findC(exprE).child;
      // }
    });

    return unit;
  };

  // console.log(exprStack[0]);

  let outUnit = exprStack[0];
  outUnit = findC(outUnit)

  // exprStack = ;

  // exprStack = exprStack.map(unit => {
  // });

  return outUnit;
}

// export function conditionParser(expr: ConditionExpr, object: any) {
//   const exprArr = splitConditionExpr(expr);

//   const comparatorMapper: {[comparator in ConditionComparator]: (a: any, b: any) => boolean} = {
//     "!=": (a, b) => a != b,
//     ">=": (a, b) => a >= b,
//     "<=": (a, b) => a <= b,
//     "==": (a, b) => a == b,
//     ">": (a, b) => a > b,
//     "<": (a, b) => a < b,
//   }

//   exprArr.forEach(expr => {
//     const comparator = parseSingleConditionComparator(expr);

//     const exprPart = expr.split(comparator); 

//     const lVal = objectExprParser(exprPart[0], object);
//     const rVal = objectExprParser(exprPart[1], object);

//     const curExprCompareRes = comparatorMapper[comparator](lVal, rVal);
//   });
// }

// 将复合条件表达式拆分为单个条件表达式
export function splitConditionExpr(expr: ConditionExpr): ConditionExpr[] {
  const exprArr: ConditionExpr[] = [];
  expr = pureExpr(expr);

  exprArr.push(...expr.split(/[\|\&]/g));

  return exprArr.filter(expr => !!expr);
}

// 解析单个条件表达式的比较运算符
export function parseSingleConditionComparator(expr: ConditionExpr): ConditionComparator {
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