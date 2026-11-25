import { useEffect, useRef } from 'react';
import { playSound } from '../utils/sound-player';

const useKeyboardSound = (keyCode, soundFile, onActiveChange, isOn = true, onPlay = null) => {
  const onPlayRef = useRef(onPlay);
  onPlayRef.current = onPlay;

  useEffect(() => {
    if (!keyCode || !soundFile || !isOn) {
      if (!isOn && onActiveChange) {
        onActiveChange(false);
      }
      return;
    }

    const target = keyCode.toLowerCase();

    const handleKeyDown = (event) => {
      if (event.repeat) return; // Evitar disparos múltiples continuos por repetición del sistema operativo
      if (event.key.toLowerCase() === target) {
        playSound(soundFile);
        if (onActiveChange) onActiveChange(true);
        if (onPlayRef.current) onPlayRef.current({ keyCode, soundFile });
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
  }, [keyCode, soundFile, onActiveChange, isOn]);
};

export default useKeyboardSound;
