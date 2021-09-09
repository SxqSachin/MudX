import React, { useEffect } from 'react';
import { parseSimpleConditionComparator, parseToExprAtom } from './core/conditionParser_old';

import { Parser } from 'expr-eval';

function App() {
  useEffect(() => {

    const obj = {
      a: {
        a: 4,
        b: 5,
        c: 4,
        d: 5,
        v: 5,
      }
    }

    const parser = new Parser();
    let res = 0;
    console.time('t');
    const expr = parser.parse('(((a.b > 3 and a.c > 4) or a.d == 5) and (a.v < 4 or a.c == 5))');
    console.log(expr);
    for(let i = 0; i < 10000; i++) {
      res = expr.evaluate(obj);
    }
    console.log(res);
    console.timeEnd('t');

    const expr3 = '(a.c + a.d) > 4';
    const res3 = parseToExprAtom(expr3);
    console.log(res3);

    // const expr3 = '(a.c > 4 & a.d < 5 & a.e == 6) | a.ee == 4';
    // const res3 = parseToExprAtom(expr3);
    // console.log(res3);

    // const expr4 = '((a.c > 4) & (a.d < 5))';
    // const res4 = parseToExprAtom(expr4);
    // console.log(res4);
  }, []);

  return (
    <div className="App bg-black">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
