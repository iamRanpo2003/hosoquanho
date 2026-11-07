import React from 'react';
import { 
  BookOpen, 
  MapPin, 
  Sparkles, 
  FileText, 
  Volume2, 
  VolumeX, 
  Download, 
  Info,
  Users,
  Compass
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'archive' | 'spatial' | 'gemini' | 'sources';
  setActiveTab: (tab: 'archive' | 'spatial' | 'gemini' | 'sources') => void;
  onOpenIntro: () => void;
  onOpenExport: () => void;
  isReading: boolean;
  onToggleSpeech: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenIntro,
  onOpenExport,
  isReading,
  onToggleSpeech,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E3D9C9] shadow-xs">
      {/* Heritage Context Bar */}
      <div className="bg-[#5B1A18] text-[#FDEBD0] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 font-medium">
              <Compass className="w-3.5 h-3.5 text-[#E8C547]" />
              <strong className="text-[#E8C547]">Vùng văn hóa:</strong> Châu thổ Bắc Bộ
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#E8C547]" />
              <strong className="text-[#E8C547]">Cộng đồng:</strong> Người gốc Bắc Ninh/Bắc Giang di cư tại Hà Nội
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E8C547]" />
              <strong className="text-[#E8C547]">Địa bàn thực địa:</strong> Thành phố Hà Nội (Đối chiếu 49 làng cổ Kinh Bắc)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenIntro}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8C547]/20 hover:bg-[#E8C547]/30 text-[#E8C547] text-xs font-medium transition-colors border border-[#E8C547]/40"
              title="Thông tin sinh viên thực hiện đề tài"
            >
              <Info className="w-3 h-3" />
              <span>Nguyễn Viết Hải (PH63500 - Nhóm 01)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('archive')}>
          <div className="w-10 h-10 rounded-xl bg-radial from-[#80221F] to-[#5B1A18] text-[#E8C547] flex items-center justify-center shadow-md border border-[#E8C547]/40">
            <span className="font-serif font-bold text-xl tracking-tight">QH</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-[#5B1A18] tracking-tight leading-tight">
              HỒ SƠ SỐ DÂN CA QUAN HỌ
            </h1>
            <p className="text-xs text-[#7A6458] font-medium">
              Vùng văn hóa Châu thổ Bắc Bộ • Khảo sát điền dã đô thị Hà Nội
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'archive'
                ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho Hồ sơ Số</span>
          </button>

          <button
            onClick={() => setActiveTab('spatial')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'spatial'
                ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Không gian & Đối chiếu</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'gemini'
                ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E8C547]" />
            <span>Cố vấn Di sản Gemini</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sources'
                ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Nguồn & Đạo đức</span>
          </button>
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Read aloud toggle for elders */}
          <button
            onClick={onToggleSpeech}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border ${
              isReading
                ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] animate-pulse'
                : 'bg-white text-[#5B1A18] border-[#D6C7B2] hover:bg-[#F3EDE2]'
            }`}
            title="Đọc to nội dung hỗ trợ người cao tuổi"
          >
            {isReading ? <VolumeX className="w-3.5 h-3.5 text-[#E8C547]" /> : <Volume2 className="w-3.5 h-3.5 text-[#5B1A18]" />}
            <span className="hidden sm:inline">{isReading ? 'Dừng đọc' : 'Đọc tiếng cho các cụ'}</span>
          </button>

          {/* Export file button */}
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 bg-[#E8C547] text-[#4A1513] hover:bg-[#D4AF37] shadow-xs font-semibold"
            title="Xuất dữ liệu hồ sơ số (JSON/CSV/Báo cáo)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất tệp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
