/**
 * Trình phát âm thanh Web Audio API mô phỏng âm mộc ngũ cung truyền thống của các làn điệu Quan họ
 * Cho phép người cao tuổi và học viên nghe mẫu xướng âm lề lối, giọng vặt, giã bạn không cần file âm thanh ngoài
 */

class HeritageAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTimeout: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playPitchSequence(
    frequencies: number[],
    onProgress?: (index: number) => void,
    onComplete?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const noteDuration = 0.55; // thời lượng mỗi nốt ngũ cung
    const startTime = this.ctx.currentTime + 0.05;

    frequencies.forEach((freq, index) => {
      if (!this.ctx) return;
      const noteTime = startTime + index * noteDuration;

      // Tạo sóng dao động kép mô phỏng giọng người (chất âm mộc)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, noteTime);
      osc2.frequency.setValueAtTime(freq * 1.002, noteTime); // độ lệch vi tế tạo cảm giác "rền"

      // Envelope: Bắt đầu êm, giữ hơi, buông nhẹ (Vang, Rền)
      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.18, noteTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration - 0.04);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start(noteTime);
      osc2.start(noteTime);

      osc1.stop(noteTime + noteDuration);
      osc2.stop(noteTime + noteDuration);

      setTimeout(() => {
        if (this.isPlaying && onProgress) {
          onProgress(index);
        }
      }, (noteTime - this.ctx.currentTime) * 1000);
    });

    const totalDuration = frequencies.length * noteDuration * 1000;
    this.currentTimeout = window.setTimeout(() => {
      this.isPlaying = false;
      if (onComplete) onComplete();
    }, totalDuration + 200);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch (e) {
        // ignore
      }
      this.ctx = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioPlayer = new HeritageAudioPlayer();
