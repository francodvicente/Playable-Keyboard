/* eslint-disable react/prop-types */
import { useState } from "react";

function TurnButton({ isOn, onToggle, initialIsOn = true }) {
  const [internalIsOn, setInternalIsOn] = useState(initialIsOn);
  const currentIsOn = isOn !== undefined ? isOn : internalIsOn;

  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOn((prev) => !prev);
    }
  };

  const text = currentIsOn ? "On" : "Off";
  const buttonClassName = `keyboard-synth-btn turn-btn keyboard-setings-turnOnOff-button ${
    currentIsOn ? "is-on" : "is-off"
  }`;

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
      aria-label={`Power: ${text}`}
    >
      <span className="btn-status-led" />
      <span className="btn-label">{text}</span>
    </button>
  );
}

export default TurnButton;
