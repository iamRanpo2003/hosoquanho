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
  Compass,
  Database
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'archive' | 'schema' | 'spatial' | 'gemini' | 'sources';
  setActiveTab: (tab: 'archive' | 'schema' | 'spatial' | 'gemini' | 'sources') => void;
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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E3D9C9] shadow-xs w-full">
      {/* Heritage Context Bar */}
      <div className="bg-[#5B1A18] text-[#FDEBD0] text-sm py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Compass className="w-4 h-4 text-[#E8C547] shrink-0" />
              <span><strong className="text-[#E8C547]">Vùng văn hóa:</strong> Châu thổ Bắc Bộ</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#E8C547] shrink-0" />
              <span><strong className="text-[#E8C547]">Cộng đồng:</strong> Người gốc Kinh Bắc (Tỉnh Bắc Ninh) di cư tại Hà Nội</span>
            </span>
            <span className="hidden lg:inline text-white/30">•</span>
            <span className="hidden lg:flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E8C547] shrink-0" />
              <span><strong className="text-[#E8C547]">Địa danh:</strong> Chuẩn sau sắp xếp 07/2025 & tên cũ</span>
            </span>
          </div>

          <div className="flex items-center shrink-0 max-w-full">
            <button
              type="button"
              onClick={onOpenIntro}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full bg-[#E8C547]/20 hover:bg-[#E8C547]/30 text-[#E8C547] text-sm font-medium transition-colors border border-[#E8C547]/40 text-left"
              title="Thông tin sinh viên thực hiện đề tài"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>Nguyễn Viết Hải (PH63500 - Nhóm 01)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 space-y-2.5">
        {/* Top Row: Brand + Utility Actions */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <button
            type="button"
            className="flex items-center gap-2.5 text-left min-h-[44px] min-w-0 py-1"
            onClick={() => setActiveTab('archive')}
          >
            <div className="w-11 h-11 rounded-xl bg-radial from-[#80221F] to-[#5B1A18] text-[#E8C547] flex items-center justify-center shadow-md border border-[#E8C547]/40 shrink-0">
              <span className="font-serif font-bold text-xl tracking-tight">QH</span>
            </div>
            <div className="min-w-0">
              <span className="font-serif font-bold text-base sm:text-xl text-[#5B1A18] tracking-tight leading-tight block">
                HỒ SƠ SỐ DÂN CA QUAN HỌ
              </span>
              <span className="text-xs sm:text-sm text-[#7A6458] font-medium block">
                Châu thổ Bắc Bộ • Công khai không cần đăng nhập
              </span>
            </div>
          </button>

          {/* Utility Actions (responsive on both mobile and desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleSpeech}
              className={`min-h-[44px] min-w-[44px] px-3 sm:px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border ${
                isReading
                  ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] animate-pulse'
                  : 'bg-white text-[#5B1A18] border-[#D6C7B2] hover:bg-[#F3EDE2]'
              }`}
              aria-label={isReading ? 'Dừng đọc tiếng' : 'Đọc tiếng cho người cao tuổi'}
              title="Đọc to nội dung hỗ trợ người cao tuổi"
            >
              {isReading ? <VolumeX className="w-5 h-5 sm:w-4 sm:h-4 text-[#E8C547]" /> : <Volume2 className="w-5 h-5 sm:w-4 sm:h-4 text-[#5B1A18]" />}
              <span className="hidden md:inline">{isReading ? 'Dừng đọc' : 'Đọc tiếng'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="min-h-[44px] min-w-[44px] px-3 sm:px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 bg-[#E8C547] text-[#4A1513] hover:bg-[#D4AF37] shadow-xs"
              aria-label="Xuất tệp dữ liệu"
              title="Xuất dữ liệu hồ sơ số (JSON/CSV/Báo cáo)"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Xuất tệp</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons (scrollable cleanly inside own frame on 360px, full row on desktop) */}
        <nav aria-label="Điều hướng chính" className="w-full overflow-x-auto pt-2 border-t border-[#E3D9C9]/70 pb-0.5">
          <div className="flex items-center gap-1.5 w-max lg:w-full lg:flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'archive'
                  ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                  : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Kho Hồ sơ Số</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'schema'
                  ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                  : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
              }`}
            >
              <Database className="w-4 h-4 text-[#E8C547] shrink-0" />
              <span>Bộ Trường Dữ Liệu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('spatial')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'spatial'
                  ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                  : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Không gian & Đối chiếu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gemini')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'gemini'
                  ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                  : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E8C547] shrink-0" />
              <span>Hỏi đáp Gemini</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sources')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sources'
                  ? 'bg-[#5B1A18] text-[#FDEBD0] shadow-sm'
                  : 'text-[#5A4A42] hover:bg-[#EFE8DC]'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Nguồn và Ghi nhận</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
