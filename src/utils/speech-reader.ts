/**
 * Trình đọc nội dung thành tiếng (Text-to-Speech) phục vụ người cao tuổi trong cộng đồng
 * Sử dụng Web Speech Synthesis API chuẩn tiếng Việt
 */

class SpeechReader {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isReading = false;
  private onStateChangeCallback: ((reading: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public registerCallback(cb: (reading: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      alert('Trình duyệt của bác/bạn không hỗ trợ chức năng đọc tiếng nói.');
      return;
    }

    this.stop();

    // Làm sạch ký tự lạ
    const cleanText = text
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9; // Tốc độ đọc chậm rãi, rõ ràng cho người cao tuổi nghe
    utterance.pitch = 1.0;

    // Tìm giọng tiếng Việt nếu có
    const voices = this.synth.getVoices();
    const vietnameseVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VIE'));
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => {
      this.isReading = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    };

    utterance.onend = () => {
      this.isReading = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isReading = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isReading = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }

  public getIsReading() {
    return this.isReading;
  }
}

export const speechReader = new SpeechReader();
