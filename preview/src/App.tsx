import { useState } from 'react';
import a from '../../out/out.json';

import validateData from '../../lib/validateData';

function App() {
  const [count, setCount] = useState(0);

  const isValid = validateData(a);

  return (
    <div style={{ color: isValid ? 'green' : 'red' }}>{JSON.stringify(a)}</div>
  );
}

export default App;
