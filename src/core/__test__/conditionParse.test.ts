import 'mocha';
import assert from 'assert'
import { parseSingleConditionExprOperator, splitConditionExpr } from '../conditionParser';

describe('简单条件表达式测试', () => {
  it('判断符解析 >', () => {
    const expr = 'unit.c > 4';

    assert.equal(parseSingleConditionExprOperator(expr), ">");
  });
  it('判断符解析 <', () => {
    const expr = 'unit.c < 4';

    assert.equal(parseSingleConditionExprOperator(expr), "<");
  });
  it('判断符解析 !=', () => {
    const expr = 'unit.c != 4';

    assert.equal(parseSingleConditionExprOperator(expr), "!=");
  });
  it('判断符解析 >=', () => {
    const expr = 'unit.c >= 4';

    assert.equal(parseSingleConditionExprOperator(expr), ">=");
  });
  it('判断符解析 ==', () => {
    const expr = 'unit.c == 4';

    assert.equal(parseSingleConditionExprOperator(expr), "==");
  });
});

describe('条件表达式切分测试', () => {
  it('连接符 &', () => {
    const expr = 'unit.c > 4 & unit.c == 8';

    assert.deepEqual(splitConditionExpr(expr), ['unit.c>4', 'unit.c==8']);
  });
  it('连接符 |', () => {
    const expr = 'unit.c > 4 | unit.c == 7';

    assert.deepEqual(splitConditionExpr(expr), ['unit.c>4', 'unit.c==7']);
  });
  it('组合连接符', () => {
    const expr = 'unit.c == 4 & unit.d != 7 | unit.f==4';

    assert.deepEqual(splitConditionExpr(expr), ['unit.c==4', 'unit.d!=7', 'unit.f==4']);
  });
  it('组合连接符2', () => {
    const expr = 'unit.c == 4 & unit.d != 7 | unit.f==4 | unit.z==c';

    assert.deepEqual(splitConditionExpr(expr), ['unit.c==4', 'unit.d!=7', 'unit.f==4', 'unit.z==c']);
  });
});