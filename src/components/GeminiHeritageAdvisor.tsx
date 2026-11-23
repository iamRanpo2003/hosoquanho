import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
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
    title: 'Giải nghĩa tục "Kết chạ" và "Bọn Quan họ" trong hồ sơ',
    mode: 'explain_term',
    query: 'Theo tư liệu của ứng dụng, tục kết chạ và bọn Quan họ có ý nghĩa gì đối với cộng đồng di cư tại Hà Nội?',
  },
  {
    title: 'Kỹ thuật "Vang - Rền - Nền - Nảy" trong bài "La rằng" và "Tình tang"',
    mode: 'technique_guidance',
    query: 'Các bản ghi trong ứng dụng ghi nhận thế nào về kỹ thuật Rền, Nền và Nảy hạt trong bài La rằng và Tình tang?',
  },
  {
    title: 'Đối đáp bài "Ngồi tựa mạn thuyền" theo bản ký âm QH-HN-011',
    mode: 'counter_singing',
    query: 'Theo hồ sơ số, khi bên nam hát "Ngồi tựa mạn thuyền" thì bên nữ thường đối lại bằng bài nào và theo nguyên tắc gì?',
  },
  {
    title: 'Nghi thức têm trầu cánh phượng và bưng khay hai tay',
    mode: 'canh_hat_etiquette',
    query: 'Tư liệu điền dã ghi nhận cách têm trầu cánh phượng và quy tắc bưng khay mời trầu trong canh hát như thế nào?',
  },
  {
    title: 'Thử câu hỏi ngoài dữ liệu ứng dụng (Kiểm tra từ chối bịa)',
    mode: 'custom_prompt',
    query: 'Lịch sử phát triển Dân ca Quan họ qua từng triều đại thế kỷ XV như thế nào?',
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
        throw new Error(data.error || 'Lỗi khi kết nối dịch vụ hỏi đáp di sản');
      }

      setResultText(data.result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Cố vấn Di sản';
      setErrorMessage(msg);
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
      <section className="bg-gradient-to-r from-[#5B1A18] via-[#7E2522] to-[#401211] text-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-sm font-semibold border border-[#E8C547]/30">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>HỎI ĐÁP DỰA TRÊN DỮ LIỆU HỒ SƠ SỐ</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            Hỏi Đáp Di Sản Dân Ca Quan Họ (Giới Hạn Trong Kho Dữ Liệu)
          </h2>
          <p className="text-base text-[#F4DEC3] leading-relaxed">
            Trợ lý Gemini 4 Hydrogen phía máy chủ chỉ trả lời dựa trên <strong>16 bản ghi thực địa và danh mục nguồn có sẵn trong ứng dụng</strong>. Nếu nội dung nằm ngoài dữ liệu, hệ thống sẽ trả lời <em>"Ứng dụng chưa có thông tin này"</em> và gợi ý nguồn chính thống để bạn tra cứu.
          </p>
          <div className="text-sm text-[#E8C547] flex flex-wrap items-center gap-2 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mỗi câu trả lời đều ghi rõ tên nguồn đã sử dụng • Khóa API xử lý hoàn toàn phía máy chủ</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mode Selector & Query Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3D9C9] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#5B1A18] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#5B1A18] shrink-0" />
              <span>Chọn Chuyên Đề Tra Cứu</span>
            </h3>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'explain_term', label: 'Giải nghĩa từ cổ & tục lệ' },
                { id: 'technique_guidance', label: 'Kỹ thuật Vang-Rền-Nền-Nảy' },
                { id: 'counter_singing', label: 'Bài đối đáp trong hồ sơ' },
                { id: 'canh_hat_etiquette', label: 'Nghi thức mời trầu & canh hát' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedMode(item.id as AdvisorMode)}
                  className={`min-h-[48px] p-3 rounded-xl text-left text-sm sm:text-base transition-all border ${
                    selectedMode === item.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] font-semibold shadow-xs'
                      : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E8DEC8] hover:bg-[#F3EDE2]'
                  }`}
                >
                  <span className="leading-snug block">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="space-y-2.5 pt-2">
              <label htmlFor="gemini-query-input" className="text-base font-bold text-[#5B1A18] block">
                Nội dung câu hỏi cần tra cứu:
              </label>
              <textarea
                id="gemini-query-input"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Nhập câu hỏi về 16 bản ghi, từ cổ Kinh Bắc, kỹ thuật hát mộc hoặc địa danh đối chiếu..."
                rows={4}
                className="w-full p-3.5 rounded-xl border border-[#D8CCBA] bg-[#FAF8F5] text-base text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40 resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium text-[#5A4A42] hover:text-[#5B1A18] hover:bg-[#FAF4EA] transition-colors"
                >
                  Xóa trắng
                </button>

                <button
                  type="button"
                  onClick={() => handleRunQuery()}
                  disabled={isLoading || !inputQuery.trim()}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#5B1A18] text-[#FDEBD0] text-base font-semibold hover:bg-[#742321] disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin shrink-0" />
                      <span>Đang tra cứu...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Gửi câu hỏi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Questions */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3D9C9] shadow-xs space-y-3">
            <span className="text-sm font-bold text-[#7A6458] uppercase tracking-wider block">
              Câu hỏi mẫu kiểm chứng (nhấn để hỏi ngay):
            </span>
            <div className="space-y-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setInputQuery(preset.query);
                    setSelectedMode(preset.mode);
                    handleRunQuery(preset.query, preset.mode);
                  }}
                  className="w-full min-h-[48px] text-left p-3 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EDE2] text-[#3A2D26] text-sm sm:text-base transition-colors border border-[#E8DEC8] flex items-center justify-between gap-2 group"
                >
                  <span className="font-serif font-medium group-hover:text-[#5B1A18] leading-snug">
                    {preset.title}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#E8C547] shrink-0 opacity-80 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Response Display */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-4 min-h-[420px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Output Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E8DC] pb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#FAF2EB] text-[#5B1A18] flex items-center justify-center font-bold text-sm border border-[#E6CCA8] shrink-0">
                  AI
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                    Kết Quả Tra Cứu Từ Dữ Liệu Ứng Dụng
                  </h4>
                  <span className="text-sm text-[#7A6458] block">
                    Chỉ trích dẫn từ 16 bản ghi, làng cổ và 7 nguồn chính thống
                  </span>
                </div>
              </div>

              {resultText && (
                <button
                  type="button"
                  onClick={handleToggleSpeech}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border ${
                    isReadingSpeech
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18]'
                      : 'bg-[#FAF8F5] text-[#5B1A18] border-[#D8CCBA] hover:bg-[#F3EDE2]'
                  }`}
                  title="Đọc kết quả thành tiếng cho người cao tuổi"
                >
                  {isReadingSpeech ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isReadingSpeech ? 'Dừng đọc' : 'Đọc tiếng'}</span>
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#5B1A18] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-serif text-base font-semibold text-[#5B1A18]">
                  Đang đối chiếu câu hỏi với kho dữ liệu hồ sơ số...
                </p>
                <p className="text-base text-[#7A6458] max-w-md mx-auto">
                  Nếu không có thông tin trong dữ liệu, hệ thống sẽ báo chưa có và gợi ý nguồn chính thống.
                </p>
              </div>
            )}

            {/* Error State */}
            {errorMessage && !isLoading && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-base text-red-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-1" />
                <div className="space-y-1">
                  <strong className="block font-bold">Không thể xử lý yêu cầu:</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Result Content */}
            {resultText && !isLoading && (
              <div className="space-y-3">
                <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#DFD4C3] text-[#2C2420] text-base leading-relaxed whitespace-pre-line font-sans break-words">
                  {resultText}
                </div>
                <div className="bg-[#FAF2E8] p-3.5 rounded-lg border border-[#E6CCA8] text-sm text-[#4A3222] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#80221F] shrink-0 mt-0.5" />
                  <span>
                    <strong>Lưu ý kiểm chứng:</strong> Nội dung phản hồi do Gemini tổng hợp từ kho dữ liệu của ứng dụng; những phần cần đối chiếu chi tiết hơn hoặc đánh dấu chưa rõ năm/nguồn cần kiểm tra thêm trực tiếp tại nguồn chính thống được dẫn kèm.
                  </span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!resultText && !isLoading && !errorMessage && (
              <div className="py-14 text-center space-y-3 text-[#6A574C]">
                <Sparkles className="w-12 h-12 text-[#D0C2AE] mx-auto" />
                <h5 className="font-serif text-lg font-bold text-[#5A4A42]">
                  Sẵn Sàng Tra Cứu Dữ Liệu Di Sản
                </h5>
                <p className="text-base max-w-md mx-auto leading-relaxed">
                  Nhập câu hỏi hoặc chọn câu hỏi mẫu bên trái. Mọi câu trả lời đều giới hạn trong dữ liệu ứng dụng và kèm tên nguồn kiểm chứng.
                </p>
              </div>
            )}
          </div>

          {/* Academic Footer Notice */}
          <div className="pt-4 border-t border-[#F0E8DC] text-sm text-[#7A6458] flex flex-wrap items-center justify-between gap-2">
            <span>
              * Chỉ sử dụng dữ liệu nội bộ của ứng dụng • Không tự suy diễn ngoài nguồn.
            </span>
            <span className="font-mono">gemini-4-hydrogen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
