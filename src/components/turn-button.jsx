import { useState } from "react";
// import KeyboardKeyBlack from "./KeyboardKeyBlack";

function TurnButton({initialIsOn}) {

  const [isOn, setIsOn] = useState(initialIsOn);

  const handleClick1 = () => {
    setIsOn(!isOn);
  };
  const text = isOn ? "On" : "Off";
  const buttonClassName = isOn
    ? "keyboard-setings-turnOnOff-button is-on"
    : "keyboard-setings-turnOnOff-button";

  return (
    <>
      <button className={buttonClassName} onClick={handleClick1}>
        <span className="keyboard-setings-turnOnOff-text">{text}</span>
        <span className="keyboard-setings-turnOnOff-stopOn">Turn</span>
      </button>
    </>
  );
}

export default TurnButton;