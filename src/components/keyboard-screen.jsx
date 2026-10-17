/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import './keyboard-screen.css';

const KeyboardScreen = ({ text = 'Ready to play', isOn = true }) => {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!isOn || !text) {
      setIsOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      if (containerRef.current && measureRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        const textWidth = measureRef.current.scrollWidth;
        setIsOverflowing(textWidth > availableWidth);
      }
    };

    // Run check on next microtask to ensure layout is ready
    const timer = setTimeout(checkOverflow, 0);

    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text, isOn]);

  return (
    <div className={`keyboard-lcd-screen ${isOn ? 'is-on' : 'is-off'}`}>
      <span className="lcd-status-led" />
      <div className="lcd-inner-bezel" ref={containerRef}>
        {/* Hidden measurement node with exact text & styles */}
        <span ref={measureRef} className="lcd-text-measure" aria-hidden="true">
          {text}
        </span>

        {isOn && text && (
          <div className="lcd-viewport">
            {isOverflowing ? (
              <div className="lcd-carousel-track">
                <span className="lcd-text">{text}</span>
                <span className="lcd-divider">•</span>
                <span className="lcd-text">{text}</span>
                <span className="lcd-divider">•</span>
              </div>
            ) : (
              <span className="lcd-text">{text}</span>
            )}
          </div>
        )}
      </div>
      <div className="lcd-glass-glare" />
    </div>
  );
};

export default KeyboardScreen;
