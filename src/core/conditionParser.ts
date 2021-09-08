import { ConditionComparator, ConditionExpr } from '../types/condition';

const SINGLE_OPERATOR_CHAR = ['>', '<', '=', '!'];
const CONDITION_CONNECTOR_CHAR = ['&', '|'];

function pureExpr(expr: string): string {
  return expr.replace(/ /g, '');
}

function singleConditionParse(rawExpr: ConditionExpr) {
  rawExpr = "unit.str > 16";
  rawExpr = rawExpr.replace(/ /g, '');

}

// 将复合条件表达式拆分为单个条件表达式
export function splitConditionExpr(expr: ConditionExpr): ConditionExpr[] {
  const exprArr: ConditionExpr[] = [];
  expr = pureExpr(expr);

  exprArr.push(...expr.split(/[\|\&]/g));

  return exprArr.filter(expr => !!expr);
}

// 解析单个条件表达式的比较运算符
export function parseSingleConditionExprOperator(expr: ConditionExpr): ConditionComparator {
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

export {
  singleConditionParse
}