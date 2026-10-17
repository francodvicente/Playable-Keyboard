import { useEffect } from 'react';
import { playSound } from '../utils/sound-player';

const useKeyboardSound = (keyCode, soundFile, onActiveChange) => {
  useEffect(() => {
    if (!keyCode || !soundFile) return;

    const target = keyCode.toLowerCase();

    const handleKeyDown = (event) => {
      if (event.repeat) return; // Evitar disparos múltiples continuos por repetición del sistema operativo
      if (event.key.toLowerCase() === target) {
        playSound(soundFile);
        if (onActiveChange) onActiveChange(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key.toLowerCase() === target) {
        if (onActiveChange) onActiveChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyCode, soundFile, onActiveChange]);
};

export default useKeyboardSound;