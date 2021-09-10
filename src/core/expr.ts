import { Expression, Parser } from 'expr-eval';
import { ConditionExpr, } from '../types/condition';

const ConditionMap: Map<ConditionExpr, Expression> = new Map();
const ConditionParser = new Parser();

function parseExpr(conditionExpr: ConditionExpr): Expression {
  let expression = ConditionMap.get(conditionExpr);
  if (expression) {
    return expression;
  }

  expression = ConditionParser.parse(conditionExpr);

  ConditionMap.set(conditionExpr, expression);

  return expression;
}

export function runExpr(conditionExpr: ConditionExpr, object: any): any {
  const expression = parseExpr(conditionExpr);

  return expression.evaluate(object);
}