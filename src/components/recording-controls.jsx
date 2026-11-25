/* eslint-disable react/prop-types */

const RecordingControls = ({
  isOn,
  isRecording,
  isPlayingRecording,
  hasRecording,
  onToggleRecord,
  onTogglePlayback,
}) => {
  return (
    <>
      <button
        type="button"
        className={`keyboard-synth-btn rec-btn ${
          isRecording ? 'is-recording' : 'is-idle'
        }`}
        onClick={onToggleRecord}
        disabled={!isOn || isPlayingRecording}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <span className="btn-status-led" />
        <span className="btn-label">{isRecording ? 'Stop' : 'Rec'}</span>
      </button>

      <button
        type="button"
        className={`keyboard-synth-btn play-btn ${
          isPlayingRecording ? 'is-playing' : 'is-idle'
        }`}
        onClick={onTogglePlayback}
        disabled={!isOn || isRecording || !hasRecording}
        aria-label={isPlayingRecording ? 'Stop playback' : 'Play recording'}
      >
        <span className="btn-status-led" />
        <span className="btn-label">{isPlayingRecording ? 'Stop' : 'Play'}</span>
      </button>
    </>
  );
};

export default RecordingControls;
