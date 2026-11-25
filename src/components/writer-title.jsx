import { useEffect, useRef } from 'react';

const GREETINGS = ['Music', 'Is', 'Life', 'Enjoy', 'It'];

const WriterTitle = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    let currentGreetingIndex = 0;
    let currentCharacterIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let pauseEnd = 0;
    let timeoutId = null;
    let isCancelled = false;

    const typeWriterEffect = () => {
      if (isCancelled || !titleRef.current) return;

      if (isPaused && Date.now() > pauseEnd) {
        isPaused = false;
        if (isDeleting) {
          currentGreetingIndex = (currentGreetingIndex + 1) % GREETINGS.length;
          isDeleting = false;
        } else {
          isDeleting = true;
        }
      }

      if (!isPaused && !isDeleting && currentCharacterIndex === GREETINGS[currentGreetingIndex].length) {
        isPaused = true;
        pauseEnd = Date.now() + 800;
        timeoutId = setTimeout(typeWriterEffect, 50);
        return;
      }

      if (!isPaused && isDeleting && currentCharacterIndex === 0) {
        isPaused = true;
        pauseEnd = Date.now() + 200;
        timeoutId = setTimeout(typeWriterEffect, 50);
        return;
      }

      const timeout = isDeleting ? 100 : 200;
      titleRef.current.innerText = GREETINGS[currentGreetingIndex].substring(0, currentCharacterIndex);
      currentCharacterIndex = isDeleting ? currentCharacterIndex - 1 : currentCharacterIndex + 1;
      timeoutId = setTimeout(typeWriterEffect, timeout);
    };

    typeWriterEffect();

    return () => {
      isCancelled = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div>
      <h1 ref={titleRef} className="typing" id="typing"></h1>
    </div>
  );
};

export default WriterTitle;
