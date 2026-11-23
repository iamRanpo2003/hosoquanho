import React, { useState, useRef } from 'react';
import { HeritageRecord } from '../types/heritage';
import { 
  Search, 
  Filter, 
  Volume2, 
  Play, 
  Square, 
  ExternalLink, 
  Quote, 
  Layers,
  FileAudio,
  Image as ImageIcon,
  Video,
  MessageSquare,
  FileCode,
  Package,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { audioPlayer } from '../utils/audio-synth';
import { speechReader } from '../utils/speech-reader';

interface RecordListProps {
  records: HeritageRecord[];
  onSelectRecord: (record: HeritageRecord) => void;
}

export const RecordList: React.FC<RecordListProps> = ({ records, onSelectRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState('all');
  const [selectedElement, setSelectedElement] = useState('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const searchSectionRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleStartNow = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 250);
  };

  // Lọc danh sách
  const filteredRecords = records.filter((item) => {
    if (selectedType !== 'all' && item.recordType !== selectedType) return false;
    if (selectedPlace !== 'all' && !item.currentAdminPlace.includes(selectedPlace)) return false;
    if (selectedElement !== 'all' && !item.heritageElement.includes(selectedElement)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = [
        item.id,
        item.title,
        item.content,
        item.currentAdminPlace,
        item.originalAdminPlace,
        item.contributor.name,
        item.communityQuote,
        item.heritageElement,
        item.kinhBacReferenceVillage,
      ]
        .join(' ')
        .toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Phát cao độ ngũ cung mô phỏng
  const handlePlayAudio = (record: HeritageRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!record.audioSample) return;

    if (playingAudioId === record.id) {
      audioPlayer.stop();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(record.id);
      audioPlayer.playPitchSequence(
        record.audioSample.pitchPattern,
        undefined,
        () => setPlayingAudioId(null)
      );
    }
  };

  // Đọc to bản ghi cho người cao tuổi
  const handleSpeakRecord = (record: HeritageRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToRead = `Bản ghi mã số ${record.id}. Tiêu đề: ${record.title}. Người cung cấp: ${record.contributor.name}, vai trò ${record.contributor.role}. Lời nghệ nhân: ${record.communityQuote}. Địa danh hiện nay: ${record.currentAdminPlace}. Địa danh cũ thời điểm tư liệu: ${record.originalAdminPlace}. Đối chiếu với ${record.kinhBacReferenceVillage}. Nội dung: ${record.content}. Nguồn kiểm chứng: ${record.sourceCitation}.`;
    speechReader.speak(textToRead);
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'audio_moc': return <FileAudio className="w-4 h-4 text-emerald-700 shrink-0" />;
      case 'anh_thuc_dia': return <ImageIcon className="w-4 h-4 text-amber-700 shrink-0" />;
      case 'video_trich_doan': return <Video className="w-4 h-4 text-red-700 shrink-0" />;
      case 'phong_van_sau': return <MessageSquare className="w-4 h-4 text-blue-700 shrink-0" />;
      case 'ky_am_loi_co': return <FileCode className="w-4 h-4 text-purple-700 shrink-0" />;
      case 'hien_vat_dao_cu': return <Package className="w-4 h-4 text-orange-700 shrink-0" />;
      default: return <Layers className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Focused Hero Section for First-Time Visitors */}
      <section className="bg-gradient-to-r from-[#6A1F1D] via-[#5B1A18] to-[#401211] text-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-3xl space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight leading-snug">
            Tra cứu 16 hồ sơ số Dân ca Quan họ của cộng đồng Kinh Bắc di cư tại Hà Nội
          </h2>
          <p className="text-base text-[#F4DEC3] leading-relaxed">
            Dành cho người học hát Quan họ, thành viên câu lạc bộ và nhà nghiên cứu cần tra cứu bài bản cổ, kỹ thuật hát mộc và địa danh đối chiếu sau sắp xếp năm 2025.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleStartNow}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#E8C547] hover:bg-[#D4AF37] text-[#4A1513] text-base font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Bắt đầu tra cứu hồ sơ ngay</span>
              <ArrowDown className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Panel */}
      <div
        ref={searchSectionRef}
        id="archive-search-section"
        className="bg-white rounded-xl p-4 sm:p-5 border border-[#E3D9C9] shadow-xs space-y-4 scroll-mt-28"
      >
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7A70]" />
            <input
              ref={searchInputRef}
              id="archive-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm hồ sơ số Dân ca Quan họ"
              placeholder="Tìm mã số, tên bài, nghệ nhân hoặc địa danh..."
              className="w-full min-h-[44px] pl-11 pr-14 py-2.5 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-base text-[#2C2420] placeholder-[#8C7A70] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] px-3 text-sm font-semibold text-[#5B1A18] hover:underline"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Quick Filter: Record Type */}
          <div className="w-full md:w-60">
            <select
              aria-label="Lọc theo loại tư liệu"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-base text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
            >
              <option value="all">Tất cả loại tư liệu ({records.length})</option>
              <option value="audio_moc">Tư liệu âm thanh mộc</option>
              <option value="anh_thuc_dia">Tư liệu thực địa / không gian</option>
              <option value="video_trich_doan">Tư liệu diễn xướng</option>
              <option value="phong_van_sau">Phỏng vấn sâu nghệ nhân</option>
              <option value="ky_am_loi_co">Ký âm / Lời bản cổ</option>
              <option value="hien_vat_dao_cu">Hiện vật / Trang phục</option>
            </select>
          </div>

          {/* Quick Filter: Current Place (Post-2025 Units) */}
          <div className="w-full md:w-64">
            <select
              aria-label="Lọc theo địa bàn hiện nay sau sắp xếp năm 2025"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-base text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
            >
              <option value="all">Tất cả địa bàn sau 07/2025</option>
              <option value="Phường Cầu Giấy">Phường Cầu Giấy (Hà Nội)</option>
              <option value="Phường Kim Liên">Phường Kim Liên (Hà Nội)</option>
              <option value="Phường Nghĩa Đô">Phường Nghĩa Đô (Hà Nội)</option>
              <option value="Phường Kinh Bắc">Phường Kinh Bắc (Tỉnh Bắc Ninh)</option>
            </select>
          </div>
        </div>

        {/* Heritage Element Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0E8DC]">
          <span className="text-sm font-semibold text-[#7A6458] flex items-center gap-1.5 mr-1">
            <Filter className="w-4 h-4 shrink-0" />
            <span>Yếu tố di sản:</span>
          </span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Vang - Rền - Nền - Nảy', label: 'Vang - Rền - Nền - Nảy' },
            { id: 'Mời trầu', label: 'Mời trầu' },
            { id: 'Hát đối', label: 'Hát đối' },
            { id: 'Giã bạn', label: 'Giã bạn' },
            { id: 'Trang phục', label: 'Trang phục' },
            { id: 'truyền khẩu', label: 'Truyền khẩu' },
          ].map((tag) => (
            <button
              type="button"
              key={tag.id}
              onClick={() => setSelectedElement(tag.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedElement === tag.id
                  ? 'bg-[#5B1A18] text-[#FDEBD0]'
                  : 'bg-[#F4EFE6] text-[#5A4A42] hover:bg-[#EAE1D2]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-base text-[#5A4A42] px-1">
        <span>
          Hiển thị <strong className="text-[#5B1A18]">{filteredRecords.length}</strong> / {records.length} bản ghi tư liệu điền dã
        </span>
        <span className="text-sm italic text-[#7A6458]">
          * Nhấn vào từng thẻ để xem đầy đủ đồng thuận, đối chiếu địa danh và nguồn
        </span>
      </div>

      {/* Grid of Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecords.map((item) => (
          <article
            key={item.id}
            className="group bg-white rounded-xl border border-[#E3D9C9] hover:border-[#5B1A18]/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Archival Header */}
              <div className="pt-4 px-4 sm:px-5 flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#FAF4EA] text-[#5B1A18] text-sm font-mono font-bold border border-[#E3D9C9]">
                  {item.id}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4EFE6] text-sm font-medium text-[#4A3B32]">
                  {getRecordTypeIcon(item.recordType)}
                  <span>{item.recordTypeLabel}</span>
                </span>
              </div>

              {/* Verified Open-Licensed Reference Photograph (when available) */}
              {item.imageUrl && item.imageAttribution && (
                <figure className="mt-3 mx-4 sm:mx-5 rounded-xl overflow-hidden border border-[#E3D9C9] bg-[#FAF8F5]">
                  <div className="relative h-48 w-full bg-[#EFE8DC]">
                    <img
                      src={item.imageUrl}
                      alt={item.imageCaption || item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#2C1817]/85 text-[#FDEBD0] text-xs font-semibold backdrop-blur-xs border border-[#E8C547]/40">
                      Ảnh tham khảo ({item.imageAttribution.license})
                    </span>
                  </div>
                  <figcaption className="px-3 py-2 text-xs text-[#5A4A42] bg-[#FAF8F5] border-t border-[#EAE0D0] leading-snug">
                    <strong>Nguồn ảnh:</strong> {item.imageAttribution.author} ({item.imageAttribution.year}) • Wikimedia Commons
                  </figcaption>
                </figure>
              )}

              {/* Card Content Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <h3 className="font-serif font-bold text-lg text-[#2C2420] group-hover:text-[#5B1A18] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Two Distinct Location Fields (2025 + Old Name) */}
                <div className="space-y-2 text-sm bg-[#FAF8F5] p-3 rounded-lg border border-[#F0E8DC]">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#5B1A18] block">
                      Địa danh hiện nay (sau 07/2025):
                    </span>
                    <span className="text-[#2C2420] font-medium block break-words">{item.currentAdminPlace}</span>
                  </div>
                  <div className="space-y-0.5 pt-1.5 border-t border-[#EBE3D7]">
                    <span className="font-semibold text-[#805030] block">
                      Tên cũ / Địa danh gốc:
                    </span>
                    <span className="text-[#55453C] italic block break-words">{item.originalAdminPlace}</span>
                  </div>
                  <div className="pt-1.5 border-t border-[#EBE3D7] flex flex-wrap items-baseline gap-1.5">
                    <span className="font-semibold text-[#306040]">
                      Làng cổ đối chiếu:
                    </span>
                    <span className="text-[#20452C] font-semibold">{item.kinhBacReferenceVillage}</span>
                  </div>
                </div>

                {/* Contributor and Survey Day */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#5A4A42]">
                  <span className="break-words">
                    <strong>Chủ thể:</strong> {item.contributor.name}
                  </span>
                  <span className="flex items-center gap-1 text-[#7A6458] shrink-0">
                    <Calendar className="w-4 h-4" />
                    <span>{item.surveyDay}</span>
                  </span>
                </div>

                {/* Voice of the Community Quote */}
                <div className="bg-[#FAF2EB] p-3.5 rounded-lg border-l-4 border-[#5B1A18] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#5B1A18] uppercase">
                    <Quote className="w-3.5 h-3.5 text-[#5B1A18] shrink-0" />
                    <span>Tiếng nói cộng đồng</span>
                  </div>
                  <p className="text-base italic text-[#4A201C] leading-relaxed line-clamp-3">
                    "{item.communityQuote}"
                  </p>
                </div>

                {/* Verified Source */}
                <div className="text-sm text-[#5A4A42] break-words">
                  <span className="font-semibold text-[#4A3B32]">Nguồn: </span>
                  <span className="text-[#5B1A18]">{item.sourceCitation}</span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions (All buttons >= 44px height) */}
            <div className="px-4 sm:px-5 py-3 bg-[#FAF8F5] border-t border-[#F0E8DC] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSpeakRecord(item, e)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg hover:bg-[#EAE0D0] text-[#5B1A18] border border-[#DFD4C3] bg-white transition-colors flex items-center justify-center"
                  aria-label={`Đọc to bản ghi ${item.id}`}
                  title="Đọc to bản ghi này cho người cao tuổi"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                {item.audioSample && (
                  <button
                    type="button"
                    onClick={(e) => handlePlayAudio(item, e)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border ${
                      playingAudioId === item.id
                        ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18]'
                        : 'bg-white text-[#5B1A18] border-[#D6C7B2] hover:bg-[#FAF4EA]'
                    }`}
                    title="Nghe mô phỏng cao độ ngũ cung"
                  >
                    {playingAudioId === item.id ? (
                      <>
                        <Square className="w-4 h-4 fill-current shrink-0" />
                        <span>Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Cao độ</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectRecord(item)}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-[#5B1A18] hover:bg-[#722220] text-[#FDEBD0] text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Xem hồ sơ</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D8CCBA] p-6 space-y-4">
          <Layers className="w-10 h-10 text-[#A08E82] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#4A3B32]">
            Không tìm thấy bản ghi tư liệu phù hợp
          </h3>
          <p className="text-base text-[#7A6458] max-w-md mx-auto">
            Vui lòng thử xóa từ khóa tìm kiếm hoặc đổi tiêu chí lọc theo loại tư liệu và địa bàn.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedPlace('all');
              setSelectedElement('all');
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-base font-semibold hover:bg-[#722220] transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
