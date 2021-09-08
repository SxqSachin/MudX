import 'mocha';
import assert from 'assert'
import { SingleObjectExprParser } from '../objectExprParser';

describe('Object表达式', () => {
  const unit = {
    str: 4,
    luck: 5,
  }
  it('测试1', () => {
    const expr = 'unit.luck';
    assert.equal(SingleObjectExprParser(expr, unit), 5);
  });
  it('测试2', () => {
    const expr = 'unit.str';
    assert.equal(SingleObjectExprParser(expr, unit), 4);
  });
});