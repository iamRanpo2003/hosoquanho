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
  FileCheck,
  Lock,
  Info
} from 'lucide-react';
import { audioPlayer } from '../utils/audio-synth';
import { speechReader } from '../utils/speech-reader';
import { shouldDisplayMediaStatus } from '../utils/heritage-logic';

interface RecordDetailModalProps {
  record: HeritageRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  if (!record) return null;

  // Phát mô phỏng cao độ ngũ cung
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

  // Đọc to toàn bộ bản ghi cho người cao tuổi
  const handleToggleSpeech = () => {
    if (isReadingSpeech) {
      speechReader.stop();
      setIsReadingSpeech(false);
    } else {
      setIsReadingSpeech(true);
      const fullText = `Hồ sơ số Dân ca Quan họ. Mã tư liệu: ${record.id}. Tiêu đề: ${record.title}. 
      Đồng thuận của chủ thể di sản: ${record.consentStatement}. 
      Người cung cấp: ${record.contributor.name}, vai trò ${record.contributor.role}, quê gốc tại ${record.contributor.origin}. 
      Địa bàn hiện nay sau sắp xếp năm 2025: ${record.currentAdminPlace}. Tên cũ và địa danh gốc: ${record.originalAdminPlace}. 
      Đối chiếu với làng Quan họ cổ ${record.kinhBacReferenceVillage}. 
      Tiếng của chính cộng đồng: "${record.communityQuote}". 
      Nội dung tư liệu: ${record.content}. 
      Bối cảnh thực địa: ${record.fieldworkContext}. 
      Nguồn tư liệu kiểm chứng: ${record.sourceCitation}. Phạm vi sử dụng: ${record.usageScope}.`;
      speechReader.speak(fullText, () => setIsReadingSpeech(false));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-modal-title"
    >
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-4 sm:p-6 flex items-start justify-between gap-3 border-b border-[#E8C547]/30">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-sm font-mono font-bold">
                {record.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-sm text-[#FDEBD0]">
                {record.recordTypeLabel}
              </span>
              <span className="text-sm text-[#E8C547] flex items-center gap-1">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{record.surveyDay}</span>
              </span>
            </div>
            <h2 id="record-modal-title" className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight break-words">
              {record.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors border ${
                isReadingSpeech
                  ? 'bg-[#E8C547] text-[#4A1513] border-[#E8C547]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Đọc to cho người cao tuổi"
              aria-label={isReadingSpeech ? 'Dừng đọc tiếng' : 'Đọc tiếng'}
            >
              {isReadingSpeech ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span className="hidden sm:inline">{isReadingSpeech ? 'Dừng đọc' : 'Đọc tiếng'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                speechReader.stop();
                audioPlayer.stop();
                onClose();
              }}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors flex items-center justify-center"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto text-[#2C2420]">
          {/* MANDATORY CONSENT STATEMENT AT THE VERY TOP */}
          <div className="bg-[#FAF2E8] border border-[#E6CCA8] rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#80221F] shrink-0 mt-1" />
            <div className="space-y-1.5 min-w-0">
              <h3 className="font-bold text-sm text-[#80221F] uppercase tracking-wide">
                Đồng thuận của Chủ thể Di sản (Ghi nhận ở đầu bản ghi)
              </h3>
              <p className="text-base text-[#4A3222] italic leading-relaxed">
                "{record.consentStatement}"
              </p>
              <p className="text-base text-[#6A574C]">
                <strong>Phạm vi cho phép:</strong> {record.usageScope}
              </p>
            </div>
          </div>

          {/* VERIFIED OPEN-LICENSED REFERENCE PHOTO (IF AVAILABLE) */}
          {record.imageUrl && record.imageAttribution && (
            <figure className="rounded-xl overflow-hidden border border-[#E3D9C9] bg-white shadow-2xs">
              <div className="relative max-h-80 w-full bg-[#EFE8DC] overflow-hidden">
                <img
                  src={record.imageUrl}
                  alt={record.imageCaption || record.title}
                  className="w-full max-h-80 object-cover"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#2C1817]/85 text-[#FDEBD0] text-xs font-semibold border border-[#E8C547]/40">
                  Ảnh tư liệu tham khảo ({record.imageAttribution.license})
                </span>
              </div>
              <figcaption className="p-4 space-y-2 bg-[#FAF8F5] border-t border-[#EAE0D0]">
                <p className="text-base text-[#2C2420] font-medium leading-relaxed">
                  {record.imageCaption}
                </p>
                <div className="text-sm text-[#5A4A42] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>Tác giả:</strong> {record.imageAttribution.author} ({record.imageAttribution.year}) • <strong>Giấy phép:</strong> {record.imageAttribution.license}
                  </span>
                  <a
                    href={record.imageAttribution.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#D8CCBA] text-[#5B1A18] font-semibold hover:bg-[#FAF4EA] transition-colors"
                  >
                    <span>Xem tệp gốc Wikimedia Commons</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </figcaption>
            </figure>
          )}

          {/* MEDIA & NON-PUBLIC SAFEGUARD NOTICE */}
          {(shouldDisplayMediaStatus(record.mediaStatus) || record.nonPublicNote) && (
            <div
              className={`grid grid-cols-1 ${
                shouldDisplayMediaStatus(record.mediaStatus) && record.nonPublicNote
                  ? 'md:grid-cols-2'
                  : ''
              } gap-4`}
            >
              {shouldDisplayMediaStatus(record.mediaStatus) && (
                <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-1.5">
                  <span className="text-sm font-bold text-[#5B1A18] flex items-center gap-1.5">
                    <Info className="w-4 h-4 shrink-0" />
                    Trạng thái tư liệu ảnh / âm thanh gốc
                  </span>
                  <p className="text-base text-[#4A3B32] leading-relaxed">
                    {record.mediaStatus}
                  </p>
                </div>
              )}
              {record.nonPublicNote && (
                <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-1.5">
                  <span className="text-sm font-bold text-[#80221F] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 shrink-0" />
                    Phần không công bố theo dặn dò
                  </span>
                  <p className="text-base text-[#4A3B32] leading-relaxed">
                    {record.nonPublicNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* DUAL LOCATIONS & KINHBAC REFERENCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2">
              <span className="text-sm font-bold text-[#5B1A18] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5B1A18] shrink-0" />
                <span>Địa danh hiện nay (sau 07/2025)</span>
              </span>
              <p className="font-semibold text-base text-[#2C2420] break-words">
                {record.currentAdminPlace}
              </p>
              <p className="text-base text-[#6A574C]">
                * Ghi theo đơn vị hành chính cấp xã/phường + tỉnh/thành phố (không ghi cấp huyện).
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2">
              <span className="text-sm font-bold text-[#805030] uppercase tracking-wider flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-[#805030] shrink-0" />
                <span>Tên cũ & Địa danh gốc lịch sử</span>
              </span>
              <p className="font-semibold text-base text-[#55453C] italic break-words">
                {record.originalAdminPlace}
              </p>
              <p className="text-base text-[#6A574C]">
                * Lưu giữ tên cũ trước sắp xếp năm 2025 và địa danh xưa để đối chiếu.
              </p>
            </div>
          </div>

          {/* VÙNG ĐỐI CHIẾU KINH BẮC & CHỦ THỂ */}
          <div className="bg-[#F8F4EE] p-4 rounded-xl border border-[#E8DEC8] space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-base">
              <span className="font-bold text-[#2A5235]">Làng Quan họ cổ đối chiếu:</span>
              <span className="font-semibold text-[#1B3E25] bg-[#E7F3EA] px-3 py-1 rounded-md border border-[#C5E2CB]">
                {record.kinhBacReferenceVillage}
              </span>
            </div>
            <div className="flex items-start gap-2 text-base text-[#2C2420]">
              <User className="w-5 h-5 text-[#5B1A18] shrink-0 mt-1" />
              <p className="leading-relaxed">
                <strong>Người cung cấp:</strong> {record.contributor.name} ({record.contributor.role}
                {record.contributor.age ? `, ${record.contributor.age} tuổi` : ''}) — Quê gốc: {record.contributor.origin}
              </p>
            </div>
          </div>

          {/* TIẾNG CỦA CHÍNH CỘNG ĐỒNG (RAW QUOTE) */}
          <div className="bg-gradient-to-r from-[#FAF0E6] to-[#FDF6F0] p-4 sm:p-5 rounded-xl border-l-4 border-[#5B1A18] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#5B1A18] uppercase">
              <Quote className="w-4 h-4 text-[#5B1A18] shrink-0" />
              <span>Tiếng của chính cộng đồng (Trích nguyên văn)</span>
            </div>
            <blockquote className="font-serif italic text-base sm:text-lg text-[#401211] leading-relaxed">
              "{record.communityQuote}"
            </blockquote>
            <p className="text-base text-[#7A5548]">
              — Lời chia sẻ trực tiếp của {record.contributor.name}, ghi nhận tại {record.currentAdminPlace}.
            </p>
          </div>

          {/* PENTATONIC PITCH SIMULATION */}
          {record.audioSample && (
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#DCD0C0] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#5B1A18] shrink-0" />
                  <span className="font-serif font-bold text-base text-[#5B1A18]">
                    Mô phỏng cao độ ngũ cung: {record.audioSample.songName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    isPlayingAudio
                      ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                      : 'bg-[#E8C547] text-[#4A1513] hover:bg-[#D4AF37]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-4 h-4 fill-current shrink-0" />
                      <span>Dừng mô phỏng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current shrink-0" />
                      <span>Nghe mô phỏng cao độ</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#F0E8DC] text-base font-mono text-[#5A4A42] break-words">
                {record.audioSample.notes}
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                {record.audioSample.pitchPattern.map((pitch, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      activeNoteIdx === idx
                        ? 'bg-[#5B1A18] scale-125 ring-4 ring-[#E8C547]'
                        : 'bg-[#E2D5C3]'
                    }`}
                    title={`Nốt ${idx + 1} (${pitch} Hz)`}
                  />
                ))}
              </div>
              <p className="text-base text-center text-[#7A6458] italic">
                * Đây là âm thanh tổng hợp mô phỏng thang âm tham khảo, không phải tệp ghi âm giọng thật của nghệ nhân.
              </p>
            </div>
          )}

          {/* DIALECT GLOSSARY */}
          {record.dialectGlossary && record.dialectGlossary.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#5B1A18]">
                Thuật ngữ bản địa Quan họ & Chú giải
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {record.dialectGlossary.map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-[#E3D9C9] space-y-1">
                    <strong className="text-base text-[#5B1A18] block">{item.term}</strong>
                    <p className="text-base text-[#55453C] leading-relaxed">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENT DETAILS & FIELDWORK CONTEXT */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#5B1A18]">
                Nội dung tư liệu chi tiết
              </h3>
              <p className="text-base text-[#2C2420] leading-relaxed bg-white p-4 rounded-xl border border-[#E3D9C9]">
                {record.content}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-sm uppercase tracking-wide text-[#7A6458]">
                Bối cảnh điền dã thực tế
              </h3>
              <p className="text-base text-[#55453C] italic bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE0D0] leading-relaxed">
                {record.fieldworkContext}
              </p>
            </div>
          </div>

          {/* SOURCE CITATION */}
          <div className="bg-[#F0EBE1] p-4 rounded-xl border border-[#DFD5C6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <span className="font-bold text-sm text-[#4A3B32] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Nguồn kiểm chứng tư liệu:</span>
              </span>
              <p className="text-base text-[#5B1A18] font-semibold break-words">{record.sourceCitation}</p>
            </div>

            {record.sourceUrl && (
              <a
                href={record.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#D0C2AE] hover:bg-[#FAF8F5] text-[#5B1A18] text-sm font-semibold transition-colors shadow-2xs shrink-0"
              >
                <span>Mở nguồn đối chiếu</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF4EA] px-4 sm:px-6 py-4 border-t border-[#E3D9C9] flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-[#6A574C]">
            Hồ sơ số Dân ca Quan họ • Nguyễn Viết Hải (PH63500)
          </span>

          <button
            type="button"
            onClick={() => {
              speechReader.stop();
              audioPlayer.stop();
              onClose();
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-base font-semibold hover:bg-[#722220] transition-colors"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
