/* eslint-disable react/prop-types */
import { useState } from 'react';
import useKeyboardSound from '../customHooks/use-keyboard-sound';
import { playSound } from '../utils/sound-player';

const KeyboardKeyBlack = ({ keyCode, soundFile, children, index, onClick, onKeyUp }) => {
  const [isPressed, setIsPressed] = useState(false);

  useKeyboardSound(keyCode, soundFile, setIsPressed);

  const handlePress = () => {
    playSound(soundFile);
    setIsPressed(true);
    if (onClick) onClick();
  };

  const handleRelease = () => {
    setIsPressed(false);
    if (onKeyUp) onKeyUp();
  };

  let groupClass = '';

  switch (index) {
    case 0:
      groupClass = 'group-0';
      break;
    case 1:
      groupClass = 'group-1';
      break;
    case 2:
      groupClass = 'group-2';
      break;
    case 3:
      groupClass = 'group-3';
      break;
    case 4:
      groupClass = 'group-4';
      break;
    case 5:
      groupClass = 'group-5';
      break;
    default:
      groupClass = '';
      break;
  }

  return (
    <li
      className={`key black ${groupClass} ${isPressed ? 'is-active' : ''}`}
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

export default KeyboardKeyBlack;