import React from 'react';
import { ResearchSource, HeritageRecord, AncientVillage } from '../types/heritage';
import {
  isPendingValue,
  isValidHttpUrl,
  formatSourceVerifiedStatus,
} from '../utils/heritage-logic';
import { 
  FileText, 
  ExternalLink, 
  HeartHandshake, 
  CheckCircle2, 
  BookOpen,
  Users,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

interface SourcesAndEthicsViewProps {
  sources: ResearchSource[];
  records: HeritageRecord[];
  villages?: AncientVillage[];
}

export const SourcesAndEthicsView: React.FC<SourcesAndEthicsViewProps> = ({
  sources,
  records,
  villages = [],
}) => {
  const officialSources = sources.filter((s) => s.type === 'chinh_thong');
  const mediaSources = sources.filter((s) => s.type === 'nghien_cuu_bao_chi');
  const adminAndFieldSources = sources.filter((s) => s.type === 'hanh_chinh_dien_da');

  const renderSourceCard = (source: ResearchSource, badgeText: string, badgeStyle: string) => {
    const hasYear = !isPendingValue(source.year);
    const hasValidUrl = isValidHttpUrl(source.url);
    const cleanStatus = formatSourceVerifiedStatus(source.verifiedStatus);

    return (
      <article
        key={source.id}
        className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#DFD4C3] flex flex-col justify-between space-y-4"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${badgeStyle}`}>
              {badgeText}
            </span>
            {cleanStatus && (
              <span className="text-sm text-[#5A4A42] flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{cleanStatus}</span>
              </span>
            )}
          </div>

          <h4 className="font-serif font-bold text-lg text-[#2C2420] leading-snug break-words">
            {source.name}
          </h4>

          <dl className="space-y-1.5 text-base bg-white p-3.5 rounded-lg border border-[#EAE0D0]">
            <div>
              <dt className="font-semibold text-[#5B1A18] inline">Đơn vị phát hành: </dt>
              <dd className="inline text-[#2C2420]">{source.organization}</dd>
            </div>
            {hasYear && (
              <div>
                <dt className="font-semibold text-[#5B1A18] inline">Năm phát hành: </dt>
                <dd className="inline font-semibold text-[#2C2420]">{source.year}</dd>
              </div>
            )}
            {hasValidUrl && (
              <div className="break-words">
                <dt className="font-semibold text-[#5B1A18] inline">Đường dẫn: </dt>
                <dd className="inline font-mono text-sm text-[#5B1A18] break-all">{source.url}</dd>
              </div>
            )}
          </dl>

          <p className="text-base text-[#4A3B32] leading-relaxed">
            <strong>Nội dung sử dụng:</strong> {source.extractedContent}
          </p>
        </div>

        {hasValidUrl && (
          <div className="pt-2 border-t border-[#EAE0D0]">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#D8CCBA] text-[#5B1A18] text-sm font-semibold hover:bg-[#FAF4EA] transition-colors w-full shadow-2xs break-all"
            >
              <span>Mở nguồn: {source.url.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        )}
      </article>
    );
  };

  // Deduplicate contributors by name for the recognition table
  const contributorMap = new Map<
    string,
    { name: string; role: string; origin: string; recordIds: string[]; consentNote: string }
  >();
  records.forEach((rec) => {
    const existing = contributorMap.get(rec.contributor.name);
    if (existing) {
      existing.recordIds.push(rec.id);
    } else {
      contributorMap.set(rec.contributor.name, {
        name: rec.contributor.name,
        role: rec.contributor.role,
        origin: rec.contributor.origin,
        recordIds: [rec.id],
        consentNote: rec.consentStatement,
      });
    }
  });
  const uniqueContributors = Array.from(contributorMap.values());

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#5B1A18] via-[#742321] to-[#401211] text-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-sm font-semibold border border-[#E8C547]/30">
            <FileText className="w-4 h-4 shrink-0" />
            <span>TRANG NGUỒN VÀ GHI NHẬN CHÍNH THỨC</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            Nguồn Tư Liệu & Ghi Nhận Cộng Đồng Đóng Góp
          </h2>
          <p className="text-base text-[#F4DEC3] leading-relaxed">
            Liệt kê đầy đủ toàn bộ nguồn dữ liệu chính thống, nghiên cứu và văn bản địa danh đang dùng trong ứng dụng cùng phần ghi nhận các nghệ nhân, liền anh, liền chị, học viên đã đồng thuận chia sẻ tư liệu.
          </p>
        </div>
      </section>

      {/* AI Content Review & Privacy Notice */}
      <section className="bg-[#FAF2E8] border border-[#E6CCA8] rounded-2xl p-5 sm:p-6 space-y-3">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#5B1A18] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#80221F] shrink-0" />
          <span>Minh bạch kiểm chứng & Phạm vi dữ liệu</span>
        </h3>
        <div className="space-y-2 text-base text-[#3A2D26] leading-relaxed">
          <p>
            <strong>1. Kiểm duyệt nội dung do Gemini sinh ra:</strong> Chức năng Hỏi đáp Gemini được cấu hình chỉ trả lời dựa trên dữ liệu có sẵn trong 16 bản ghi, danh mục làng cổ và các nguồn tư liệu của ứng dụng. Khi thiếu dữ liệu, hệ thống trả lời <em>"Ứng dụng chưa có thông tin này"</em> và gợi ý nguồn chính thống để đối chiếu.
          </p>
          <p>
            <strong>2. Không dùng ảnh máy sinh & bảo vệ quyền riêng tư:</strong> Ứng dụng không sử dụng hình ảnh do máy sinh để thay thế hiện vật, di tích hoặc nghệ nhân có thật. Mọi thông tin riêng tư cá nhân và nghi lễ kiêng kỵ không được phép công bố đã được giữ kín. Ứng dụng hoạt động hoàn toàn công khai, không yêu cầu đăng nhập và không thu thập dữ liệu cá nhân người xem.
          </p>
          <p>
            <strong>3. Quy chuẩn về hình ảnh lấy từ Google / Internet:</strong> Không sao chép tùy tiện ảnh có bản quyền từ kết quả tìm kiếm Google Images khi chưa có phép. Các ảnh minh họa đang hiển thị trên ứng dụng đều là ảnh tư liệu tham khảo có giấy phép mở (Creative Commons CC BY / CC BY-SA) từ <strong>Wikimedia Commons</strong>, ghi đầy đủ tác giả, năm, giấy phép và đường dẫn gốc bên dưới; tuyệt đối không mạo nhận là ảnh chụp riêng tại nhà nghệ nhân.
          </p>
        </div>
      </section>

      {/* All Sources Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5B1A18] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B1A18] shrink-0" />
            <span>Toàn Bộ Nguồn Dữ Liệu Đang Sử Dụng ({sources.length} nguồn)</span>
          </h3>
          <p className="text-base text-[#5A4A42] mt-1 leading-relaxed">
            Mỗi nguồn hiển thị đầy đủ tên tài liệu, đơn vị phát hành và thông tin năm công bố hoặc đường dẫn gốc đã xác minh, tuyệt đối không tự bịa.
          </p>
        </div>

        {/* Section I: Official State & UNESCO Sources */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#2A5235] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span>I. Nguồn Cơ Quan Nhà Nước, Viện Nghiên Cứu & UNESCO ({officialSources.length} nguồn)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialSources.map((source, idx) =>
              renderSourceCard(source, `Nguồn ${idx + 1} • Chính thống`, 'bg-[#E8F0EA] text-[#1B3E25] border-[#C5DDD0]')
            )}
          </div>
        </div>

        {/* Section II: Research & Media Sources */}
        <div className="space-y-4 pt-5 border-t border-[#F0E8DC]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#805018] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
            <span>II. Nguồn Nghiên Cứu & Báo Chí Truyền Thông ({mediaSources.length} nguồn)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mediaSources.map((source, idx) =>
              renderSourceCard(source, `Nguồn ${idx + 5} • Nghiên cứu`, 'bg-[#FAF0E6] text-[#805018] border-[#E6CCA8]')
            )}
          </div>
        </div>

        {/* Section III: 2025 Administrative Resolutions & Fieldwork Dataset */}
        <div className="space-y-4 pt-5 border-t border-[#F0E8DC]">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#5B1A18] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#5B1A18] shrink-0" />
            <span>III. Văn Bản Địa Danh Năm 2025 & Tư Liệu Điền Dã ({adminAndFieldSources.length} nguồn)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminAndFieldSources.map((source, idx) =>
              renderSourceCard(source, `Nguồn ${idx + 8} • Pháp lý & Điền dã`, 'bg-[#FAF2EB] text-[#5B1A18] border-[#E6CCA8]')
            )}
          </div>
        </div>
      </section>

      {/* Open-Licensed Image Attribution Table */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-5">
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5B1A18] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#5B1A18] shrink-0" />
            <span>Nguồn & Giấy Phép Hình Ảnh Tư Liệu Mở Đang Sử Dụng</span>
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Thay cho ảnh không rõ bản quyền trên Google Images hoặc ảnh do máy sinh, ứng dụng chỉ sử dụng ảnh thực tế có giấy phép mở Creative Commons trên Wikimedia Commons và ghi nhận tác giả đầy đủ:
          </p>
        </div>

        <p className="text-base text-[#7A6458] italic sm:hidden">
          ← Vuốt ngang trong bảng để xem đầy đủ tác giả & liên kết →
        </p>

        <div className="w-full overflow-x-auto rounded-xl border border-[#E3D9C9]">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead>
              <tr className="bg-[#F3EDE2] text-[#4A1513] font-semibold text-sm border-b border-[#E3D9C9]">
                <th className="py-3 px-4">Mục gắn ảnh</th>
                <th className="py-3 px-4">Mô tả ảnh tham khảo</th>
                <th className="py-3 px-4">Tác giả & Năm</th>
                <th className="py-3 px-4">Giấy phép</th>
                <th className="py-3 px-4">Đường dẫn tệp gốc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC] text-base text-[#2C2420]">
              {[
                ...records
                  .filter((r) => r.imageUrl && r.imageAttribution)
                  .map((r) => ({
                    targetId: r.id,
                    caption: r.imageCaption || r.title,
                    attr: r.imageAttribution!,
                  })),
                ...villages
                  .filter((v) => v.imageUrl && v.imageAttribution)
                  .map((v) => ({
                    targetId: v.name,
                    caption: v.imageCaption || v.name,
                    attr: v.imageAttribution!,
                  })),
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5 px-4 font-mono text-sm font-bold text-[#5B1A18] whitespace-nowrap">
                    {item.targetId}
                  </td>
                  <td className="py-3.5 px-4">{item.caption}</td>
                  <td className="py-3.5 px-4 text-[#55453C]">
                    {item.attr.author} ({item.attr.year})
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-mono font-bold">
                      {item.attr.license}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={item.attr.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#5B1A18] hover:underline"
                    >
                      <span>Wikimedia Commons</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contributor Attribution & Acknowledgments Section */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-5">
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5B1A18] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#5B1A18] shrink-0" />
            <span>Ghi Nhận Người Đóng Góp Tư Liệu & Cộng Đồng Chủ Thể</span>
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Trân trọng ghi nhận các nghệ nhân, liền anh, liền chị, học viên thuộc <strong>CLB Dân ca Quan họ Cầu Giấy</strong>, <strong>CLB Quan họ Đống Đa</strong> và nhóm sinh viên thực hiện <strong>Nguyễn Viết Hải (Mã SV: PH63500 - Nhóm 01)</strong>. Tư liệu chỉ được đưa lên khi có sự đồng ý; những phần người giữ tư liệu dặn không công bố đã được giữ kín hoàn toàn.
          </p>
        </div>

        {/* Dedicated horizontal-scroll wrapper so wide table never causes 360px page overflow */}
        <div className="space-y-2">
          <p className="text-base text-[#7A6458] italic sm:hidden">
            ← Vuốt ngang trong bảng để xem đầy đủ các cột →
          </p>
          <div className="w-full overflow-x-auto rounded-xl border border-[#E3D9C9]">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[#F3EDE2] text-[#4A1513] font-semibold text-sm border-b border-[#E3D9C9]">
                  <th className="py-3 px-4">Người / Tập thể đóng góp</th>
                  <th className="py-3 px-4">Vai trò tại cộng đồng</th>
                  <th className="py-3 px-4">Quê quán gốc</th>
                  <th className="py-3 px-4">Mã hồ sơ đóng góp</th>
                  <th className="py-3 px-4">Tình trạng đồng thuận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC] text-base text-[#2C2420]">
                {uniqueContributors.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 px-4 font-semibold text-[#5B1A18]">{c.name}</td>
                    <td className="py-3.5 px-4">{c.role}</td>
                    <td className="py-3.5 px-4 text-[#55453C]">{c.origin}</td>
                    <td className="py-3.5 px-4 font-mono text-sm text-[#5B1A18] font-semibold">
                      {c.recordIds.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-emerald-800">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Đã đồng thuận chia sẻ phi thương mại</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ethical Code of Conduct in Heritage Digitization */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-sm font-bold border border-[#E6CCA8]">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>NGUYÊN TẮC ĐẠO ĐỨC ĐIỀN DÃ</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5B1A18]">
            Tuyên Ngôn Đạo Đức & Cam Kết Bảo Vệ Quyền Riêng Tư
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Người làm hồ sơ số chỉ là người ghi chép và giới thiệu lại một cách trung thực. Người quyết định cao nhất là cộng đồng thực hành di sản.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Người ghi chép, không phán xét',
              desc: 'Không đánh giá thực hành của nghệ nhân là đúng hay sai so với sách vở. Giọng viết là giọng của người học hỏi.',
            },
            {
              title: 'Đồng thuận trước khi ghi',
              desc: 'Nói rõ mục đích nghiên cứu trước khi ghi chép. Ghi câu đồng ý vào đầu bản ghi. Nếu chủ thể đổi ý, lập tức gỡ bỏ tư liệu.',
            },
            {
              title: 'Giữ kín phần không công bố',
              desc: 'Nghi lễ không cho người ngoài xem hoặc thông tin cá nhân, bí quyết gia truyền nghệ nhân dặn không công bố thì tuyệt đối giữ kín.',
            },
            {
              title: 'Phi thương mại hoàn toàn',
              desc: 'Ghi rõ danh tính người cung cấp khi được phép. Không dùng tư liệu và lời ca của cộng đồng để kinh doanh.',
            },
            {
              title: 'Không dùng ảnh máy sinh giả mạo',
              desc: 'Tuyệt đối không dùng ảnh do máy sinh thay cho hiện vật, di tích hoặc nghệ nhân có thật; chỉ dùng ảnh thật được cấp phép và ghi rõ nguồn.',
            },
            {
              title: 'Bảo lưu từ ngữ bản địa & địa danh 2025',
              desc: 'Giữ nguyên tên gọi bản địa kèm chú giải và cập nhật địa danh theo đơn vị hành chính sau sắp xếp năm 2025 kèm tên cũ.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-[#DFD4C3] space-y-2">
              <h4 className="font-serif font-bold text-base text-[#5B1A18]">{item.title}</h4>
              <p className="text-base text-[#4A3B32] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
