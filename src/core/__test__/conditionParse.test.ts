import 'mocha';
import assert from 'assert'
import { parseSingleConditionComparator as parseSingleConditionExprOperator, parseToExprAtom, splitConditionExpr } from '../conditionParser_old';

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
  it('异常测试', () => {
    const expr = 'unit.c >!==!= 4';
    const res = parseSingleConditionExprOperator(expr)

    assert.equal(res, "!=");
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
  it('异常测试', () => {
    const expr = 'unit.c == 4 && unit.d != 7 |& unit.f==4 | unit.z==c';

    assert.deepEqual(splitConditionExpr(expr), ['unit.c==4', 'unit.d!=7', 'unit.f==4', 'unit.z==c']);
  });
});
describe('条件表达式解析', () => {
  it('test1', () => {
    const expr = '(((a.b > 3 & a.c > 4) | c.d == 5) & (d.v < 4 | c.c == 4))';

    const res = parseToExprAtom(expr);

    console.log(res);


    // assert.deepEqual(splitConditionExpr(expr), ['unit.c>4', 'unit.c==8']);
  });
});