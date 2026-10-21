/**
 * Pure Web Audio API Generative Soundscapes & Sound Effects
 * Zero external audio files required — lightweight, immediate, and responsive.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;

  // Rain nodes
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  // Vinyl nodes
  private vinylGain: GainNode | null = null;
  private vinylInterval: number | null = null;

  // Piano / Chime nodes
  private pianoGain: GainNode | null = null;
  private pianoInterval: number | null = null;

  // Wind nodes
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windOsc: OscillatorNode | null = null;

  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public async start(): Promise<boolean> {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isRunning) return true;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Setup Rain
      this.setupRain();

      // 2. Setup Vinyl
      this.setupVinyl();

      // 3. Setup Generative Piano / Bells
      this.setupPiano();

      // 4. Setup Wind
      this.setupWind();

      this.isRunning = true;
      return true;
    } catch (e) {
      console.warn('AudioContext autoplay or init issue:', e);
      return false;
    }
  }

  private setupRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise approximation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    // Filter to simulate rain on window glass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainSource.start();
  }

  private setupVinyl() {
    if (!this.ctx || !this.masterGain) return;
    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.vinylGain.connect(this.masterGain);

    // Create periodic random clicks and dust pops
    this.vinylInterval = window.setInterval(() => {
      if (!this.ctx || !this.vinylGain || this.isMuted) return;
      const popCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < popCount; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + Math.random() * 0.4;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 800, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.03 + Math.random() * 0.04, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        osc.connect(gain);
        gain.connect(this.vinylGain);

        osc.start(now);
        osc.stop(now + 0.025);
      }
    }, 450);
  }

  private setupPiano() {
    if (!this.ctx || !this.masterGain) return;
    this.pianoGain = this.ctx.createGain();
    this.pianoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.pianoGain.connect(this.masterGain);

    // Warm pentatonic frequencies (Eb major / C minor melancholy warmth: Eb3, G3, Bb3, C4, D4, Eb4, G4)
    const notes = [155.56, 196.00, 233.08, 261.63, 293.66, 311.13, 392.00, 466.16];

    const playRandomChord = () => {
      if (!this.ctx || !this.pianoGain || this.isMuted) return;

      const baseNote = notes[Math.floor(Math.random() * notes.length)];
      const harmonics = [baseNote, baseNote * (Math.random() > 0.5 ? 1.5 : 1.25)];

      harmonics.forEach((freq, idx) => {
        if (!this.ctx || !this.pianoGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const now = this.ctx.currentTime + (idx * 0.06);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Warm piano-like bell envelope
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(noteGain);
        noteGain.connect(this.pianoGain);

        osc.start(now);
        osc.stop(now + 3.3);
      });
    };

    // Play initial note
    setTimeout(playRandomChord, 800);

    // Play gentle note every 4 to 8 seconds
    this.pianoInterval = window.setInterval(() => {
      playRandomChord();
    }, 4800);
  }

  private setupWind() {
    if (!this.ctx || !this.masterGain) return;

    // Sub-bass resonance and nocturnal breeze
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    // LFO for filter sweep
    this.windOsc = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.windOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // slow sway
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);

    this.windOsc.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    windSource.start();
    this.windOsc.start();
  }

  public setVolumes(rain: number, vinyl: number, piano: number, wind: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.rainGain) this.rainGain.gain.linearRampToValueAtTime(rain, now + 0.1);
    if (this.vinylGain) this.vinylGain.gain.linearRampToValueAtTime(vinyl, now + 0.1);
    if (this.pianoGain) this.pianoGain.gain.linearRampToValueAtTime(piano, now + 0.1);
    if (this.windGain) this.windGain.gain.linearRampToValueAtTime(wind, now + 0.1);
  }

  public setMasterVolume(val: number) {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : val, this.ctx.currentTime + 0.1);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  public playCardChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  public playCoinTink() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2480, now);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.4);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  public playWaterDrop() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public stop() {
    if (this.vinylInterval) clearInterval(this.vinylInterval);
    if (this.pianoInterval) clearInterval(this.pianoInterval);
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
    }
    this.isRunning = false;
    this.ctx = null;
  }

  public getActive(): boolean {
    return this.isRunning;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const ambientSound = new AmbientSoundEngine();
