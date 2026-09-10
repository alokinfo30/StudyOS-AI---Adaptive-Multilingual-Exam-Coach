// Web Audio API Sound Effects for Gamified Progress and Mastery Pop
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio API not supported or initialized', e);
    return null;
  }
}

/**
 * Plays a cheerful, subtle "pop" / level-up chime sound when a concept mastery updates.
 * Synthesizes organic two-tone sweep with harmonic decay.
 */
export function playMasteryPopSound(isHighMastery = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary oscillator: quick pitch sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Harmonics oscillator for shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();

    if (isHighMastery) {
      // High mastery (≥90%): bright ascending chime (E5 -> B5 -> E6)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.14); // E6

      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(987.77, now); // B5
      shimmerOsc.frequency.exponentialRampToValueAtTime(1975.5, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      shimmerGain.gain.setValueAtTime(0.08, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    } else {
      // Standard mastery progress pop: clean organic bubble/wood pop (480Hz -> 760Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);

      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(960, now);
      shimmerOsc.frequency.exponentialRampToValueAtTime(1140, now + 0.06);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      shimmerGain.gain.setValueAtTime(0.05, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    }

    // Connect nodes to destination
    osc.connect(gain);
    gain.connect(ctx.destination);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);

    // Trigger playback
    osc.start(now);
    osc.stop(now + 0.3);

    shimmerOsc.start(now);
    shimmerOsc.stop(now + 0.3);
  } catch (err) {
    // Non-blocking catch
    console.warn('Error playing audio pop', err);
  }
}
