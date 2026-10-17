// Cache of preloaded Audio objects for instantaneous response and low-latency polyphony
const audioCache = new Map();

/**
 * Reproduce un sonido del sintetizador a partir del archivo asignado a la tecla
 * @param {string} soundFile - Nombre del archivo de audio (ej: 'A0.ogg')
 * @returns {HTMLAudioElement|null}
 */
export const playSound = (soundFile) => {
  if (!soundFile) return null;

  try {
    const soundPath = `/sounds/${soundFile}`;
    let cached = audioCache.get(soundPath);

    if (!cached) {
      cached = new Audio(soundPath);
      cached.preload = 'auto';
      audioCache.set(soundPath, cached);
    }

    // cloneNode permite polifonía y pulsaciones rápidas repetidas sin cortar el audio anterior
    const instance = cached.cloneNode();
    instance.currentTime = 0;
    const playPromise = instance.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Manejo silencioso en caso de restricciones de autoplay del navegador
        console.debug(`Autoplay restriction or audio note info for ${soundFile}:`, err);
      });
    }
    return instance;
  } catch (error) {
    console.warn(`Error playing sound ${soundFile}:`, error);
    try {
      const fallbackAudio = new Audio(`/sounds/${soundFile}`);
      fallbackAudio.play().catch(() => {});
      return fallbackAudio;
    } catch {
      return null;
    }
  }
};
