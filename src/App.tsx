import React, { useEffect } from 'react';
import { parseToExprAtom } from './core/conditionParser';

function App() {

  useEffect(() => {
    const expr = '(((a.b > 3 & a.c > 4) | c.d == 5) & (d.v < 4 | c.c == 4))';
    const res = parseToExprAtom(expr);
    console.log(res);

    const expr2 = 'a.c > 4 & a.d < 5';
    const res2 = parseToExprAtom(expr2);
    console.log(res2);

    const expr3 = '(a.c > 4 & a.d < 5 & a.e == 6) | a.ee == 4';
    const res3 = parseToExprAtom(expr3);
    console.log(res3);

    const expr4 = '((a.c > 4) & (a.d < 5))';
    const res4 = parseToExprAtom(expr4);
    console.log(res4);
  }, []);

  return (
    <div className="App bg-black">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
