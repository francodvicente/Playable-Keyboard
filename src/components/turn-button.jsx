/* eslint-disable react/prop-types */
import { useState } from "react";

function TurnButton({ initialIsOn = true }) {
  const [isOn, setIsOn] = useState(initialIsOn);

  const handleClick1 = () => {
    setIsOn(!isOn);
  };
  const text = isOn ? "On" : "Off";
  const buttonClassName = `keyboard-synth-btn turn-btn keyboard-setings-turnOnOff-button ${
    isOn ? "is-on" : "is-off"
  }`;

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick1}
      aria-label={`Power: ${text}`}
    >
      <span className="btn-status-led" />
      <span className="btn-label">{text}</span>
    </button>
  );
}

export default TurnButton;