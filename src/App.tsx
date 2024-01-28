import React from 'react';
import './App.css';

import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Button } from '@consta/uikit/Button';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <Button label="Кнопка" />
    </Theme>
  );
}

export default App;
