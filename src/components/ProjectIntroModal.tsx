import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Award,
  BookOpen
} from 'lucide-react';
import { fieldworkJournalData } from '../data/heritage-records';

interface ProjectIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectIntroModal: React.FC<ProjectIntroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-modal-title"
    >
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-4 sm:p-6 flex items-start justify-between gap-3 border-b border-[#E8C547]/30">
          <div className="space-y-1.5 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
              THÔNG TIN ĐỀ TÀI & TÁC GIẢ
            </span>
            <h2 id="intro-modal-title" className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
              Hồ Sơ Số Dân Ca Quan Họ Ở Vùng Văn Hóa Châu Thổ Bắc Bộ
            </h2>
            <p className="text-base text-[#FDEBD0]/90">
              Cộng đồng Kinh Bắc (Tỉnh Bắc Ninh) di cư tại Hà Nội • Đối chiếu 49 làng Quan họ cổ
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors flex items-center justify-center shrink-0"
            aria-label="Đóng thông tin đề tài"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto text-[#2C2420]">
          {/* STUDENT PROFILE CARD */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E3D9C9] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#5B1A18]">
              <Award className="w-5 h-5 text-[#5B1A18] shrink-0" />
              <span>Hồ Sơ Sinh Viên Thực Hiện</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#F0E8DC]">
                <span className="text-sm text-[#7A6458] block">Họ và tên:</span>
                <strong className="text-base font-serif text-[#5B1A18]">Nguyễn Viết Hải</strong>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#F0E8DC]">
                <span className="text-sm text-[#7A6458] block">Mã sinh viên:</span>
                <strong className="text-base font-mono text-[#2C2420]">PH63500</strong>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#F0E8DC]">
                <span className="text-sm text-[#7A6458] block">Nhóm thực hiện:</span>
                <strong className="text-base font-mono text-[#2C2420]">Nhóm [01]</strong>
              </div>
            </div>
          </div>

          {/* PROJECT SCOPE STATEMENT */}
          <div className="space-y-3 bg-[#FAF2EB] p-4 sm:p-5 rounded-xl border border-[#E6CCA8] text-base text-[#4A3222] leading-relaxed">
            <h3 className="font-serif font-bold text-lg text-[#80221F] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#80221F] shrink-0" />
              <span>Phạm Vi Nghiên Cứu & Nguyên Tắc Trung Thực</span>
            </h3>
            <p>
              Đề tài tập trung khảo sát cộng đồng người dân gốc Kinh Bắc (tỉnh Bắc Ninh và Bắc Giang cũ, nay hợp nhất thành <strong>Tỉnh Bắc Ninh</strong> từ 07/2025) di cư ra Hà Nội, sinh hoạt tại <strong>CLB Dân ca Quan họ Cầu Giấy</strong> (Phường Cầu Giấy, khu vực Dịch Vọng cũ) và <strong>CLB Quan họ Đống Đa</strong> (Phường Kim Liên).
            </p>
            <div className="p-3.5 bg-white rounded-lg border border-[#E3D9C9] text-base text-[#5B1A18]">
              <strong>Nguyên tắc tư liệu:</strong> Toàn bộ 16 bản ghi ghi nhận thực tế trong 6 ngày khảo sát đều giữ đồng thuận của chủ thể ở đầu bản ghi, ẩn phần thông tin riêng tư theo dặn dò và không dùng ảnh do máy sinh thay cho hiện vật, di tích, nghệ nhân có thật.
            </div>
          </div>

          {/* 6-DAY FIELDWORK JOURNAL */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#5B1A18] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5B1A18] shrink-0" />
              <span>Nhật Ký 6 Ngày Khảo Sát Điền Dã Thực Tế</span>
            </h3>

            <div className="space-y-3">
              {fieldworkJournalData.map((journal, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E8DC] pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#5B1A18] text-[#FDEBD0] text-sm font-bold font-mono">
                        {journal.day}
                      </span>
                      <span className="font-semibold text-[#5B1A18] text-base font-serif">
                        {journal.activity}
                      </span>
                    </div>
                    <span className="text-sm text-[#7A6458]">{journal.date}</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-sm text-[#6A574C]">
                    <MapPin className="w-4 h-4 text-[#5B1A18] shrink-0 mt-0.5" />
                    <span><strong>Địa bàn:</strong> {journal.location}</span>
                  </div>

                  <p className="text-base text-[#2C2420] leading-relaxed">
                    {journal.details}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm text-[#5B1A18] pt-1 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bản ghi thu thập: {journal.recordsCollected.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EA] px-4 sm:px-6 py-4 border-t border-[#E3D9C9] flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-[#6A574C]">
            Đề tài Nghiên cứu Di sản Văn hóa Phi vật thể • 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-base font-semibold hover:bg-[#722220] transition-colors"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
