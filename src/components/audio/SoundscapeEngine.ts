import { AtmosphericMood } from '../../types';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volume: number = 1.0;
  private currentMood: AtmosphericMood = 'golden';

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private crackleGain: GainNode | null = null;
  
  // Timer handles for random nature triggers
  private birdTimer: number | null = null;
  private cricketTimer: number | null = null;
  private crackleTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupWindGenerator();
    } catch {
      console.warn('Web Audio API not supported or blocked by browser.');
    }
  }

  private setupWindGenerator() {
    if (!this.ctx || !this.masterGain) return;

    // Generate brown/pink noise buffer for realistic organic mountain wind
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    windSource.start();

    // Modulate wind cutoff for gusting breeze effect
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    lfo.start();
  }

  public playBirdChirp() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    if (this.currentMood === 'night') return; // Fewer birds at night

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 1400;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playCricketChirp() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    if (this.currentMood !== 'night' && this.currentMood !== 'autumn') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4500 + Math.random() * 600, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playHearthCrackle() {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    if (this.currentMood === 'dawn') return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  private startAtmosphericLoops() {
    // Random bird chirps every 3-8s
    const scheduleBird = () => {
      const delay = 2500 + Math.random() * 6000;
      this.birdTimer = window.setTimeout(() => {
        if (this.isPlaying) {
          this.playBirdChirp();
          if (Math.random() > 0.4) {
            setTimeout(() => this.playBirdChirp(), 180);
          }
          scheduleBird();
        }
      }, delay);
    };
    scheduleBird();

    // Random crickets
    const scheduleCricket = () => {
      const delay = 800 + Math.random() * 2000;
      this.cricketTimer = window.setTimeout(() => {
        if (this.isPlaying) {
          this.playCricketChirp();
          scheduleCricket();
        }
      }, delay);
    };
    scheduleCricket();

    // Random crackle
    const scheduleCrackle = () => {
      const delay = 400 + Math.random() * 1600;
      this.crackleTimer = window.setTimeout(() => {
        if (this.isPlaying) {
          this.playHearthCrackle();
          scheduleCrackle();
        }
      }, delay);
    };
    scheduleCrackle();
  }

  private stopAtmosphericLoops() {
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.cricketTimer) clearTimeout(this.cricketTimer);
    if (this.crackleTimer) clearTimeout(this.crackleTimer);
  }

  public setMood(mood: AtmosphericMood) {
    this.currentMood = mood;
    if (!this.windFilter || !this.ctx) return;

    const now = this.ctx.currentTime;
    if (mood === 'dawn') {
      this.windFilter.frequency.setTargetAtTime(240, now, 1.0);
    } else if (mood === 'golden') {
      this.windFilter.frequency.setTargetAtTime(360, now, 1.0);
    } else if (mood === 'night') {
      this.windFilter.frequency.setTargetAtTime(180, now, 1.0);
    } else if (mood === 'autumn') {
      this.windFilter.frequency.setTargetAtTime(450, now, 1.0);
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }
      this.startAtmosphericLoops();
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      this.stopAtmosphericLoops();
    }

    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.masterGain && this.ctx && this.isPlaying) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const soundscape = new SoundscapeEngine();
