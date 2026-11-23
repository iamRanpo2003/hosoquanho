import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Eye, 
  MapPin, 
  Camera, 
  FileAudio, 
  FileText, 
  Building, 
  Users,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { HeritageRecord } from '../types/heritage';

interface SchemaAndFieldDataViewProps {
  records: HeritageRecord[];
  onSelectRecord: (record: HeritageRecord) => void;
}

export const SchemaAndFieldDataView: React.FC<SchemaAndFieldDataViewProps> = ({
  records,
  onSelectRecord,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'records-table'>('schema');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const schemaFields = [
    {
      code: 'id',
      name: 'Mã tư liệu',
      type: 'String (Mã chuẩn)',
      requirement: 'Bắt buộc (Unique)',
      description: 'Mã định danh khoa học cho hồ sơ di sản theo quy chuẩn QH-HN-xxx',
      rule: 'Bắt đầu bằng QH-HN-, 3 chữ số tăng dần (ví dụ: QH-HN-001, QH-HN-002)',
      example: 'QH-HN-001'
    },
    {
      code: 'title',
      name: 'Tên tư liệu',
      type: 'String',
      requirement: 'Bắt buộc',
      description: 'Tên gọi khoa học, chuẩn mực của thực hành, làn điệu, hiện vật hoặc nghi thức',
      rule: 'Viết rõ ràng, phản ánh chính xác nội dung di sản',
      example: 'Nghi thức têm trầu cánh phượng mở đầu canh hát giao duyên'
    },
    {
      code: 'recordType',
      name: 'Loại tư liệu',
      type: 'Enum (6 nhóm)',
      requirement: 'Bắt buộc',
      description: 'Hình thức thể hiện của tư liệu thu thập thực tế',
      rule: 'Tư liệu thực địa, Âm thanh mộc, Diễn xướng, Phỏng vấn sâu, Ký âm lời cổ, Hiện vật đạo cụ',
      example: 'Tư liệu thực địa / Ký âm lời cổ'
    },
    {
      code: 'culturalZone',
      name: 'Vùng văn hóa',
      type: 'String',
      requirement: 'Bắt buộc',
      description: 'Vùng văn hóa lịch sử bao trùm di sản',
      rule: 'Chuẩn hóa danh mục: Châu thổ Bắc Bộ',
      example: 'Châu thổ Bắc Bộ'
    },
    {
      code: 'community',
      name: 'Cộng đồng chủ thể',
      type: 'String',
      requirement: 'Bắt buộc',
      description: 'Cộng đồng di cư đang thực hành và trao truyền di sản',
      rule: 'Người dân gốc Kinh Bắc di cư sinh hoạt tại CLB Quan họ Cầu Giấy hoặc Đống Đa (Hà Nội)',
      example: 'Người dân gốc Bắc Ninh di cư tại Hà Nội'
    },
    {
      code: 'currentAdminPlace',
      name: 'Địa danh hiện nay (sau 07/2025)',
      type: 'String',
      requirement: 'Bắt buộc (Chuẩn 2025)',
      description: 'Địa bàn hành chính sau sắp xếp năm 2025 nơi diễn ra khảo sát thực địa',
      rule: 'Ghi theo đơn vị hành chính cấp xã/phường mới, rồi đến tỉnh/thành phố. Không ghi cấp huyện.',
      example: 'Phường Cầu Giấy, Thành phố Hà Nội (hoặc Phường Kim Liên, Thành phố Hà Nội)'
    },
    {
      code: 'originalAdminPlace',
      name: 'Tên cũ & Địa danh gốc',
      type: 'String',
      requirement: 'Bắt buộc',
      description: 'Tên cũ trước sắp xếp năm 2025 và địa danh gốc lịch sử của làng cổ',
      rule: 'Ghi rõ cả tên cũ (ví dụ: Phường Dịch Vọng, Phường Hòa Long) để phục vụ tra cứu đối chiếu',
      example: 'Trước 07/2025 là Phường Dịch Vọng, quận Cầu Giấy cũ'
    },
    {
      code: 'kinhBacReferenceVillage',
      name: 'Làng cổ Kinh Bắc đối chiếu',
      type: 'String',
      requirement: 'Bắt buộc',
      description: 'Điểm quy chiếu trong 49 làng Quan họ cổ vùng Kinh Bắc',
      rule: 'Thuộc danh mục 49 làng Quan họ cổ được UNESCO ghi danh',
      example: 'Làng Diềm (Viêm Xá), Làng Bồ Sơn, Làng Khả Lễ...'
    },
    {
      code: 'consentStatement',
      name: 'Lời đồng thuận đạo đức',
      type: 'String',
      requirement: 'Bắt buộc (Đầu bản ghi)',
      description: 'Cam kết đồng ý của nghệ nhân/người dân trước khi ghi chép và số hóa',
      rule: 'Ghi câu đồng ý ở đầu bản ghi; nếu chủ thể đổi ý thì gỡ ngay.',
      example: 'Nghệ nhân Nguyễn Thị Được đã đồng thuận cho ghi chép và số hóa...'
    },
    {
      code: 'nonPublicNote',
      name: 'Phần giữ kín không công bố',
      type: 'String',
      requirement: 'Bảo vệ riêng tư',
      description: 'Ghi rõ những phần riêng tư hoặc nghi lễ kiêng kỵ chủ thể dặn không công bố',
      rule: 'Tuyệt đối không đăng địa chỉ nhà riêng, bí quyết riêng hoặc nghi lễ nội bộ.',
      example: 'Địa chỉ nhà riêng và phần nghi lễ nội cung không cho người ngoài xem được giữ kín.'
    },
    {
      code: 'contributor',
      name: 'Người cung cấp tư liệu',
      type: 'Object {name, role, age, origin}',
      requirement: 'Bắt buộc',
      description: 'Chủ thể di sản trực tiếp truyền dạy và cung cấp tư liệu',
      rule: 'Ghi rõ danh tính được phép công bố, vai trò và quê hương gốc',
      example: 'Nguyễn Thị Được (Nghệ nhân truyền dạy, gốc Làng Diềm)'
    },
    {
      code: 'communityQuote',
      name: 'Tiếng nói cộng đồng',
      type: 'String (Nguyên văn)',
      requirement: 'Bắt buộc',
      description: 'Lời nói nguyên văn của người dân, nghệ nhân chia sẻ về di sản',
      rule: 'Trích nguyên văn, giữ giọng người học hỏi, không phán xét đúng sai.',
      example: '"Miếng trầu là đầu câu chuyện..."'
    },
    {
      code: 'dialectGlossary',
      name: 'Từ ngữ bản địa & giải nghĩa',
      type: 'Array<{term, meaning}>',
      requirement: 'Bắt buộc khi có từ cổ',
      description: 'Hệ thống thuật ngữ lề lối cổ truyền và tiếng địa phương Kinh Bắc',
      rule: 'Giữ nguyên tên gọi bản địa kèm giải nghĩa dễ hiểu',
      example: 'Têm trầu cánh phượng, Hát mộc, Giọng lề lối, Nảy hạt...'
    },
    {
      code: 'content',
      name: 'Nội dung tư liệu',
      type: 'Text (Chi tiết)',
      requirement: 'Bắt buộc',
      description: 'Nội dung chi tiết về kỹ thuật, nghi lễ, bài bản hoặc không gian di sản',
      rule: 'Mô tả trung thực quy trình thực hành và kỹ thuật hát Vang - Rền - Nền - Nảy',
      example: 'Tư liệu điền dã làn điệu La rằng...'
    },
    {
      code: 'sourceCitation & sourceUrl',
      name: 'Nguồn tư liệu kiểm chứng',
      type: 'String & URL',
      requirement: 'Bắt buộc (100% có nguồn)',
      description: 'Căn cứ khoa học và xuất xứ kiểm chứng của tư liệu',
      rule: 'Mỗi thông tin phải dẫn được nguồn chính thống hoặc tư liệu điền dã xác thực.',
      example: 'Khảo sát điền dã; đối chiếu Cục Di sản văn hóa (dsvh.gov.vn)'
    },
    {
      code: 'mediaStatus',
      name: 'Trạng thái ảnh / âm thanh gốc',
      type: 'String',
      requirement: 'Trung thực nguồn media',
      description: 'Xác nhận có tệp ảnh/audio gốc được phép hay chưa',
      rule: 'Không dùng ảnh do máy sinh thay cho hiện vật, di tích, nghệ nhân có thật.',
      example: 'Chưa có tệp ảnh gốc được cấp phép công bố.'
    }
  ];

  const getRecordCategory = (record: HeritageRecord): { label: string; color: string; icon: React.ComponentType<{ className?: string }> } => {
    if (record.id === 'QH-HN-005' || record.id === 'QH-HN-006') {
      return { label: 'Hiện vật & Trang phục', color: 'bg-amber-100 text-amber-900 border-amber-300', icon: Camera };
    }
    if (record.id === 'QH-HN-003' || record.id === 'QH-HN-009' || record.id === 'QH-HN-013') {
      return { label: 'Phỏng vấn & Tri thức', color: 'bg-blue-100 text-blue-900 border-blue-300', icon: FileText };
    }
    if (record.id === 'QH-HN-002' || record.id === 'QH-HN-004' || record.id === 'QH-HN-008' || record.id === 'QH-HN-011' || record.id === 'QH-HN-012' || record.id === 'QH-HN-016') {
      return { label: 'Bài bản cổ & Ký âm', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: FileAudio };
    }
    if (record.id === 'QH-HN-001' || record.id === 'QH-HN-007' || record.id === 'QH-HN-015') {
      return { label: 'Hoạt động & Nghi lễ', color: 'bg-rose-100 text-rose-900 border-rose-300', icon: Users };
    }
    return { label: 'Địa điểm & Di tích', color: 'bg-purple-100 text-purple-900 border-purple-300', icon: Building };
  };

  const filteredRecords = records.filter(record => {
    const cat = getRecordCategory(record).label;
    const matchesCategory = categoryFilter === 'all' || cat.includes(categoryFilter);
    const matchesSearch = 
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.currentAdminPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.originalAdminPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.sourceCitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="bg-[#5B1A18] text-[#FDEBD0] rounded-2xl p-5 sm:p-8 border border-[#E8C547]/30 shadow-md">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-sm font-semibold border border-[#E8C547]/30">
            <Database className="w-4 h-4 shrink-0" />
            <span>Đặc tả Dữ liệu Khoa học • Địa danh Sau Sắp Xếp 2025</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Thiết Kế Bộ Trường Dữ Liệu & Danh Mục {records.length} Hồ Sơ Thực Tế
          </h2>
          <p className="text-base text-[#FDEBD0]/90 leading-relaxed">
            Quy chuẩn cấu trúc <strong>{schemaFields.length} trường dữ liệu</strong> cho mỗi hồ sơ số di sản Quan họ, bảo đảm địa danh 2 cấp sau sắp xếp năm 2025 (kèm tên cũ), đồng thuận cộng đồng và nguồn kiểm chứng rõ ràng.
          </p>
        </div>
      </section>

      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3D9C9] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('schema')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'schema'
                ? 'bg-[#5B1A18] text-white shadow-sm'
                : 'bg-white text-[#5A4A42] hover:bg-[#EFE8DC] border border-[#E3D9C9]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#E8C547] shrink-0" />
            <span>1. Bộ trường dữ liệu ({schemaFields.length} trường)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('records-table')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'records-table'
                ? 'bg-[#5B1A18] text-white shadow-sm'
                : 'bg-white text-[#5A4A42] hover:bg-[#EFE8DC] border border-[#E3D9C9]'
            }`}
          >
            <Table className="w-4 h-4 text-[#E8C547] shrink-0" />
            <span>2. Bảng 16 bản ghi thực tế</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{records.length}/15 bản ghi</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>100% Có nguồn</span>
          </span>
        </div>
      </div>

      {/* VIEW 1: DATA SCHEMA SPECIFICATION */}
      {activeSubTab === 'schema' && (
        <div className="space-y-6">
          {/* Key Principles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#5B1A18]">Nguyên tắc Kiểm chứng</h3>
              <p className="text-base text-[#4A3B32] leading-relaxed">
                Mỗi thông tin đều dẫn nguồn chính thống hoặc tư liệu điền dã đã xác minh, tuyệt đối không tự bịa.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#5B1A18]">Địa danh Sau Sắp Xếp 2025</h3>
              <p className="text-base text-[#4A3B32] leading-relaxed">
                Ghi theo đơn vị hành chính cấp xã/phường mới + tỉnh/thành phố (không ghi cấp huyện), đồng thời lưu rõ tên cũ.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#5B1A18]">Bảo Vệ Quyền Riêng Tư</h3>
              <p className="text-base text-[#4A3B32] leading-relaxed">
                Ghi đồng thuận ở đầu bản ghi, ẩn giữ kín các phần chủ thể dặn không công bố và không dùng ảnh máy sinh thay cho người thật.
              </p>
            </div>
          </div>

          {/* Detailed Schema Table inside dedicated horizontal scroll container */}
          <div className="bg-white rounded-xl border border-[#E3D9C9] shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b border-[#E3D9C9] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#5B1A18] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#E8C547] shrink-0" />
                  <span>Đặc tả {schemaFields.length} trường thông tin lưu trữ trong mỗi bản ghi</span>
                </h3>
                <p className="text-base text-[#7A6458] mt-1 sm:hidden">
                  ← Vuốt ngang trong bảng để xem đầy đủ các cột →
                </p>
              </div>
              <span className="text-sm font-mono bg-[#5B1A18] text-[#FDEBD0] px-3 py-1 rounded-md font-semibold">
                Schema v2.1 (2025)
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-base min-w-[820px]">
                <thead>
                  <tr className="bg-[#F3EDE2] text-[#4A1513] font-semibold text-sm border-b border-[#E3D9C9]">
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4 w-44">Tên trường</th>
                    <th className="py-3 px-4 w-36">Mã trường</th>
                    <th className="py-3 px-4 w-36">Yêu cầu</th>
                    <th className="py-3 px-4 min-w-[260px]">Ý nghĩa & Quy chuẩn</th>
                    <th className="py-3 px-4 min-w-[200px]">Ví dụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DC]">
                  {schemaFields.map((field, idx) => (
                    <tr key={field.code} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-sm text-[#7A6458]">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#2C2420]">
                        {field.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sm text-emerald-800 bg-emerald-50/50">
                        {field.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
                          {field.requirement}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#3A2D26] leading-relaxed">
                        <p>{field.description}</p>
                        <p className="text-base text-[#6A574C] mt-1 italic">
                          <strong>Quy chuẩn:</strong> {field.rule}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-[#5B1A18] font-medium italic bg-[#FAF7F2]/40">
                        {field.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 16 FIELD RECORDS TABLE */}
      {activeSubTab === 'records-table' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-xl border border-[#E3D9C9] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[#5A4A42] flex items-center gap-1 mr-1">
                <Filter className="w-4 h-4 text-[#5B1A18]" />
                <span>Phân loại:</span>
              </span>
              {[
                { key: 'all', label: 'Tất cả 16' },
                { key: 'Hiện vật', label: 'Hiện vật' },
                { key: 'Phỏng vấn', label: 'Phỏng vấn' },
                { key: 'Bài bản cổ', label: 'Bài bản cổ' },
                { key: 'Hoạt động', label: 'Nghi lễ' },
                { key: 'Địa điểm', label: 'Địa điểm' },
              ].map(cat => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === cat.key
                      ? 'bg-[#5B1A18] text-white shadow-2xs font-semibold'
                      : 'bg-[#F3EDE2] text-[#5A4A42] hover:bg-[#EAE0D0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <input
                type="text"
                aria-label="Tìm kiếm trong bảng hồ sơ"
                placeholder="Tìm mã, tên, địa danh, nguồn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] text-base pl-10 pr-3 py-2 rounded-lg border border-[#D6C7B2] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#5B1A18]/40"
              />
              <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <p className="text-base text-[#7A6458] italic sm:hidden">
            ← Vuốt ngang trong bảng để xem đầy đủ các cột →
          </p>

          {/* Records Table inside dedicated horizontal scroll wrapper */}
          <div className="bg-white rounded-xl border border-[#E3D9C9] shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-base min-w-[920px]">
                <thead>
                  <tr className="bg-[#F3EDE2] text-[#4A1513] font-semibold text-sm border-b border-[#E3D9C9]">
                    <th className="py-3 px-3 w-12 text-center">STT</th>
                    <th className="py-3 px-3 w-32">Mã tư liệu</th>
                    <th className="py-3 px-3 min-w-[240px]">Tên tư liệu</th>
                    <th className="py-3 px-3 w-44">Phân loại</th>
                    <th className="py-3 px-3 min-w-[190px]">Địa danh hiện nay (2025)</th>
                    <th className="py-3 px-3 min-w-[200px]">Tên cũ & Làng đối chiếu</th>
                    <th className="py-3 px-3 min-w-[230px]">Nguồn kiểm chứng</th>
                    <th className="py-3 px-3 w-28 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DC]">
                  {filteredRecords.map((rec, idx) => {
                    const catInfo = getRecordCategory(rec);
                    const CatIcon = catInfo.icon;

                    return (
                      <tr key={rec.id} className="hover:bg-[#FAF7F2]/70 transition-colors">
                        <td className="py-3.5 px-3 text-center font-mono text-sm text-[#7A6458]">{idx + 1}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-sm font-bold text-[#5B1A18] bg-[#FDEBD0] px-2.5 py-1 rounded-md border border-[#E8C547]/40">
                            {rec.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-[#2C2420] leading-snug">{rec.title}</p>
                          <p className="text-base text-[#6A574C] mt-0.5">
                            {rec.surveyDay} • {rec.contributor.name}
                          </p>
                        </td>
                        <td className="py-3.5 px-3 space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${catInfo.color}`}>
                            <CatIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{catInfo.label}</span>
                          </span>
                          <span className="block text-sm text-[#6A574C]">
                            {rec.recordTypeLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-start gap-1 text-sm font-medium text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{rec.currentAdminPlace}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-sm text-[#5A4A42]">
                          <span className="font-semibold text-[#5B1A18] block">{rec.kinhBacReferenceVillage}</span>
                          <span className="text-[#6A574C] block mt-0.5">{rec.originalAdminPlace}</span>
                        </td>
                        <td className="py-3.5 px-3 text-sm">
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-1 text-emerald-800 font-semibold">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{rec.sourceCitation}</span>
                            </div>
                            {rec.sourceUrl && (
                              <a
                                href={rec.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 underline py-2"
                              >
                                <span>{rec.sourceUrl}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onSelectRecord(rec)}
                            className="min-h-[44px] min-w-[84px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5B1A18] text-[#FDEBD0] hover:bg-[#80221F] font-semibold text-sm shadow-2xs transition-colors"
                            title="Xem chi tiết hồ sơ số"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span>Xem</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#E3D9C9] flex flex-wrap items-center justify-between gap-3 text-sm text-[#6A574C]">
              <span>Hiển thị <strong>{filteredRecords.length} / {records.length}</strong> bản ghi tư liệu thực tế</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Địa danh chuẩn 07/2025 (Xã/Phường + Tỉnh/TP)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
