import React from 'react';
import { ResearchSource } from '../types/heritage';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface SourcesAndEthicsViewProps {
  sources: ResearchSource[];
}

export const SourcesAndEthicsView: React.FC<SourcesAndEthicsViewProps> = ({ sources }) => {
  const officialSources = sources.filter((s) => s.type === 'chinh_thong');
  const mediaSources = sources.filter((s) => s.type === 'nghien_cuu_bao_chi');

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#5B1A18] via-[#742321] to-[#401211] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-xs font-semibold tracking-wide border border-[#E8C547]/30">
            <FileText className="w-3.5 h-3.5" />
            <span>NGUỒN TƯ LIỆU KIỂM CHỨNG & ĐẠO ĐỨC DI SẢN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            7 Nguồn Tham Khảo Kiểm Chứng & Bộ Quy Tắc Đạo Đức Điền Dã
          </h2>
          <p className="text-sm sm:text-base text-[#F4DEC3] leading-relaxed">
            Mọi thông tin trong Hồ sơ số Dân ca Quan họ đều được trích xuất từ 
            <strong>4 nguồn chính thống</strong> (Cục Di sản văn hóa, Ủy ban NVNONN, Viện Âm nhạc, UNESCO/TTXVN) và 
            <strong>3 nguồn nghiên cứu & báo chí uy tín</strong>, kết hợp cùng các cuộc phỏng vấn sâu trực tiếp với nghệ nhân 
            dưới sự đồng thuận tuyệt đối của cộng đồng di sản.
          </p>
        </div>
      </div>

      {/* 7 Mandatory Sources Display */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#5B1A18] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B1A18]" />
            <span>Danh Sách 7 Nguồn Tư Liệu Tham Khảo Phục Vụ Hồ Sơ Số</span>
          </h3>
          <p className="text-xs text-[#7A6458] mt-1">
            Bao gồm 4 nguồn cơ quan quản lý nhà nước/UNESCO và 3 nguồn chuyên khảo & báo chí tổng hợp (mỗi nguồn đều có liên kết mở trực tiếp)
          </p>
        </div>

        {/* Section 1: Official State & UNESCO Sources (4 Sources) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A5235]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>I. Nguồn Cơ Quan Quản Lý Nhà Nước, Viện Nghiên Cứu & UNESCO (4 Nguồn)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialSources.map((source, idx) => (
              <div
                key={source.id}
                className="bg-[#FAF8F5] p-5 rounded-xl border border-[#DFD4C3] flex flex-col justify-between hover:border-[#5B1A18]/40 transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#E8F0EA] text-[#1B3E25] text-xs font-mono font-bold border border-[#C5DDD0]">
                      Nguồn {idx + 1} • Chính thống
                    </span>
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {source.verifiedStatus}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#2C2420] leading-snug">
                    {source.name}
                  </h4>
                  <p className="text-xs text-[#7A6458]">
                    <strong>Đơn vị chủ quản:</strong> {source.organization}
                  </p>

                  <p className="text-xs text-[#4A3B32] leading-relaxed bg-white p-3 rounded-lg border border-[#EAE0D0]">
                    <strong>Nội dung khai thác:</strong> {source.extractedContent}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE0D0]">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D8CCBA] text-[#5B1A18] text-xs font-semibold hover:bg-[#FAF4EA] transition-colors w-full justify-center shadow-2xs"
                  >
                    <span>Truy cập nguồn: {source.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Research & Media Sources (3 Sources) */}
        <div className="space-y-4 pt-4 border-t border-[#F0E8DC]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#805018]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>II. Nguồn Tài Liệu Chuyên Khảo & Báo Chí Truyền Thông Tổng Hợp (3 Nguồn)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mediaSources.map((source, idx) => (
              <div
                key={source.id}
                className="bg-[#FAF8F5] p-5 rounded-xl border border-[#DFD4C3] flex flex-col justify-between hover:border-[#5B1A18]/40 transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF0E6] text-[#805018] text-xs font-mono font-bold border border-[#E6CCA8]">
                      Nguồn {idx + 5} • Nghiên cứu
                    </span>
                    <span className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {source.verifiedStatus}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#2C2420] leading-snug">
                    {source.name}
                  </h4>
                  <p className="text-xs text-[#7A6458]">
                    <strong>Đơn vị:</strong> {source.organization}
                  </p>

                  <p className="text-xs text-[#4A3B32] leading-relaxed bg-white p-3 rounded-lg border border-[#EAE0D0]">
                    <strong>Nội dung:</strong> {source.extractedContent}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE0D0]">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D8CCBA] text-[#5B1A18] text-xs font-semibold hover:bg-[#FAF4EA] transition-colors w-full justify-center shadow-2xs"
                  >
                    <span>Truy cập nguồn: {source.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ethical Code of Conduct in Heritage Digitization */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-xs font-bold border border-[#E6CCA8]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>NGUYÊN TẮC ĐẠO ĐỨC ĐIỀN DÃ</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Tuyên Ngôn Đạo Đức & Cam Kết Tôn Trọng Chủ Thể Di Sản
          </h3>
          <p className="text-sm text-[#7A6458] leading-relaxed">
            Người làm hồ sơ số chỉ là người ghi chép và giới thiệu lại một cách trung thực. 
            Người quyết định cao nhất chính là cộng đồng thực hành di sản.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Người ghi chép, không phán xét',
              desc: 'Không đánh giá thực hành của nghệ nhân là đúng hay sai so với sách vở. Giọng viết là giọng của người học hỏi, không phải người phán xét.',
              icon: '✍️',
            },
            {
              title: 'Đồng thuận trước khi ghi',
              desc: 'Nói rõ mục đích nghiên cứu trước khi ghi âm, ghi hình. Ghi câu đồng ý vào đầu bản ghi. Nếu chủ thể đổi ý, lập tức gỡ bỏ tư liệu.',
              icon: '🤝',
            },
            {
              title: 'Khuất tịch và điều cấm kỵ',
              desc: 'Nghi lễ có phần kiêng kỵ không cho người ngoài xem thì tuyệt đối không xem, không chụp ảnh, không ghi chép.',
              icon: '🔒',
            },
            {
              title: 'Phi thương mại hoàn toàn',
              desc: 'Ghi rõ danh tính người cung cấp. Tuyệt đối không dùng tư liệu và lời ca của họ để kinh doanh hoặc trục lợi cá nhân.',
              icon: '🛡️',
            },
            {
              title: 'Ghi nhận cả lối xưa và nay',
              desc: 'Ghi cả cách hát ở làng cổ và cách sinh hoạt câu lạc bộ tại Hà Nội, không phán xét cái nào mới là "thật" hay "giả".',
              icon: '⚖️',
            },
            {
              title: 'Bảo lưu từ ngữ bản địa',
              desc: 'Giữ nguyên vẹn tên gọi bản địa (mớ ba mớ bảy, hát mộc, nẩy hạt, kết chạ, buông áo dặn dò...) kèm chú giải, không dịch gượng ép sang tiếng phổ thông.',
              icon: '📖',
            },
            {
              title: 'Tôn vinh phụ nữ và người trẻ',
              desc: 'Ghi nhận vai trò cốt cán của các liền chị trong việc lưu giữ lề lối và học viên trẻ, sinh viên Hà Nội trong việc kế thừa trao truyền.',
              icon: '🌟',
            },
            {
              title: 'Bối cảnh thực tế trung thực',
              desc: 'Ghi rõ bối cảnh không gian thu thập tư liệu thực địa. Tuyệt đối không dùng ảnh khu du lịch hay biểu diễn sân khấu hóa giả làm canh hát thật.',
              icon: '🔍',
            },
            {
              title: 'Quay lại phục vụ cộng đồng',
              desc: 'Sản phẩm số hóa cung cấp chức năng đọc tiếng cho người cao tuổi và xuất dữ liệu mở để cộng đồng và người nghiên cứu dùng lại miễn phí.',
              icon: '🎁',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-[#DFD4C3] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <h4 className="font-serif font-bold text-sm text-[#5B1A18]">{item.title}</h4>
              </div>
              <p className="text-xs text-[#55453C] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
