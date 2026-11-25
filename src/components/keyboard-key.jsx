/* eslint-disable react/prop-types */
import { useState } from 'react';
import useKeyboardSound from '../customHooks/use-keyboard-sound';
import { playSound } from '../utils/sound-player';
import { useKeyboardContext } from '../context/keyboard-context';

const GROUP_CLASSES = {
  0: 'group-0',
  1: 'group-1',
  2: 'group-2',
  3: 'group-3',
  4: 'group-4',
  5: 'group-5',
};

const KeyboardKey = ({ variant, keyCode, soundFile, children, index, onClick, onKeyUp }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { isOn, recordNote, playbackActiveNote } = useKeyboardContext();

  useKeyboardSound(keyCode, soundFile, setIsPressed, isOn, recordNote);

  const handlePress = () => {
    if (!isOn) return;
    playSound(soundFile);
    setIsPressed(true);
    if (recordNote) {
      recordNote({ keyCode, soundFile });
    }
    if (onClick) onClick();
  };

  const handleRelease = () => {
    if (isPressed) {
      setIsPressed(false);
    }
    if (isOn && onKeyUp) onKeyUp();
  };

  const isPlaybackActive = Boolean(
    isOn &&
      playbackActiveNote &&
      playbackActiveNote.soundFile === soundFile &&
      playbackActiveNote.keyCode === keyCode
  );

  const groupClass = GROUP_CLASSES[index] || '';

  return (
    <li
      className={`key ${variant} ${groupClass} ${isPressed || isPlaybackActive ? 'is-active' : ''}`}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onTouchEnd={handleRelease}
    >
      <span>{children}</span>
    </li>
  );
};

export default KeyboardKey;
