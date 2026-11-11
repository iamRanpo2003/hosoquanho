import React, { useState } from 'react';
import { AncientVillage } from '../types/heritage';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Search, 
  Music, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { speechReader } from '../utils/speech-reader';

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

  const handleReadSection = (title: string, content: string) => {
    speechReader.speak(`${title}. ${content}`);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#5B1A18] via-[#742321] to-[#401211] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8C547]/30">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C547]/20 text-[#E8C547] text-xs font-semibold tracking-wide border border-[#E8C547]/30">
            <Compass className="w-3.5 h-3.5" />
            <span>KHÔNG GIAN DIỄN XƯỚNG VÀ VÙNG ĐỐI CHIẾU DI SẢN</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDF6E2] tracking-tight">
            Từ 49 Làng Quan Họ Cổ Kinh Bắc Đến Không Gian Đô Thị Hà Nội
          </h2>
          <p className="text-sm sm:text-base text-[#F4DEC3] leading-relaxed">
            Nghiên cứu đối chiếu sự tiếp nối và thích ứng của Dân ca Quan họ giữa hai không gian văn hóa: 
            <strong>Cội nguồn 49 làng cổ</strong> tại lưu vực sông Cầu (Bắc Ninh - Bắc Giang) và 
            <strong>Không gian đô thị đương đại</strong> tại các câu lạc bộ Quan họ ở Thủ đô Hà Nội.
          </p>
        </div>
      </div>

      {/* Part 1: Interactive Spatial Map & 49 Ancient Villages Explorer */}
      <div className="bg-white rounded-2xl p-6 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0E8DC] pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#5B1A18] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#5B1A18]" />
              <span>Bản Đồ Không Gian Đối Chiếu: Hà Nội & 49 Làng Cổ Kinh Bắc</span>
            </h3>
            <p className="text-xs text-[#7A6458]">
              Căn cứ chuẩn hóa hồ sơ di sản theo công ước bảo tồn di sản UNESCO 2009
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#7A6458]">Lọc theo tỉnh gốc:</span>
            {(['all', 'Bắc Ninh', 'Bắc Giang'] as const).map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedProvince === prov
                    ? 'bg-[#5B1A18] text-[#FDEBD0]'
                    : 'bg-[#F4EFE6] text-[#5A4A42] hover:bg-[#EAE1D2]'
                }`}
              >
                {prov === 'all' ? 'Tất cả 49 làng cổ' : prov}
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A70]" />
              <input
                type="text"
                value={villageSearch}
                onChange={(e) => setVillageSearch(e.target.value)}
                placeholder="Tìm tên làng cổ, đặc trưng hoặc bài hát..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D8CCBA] bg-[#FAF8F5] text-xs text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#5B1A18]/40"
              />
            </div>

            {/* Urban Fieldwork Nodes in Hanoi (Highlight) */}
            <div className="p-3.5 rounded-xl bg-[#FAF0E6] border border-[#E6CCA8] space-y-2">
              <span className="text-xs font-bold text-[#5B1A18] uppercase tracking-wider block">
                🏛️ Điểm Khảo Sát Thực Địa Tại Hà Nội (Đô thị)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-[#DFD1BF]">
                  <strong className="text-[#5B1A18] block">CLB Quan họ Cầu Giấy</strong>
                  <span className="text-[#6A574C]">Nhà VH Phường Dịch Vọng, Hà Nội</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#DFD1BF]">
                  <strong className="text-[#5B1A18] block">CLB Quan họ Đống Đa</strong>
                  <span className="text-[#6A574C]">Phường Kim Liên, Hà Nội</span>
                </div>
              </div>
            </div>

            {/* List of Ancient Villages */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-[#7A6458] block">
                Danh bạ các Làng Quan họ cổ Kinh Bắc gốc rễ:
              </span>
              {filteredVillages.map((village) => (
                <button
                  key={village.id}
                  onClick={() => setActiveVillage(village)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                    activeVillage.id === village.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] font-semibold shadow-xs'
                      : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E8DEC8] hover:bg-[#F3EDE2]'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <span className="font-serif block truncate">{village.name}</span>
                    <span className={`text-[10px] block truncate ${activeVillage.id === village.id ? 'text-[#E8C547]' : 'text-[#7A6458]'}`}>
                      {village.currentPlace}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    activeVillage.id === village.id ? 'bg-white/20 text-white' : 'bg-[#EAE0D0] text-[#5A4A42]'
                  }`}>
                    {village.province}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Active Village Details */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 rounded-2xl border border-[#DFD4C3] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
                  LÀNG QUAN HỌ CỔ GỐC
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#5B1A18] mt-1">
                  {activeVillage.name}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5B1A18] text-white text-xs font-semibold">
                {activeVillage.province}
              </span>
            </div>

            {/* Location Specs & Village Photo */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-[#E3D9C9] bg-black/10">
              <img
                src={
                  activeVillage.name.includes('Diềm')
                    ? '/src/assets/images/den_vua_ba_1794428331652.jpg'
                    : activeVillage.name.includes('Thổ Hà') || activeVillage.name.includes('Bồ Sơn')
                    ? '/src/assets/images/hat_moc_quanho_1794428287844.jpg'
                    : '/src/assets/images/hat_doi_canhhat_1794428317535.jpg'
                }
                alt={activeVillage.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-3 text-xs text-[#FDEBD0] font-medium drop-shadow-xs">
                📷 Không gian làng cổ: {activeVillage.name} ({activeVillage.province})
              </span>
            </div>

            <div className="space-y-2 text-xs bg-white p-3.5 rounded-xl border border-[#E3D9C9]">
              <div className="flex items-start gap-2">
                <strong className="text-[#5B1A18] min-w-[120px]">📍 Địa bàn hiện nay:</strong>
                <span className="text-[#2C2420] font-medium">{activeVillage.currentPlace}</span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-[#805030] min-w-[120px]">📜 Địa danh gốc xưa:</strong>
                <span className="text-[#55453C] italic">{activeVillage.originalPlace}</span>
              </div>
            </div>

            {/* Cultural Traits */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5B1A18] uppercase tracking-wide">
                Đặc trưng không gian văn hóa & Tục lệ:
              </span>
              <p className="text-sm text-[#3A2D26] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E3D9C9]">
                {activeVillage.chracteristics}
              </p>
            </div>

            {/* Notable Songs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#5B1A18] uppercase tracking-wide flex items-center gap-1.5">
                <Music className="w-4 h-4 text-[#5B1A18]" />
                Làn điệu cổ tiêu biểu của làng:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeVillage.notableSongs.map((song, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF0E6] text-[#5B1A18] text-xs font-semibold border border-[#E6CCA8]"
                  >
                    🎵 {song}
                  </span>
                ))}
              </div>
            </div>

            {/* Urban Migration Connection */}
            <div className="p-3 bg-[#E8F0EA] rounded-xl border border-[#C5DDD0] text-xs text-[#20452C] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Mối liên hệ di cư ra Hà Nội:</strong> Các nghệ nhân gốc {activeVillage.name} hiện đang sinh hoạt 
                tại CLB Quan họ Cầu Giấy và Đống Đa, đóng vai trò "cây cao bóng cả" trực tiếp truyền dạy các bài bản cổ 
                và giữ trọn lề lối xướng âm mộc cho thế hệ trẻ Thủ đô.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: 4 Pillars of Vocal Technique "VANG - RỀN - NỀN - NẢY" */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-xs font-bold border border-[#E6CCA8]">
            <span>CHUYÊN ĐỀ KỸ THUẬT XƯỚNG ÂM</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Bộ Tứ Chuẩn Mực Âm Sắc: "VANG - RỀN - NỀN - NẢY"
          </h3>
          <p className="text-sm text-[#7A6458] leading-relaxed">
            Trong Dân ca Quan họ chuẩn mực, âm nhạc mộc không dùng đàn sáo mà phụ thuộc hoàn toàn vào 
            kỹ thuật phối hợp bốn âm sắc cổ truyền giữa hai người bạn hát trong cùng một cặp.
          </p>
        </div>

        {/* Tab buttons for 4 techniques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'vang', label: 'VANG', subtitle: 'Âm thanh khoáng đạt, tỏa xa' },
            { id: 'ren', label: 'RỀN', subtitle: 'Rung ngân ấm áp từ cơ hoành' },
            { id: 'nen', label: 'NỀN', subtitle: 'Lót đệm, nâng đỡ bạn hát' },
            { id: 'nay', label: 'NẢY', subtitle: 'Hạt ngọc luyến láy đáy họng' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTechnique(item.id as any)}
              className={`p-4 rounded-xl text-left transition-all border ${
                activeTechnique === item.id
                  ? 'bg-[#5B1A18] text-white border-[#5B1A18] shadow-md scale-102'
                  : 'bg-[#FAF8F5] text-[#3A2D26] border-[#E3D9C9] hover:bg-[#F3EDE2]'
              }`}
            >
              <h4 className="font-serif font-black text-xl tracking-wider">{item.label}</h4>
              <p className={`text-xs mt-1 ${activeTechnique === item.id ? 'text-[#E8C547]' : 'text-[#7A6458]'}`}>
                {item.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* Technique Detail Card */}
        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DFD4C3] space-y-4">
          {activeTechnique === 'vang' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                1. Kỹ Thuật "VANG" - Sự Lan Tỏa Của Âm Thanh Trên Mặt Nước Và Sân Đình
              </h4>
              <p className="text-sm text-[#3A2D26] leading-relaxed">
                "Vang" là yêu cầu âm thanh phải mở rộng khoang miệng hình quả táo, đẩy cột hơi phóng ra ngoài một cách tự nhiên, 
                trong sáng và cao vút mà không bị gắt. Trong không gian xưa ven sông Cầu hoặc sân đình làng, tiếng hát vang có thể 
                truyền qua mặt nước hàng trăm mét đến tai bạn hát bờ bên kia. Khi về các phòng tập đô thị Hà Nội, nghệ nhân rèn cho học viên 
                cách mở khẩu hình để tiếng hát mộc không bị nghẹt trong cổ.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E3D9C9] text-xs italic text-[#5B1A18]">
                💬 <strong>Lời nghệ nhân:</strong> "Hát mà không vang thì như chuông úp, câu ca không chạm được đến người nghe thì làm sao gọi là đưa duyên."
              </div>
            </div>
          )}

          {activeTechnique === 'ren' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                2. Kỹ Thuật "RỀN" - Độ Rung Ngân Trầm Ấm Và Nội Lực Hơi Thở
              </h4>
              <p className="text-sm text-[#3A2D26] leading-relaxed">
                "Rền" là âm sắc có độ sóng sánh, rung ngân sâu lắng phát ra từ sự điều tiết hơi thở cơ hoành (đan điền). 
                Tiếng hát rền nghe ấm áp như tiếng sấm xa hay tiếng chuông đồng ngân nga, tạo chiều sâu cảm xúc da diết. 
                Để hát rền, người liền anh liền chị phải luyện lấy hơi bụng, nén hơi nhả dần từng luồng nhỏ bền bỉ.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E3D9C9] text-xs italic text-[#5B1A18]">
                💬 <strong>Lời nghệ nhân:</strong> "Rền là hồn cốt của Quan họ. Hát mộc mà không có độ rền thì nghe khô khốc như đọc thơ, không thể làm bạn hát nao lòng."
              </div>
            </div>
          )}

          {activeTechnique === 'nen' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                3. Kỹ Thuật "NỀN" - Nghệ Thuật Lót Bè Và Đạo Lý Nhường Bạn
              </h4>
              <p className="text-sm text-[#3A2D26] leading-relaxed">
                "Nền" thể hiện triết lý tương trợ cao đẹp của người Kinh Bắc. Trong một cặp hát (hai liền anh hoặc hai liền chị), 
                người hát nền có nhiệm vụ giữ vững cao độ chuẩn, lót âm nền êm ả để nâng đỡ người bạn cùng cặp trổ tài luyến láy. 
                Người hát nền không bao giờ được hát to hơn hay tranh giọng của bạn.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E3D9C9] text-xs italic text-[#5B1A18]">
                💬 <strong>Lời nghệ nhân:</strong> "Chơi Quan họ là vì bạn. Giọng mình hay đến mấy mà bạn mình chênh thì canh hát hỏng. Người giữ nền là người có tâm nhất."
              </div>
            </div>
          )}

          {activeTechnique === 'nay' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-[#5B1A18]">
                4. Kỹ Thuật "NẢY" - Hạt Âm Vi Tế Và Sự Tinh Xảo Cuống Họng
              </h4>
              <p className="text-sm text-[#3A2D26] leading-relaxed">
                "Nảy" là kỹ thuật khó nhất, chỉ có ở các nghệ nhân bậc thầy. Đó là khả năng làm rung chuyển các hạt âm nhỏ li ti 
                ở đáy cuống họng khi luyến láy các từ đệm "i, a, ư, hự", tựa như chuỗi ngọc rơi trên mâm bạc. 
                Nảy không phải là hát ngắt nhịp giật cục mà là những gợn sóng âm thoắt ẩn thoắt hiện vô cùng duyên dáng.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E3D9C9] text-xs italic text-[#5B1A18]">
                💬 <strong>Lời nghệ nhân:</strong> "Hạt nảy phải tròn và mịn như hạt sương mai. Luyện được cái nảy hạt này phải mất năm bảy năm bẻ làn nắn điệu mới thành."
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Part 3: 3 Stages of a Traditional Canh Hát */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-xs font-bold border border-[#E6CCA8]">
            <span>TIẾN TRÌNH DIỄN XƯỚNG CANH HÁT</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Quy Chuẩn 3 Chặng Của Một Canh Hát Quan Họ Cổ Truyền
          </h3>
          <p className="text-sm text-[#7A6458] leading-relaxed">
            Một canh hát Quan họ đúng lề lối diễn ra thâu đêm từ chiều tối đến rạng sáng hôm sau, 
            trải qua ba chặng tuần tự nghiêm ngặt, phản ánh quy chuẩn văn hóa ứng xử trọng lễ nghĩa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#5B1A18] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-[#5B1A18] text-[#FDEBD0] text-xs font-bold">
              CHẶNG 1: GIỌNG LỀ LỐI
            </span>
            <h4 className="font-serif font-bold text-base text-[#5B1A18]">
              Nghi thức Mời trầu & Mở canh hát
            </h4>
            <p className="text-xs text-[#55453C] leading-relaxed">
              Bắt buộc phải hát vào đầu canh. Liền chị dâng cơi trầu têm cánh phượng, liền anh mời chén trà sen. 
              Các bài hát có giai điệu cổ kính, trang nghiêm, đo lường bản lĩnh thanh nhạc của hai bên.
            </p>
            <div className="pt-2 border-t border-[#EAE0D0] text-xs space-y-1">
              <strong className="text-[#5B1A18] block">Bài bản bắt buộc:</strong>
              <span className="text-[#6A574C] block">• La rằng (Bài mở đầu kinh điển)</span>
              <span className="text-[#6A574C] block">• Tình tang (Bắt nhịp hòa âm)</span>
              <span className="text-[#6A574C] block">• Đương quan đương lội</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#C88A28] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-[#C88A28] text-white text-xs font-bold">
              CHẶNG 2: GIỌNG VẶT
            </span>
            <h4 className="font-serif font-bold text-base text-[#805018]">
              Hát Đối Đáp Giao Duyên Phong Phú
            </h4>
            <p className="text-xs text-[#55453C] leading-relaxed">
              Chiếm phần lớn thời lượng canh hát. Hai bên nam nữ tự do thể hiện tài ứng biến ca từ, 
              đối giọng đối lời, gửi gắm tâm tư tình yêu, cảnh sắc quê hương, tri âm tri kỷ.
            </p>
            <div className="pt-2 border-t border-[#EAE0D0] text-xs space-y-1">
              <strong className="text-[#805018] block">Làn điệu đối đáp tiêu biểu:</strong>
              <span className="text-[#6A574C] block">• Cây trúc xinh (Đối lời khen ngợi)</span>
              <span className="text-[#6A574C] block">• Lúng liếng (Ánh mắt đưa duyên)</span>
              <span className="text-[#6A574C] block">• Ngồi tựa mạn thuyền / Ngồi tựa song đào</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border-t-4 border-[#80221F] border-x border-b border-[#E3D9C9] space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-[#80221F] text-white text-xs font-bold">
              CHẶNG 3: GIỌNG GIÃ BẠN
            </span>
            <h4 className="font-serif font-bold text-base text-[#80221F]">
              Nghi thức Tống biệt & Hẹn mùa sau
            </h4>
            <p className="text-xs text-[#55453C] leading-relaxed">
              Diễn ra lúc nửa đêm hoặc trời gần sáng khi canh hát tàn. Lời ca lưu luyến xót xa, 
              bước chân không đành, dâng chén rượu tiễn biệt và trao nhau kỷ vật hẹn ngày tái ngộ.
            </p>
            <div className="pt-2 border-t border-[#EAE0D0] text-xs space-y-1">
              <strong className="text-[#80221F] block">Bài bản giã bạn da diết:</strong>
              <span className="text-[#6A574C] block">• Người ơi người ở đừng về</span>
              <span className="text-[#6A574C] block">• Chia rẽ đôi nơi</span>
              <span className="text-[#6A574C] block">• Con nhện giăng mùng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 4: Comparative Matrix (Ancient Village vs Urban Hanoi CLB) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E3D9C9] shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF2EB] text-[#5B1A18] text-xs font-bold border border-[#E6CCA8]">
            <span>ĐỐI CHIẾU DI SẢN ĐỒNG THỜI</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#5B1A18]">
            Đối Chiếu Thực Hành: Làng Xã Kinh Bắc Cổ Truyền vs Môi Trường Đô Thị Hà Nội
          </h3>
          <p className="text-sm text-[#7A6458] leading-relaxed">
            Sự chuyển đổi không gian không làm mất đi cốt tủy di sản mà tạo nên hình thái thích ứng văn hóa mới 
            của người dân Kinh Bắc di cư nơi đô thị phồn hoa.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-[#E3D9C9]">
            <thead>
              <tr className="bg-[#FAF2EB] text-[#5B1A18]">
                <th className="p-3.5 border border-[#E3D9C9] font-serif font-bold text-sm w-1/4">Tiêu chí đối chiếu</th>
                <th className="p-3.5 border border-[#E3D9C9] font-serif font-bold text-sm w-3/8 text-[#2A5235]">
                  49 Làng Quan họ cổ Kinh Bắc (Gốc)
                </th>
                <th className="p-3.5 border border-[#E3D9C9] font-serif font-bold text-sm w-3/8 text-[#5B1A18]">
                  Cộng đồng di cư tại Hà Nội (Hiện thực)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE1D2] text-[#3A2D26]">
              <tr>
                <td className="p-3.5 font-bold bg-[#FAF8F5] border border-[#E3D9C9]">Không gian diễn xướng</td>
                <td className="p-3.5 border border-[#E3D9C9]">
                  Sân đình làng, bến đò sông Cầu, nhà chứa Quan họ, đồi Lim, không gian tự nhiên thoáng đạt.
                </td>
                <td className="p-3.5 border border-[#E3D9C9] bg-[#FDFBF7]">
                  Nhà văn hóa phường (Dịch Vọng, Kim Liên), phòng khách căn hộ chung cư, công viên, sân khấu giao lưu.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-[#FAF8F5] border border-[#E3D9C9]">Chủ thể thực hành</td>
                <td className="p-3.5 border border-[#E3D9C9]">
                  Người dân làng nông nghiệp, tổ chức thành các "bọn Quan họ", gắn kết qua tục kết chạ giữa các làng.
                </td>
                <td className="p-3.5 border border-[#E3D9C9] bg-[#FDFBF7]">
                  Nghệ nhân cao niên di cư, cán bộ hưu trí, công chức, sinh viên yêu mến văn hóa Kinh Bắc tại Thủ đô.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-[#FAF8F5] border border-[#E3D9C9]">Phương thức trao truyền</td>
                <td className="p-3.5 border border-[#E3D9C9]">
                  Truyền khẩu gia đình thế hệ (ông bà dạy cháu, mẹ dạy con), học tự nhiên qua các canh hát thực tế.
                </td>
                <td className="p-3.5 border border-[#E3D9C9] bg-[#FDFBF7]">
                  Lớp sinh hoạt định kỳ cuối tuần, bẻ làn nắn điệu kết hợp số hóa băng ghi âm, văn bản ký âm đối chiếu.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-[#FAF8F5] border border-[#E3D9C9]">Bảo lưu kỹ thuật mộc</td>
                <td className="p-3.5 border border-[#E3D9C9]">
                  Hát mộc tuyệt đối không nhạc đệm, nương tựa vào âm thanh tự nhiên của vòm miệng và cơ hoành.
                </td>
                <td className="p-3.5 border border-[#E3D9C9] bg-[#FDFBF7]">
                  Nỗ lực giữ vững hát mộc lề lối, kiên quyết hạn chế dùng đàn organ tân thời để bảo vệ độ Vang - Rền - Nền - Nảy.
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold bg-[#FAF8F5] border border-[#E3D9C9]">Trang phục & Đạo cụ</td>
                <td className="p-3.5 border border-[#E3D9C9]">
                  May đo thủ công từ the, lụa Vạn Phúc, nón ba tầm đan tay quai thao tơ tằm buông dài.
                </td>
                <td className="p-3.5 border border-[#E3D9C9] bg-[#FDFBF7]">
                  Trang phục giữ chuẩn mực nguyên bản, đặt may theo đúng ni tấc cổ truyền, cơi trầu têm cánh phượng chuẩn mực.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
