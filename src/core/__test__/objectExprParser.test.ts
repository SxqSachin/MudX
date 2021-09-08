import 'mocha';
import assert from 'assert'
import { objectExprParser, SingleObjectExprParser } from '../objectExprParser';

describe('Object表达式', () => {
  const obj = {
    unit: {
      str: 4,
      luck: 5,
      item: {
        gogo: {
          price: 1,
          count: 5,
        }
      }
    },
  };

  it('单层获取', () => {
    const expr = 'unit.luck';
    assert.equal(objectExprParser(expr, obj), 5);
  });
  it('深度获取', () => {
    const expr = 'unit.item.gogo.count';
    assert.equal(objectExprParser(expr, obj), 5);
  });
  it('异常测试', () => {
    const expr = 'unit.item.gogo2.count';
    assert.equal(objectExprParser(expr, obj), null);
  });
});
