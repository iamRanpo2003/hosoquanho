import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Music, 
  Compass, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { speechReader } from '../utils/speech-reader';

type AdvisorMode = 'explain_term' | 'technique_guidance' | 'counter_singing' | 'canh_hat_etiquette' | 'custom_prompt';

interface PresetQuery {
  title: string;
  mode: AdvisorMode;
  query: string;
}

const PRESET_QUERIES: PresetQuery[] = [
  {
    title: 'Giải nghĩa tục "Kết chạ" và "Nhà chứa"',
    mode: 'explain_term',
    query: 'Tục kết chạ giữa các làng Quan họ cổ và vai trò của nhà chứa trong sinh hoạt văn hóa Kinh Bắc có ý nghĩa gì đối với cộng đồng di cư tại Hà Nội?',
  },
  {
    title: 'Kỹ thuật lấy hơi & nảy hạt bài "La rằng"',
    mode: 'technique_guidance',
    query: 'Trong điệu lề lối La rằng (La rằng... la rằng rằng ơi...), cách nén hơi cơ hoành để tạo độ rền và cách nắn hạt nảy vi tế ở cuống họng cần rèn luyện thế nào?',
  },
  {
    title: 'Gợi ý bài đối đáp cho "Ngồi tựa mạn thuyền"',
    mode: 'counter_singing',
    query: 'Khi liền anh xướng làn điệu giọng vặt "Ngồi tựa mạn thuyền", bên liền chị nên đối đáp lại bằng những làn điệu nào để cân xứng về cao độ, cấu trúc ngũ cung và tình ý?',
  },
  {
    title: 'Nghi thức têm trầu cánh phượng & mời trầu',
    mode: 'canh_hat_etiquette',
    query: 'Ý nghĩa của miếng trầu cánh phượng và cử chỉ chuẩn mực khi liền chị bưng khay cơi trầu hai tay mời khách trong canh hát?',
  },
  {
    title: 'Cách phân biệt "Hát mộc" và "Hát có nhạc đệm"',
    mode: 'explain_term',
    query: 'Vì sao trong hồ sơ UNESCO và các nghệ nhân cao niên luôn coi hát mộc không nhạc đệm là tiêu chuẩn cao nhất của Dân ca Quan họ?',
  },
];

export const GeminiHeritageAdvisor: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<AdvisorMode>('explain_term');
  const [inputQuery, setInputQuery] = useState('');
  const [resultText, setResultText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  const handleRunQuery = async (queryText?: string, modeOverride?: AdvisorMode) => {
    const textToSubmit = queryText || inputQuery;
    const modeToSubmit = modeOverride || selectedMode;

    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResultText(null);
    speechReader.stop();
    setIsReadingSpeech(false);

    try {
      const response = await fetch('/api/gemini/analyze-quanho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: modeToSubmit,
          content: textToSubmit.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi kết nối dịch vụ cố vấn');
      }

      setResultText(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ Cố vấn Di sản');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = () => {
    if (!resultText) return;

    if (isReadingSpeech) {
      speechReader.stop();
      setIsReadingSpeech(false);
    } else {
      setIsReadingSpeech(true);
      speechReader.speak(resultText, () => setIsReadingSpeech(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#5B1A18] via-[#7E2522] to-[#401211] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-xs font-semibold tracking-wide border border-[#E8C547]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRÍ TUỆ NHÂN TẠO ĐỒNG HÀNH BẢO TỒN DI SẢN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            Cố Vấn Di Sản Dân Ca Quan Họ Thông Minh
          </h2>
          <p className="text-sm sm:text-base text-[#F4DEC3] leading-relaxed">
            Ứng dụng mô hình <strong>Gemini 3.8 Flash</strong> phía máy chủ để hỗ trợ tra cứu, 
            giải nghĩa phương ngữ Kinh Bắc, phân tích kỹ thuật xướng âm <em>Vang - Rền - Nền - Nảy</em>, 
            gợi ý đối đáp bài bản lề lối và hướng dẫn quy chuẩn canh hát truyền thống theo góc nhìn của người học hỏi di sản.
          </p>
          <div className="text-xs text-[#E8C547] flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Xử lý an toàn phía máy chủ (Server-Side Proxy) • Giọng văn tôn trọng cộng đồng • Không phán xét đúng sai
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mode Selector & Query Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E3D9C9] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#5B1A18] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5B1A18]" />
              <span>Chọn Chuyên Đề Cố Vấn</span>
            </h3>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'explain_term', label: 'Giải nghĩa từ cổ & tục lệ', icon: '📖' },
                { id: 'technique_guidance', label: 'Kỹ thuật Vang-Rền-Nền-Nảy', icon: '🎙️' },
                { id: 'counter_singing', label: 'Gợi ý đối đáp bài bản', icon: '🎶' },
                { id: 'canh_hat_etiquette', label: 'Nghi thức canh hát & mời trầu', icon: '🪶' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMode(item.id as AdvisorMode)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    selectedMode === item.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] font-semibold shadow-xs'
                      : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E8DEC8] hover:bg-[#F3EDE2]'
                  }`}
                >
                  <span className="text-base block mb-1">{item.icon}</span>
                  <span className="leading-snug block">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[#5B1A18] block">
                Nội dung câu hỏi / Câu hát / Điển tích cần tham vấn:
              </label>
              <textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ví dụ: Phân tích kỹ thuật nảy hạt trong câu hát 'Người ơi người ở đừng về' hoặc giải nghĩa tục 'kết chạ'..."
                rows={4}
                className="w-full p-3.5 rounded-xl border border-[#D8CCBA] bg-[#FAF8F5] text-xs text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40 resize-none"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setInputQuery('')}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#8C7A70] hover:text-[#5B1A18] transition-colors"
                >
                  Xóa trắng
                </button>

                <button
                  onClick={() => handleRunQuery()}
                  disabled={isLoading || !inputQuery.trim()}
                  className="px-5 py-2 rounded-xl bg-[#5B1A18] text-[#FDEBD0] text-xs font-semibold hover:bg-[#742321] disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang luận giải...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi tới Cố vấn Gemini</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Questions */}
          <div className="bg-white rounded-2xl p-5 border border-[#E3D9C9] shadow-xs space-y-3">
            <span className="text-xs font-bold text-[#7A6458] uppercase tracking-wider block">
              💡 Câu hỏi điền dã mẫu (Nhấp để tra cứu ngay):
            </span>
            <div className="space-y-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(preset.query);
                    setSelectedMode(preset.mode);
                    handleRunQuery(preset.query, preset.mode);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#3A2D26] text-xs transition-colors border border-[#E8DEC8] flex items-center justify-between group"
                >
                  <span className="font-serif font-medium group-hover:text-[#5B1A18] truncate pr-2">
                    {preset.title}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E8C547] shrink-0 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Response Display */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-4 min-h-[460px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Output Header */}
            <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF2EB] text-[#5B1A18] flex items-center justify-center font-bold text-xs border border-[#E6CCA8]">
                  AI
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#5B1A18]">
                    Luận Giải Chuyên Môn Di Sản
                  </h4>
                  <span className="text-[11px] text-[#8C7A70]">
                    Trực tiếp từ mô hình Gemini 3.8 Flash • Cơ sở lý luận Viện Âm nhạc & 49 Làng cổ
                  </span>
                </div>
              </div>

              {resultText && (
                <button
                  onClick={handleToggleSpeech}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    isReadingSpeech
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18]'
                      : 'bg-[#FAF8F5] text-[#5B1A18] border-[#D8CCBA] hover:bg-[#F3EDE2]'
                  }`}
                  title="Đọc kết quả thành tiếng cho người cao tuổi"
                >
                  {isReadingSpeech ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isReadingSpeech ? 'Dừng đọc' : 'Đọc tiếng'}</span>
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#5B1A18] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-serif text-sm font-semibold text-[#5B1A18]">
                  Đang đối chiếu kho tư liệu 49 làng cổ và thanh nhạc Kinh Bắc...
                </p>
                <p className="text-xs text-[#8C7A70] max-w-sm mx-auto">
                  Mô hình Gemini đang phân tích theo lề lối xướng âm mộc Vang - Rền - Nền - Nảy.
                </p>
              </div>
            )}

            {/* Error State */}
            {errorMessage && !isLoading && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Không thể xử lý yêu cầu:</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Result Content */}
            {resultText && !isLoading && (
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#DFD4C3] space-y-3 text-[#2C2420] text-sm leading-relaxed whitespace-pre-line font-sans">
                {resultText}
              </div>
            )}

            {/* Empty State */}
            {!resultText && !isLoading && !errorMessage && (
              <div className="py-20 text-center space-y-3 text-[#8C7A70]">
                <Sparkles className="w-12 h-12 text-[#D0C2AE] mx-auto" />
                <h5 className="font-serif text-base font-bold text-[#5A4A42]">
                  Sẵn Sàng Hỗ Trợ Tìm Hiểu & Học Hỏi Di Sản
                </h5>
                <p className="text-xs max-w-md mx-auto leading-relaxed">
                  Hãy nhập câu hỏi vào ô bên trái hoặc chọn một câu hỏi điền dã gợi ý để nhận giải đáp chuyên sâu 
                  về kỹ thuật hát lề lối, phương ngữ Kinh Bắc, bài đối đáp hoặc nghi thức mời trầu canh hát.
                </p>
              </div>
            )}
          </div>

          {/* Academic Footer Notice */}
          <div className="pt-4 border-t border-[#F0E8DC] text-[11px] text-[#8C7A70] flex items-center justify-between">
            <span>
              * Giữ đúng nguyên tắc: Người học hỏi, tôn trọng chủ thể di sản, không phê phán.
            </span>
            <span className="font-mono">Model: gemini-3.8-flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
