import { createContext, useContext } from 'react';

export const KeyboardContext = createContext({
  isOn: true,
});

export const useKeyboardContext = () => useContext(KeyboardContext);
