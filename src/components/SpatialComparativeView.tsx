import React, { useState } from 'react';
import { AncientVillage } from '../types/heritage';
import { 
  MapPin, 
  Compass, 
  Search, 
  Music, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';

interface SpatialComparativeViewProps {
  ancientVillages: AncientVillage[];
}

export const SpatialComparativeView: React.FC<SpatialComparativeViewProps> = ({ ancientVillages }) => {
  const [selectedProvince, setSelectedProvince] = useState<'all' | 'Bắc Ninh' | 'Bắc Giang'>('all');
  const [villageSearch, setVillageSearch] = useState('');
  const [activeVillage, setActiveVillage] = useState<AncientVillage>(ancientVillages[0]);
  const [activeTechnique, setActiveTechnique] = useState<'vang' | 'ren' | 'nen' | 'nay'>('vang');

  const filteredVillages = ancientVillages.filter((v) => {
    if (selectedProvince !== 'all' && v.province !== selectedProvince) return false;
    if (villageSearch.trim()) {
      const q = villageSearch.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.currentPlace.toLowerCase().includes(q) ||
        v.originalPlace.toLowerCase().includes(q) ||
        v.chracteristics.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#5B1A18] via-[#742321] to-[#401211] text-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-sm font-semibold border border-[#E8C547]/30">
            <Compass className="w-4 h-4 shrink-0" />
            <span>KHÔNG GIAN DIỄN XƯỚNG VÀ VÙNG ĐỐI CHIẾU DI SẢN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            Từ 49 Làng Quan Họ Cổ Kinh Bắc Đến Đô Thị Hà Nội (Cập Nhật 2025)
          </h2>
          <p className="text-base text-[#F4DEC3] leading-relaxed">
            Đối chiếu thực hành Dân ca Quan họ giữa cội nguồn 49 làng cổ (nay đều thuộc <strong>Tỉnh Bắc Ninh</strong> sau sắp xếp năm 2025) và cộng đồng di cư tại <strong>Thành phố Hà Nội</strong>.
          </p>
        </div>
      </section>

      {/* Part 1: Interactive Spatial Map & 49 Ancient Villages Explorer */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0E8DC] pb-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#5B1A18] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5B1A18] shrink-0" />
              <span>Đối Chiếu Hà Nội & Các Làng Quan Họ Cổ Kinh Bắc</span>
            </h3>
            <p className="text-base text-[#6A574C]">
              Cập nhật địa danh sau sắp xếp 07/2025 kèm tên cũ để tra cứu lịch sử.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'all', label: 'Tất cả (Tỉnh Bắc Ninh mới)' },
              { id: 'Bắc Ninh', label: 'Vùng Bắc Ninh cũ' },
              { id: 'Bắc Giang', label: 'Vùng Bắc Giang cũ' },
            ] as const).map((prov) => (
              <button
                type="button"
                key={prov.id}
                onClick={() => setSelectedProvince(prov.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedProvince === prov.id
                    ? 'bg-[#5B1A18] text-[#FDEBD0]'
                    : 'bg-[#F4EFE6] text-[#5A4A42] hover:bg-[#EAE1D2]'
                }`}
              >
                {prov.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Diagram Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Node Selector */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Village */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7A70]" />
              <input
                type="text"
                aria-label="Tìm tên làng cổ Kinh Bắc"
                value={villageSearch}
                onChange={(e) => setVillageSearch(e.target.value)}
                placeholder="Tìm tên làng cổ hoặc bài hát..."
                className="w-full min-h-[44px] pl-11 pr-3 py-2 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-base text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
              />
            </div>

            {/* Urban Fieldwork Nodes in Hanoi */}
            <div className="p-4 rounded-xl bg-[#FAF0E6] border border-[#E6CCA8] space-y-2.5">
              <span className="text-sm font-bold text-[#5B1A18] uppercase tracking-wider block">
                Điểm khảo sát tại Hà Nội (sau 07/2025)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                <div className="bg-white p-3 rounded-lg border border-[#DFD1BF]">
                  <strong className="text-[#5B1A18] block">CLB Quan họ Cầu Giấy</strong>
                  <span className="text-[#5A4A42]">Phường Cầu Giấy (Dịch Vọng cũ), Hà Nội</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#DFD1BF]">
                  <strong className="text-[#5B1A18] block">CLB Quan họ Đống Đa</strong>
                  <span className="text-[#5A4A42]">Phường Kim Liên (Kim Liên/Khương Thượng cũ), Hà Nội</span>
                </div>
              </div>
            </div>

            {/* List of Ancient Villages */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              <span className="text-sm font-bold text-[#7A6458] block">
                Danh bạ làng cổ tiêu biểu trong 49 làng Quan họ:
              </span>
              {filteredVillages.map((village) => (
                <button
                  type="button"
                  key={village.id}
                  onClick={() => setActiveVillage(village)}
                  className={`w-full min-h-[48px] text-left p-3 rounded-lg text-sm transition-all flex items-center justify-between gap-2 border ${
                    activeVillage.id === village.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] font-semibold shadow-xs'
                      : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E8DEC8] hover:bg-[#F3EDE2]'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-serif text-base block truncate">{village.name}</span>
                    <span className={`text-sm block truncate ${activeVillage.id === village.id ? 'text-[#E8C547]' : 'text-[#6A574C]'}`}>
                      {village.currentPlace}
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                    activeVillage.id === village.id ? 'bg-white/20 text-white' : 'bg-[#EAE0D0] text-[#5A4A42]'
                  }`}>
                    {village.province} cũ
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active Village Details */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-4 sm:p-6 rounded-2xl border border-[#DFD4C3] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
                  LÀNG QUAN HỌ CỔ ĐỐI CHIẾU
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#5B1A18] mt-1.5">
                  {activeVillage.name}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5B1A18] text-white text-sm font-semibold">
                Tỉnh Bắc Ninh (sau 07/2025)
              </span>
            </div>

            {/* Verified Village Reference Photo (shown when available) */}
            {activeVillage.imageUrl && activeVillage.imageAttribution && (
              <figure className="rounded-xl overflow-hidden border border-[#DFD4C3] bg-white">
                <div className="relative h-56 sm:h-64 w-full bg-[#EFE8DC]">
                  <img
                    src={activeVillage.imageUrl}
                    alt={activeVillage.imageCaption || activeVillage.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#2C1817]/85 text-[#FDEBD0] text-xs font-semibold border border-[#E8C547]/40">
                    Ảnh tư liệu tham khảo ({activeVillage.imageAttribution.license})
                  </span>
                </div>
                <figcaption className="p-3.5 space-y-2 bg-[#FAF8F5] border-t border-[#EAE0D0]">
                  <p className="text-base text-[#2C2420] font-medium">
                    {activeVillage.imageCaption}
                  </p>
                  <div className="text-sm text-[#5A4A42] flex flex-wrap items-center justify-between gap-2">
                    <span>
                      <strong>Tác giả:</strong> {activeVillage.imageAttribution.author} ({activeVillage.imageAttribution.year}) • {activeVillage.imageAttribution.license}
                    </span>
                    <a
                      href={activeVillage.imageAttribution.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#D8CCBA] text-[#5B1A18] font-semibold hover:bg-[#FAF4EA] transition-colors"
                    >
                      <span>Nguồn Wikimedia</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </figcaption>
              </figure>
            )}

            <div className="space-y-2.5 text-base bg-white p-4 rounded-xl border border-[#E3D9C9]">
              <div className="space-y-0.5">
                <strong className="text-[#5B1A18] block text-sm">Địa bàn hiện nay (sau sắp xếp 07/2025):</strong>
                <span className="text-[#2C2420] font-semibold block break-words">{activeVillage.currentPlace}</span>
              </div>
              <div className="space-y-0.5 pt-2 border-t border-[#F0E8DC]">
                <strong className="text-[#805030] block text-sm">Tên cũ & Địa danh gốc lịch sử:</strong>
                <span className="text-[#55453C] italic block break-words">{activeVillage.originalPlace}</span>
              </div>
            </div>

            {/* Cultural Traits */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-[#5B1A18] uppercase tracking-wide block">
                Đặc trưng không gian văn hóa & Tục lệ:
              </span>
              <p className="text-base text-[#2C2420] leading-relaxed bg-white p-4 rounded-xl border border-[#E3D9C9]">
                {activeVillage.chracteristics}
              </p>
            </div>

            {/* Notable Songs */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-[#5B1A18] uppercase tracking-wide flex items-center gap-1.5">
                <Music className="w-4 h-4 text-[#5B1A18] shrink-0" />
                <span>Làn điệu cổ tiêu biểu của làng:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {activeVillage.notableSongs.map((song, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF0E6] text-[#5B1A18] text-sm font-semibold border border-[#E6CCA8]"
                  >
                    {song}
                  </span>
                ))}
              </div>
            </div>

            {/* Urban Migration Connection */}
            <div className="p-4 bg-[#E8F0EA] rounded-xl border border-[#C5DDD0] text-base text-[#20452C] flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <p className="leading-relaxed">
                <strong>Liên hệ di cư tại Hà Nội:</strong> Các nghệ nhân gốc {activeVillage.name} hiện sinh hoạt tại CLB Quan họ Cầu Giấy và Đống Đa, trực tiếp truyền dạy bài bản cổ và giữ lối hát mộc cho học viên Thủ đô.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: 4 Pillars of Vocal Technique "VANG - RỀN - NỀN - NẢY" */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-sm font-bold border border-[#E6CCA8]">
            <span>CHUYÊN ĐỀ KỸ THUẬT XƯỚNG ÂM</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Bộ Tứ Chuẩn Mực Âm Sắc: "VANG - RỀN - NỀN - NẢY"
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Trong Dân ca Quan họ chuẩn mực, hát mộc không dùng đàn sáo mà phụ thuộc hoàn toàn vào kỹ thuật phối hợp bốn âm sắc cổ truyền giữa hai người bạn hát cùng cặp.
          </p>
        </div>

        {/* Tab buttons for 4 techniques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'vang', label: 'VANG', subtitle: 'Âm thanh khoáng đạt, tỏa xa' },
            { id: 'ren', label: 'RỀN', subtitle: 'Rung ngân ấm áp từ cơ hoành' },
            { id: 'nen', label: 'NỀN', subtitle: 'Lót đệm, nâng đỡ bạn hát' },
            { id: 'nay', label: 'NẢY', subtitle: 'Hạt âm vi tế đáy họng' },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveTechnique(item.id as 'vang' | 'ren' | 'nen' | 'nay')}
              className={`min-h-[64px] p-4 rounded-xl text-left transition-all border ${
                activeTechnique === item.id
                  ? 'bg-[#5B1A18] text-white border-[#5B1A18] shadow-md'
                  : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E3D9C9] hover:bg-[#F3EDE2]'
              }`}
            >
              <span className="font-serif font-black text-xl tracking-wider block">{item.label}</span>
              <span className={`text-sm mt-1 block ${activeTechnique === item.id ? 'text-[#E8C547]' : 'text-[#6A574C]'}`}>
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* Technique Detail Card */}
        <div className="bg-[#FAF8F5] p-4 sm:p-6 rounded-2xl border border-[#DFD4C3] space-y-4">
          {activeTechnique === 'vang' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                1. Kỹ Thuật "VANG" - Sự Lan Tỏa Của Âm Thanh
              </h4>
              <p className="text-base text-[#2C2420] leading-relaxed">
                "Vang" là yêu cầu âm thanh mở rộng khoang miệng hình quả táo, đẩy cột hơi phóng ra tự nhiên, trong sáng và cao vút mà không bị gắt. Khi về các phòng tập đô thị Hà Nội, nghệ nhân rèn cho học viên cách mở khẩu hình để tiếng hát mộc không bị nghẹt trong cổ.
              </p>
            </div>
          )}

          {activeTechnique === 'ren' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                2. Kỹ Thuật "RỀN" - Độ Rung Ngân Trầm Ấm Và Nội Lực Hơi Thở
              </h4>
              <p className="text-base text-[#2C2420] leading-relaxed">
                "Rền" là âm sắc có độ sóng sánh, rung ngân sâu lắng phát ra từ sự điều tiết hơi thở cơ hoành (đan điền), tạo chiều sâu cảm xúc da diết. Người hát phải luyện lấy hơi bụng, nén hơi nhả dần từng luồng nhỏ bền bỉ.
              </p>
            </div>
          )}

          {activeTechnique === 'nen' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                3. Kỹ Thuật "NỀN" - Nghệ Thuật Lót Bè Và Đạo Lý Nhường Bạn
              </h4>
              <p className="text-base text-[#2C2420] leading-relaxed">
                Trong một cặp hát (hai liền anh hoặc hai liền chị), người hát nền giữ vững cao độ chuẩn, lót âm nền êm ả để nâng đỡ người bạn cùng cặp trổ tài luyến láy, không bao giờ hát át giọng bạn.
              </p>
            </div>
          )}

          {activeTechnique === 'nay' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                4. Kỹ Thuật "NẢY" - Hạt Âm Vi Tế Trong Cuống Họng
              </h4>
              <p className="text-base text-[#2C2420] leading-relaxed">
                "Nảy" là khả năng làm rung chuyển các hạt âm nhỏ li ti ở đáy cuống họng khi luyến láy các từ đệm "i, a, ư, hự". Nảy không phải hát ngắt nhịp giật cục mà là những gợn sóng âm mượt mà, đều đặn.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Part 3: 3 Stages of a Traditional Canh Hát */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-sm font-bold border border-[#E6CCA8]">
            <span>TIẾN TRÌNH DIỄN XƯỚNG CANH HÁT</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Quy Chuẩn 3 Chặng Của Một Canh Hát Quan Họ Cổ Truyền
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Một canh hát Quan họ đúng lề lối trải qua ba chặng tuần tự nghiêm ngặt, phản ánh quy chuẩn văn hóa ứng xử trọng lễ nghĩa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#5B1A18] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="inline-block px-2.5 py-1 rounded-md bg-[#5B1A18] text-[#FDEBD0] text-xs font-bold">
              CHẶNG 1: GIỌNG LỀ LỐI
            </span>
            <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
              Nghi thức Mời trầu & Mở canh hát
            </h4>
            <p className="text-base text-[#3A2D26] leading-relaxed">
              Bắt buộc hát vào đầu canh. Liền chị dâng cơi trầu têm cánh phượng, hai bên thể hiện các bài bản cổ kính, trang nghiêm (La rằng, Tình tang, Đương quan đương lội).
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#C88A28] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="inline-block px-2.5 py-1 rounded-md bg-[#C88A28] text-white text-xs font-bold">
              CHẶNG 2: GIỌNG VẶT
            </span>
            <h4 className="font-serif font-bold text-lg text-[#805018]">
              Hát Đối Đáp Giao Duyên
            </h4>
            <p className="text-base text-[#3A2D26] leading-relaxed">
              Chiếm phần lớn thời lượng canh hát. Hai bên đối giọng đối lời qua các bài phong phú như Cây trúc xinh, Lúng liếng, Ngồi tựa mạn thuyền.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#80221F] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="inline-block px-2.5 py-1 rounded-md bg-[#80221F] text-white text-xs font-bold">
              CHẶNG 3: GIỌNG GIÃ BẠN
            </span>
            <h4 className="font-serif font-bold text-lg text-[#80221F]">
              Nghi thức Tống biệt & Hẹn mùa sau
            </h4>
            <p className="text-base text-[#3A2D26] leading-relaxed">
              Diễn ra lúc tàn canh với các làn điệu lưu luyến như Người ơi người ở đừng về, Chia rẽ đôi nơi.
            </p>
          </div>
        </div>
      </section>

      {/* Part 4: Comparative Matrix with dedicated horizontal scroll wrapper */}
      <section className="bg-white rounded-2xl p-4 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-sm font-bold border border-[#E6CCA8]">
            <span>ĐỐI CHIẾU KHÔNG GIAN</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            So Sánh Thực Hành: Làng Cổ Kinh Bắc & Cộng Đồng Di Cư Hà Nội
          </h3>
          <p className="text-base text-[#5A4A42] leading-relaxed">
            Bảng tổng hợp sự tiếp nối và thích ứng giữa môi trường làng xã cội nguồn và câu lạc bộ đô thị hiện nay.
          </p>
        </div>

        <p className="text-base text-[#7A6458] italic sm:hidden">
          ← Vuốt ngang trong bảng để xem đầy đủ các cột →
        </p>

        <div className="w-full overflow-x-auto rounded-xl border border-[#E3D9C9]">
          <table className="w-full text-base text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#FAF2EB] text-[#5B1A18]">
                <th className="p-4 border-b border-r border-[#E3D9C9] font-serif font-bold w-1/4">Tiêu chí đối chiếu</th>
                <th className="p-4 border-b border-r border-[#E3D9C9] font-serif font-bold w-3/8 text-[#2A5235]">
                  Làng Quan họ cổ Kinh Bắc (Tỉnh Bắc Ninh)
                </th>
                <th className="p-4 border-b border-[#E3D9C9] font-serif font-bold w-3/8 text-[#5B1A18]">
                  Cộng đồng di cư tại Thành phố Hà Nội
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE1D2] text-[#2C2420]">
              <tr>
                <td className="p-4 font-bold bg-[#FAF8F5] border-r border-[#E3D9C9]">Không gian diễn xướng</td>
                <td className="p-4 border-r border-[#E3D9C9]">
                  Sân đình làng, bến đò sông Cầu, nhà chứa Quan họ, lễ hội truyền thống.
                </td>
                <td className="p-4 bg-[#FDFBF7]">
                  Nhà văn hóa tại Phường Cầu Giấy (Dịch Vọng cũ), Phường Kim Liên, phòng sinh hoạt gia đình đô thị.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-[#FAF8F5] border-r border-[#E3D9C9]">Chủ thể thực hành</td>
                <td className="p-4 border-r border-[#E3D9C9]">
                  Cư dân làng xã tổ chức thành các "bọn Quan họ", gắn kết qua tục kết chạ giữa các làng.
                </td>
                <td className="p-4 bg-[#FDFBF7]">
                  Nghệ nhân cao niên di cư, cán bộ hưu trí, công chức, sinh viên yêu văn hóa Kinh Bắc.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-[#FAF8F5] border-r border-[#E3D9C9]">Phương thức trao truyền</td>
                <td className="p-4 border-r border-[#E3D9C9]">
                  Truyền khẩu gia đình nhiều thế hệ, học tự nhiên qua các canh hát.
                </td>
                <td className="p-4 bg-[#FDFBF7]">
                  Lớp sinh hoạt cuối tuần, bẻ làn nắn điệu kết hợp ký âm lời cổ đối chiếu.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-[#FAF8F5] border-r border-[#E3D9C9]">Bảo lưu kỹ thuật mộc</td>
                <td className="p-4 border-r border-[#E3D9C9]">
                  Hát mộc tuyệt đối không nhạc đệm, dựa vào hơi thở cơ hoành và vòm miệng.
                </td>
                <td className="p-4 bg-[#FDFBF7]">
                  Kiên trì rèn hát mộc lề lối, hạn chế nhạc điện tử để giữ âm sắc Vang - Rền - Nền - Nảy.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
