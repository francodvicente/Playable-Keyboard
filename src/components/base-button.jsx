import { useState, useEffect } from 'react';

const BaseButton = () => {
  const [audio] = useState(new Audio(`../../src/sounds/base.mp3`));
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.loop = true;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleKeyPress = (event) => {
    if (event.key === ' ') {
      toggleAudio();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <button
      type="button"
      className={`keyboard-synth-btn base-btn sound-base ${
        isPlaying ? 'is-playing' : 'is-idle'
      }`}
      onClick={toggleAudio}
      aria-label={isPlaying ? 'Stop base' : 'Play base'}
    >
      <span className="btn-status-led" />
      <span className="btn-label">{isPlaying ? 'Stop' : 'Base'}</span>
    </button>
  );
};

export default BaseButton;