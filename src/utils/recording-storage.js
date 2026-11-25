const RECORDING_STORAGE_KEY = 'playable_keyboard_recording';

/**
 * Carga la grabación almacenada en localStorage de forma segura.
 * @returns {Array<{ keyCode: string, soundFile: string, delay: number }>}
 */
export const loadRecording = () => {
  try {
    const raw = localStorage.getItem(RECORDING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.soundFile === 'string' &&
        typeof item.delay === 'number' &&
        Number.isFinite(item.delay)
    );
  } catch (error) {
    console.warn('Error loading recording from localStorage:', error);
    return [];
  }
};

/**
 * Guarda la secuencia de notas grabadas en localStorage.
 * @param {Array<{ keyCode: string, soundFile: string, delay: number }>} notes
 */
export const saveRecording = (notes) => {
  try {
    localStorage.setItem(RECORDING_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn('Error saving recording to localStorage:', error);
  }
};
