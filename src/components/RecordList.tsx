import React, { useState } from 'react';
import { HeritageRecord } from '../types/heritage';
import { 
  Search, 
  Filter, 
  Volume2, 
  Play, 
  Square, 
  ExternalLink, 
  Quote, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Layers,
  FileAudio,
  Image as ImageIcon,
  Video,
  MessageSquare,
  FileCode,
  Package
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

  // Xử lý phát giai điệu mộc ngũ cung
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
    const textToRead = `Bản ghi mã số ${record.id}. Tiêu đề: ${record.title}. Người cung cấp: ${record.contributor.name}, vai trò ${record.contributor.role}. Lời nghệ nhân: ${record.communityQuote}. Địa danh hiện nay: ${record.currentAdminPlace}. Địa danh gốc thời điểm tư liệu: ${record.originalAdminPlace}. Đối chiếu với ${record.kinhBacReferenceVillage}. Nội dung: ${record.content}. Nguồn kiểm chứng: ${record.sourceCitation}.`;
    speechReader.speak(textToRead);
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'audio_moc': return <FileAudio className="w-4 h-4 text-emerald-700" />;
      case 'anh_thuc_dia': return <ImageIcon className="w-4 h-4 text-amber-700" />;
      case 'video_trich_doan': return <Video className="w-4 h-4 text-red-700" />;
      case 'phong_van_sau': return <MessageSquare className="w-4 h-4 text-blue-700" />;
      case 'ky_am_loi_co': return <FileCode className="w-4 h-4 text-purple-700" />;
      case 'hien_vat_dao_cu': return <Package className="w-4 h-4 text-orange-700" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[#6A1F1D] via-[#5B1A18] to-[#401211] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-xs font-semibold tracking-wide border border-[#E8C547]/30">
            <Quote className="w-3.5 h-3.5" />
            <span>KHO TƯ LIỆU THỰC ĐỊA ĐIỀN DÃ ĐỘ THỊ HÀ NỘI</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            16 Bản Ghi Di Sản Dân Ca Quan Họ Được Số Hóa Thực Tế
          </h2>
          <p className="text-sm sm:text-base text-[#F4DEC3] leading-relaxed">
            Hồ sơ số thu thập trực tiếp qua <strong>6 ngày khảo sát thực địa</strong> tại CLB Dân ca Quan họ Cầu Giấy và CLB Đống Đa, 
            trực tiếp phỏng vấn các nghệ nhân cao niên gốc Bắc Ninh/Bắc Giang di cư ra Hà Nội, ghi âm mộc không nhạc đệm, ký âm lời cổ 
            và đối chiếu chuẩn hóa với <strong>49 làng Quan họ cổ Kinh Bắc</strong> theo công ước UNESCO 2003.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#E8C547]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% bản ghi có dẫn nguồn kiểm chứng rõ ràng
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Có văn bản đồng thuận của chủ thể di sản
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Đầy đủ 2 trường địa danh hiện nay và địa danh gốc
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E3D9C9] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A70]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo mã số, tên bài hát, nghệ nhân, kỹ thuật hoặc địa danh..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-sm text-[#2C2420] placeholder-[#8C7A70] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A70] hover:text-[#5B1A18]"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Quick Filter: Record Type */}
          <div className="w-full md:w-56">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
            >
              <option value="all">Tất cả loại tư liệu ({records.length})</option>
              <option value="audio_moc">Âm thanh mộc điền dã</option>
              <option value="anh_thuc_dia">Ảnh chụp thực địa</option>
              <option value="video_trich_doan">Video trích đoạn</option>
              <option value="phong_van_sau">Phỏng vấn sâu nghệ nhân</option>
              <option value="ky_am_loi_co">Ký âm / Lời bản cổ</option>
              <option value="hien_vat_dao_cu">Hiện vật / Trang phục</option>
            </select>
          </div>

          {/* Quick Filter: Current Place */}
          <div className="w-full md:w-56">
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="w-full py-2.5 px-3 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
            >
              <option value="all">Tất cả địa bàn hiện nay</option>
              <option value="Phường Dịch Vọng">Phường Dịch Vọng (Hà Nội)</option>
              <option value="Phường Kim Liên">Phường Kim Liên (Hà Nội)</option>
              <option value="Phường Nghĩa Tân">Phường Nghĩa Tân (Hà Nội)</option>
              <option value="Phường Khương Thượng">Phường Khương Thượng (Hà Nội)</option>
              <option value="Phường Hòa Long">Phường Hòa Long (Bắc Ninh - Đối chiếu)</option>
            </select>
          </div>
        </div>

        {/* Heritage Element Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F0E8DC]">
          <span className="text-xs font-semibold text-[#7A6458] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Yếu tố di sản:
          </span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Vang - Rền - Nền - Nảy', label: 'Kỹ thuật Vang - Rền - Nền - Nảy' },
            { id: 'Mời trầu', label: 'Nghi thức Mời trầu' },
            { id: 'Hát đối', label: 'Hát đối canh hát' },
            { id: 'Giã bạn', label: 'Nghi thức Giã bạn' },
            { id: 'Trang phục', label: 'Trang phục & Đạo cụ' },
            { id: 'truyền khẩu', label: 'Quy trình truyền khẩu' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedElement(tag.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
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
      <div className="flex items-center justify-between text-xs text-[#7A6458] px-1">
        <span>
          Hiển thị <strong>{filteredRecords.length}</strong> / {records.length} bản ghi tư liệu điền dã
        </span>
        <span className="italic">
          * Nhấp vào từng bản ghi để xem chi tiết, ký âm hoặc nghe xướng âm mộc
        </span>
      </div>

      {/* Grid of Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRecord(item)}
            className="group bg-white rounded-xl border border-[#E3D9C9] hover:border-[#5B1A18]/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#FAF4EA] text-[#5B1A18] text-xs font-mono font-bold border border-[#E3D9C9]">
                  {item.id}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4EFE6] text-xs font-medium text-[#4A3B32]">
                  {getRecordTypeIcon(item.recordType)}
                  <span>{item.recordTypeLabel}</span>
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#2C2420] group-hover:text-[#5B1A18] transition-colors leading-snug">
                {item.title}
              </h3>

              {/* Two Distinct Location Fields */}
              <div className="space-y-1.5 text-xs bg-[#FAF8F5] p-2.5 rounded-lg border border-[#F0E8DC]">
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-[#5B1A18] shrink-0 min-w-[110px]">
                    📍 Địa danh hiện nay:
                  </span>
                  <span className="text-[#332A25] font-medium">{item.currentAdminPlace}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-[#805030] shrink-0 min-w-[110px]">
                    📜 Địa danh gốc xưa:
                  </span>
                  <span className="text-[#55453C] italic">{item.originalAdminPlace}</span>
                </div>
                <div className="flex items-start gap-1.5 pt-1 border-t border-[#EBE3D7]">
                  <span className="font-semibold text-[#306040] shrink-0 min-w-[110px]">
                    🌾 Làng cổ đối chiếu:
                  </span>
                  <span className="text-[#20452C] font-semibold">{item.kinhBacReferenceVillage}</span>
                </div>
              </div>

              {/* Contributor and Survey Day */}
              <div className="flex items-center justify-between text-xs text-[#7A6458]">
                <span>
                  <strong>Người cung cấp:</strong> {item.contributor.name}
                </span>
                <span className="flex items-center gap-1 text-[#8C7A70]">
                  <Calendar className="w-3 h-3" />
                  {item.surveyDay}
                </span>
              </div>

              {/* Voice of the Community Quote */}
              <div className="relative bg-[#FAF2EB] p-3 rounded-lg border-l-3 border-[#5B1A18] text-xs italic text-[#4A201C] space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#5B1A18] uppercase not-italic">
                  <Quote className="w-3 h-3 text-[#5B1A18]" />
                  Tiếng của chính cộng đồng:
                </div>
                <p className="line-clamp-3">"{item.communityQuote}"</p>
              </div>

              {/* Verified Source */}
              <div className="text-[11px] text-[#7A6458] flex items-center gap-1">
                <span className="font-medium text-[#4A3B32]">Nguồn kiểm chứng:</span>
                <span className="truncate text-[#5B1A18] font-mono">{item.sourceCitation}</span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 py-3 bg-[#FAF8F5] border-t border-[#F0E8DC] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* Speech reader for elders */}
                <button
                  onClick={(e) => handleSpeakRecord(item, e)}
                  className="p-1.5 rounded-md hover:bg-[#EAE0D0] text-[#5B1A18] transition-colors"
                  title="Đọc to bản ghi này cho người cao tuổi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Melodic audio synthesizer play button if sample available */}
                {item.audioSample && (
                  <button
                    onClick={(e) => handlePlayAudio(item, e)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                      playingAudioId === item.id
                        ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18]'
                        : 'bg-white text-[#5B1A18] border-[#D6C7B2] hover:bg-[#FAF4EA]'
                    }`}
                    title="Nghe mẫu xướng âm mộc ngũ cung"
                  >
                    {playingAudioId === item.id ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        <span>Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Nghe âm mộc</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <span className="text-xs font-semibold text-[#5B1A18] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Xem hồ sơ
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D8CCBA] p-8 space-y-3">
          <Layers className="w-10 h-10 text-[#A08E82] mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#4A3B32]">
            Không tìm thấy bản ghi tư liệu phù hợp
          </h3>
          <p className="text-sm text-[#7A6458] max-w-md mx-auto">
            Vui lòng thử xóa từ khóa tìm kiếm hoặc đổi tiêu chí lọc theo loại tư liệu và địa bàn.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedPlace('all');
              setSelectedElement('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-xs font-semibold hover:bg-[#722220] transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
