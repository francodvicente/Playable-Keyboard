import { useState, useEffect, useRef, useCallback } from 'react';
import { useKeyboardContext } from '../context/keyboard-context';

const BaseButton = () => {
  const { isOn } = useKeyboardContext();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = useCallback(() => {
    if (!isOn) return;

    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/base.mp3');
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.loop = true;
      audioRef.current.play().catch((err) => {
        console.debug('Could not play base audio:', err);
      });
      setIsPlaying(true);
    }
  }, [isOn, isPlaying]);

  useEffect(() => {
    if (!isOn && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, [isOn, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isOn) return;
      if (event.key === ' ' && !event.repeat) {
        event.preventDefault();
        toggleAudio();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOn, toggleAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <button
      type="button"
      className={`keyboard-synth-btn base-btn sound-base ${
        isPlaying ? 'is-playing' : 'is-idle'
      }`}
      onClick={toggleAudio}
      disabled={!isOn}
      aria-label={isPlaying ? 'Stop base' : 'Play base'}
    >
      <span className="btn-status-led" />
      <span className="btn-label">{isPlaying ? 'Stop' : 'Base'}</span>
    </button>
  );
};

export default BaseButton;
