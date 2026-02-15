
export const playTTS = (text: string, lang: string = 'en') => {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("Speech Synthesis not supported in this browser.");
    return;
  }

  // Hủy các câu nói đang phát dở để tránh chồng chéo
  window.speechSynthesis.cancel();

  // Loại bỏ các chỉ định từ loại như (n), (v), (adj), (adv)... để không làm rối công cụ TTS
  const cleanText = text.replace(/\s*\([a-z.]+\)/gi, '').trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Thiết lập ngôn ngữ
  if (lang === 'en') utterance.lang = 'en-US';
  else if (lang === 'vi') utterance.lang = 'vi-VN';
  else utterance.lang = lang;

  // Tốc độ đọc vừa phải để người học dễ nghe
  utterance.rate = 0.9; 
  utterance.pitch = 1;

  // Tìm kiếm giọng đọc tốt nhất (ưu tiên các giọng "Google" hoặc "Premium")
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(lang) && (v.name.includes('Google') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.startsWith(lang));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
};

// Đảm bảo voices được tải (một số trình duyệt tải voices bất đồng bộ)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
