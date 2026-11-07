import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Sparkles, 
  FileCheck, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-6 flex items-start justify-between gap-4 border-b border-[#E8C547]/30">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
              THÔNG TIN ĐỀ TÀI & TÁC GIẢ
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Hồ Sơ Số Dân Ca Quan Họ Ở Vùng Văn Hóa Châu Thổ Bắc Bộ
            </h2>
            <p className="text-xs text-[#FDEBD0]/80">
              Khảo sát điền dã cộng đồng di cư Bắc Ninh/Bắc Giang tại Hà Nội & Đối chiếu 49 làng Quan họ cổ Kinh Bắc
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-[#2C2420]">
          {/* STUDENT PROFILE CARD - MANDATORY REQUIREMENTS */}
          <div className="bg-white p-5 rounded-xl border border-[#E3D9C9] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B1A18]">
              <Award className="w-4 h-4 text-[#5B1A18]" />
              <span>Hồ Sơ Sinh Viên Thực Hiện</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#F0E8DC]">
                <span className="text-xs text-[#7A6458] block">Họ và tên:</span>
                <strong className="text-base font-serif text-[#5B1A18]">Nguyễn Viết Hải</strong>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#F0E8DC]">
                <span className="text-xs text-[#7A6458] block">Mã sinh viên:</span>
                <strong className="text-base font-mono text-[#2C2420]">PH63500</strong>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#F0E8DC]">
                <span className="text-xs text-[#7A6458] block">Nhóm thực hiện:</span>
                <strong className="text-base font-mono text-[#2C2420]">Nhóm [01]</strong>
              </div>
            </div>
          </div>

          {/* PROJECT SCOPE STATEMENT */}
          <div className="space-y-3 bg-[#FAF2EB] p-5 rounded-xl border border-[#E6CCA8] text-xs sm:text-sm text-[#4A3222] leading-relaxed">
            <h4 className="font-serif font-bold text-base text-[#80221F] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#80221F]" />
              <span>Phạm Vi Nghiên Cứu & Tuyên Ngôn Giá Trị Mới</span>
            </h4>
            <p>
              Đề tài tập trung nghiên cứu <strong>cộng đồng người dân gốc Bắc Ninh / Bắc Giang di cư ra Hà Nội</strong>, 
              khảo sát thực địa trực tiếp tại <strong>CLB Dân ca Quan họ Cầu Giấy</strong> (Nhà văn hóa Phường Dịch Vọng) 
              và <strong>CLB Quan họ Đống Đa</strong> (Phường Kim Liên). 
              Hệ thống tư liệu được chuẩn hóa đối chiếu với <strong>49 làng Quan họ cổ vùng Kinh Bắc</strong> theo công ước UNESCO 2003.
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#E3D9C9] text-xs text-[#5B1A18] font-medium">
              ⭐ <strong>Giá trị mới của đề tài:</strong> Toàn bộ 16 bản ghi tư liệu do chính thực tập sinh trực tiếp đi thực địa 
              thu thập trong 6 ngày (phỏng vấn sâu người cao tuổi, ghi âm âm thanh mộc không nhạc đệm, đo đạc trang phục chuẩn mực, 
              chép lại ký âm lời cổ được phép công bố), không phải là việc tổng hợp lại tư liệu đã có sẵn trên mạng.
            </div>
          </div>

          {/* 6-DAY FIELDWORK JOURNAL */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#5B1A18] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5B1A18]" />
              <span>Nhật Ký 6 Ngày Khảo Sát Điền Dã Thực Tế Tại Hà Nội</span>
            </h4>

            <div className="space-y-3">
              {fieldworkJournalData.map((journal, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-[#E3D9C9] space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E8DC] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#5B1A18] text-[#FDEBD0] font-bold font-mono">
                        {journal.day}
                      </span>
                      <span className="font-semibold text-[#5B1A18] text-sm font-serif">
                        {journal.activity}
                      </span>
                    </div>
                    <span className="text-[#8C7A70]">{journal.date}</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[#7A6458]">
                    <MapPin className="w-3.5 h-3.5 text-[#5B1A18] shrink-0 mt-0.5" />
                    <span><strong>Địa bàn:</strong> {journal.location}</span>
                  </div>

                  <p className="text-[#3A2D26] leading-relaxed">
                    {journal.details}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-[#5B1A18] pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bản ghi thu thập: {journal.recordsCollected.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EA] px-6 py-4 border-t border-[#E3D9C9] flex items-center justify-between">
          <span className="text-xs text-[#7A6458]">
            Đề tài Nghiên cứu Di sản Văn hóa Phi vật thể • 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-xs font-semibold hover:bg-[#722220] transition-colors"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
