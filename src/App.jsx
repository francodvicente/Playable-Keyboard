import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import KeyboardKeyWhite from './components/keyboard-key-white'
import KeyboardKeyBlack from './components/keyboard-key-black'
import WriterTitle from './components/writer-title'
import TurnButton from './components/turn-button'
import BaseButton from './components/base-button'
import KeyboardScreen from './components/keyboard-screen'
import RecordingControls from './components/recording-controls'
import { loadRecording, saveRecording } from './utils/recording-storage'
import { playSound } from './utils/sound-player'
import { KeyboardContext } from './context/keyboard-context'
import './App.css'

function App() {
  const [isOn, setIsOn] = useState(true);
  const [screenText, setScreenText] = useState('Ready to play');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(() => loadRecording().length > 0);
  const [playbackActiveNote, setPlaybackActiveNote] = useState(null);

  const screenTimerRef = useRef(null);
  const playbackTimersRef = useRef([]);
  const isRecordingRef = useRef(false);
  const recordingStartRef = useRef(0);
  const recordedNotesRef = useRef([]);

  const clearScreenTimer = () => {
    if (screenTimerRef.current !== null) {
      clearTimeout(screenTimerRef.current);
      screenTimerRef.current = null;
    }
  };

  const stopPlayback = useCallback(() => {
    playbackTimersRef.current.forEach((id) => clearTimeout(id));
    playbackTimersRef.current = [];
    setPlaybackActiveNote(null);
    setIsPlayingRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      clearScreenTimer();
      stopPlayback();
    };
  }, [stopPlayback]);

  const recordNote = useCallback(({ keyCode, soundFile }) => {
    if (!isRecordingRef.current) return;
    const delay = Math.max(0, Date.now() - recordingStartRef.current);
    recordedNotesRef.current.push({ keyCode, soundFile, delay });
  }, []);

  const finishRecording = useCallback((showEndScreen = true) => {
    isRecordingRef.current = false;
    setIsRecording(false);

    const rawNotes = recordedNotesRef.current;
    if (rawNotes.length > 0) {
      const firstDelay = rawNotes[0].delay;
      const normalizedNotes = rawNotes.map((note) => ({
        ...note,
        delay: note.delay - firstDelay,
      }));
      saveRecording(normalizedNotes);
      setHasRecording(true);
    }

    if (showEndScreen) {
      clearScreenTimer();
      setScreenText('End of recording');
      screenTimerRef.current = setTimeout(() => {
        setScreenText('');
        screenTimerRef.current = null;
      }, 4000);
    }
  }, []);

  const handleToggleRecord = () => {
    if (!isOn) return;
    clearScreenTimer();

    if (isRecording) {
      finishRecording(true);
    } else {
      stopPlayback();
      recordedNotesRef.current = [];
      recordingStartRef.current = Date.now();
      isRecordingRef.current = true;
      setIsRecording(true);
      setScreenText('Recording');
    }
  };

  const handleTogglePlayback = () => {
    if (!isOn || isRecording) return;

    if (isPlayingRecording) {
      stopPlayback();
      return;
    }

    const notes = loadRecording();
    if (notes.length === 0) {
      setHasRecording(false);
      return;
    }

    setIsPlayingRecording(true);
    const timers = [];

    notes.forEach((note, index) => {
      const playTimer = setTimeout(() => {
        playSound(note.soundFile);
        setPlaybackActiveNote({
          keyCode: note.keyCode,
          soundFile: note.soundFile,
          index,
        });
      }, note.delay);
      timers.push(playTimer);

      const releaseTimer = setTimeout(() => {
        setPlaybackActiveNote((current) =>
          current && current.index === index ? null : current
        );
      }, note.delay + 200);
      timers.push(releaseTimer);
    });

    const totalDuration = notes[notes.length - 1].delay + 350;
    const endTimer = setTimeout(() => {
      stopPlayback();
    }, totalDuration);
    timers.push(endTimer);

    playbackTimersRef.current = timers;
  };

  const handleTogglePower = () => {
    clearScreenTimer();
    if (isOn) {
      if (isRecordingRef.current) {
        finishRecording(false);
      }
      stopPlayback();
      setIsOn(false);
      setScreenText('Off');
      screenTimerRef.current = setTimeout(() => {
        setScreenText('');
        screenTimerRef.current = null;
      }, 4000);
    } else {
      setIsOn(true);
      setScreenText('Ready to play');
    }
  };

  const keyboardContextValue = useMemo(
    () => ({ isOn, recordNote, playbackActiveNote }),
    [isOn, recordNote, playbackActiveNote]
  );
  const handleClick = () => {
    console.log("Botón clickeado");
  };

  const handleKeyUp = () => {
    console.log("Botón soltado");
  };

  return (
    <>
     <div>
     <WriterTitle/>
     <br /> 
     <br />
      <section className='body'>
        <KeyboardContext.Provider value={keyboardContextValue}>
        <div className="wrapper">
          <div className='keyboard-header'>
            <h2>Keyboard 1.0</h2>
            <KeyboardScreen text={screenText} isOn={isOn} isRecording={isRecording} />
            <div className='keyboard-header-actions'>
              <RecordingControls
                isOn={isOn}
                isRecording={isRecording}
                isPlayingRecording={isPlayingRecording}
                hasRecording={hasRecording}
                onToggleRecord={handleToggleRecord}
                onTogglePlayback={handleTogglePlayback}
              />
              <BaseButton/>
              <TurnButton isOn={isOn} onToggle={handleTogglePower} />
            </div>
          </div>
           <ul className="piano-keys">
            {/* 1 to 5 - first group of keys - 3 white y 2 black */}
            <KeyboardKeyWhite index={10}
              keyCode="a" soundFile="A0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                A
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={10}
              keyCode="q" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Q
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={10}
              keyCode="s" soundFile="B0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                S
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={10}
              keyCode="w" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                W
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={10}
              keyCode="d" soundFile="C0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                D
            </KeyboardKeyWhite>
            {/* 6 to 12 -second group of keys - 4 white y 3 black */}
            <KeyboardKeyWhite index={10}
              keyCode="f" soundFile="D0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                F
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={10}
              keyCode="e" soundFile="Ds1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                E
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={10}
              keyCode="g" soundFile="E0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                G
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={10}
              keyCode="r" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                R
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={10}
              keyCode="h" soundFile="F0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                H
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={10}
              keyCode="t" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                T
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={10}
              keyCode="j" soundFile="G0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                J
            </KeyboardKeyWhite>
            {/* 13 to 17 - third group of keys - 3 white y 2 black */}
            <KeyboardKeyWhite index={1}
              keyCode="k" soundFile="A1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                K
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={1}
              keyCode="y" soundFile="Ds1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Y
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={1}
              keyCode="l" soundFile="B1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                L
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={1}
              keyCode="u" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                U
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={1}
              keyCode="ñ" soundFile="C1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Ñ
            </KeyboardKeyWhite>
            {/* 18 to 24 - fourth group of keys - 4 blacas y 3 negras */}
            <KeyboardKeyWhite index={2}
              keyCode="z" soundFile="D1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Z
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={2}
              keyCode="y" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Y
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={2}
              keyCode="x" soundFile="E1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                X
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={2}
              keyCode="o" soundFile="Ds1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                O
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={2}
              keyCode="c" soundFile="F1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                C
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={2}
              keyCode="p" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                P
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={2}
              keyCode="v" soundFile="G1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                V
            </KeyboardKeyWhite>
            {/* 25 to 29 - fifth group of keys - 3 white y 2 black */}
            <KeyboardKeyWhite index={3}
              keyCode="b" soundFile="A2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                B
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={3}
              keyCode="e" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                E
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={3}
              keyCode="n" soundFile="B2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                N
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={3}
              keyCode="r" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                R
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={3}
              keyCode="a1" soundFile="C2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                A1
            </KeyboardKeyWhite>
            {/* 30 to 36 - sixth group of keys - 4 blacas y 3 negras */}
            <KeyboardKeyWhite index={3}
              keyCode="s1" soundFile="D2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                S1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={3}
              keyCode="t" soundFile="Cs1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                T
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={3}
              keyCode="d1" soundFile="E2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                D1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={3}
              keyCode="y" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Y
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={3}
              keyCode="f1" soundFile="F2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                F1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={3}
              keyCode="u" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                U
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={3}
              keyCode="g" soundFile="G2.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                G1
            </KeyboardKeyWhite>
            {/* 37 to 41 - seventh group of keys - 3 white y 2 black */}
            <KeyboardKeyWhite index={4}
              keyCode="h1" soundFile="A3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                H1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={4}
              keyCode="i" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                I
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={4}
              keyCode="j1" soundFile="B3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                J1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={4}
              keyCode="p" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                P
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={4}
              keyCode="k1" soundFile="C3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                K1
            </KeyboardKeyWhite>
            {/* 42 to 48 - eighth group of keys - 4 blacas y 3 negras */}
            <KeyboardKeyWhite index={4}
              keyCode="l1" soundFile="D3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                L1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={4}
              keyCode="e" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                E
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={4}
              keyCode="ñ1" soundFile="E3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Ñ1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={4}
              keyCode="r" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                R
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={4}
              keyCode="z1" soundFile="F3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Z1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={4}
              keyCode="t" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                T
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={4}
              keyCode="x1" soundFile="G3.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                X1
            </KeyboardKeyWhite>
            {/* 49 to 53 - nineth group of keys - 3 white y 2 black */}
            <KeyboardKeyWhite index={5}
              keyCode="c1" soundFile="A4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                C1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={5}
              keyCode="y" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                Y
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={5}
              keyCode="v1" soundFile="B4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                V1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={5}
              keyCode="b" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                B
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={5}
              keyCode="b1" soundFile="C4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                B1
            </KeyboardKeyWhite>
            {/* 54 to 60 - prefinal group of keys - 4 blacas y 3 negras */}
            <KeyboardKeyWhite index={5}
              keyCode="n1" soundFile="D4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                N1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={5}
              keyCode="rt" soundFile="As0.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                RT
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={5}
              keyCode="m1" soundFile="E4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                M1
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={5}
              keyCode="et" soundFile="Ds1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                ET
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={5}
              keyCode="a2" soundFile="F4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                A2
            </KeyboardKeyWhite>
            <KeyboardKeyBlack index={5}
              keyCode="ut" soundFile="Ds1.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                UT
            </KeyboardKeyBlack>
            <KeyboardKeyWhite index={5}
              keyCode="s2" soundFile="G4.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                S2
            </KeyboardKeyWhite>
            {/* 61 - final group of keys - 1 white do */}
            <KeyboardKeyWhite index={0}
              keyCode="m" soundFile="A5.ogg" onClick={handleClick} onKeyUp={handleKeyUp}>
                M
            </KeyboardKeyWhite>
          </ul>
        </div>
        </KeyboardContext.Provider>
        <footer className="footer-container">
          <p className='footer-text'>© 2024 Franco Vicente</p>
        </footer>
      </section>
     </div>
    </>
  )
}

export default App
