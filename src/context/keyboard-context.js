import { createContext, useContext } from 'react';

export const KeyboardContext = createContext({
  isOn: true,
  recordNote: null,
  playbackActiveNote: null,
});

export const useKeyboardContext = () => useContext(KeyboardContext);
