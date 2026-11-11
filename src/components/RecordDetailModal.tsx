import React, { useState } from 'react';
import { HeritageRecord } from '../types/heritage';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck, 
  ExternalLink, 
  Quote, 
  BookMarked,
  Music,
  Share2,
  FileCheck
} from 'lucide-react';
import { audioPlayer } from '../utils/audio-synth';
import { speechReader } from '../utils/speech-reader';

interface RecordDetailModalProps {
  record: HeritageRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  if (!record) return null;

  // Xử lý phát âm mộc ngũ cung
  const handleToggleAudio = () => {
    if (!record.audioSample) return;

    if (isPlayingAudio) {
      audioPlayer.stop();
      setIsPlayingAudio(false);
      setActiveNoteIdx(null);
    } else {
      setIsPlayingAudio(true);
      audioPlayer.playPitchSequence(
        record.audioSample.pitchPattern,
        (idx) => setActiveNoteIdx(idx),
        () => {
          setIsPlayingAudio(false);
          setActiveNoteIdx(null);
        }
      );
    }
  };

  // Đọc to toàn bộ bản ghi cho các cụ
  const handleToggleSpeech = () => {
    if (isReadingSpeech) {
      speechReader.stop();
      setIsReadingSpeech(false);
    } else {
      setIsReadingSpeech(true);
      const fullText = `Hồ sơ số Dân ca Quan họ. Mã tư liệu: ${record.id}. Tiêu đề: ${record.title}. 
      Văn bản đồng thuận của chủ thể di sản: ${record.consentStatement}. 
      Người cung cấp: ${record.contributor.name}, vai trò ${record.contributor.role}, quê gốc tại ${record.contributor.origin}. 
      Địa bàn hiện nay: ${record.currentAdminPlace}. Địa danh gốc thời điểm tư liệu: ${record.originalAdminPlace}. 
      Đối chiếu với làng Quan họ cổ ${record.kinhBacReferenceVillage}. 
      Tiếng của chính cộng đồng: trích nguyên văn: "${record.communityQuote}". 
      Nội dung tư liệu: ${record.content}. 
      Bối cảnh thực địa: ${record.fieldworkContext}. 
      Nguồn tư liệu kiểm chứng: ${record.sourceCitation}. Phạm vi sử dụng: ${record.usageScope}.`;
      speechReader.speak(fullText, () => setIsReadingSpeech(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-[#E8C547]/30">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
                {record.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs text-[#FDEBD0]">
                {record.recordTypeLabel}
              </span>
              <span className="text-xs text-[#E8C547] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {record.surveyDay}
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
              {record.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isReadingSpeech
                  ? 'bg-[#E8C547] text-[#4A1513] border-[#E8C547]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Đọc to cho người cao tuổi"
            >
              {isReadingSpeech ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isReadingSpeech ? 'Dừng đọc' : 'Đọc tiếng'}</span>
            </button>

            <button
              onClick={() => {
                speechReader.stop();
                audioPlayer.stop();
                onClose();
              }}
              className="p-2 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-[#2C2420]">
          {/* MANDATORY CONSENT STATEMENT AT THE VERY TOP */}
          <div className="bg-[#FAF2E8] border border-[#E6CCA8] rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#80221F] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-[#80221F] uppercase tracking-wide">
                Đồng thuận của Chủ thể Di sản (Ghi nhận ở đầu bản ghi)
              </h4>
              <p className="text-[#4A3222] italic">
                "{record.consentStatement}"
              </p>
              <div className="text-[11px] text-[#7A6458] pt-0.5">
                <strong>Phạm vi cho phép:</strong> {record.usageScope}
              </div>
            </div>
          </div>

          {/* FIELD PHOTOGRAPH / VISUAL RECORD */}
          {record.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[#E3D9C9] bg-white shadow-xs">
              <div className="relative aspect-video max-h-80 w-full overflow-hidden bg-black/5">
                <img
                  src={record.imageUrl}
                  alt={record.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {record.imageCaption && (
                <div className="p-3 bg-[#FAF8F5] border-t border-[#F0E8DC] text-xs text-[#5B1A18] font-medium flex items-center gap-2">
                  <span className="font-bold">📷 Tư liệu hình ảnh thực địa:</span>
                  <span className="text-[#4A3222] italic">{record.imageCaption}</span>
                </div>
              )}
            </div>
          )}

          {/* DUAL LOCATIONS & KINHBAC REFERENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2">
              <span className="text-xs font-bold text-[#5B1A18] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5B1A18]" />
                Địa danh hiện nay (Chuẩn hành chính)
              </span>
              <p className="font-semibold text-sm text-[#2C2420]">
                {record.currentAdminPlace}
              </p>
              <p className="text-xs text-[#7A6458]">
                * Quy định: Ghi theo cấp xã/phường + tỉnh/thành phố (không ghi cấp huyện).
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2">
              <span className="text-xs font-bold text-[#805030] uppercase tracking-wider flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-[#805030]" />
                Địa danh tại thời điểm tư liệu (Gốc lịch sử)
              </span>
              <p className="font-semibold text-sm text-[#55453C] italic">
                {record.originalAdminPlace}
              </p>
              <p className="text-xs text-[#7A6458]">
                * Giữ nguyên vẹn tên cổ trong hồ sơ và trích lục văn bản.
              </p>
            </div>
          </div>

          {/* VÙNG ĐỐI CHIẾU KINH BẮC & CHỦ THỂ */}
          <div className="bg-[#F8F4EE] p-4 rounded-xl border border-[#E8DEC8] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2A5235]">🌾 Làng Quan họ cổ đối chiếu:</span>
              <span className="font-semibold text-[#1B3E25] bg-[#E7F3EA] px-2.5 py-1 rounded-md border border-[#C5E2CB]">
                {record.kinhBacReferenceVillage}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B1A18]" />
              <span>
                <strong>Người cung cấp:</strong> {record.contributor.name} ({record.contributor.role}
                {record.contributor.age ? `, ${record.contributor.age} tuổi` : ''}) - Gốc: {record.contributor.origin}
              </span>
            </div>
          </div>

          {/* TIẾNG CỦA CHÍNH CỘNG ĐỒNG (RAW QUOTE) */}
          <div className="bg-gradient-to-r from-[#FAF0E6] to-[#FDF6F0] p-5 rounded-xl border-l-4 border-[#5B1A18] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#5B1A18] uppercase">
              <Quote className="w-4 h-4 text-[#5B1A18]" />
              Tiếng của chính cộng đồng (Trích nguyên văn lời nghệ nhân)
            </div>
            <blockquote className="font-serif italic text-base sm:text-lg text-[#401211] leading-relaxed">
              "{record.communityQuote}"
            </blockquote>
            <p className="text-xs text-[#8A6052]">
              — Lời kể trực tiếp của {record.contributor.name}, ghi nhận tại {record.currentAdminPlace}.
            </p>
          </div>

          {/* BẢN CHẤT ÂM MỘC VÀ NGŨ CUNG (AUDIO SYNTH IF AVAILABLE) */}
          {record.audioSample && (
            <div className="bg-white p-5 rounded-xl border border-[#DCD0C0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#5B1A18]" />
                  <span className="font-serif font-bold text-sm text-[#5B1A18]">
                    Mẫu xướng âm mộc ngũ cung: {record.audioSample.songName}
                  </span>
                </div>
                <button
                  onClick={handleToggleAudio}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlayingAudio
                      ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                      : 'bg-[#E8C547] text-[#4A1513] hover:bg-[#D4AF37]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng âm mộc</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Nghe diễn xướng mộc</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#F0E8DC] text-xs font-mono text-[#6A574C]">
                {record.audioSample.notes}
              </div>

              {/* Pitch Visualizer Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {record.audioSample.pitchPattern.map((pitch, idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      activeNoteIdx === idx
                        ? 'bg-[#5B1A18] scale-135 ring-4 ring-[#E8C547]'
                        : 'bg-[#E2D5C3]'
                    }`}
                    title={`Nốt ${idx + 1} (${pitch} Hz)`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-center text-[#8C7A70] italic">
                * Mô phỏng xướng âm mộc ngũ cung không nhạc đệm theo lối truyền khẩu Kinh Bắc
              </p>
            </div>
          )}

          {/* DIALECT GLOSSARY */}
          {record.dialectGlossary && record.dialectGlossary.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#5B1A18] flex items-center gap-2">
                <span>📚</span>
                <span>Thuật ngữ bản địa Quan họ & Chú giải</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {record.dialectGlossary.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-[#E3D9C9] text-xs space-y-1">
                    <strong className="text-[#5B1A18] block">{item.term}</strong>
                    <p className="text-[#55453C] leading-snug">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENT DETAILS & FIELDWORK CONTEXT */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="font-serif font-bold text-sm text-[#5B1A18]">
                Nội dung tư liệu chi tiết
              </h4>
              <p className="text-sm text-[#382D27] leading-relaxed bg-white p-4 rounded-xl border border-[#E3D9C9]">
                {record.content}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wide text-[#7A6458]">
                Bối cảnh điền dã thực tế
              </h4>
              <p className="text-xs text-[#55453C] italic bg-[#FAF8F5] p-3 rounded-lg border border-[#EAE0D0]">
                {record.fieldworkContext}
              </p>
            </div>
          </div>

          {/* SOURCE CITATION */}
          <div className="bg-[#F0EBE1] p-4 rounded-xl border border-[#DFD5C6] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#4A3B32] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Nguồn kiểm chứng tư liệu:
              </span>
              <p className="font-mono text-[#5B1A18] font-semibold">{record.sourceCitation}</p>
            </div>

            {record.sourceUrl && (
              <a
                href={record.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#D0C2AE] hover:bg-[#FAF8F5] text-[#5B1A18] font-semibold transition-colors shadow-2xs"
              >
                <span>Mở nguồn đối chiếu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF4EA] px-6 py-4 border-t border-[#E3D9C9] flex items-center justify-between">
          <span className="text-xs text-[#7A6458]">
            Hồ sơ số Dân ca Quan họ • Nguyễn Viết Hải (PH63500)
          </span>

          <button
            onClick={() => {
              speechReader.stop();
              audioPlayer.stop();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-sm font-semibold hover:bg-[#722220] transition-colors"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
