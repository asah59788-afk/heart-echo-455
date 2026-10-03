/**
 * Web Audio API synthesizer for zero-latency, zero-asset-dependency sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Balloon Pop effect: burst of filtered noise + rapid frequency sweep
   */
  public playPop() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 1. Noise burst
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // 2. Thump tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.08);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Candle blow breath effect
   */
  public playBlow() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Playful dodge / escape sound (spring boing)
   */
  public playDodge() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch bend upwards like a cartoon spring
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Cake slice or puzzle tile slide swoosh
   */
  public playSlide() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Celebratory Fanfare (C-E-G-C arpeggio chime)
   */
  public playFanfare() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Sparkling bell chime for card opening / wax breaking
   */
  public playSparkle() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.52);
      });
    } catch {
      // Audio fallback ignored
    }
  }

  /**
   * Ambient melodic loop (gentle acoustic chord progressions)
   */
  public toggleMusic(enable: boolean, track: string = 'romantic_melody') {
    const ctx = this.initCtx();
    if (!ctx) return;

    if (!enable) {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      this.isMusicPlaying = false;
      return;
    }

    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Romantic chords (Cmaj7 -> Am9 -> Fmaj7 -> Gsus4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [174.61, 261.63, 329.63, 349.23], // F C E F
      [196.00, 261.63, 293.66, 392.00], // G C D G
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.001, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.06 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + 2.0);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, 2200);
  }

  /**
   * Cute companion giggle: rapid pitch oscillation
   */
  public playCompanionGiggle() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pitches = [587.33, 659.25, 783.99, 880.0, 783.99]; // D5, E5, G5, A5, G5
      pitches.forEach((freq, idx) => {
        const noteTime = now + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq + 40, noteTime + 0.04);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.06);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Cute companion chirp / squeak on greeting or tap
   */
  public playCompanionChirp() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback
    }
  }

  public stopAll() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const sounds = new SoundEngine();

