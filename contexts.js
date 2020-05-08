import React from 'react';

import TimerStore from './stores/timerStore';
import AuthStore from './stores/authStore';

export default React.createContext({
  timerStore: new TimerStore(),
  authStore: new AuthStore(),
});
