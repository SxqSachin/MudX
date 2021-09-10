import React, { useEffect } from 'react';
import { runExpr } from './core/expr';

import { Parser } from 'expr-eval';

import expr from './data/expr.json';

function App() {
  useEffect(() => {

    const obj = {
      unit: {
        a: 4,
        b: 5,
        c: 4,
        d: 5,
        v: 5,
      }
    }

    let res = 0;
    console.time('t');
    for(let i = 0; i < 10000; i++) {
      res = runExpr(expr.test.expr, obj);
    }
    console.log(res);
    console.timeEnd('t');
  }, []);

  return (
    <div className="App bg-black">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
