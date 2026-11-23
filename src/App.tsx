import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RecordList } from './components/RecordList';
import { RecordDetailModal } from './components/RecordDetailModal';
import { SpatialComparativeView } from './components/SpatialComparativeView';
import { GeminiHeritageAdvisor } from './components/GeminiHeritageAdvisor';
import { SourcesAndEthicsView } from './components/SourcesAndEthicsView';
import { ProjectIntroModal } from './components/ProjectIntroModal';
import { ExportModal } from './components/ExportModal';
import { SchemaAndFieldDataView } from './components/SchemaAndFieldDataView';
import { 
  heritageRecordsData, 
  ancientVillagesData, 
  researchSourcesData 
} from './data/heritage-records';
import { HeritageRecord } from './types/heritage';
import { calculateHeritageStats } from './utils/heritage-logic';
import { speechReader } from './utils/speech-reader';
import { 
  FileAudio, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  MapPin, 
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'archive' | 'schema' | 'spatial' | 'gemini' | 'sources'>('archive');
  const [selectedRecord, setSelectedRecord] = useState<HeritageRecord | null>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  // Sync speech reader state
  useEffect(() => {
    speechReader.registerCallback((reading) => {
      setIsReadingSpeech(reading);
    });
  }, []);

  const stats = calculateHeritageStats(heritageRecordsData);

  const handleToggleGlobalSpeech = () => {
    if (isReadingSpeech) {
      speechReader.stop();
    } else {
      const summaryText = `Chào mừng quý vị và các bác đến với Hồ sơ số Dân ca Quan họ ở vùng văn hóa châu thổ Bắc Bộ. 
      Cộng đồng nghiên cứu: Người dân gốc Bắc Ninh, Bắc Giang di cư ra Hà Nội, tập trung khảo sát điền dã tại Câu lạc bộ Quan họ Cầu Giấy và Đống Đa, 
      đối chiếu chuẩn mực với 49 làng Quan họ cổ Kinh Bắc. Hệ thống bao gồm 16 bản ghi tư liệu thực tế có âm thanh mộc, ảnh chụp, 
      video trích đoạn và phỏng vấn sâu nghệ nhân. Đề tài do sinh viên Nguyễn Viết Hải, mã sinh viên PH63500, Nhóm 01 thực hiện.`;
      speechReader.speak(summaryText);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIntro={() => setIsIntroOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isReading={isReadingSpeech}
        onToggleSpeech={handleToggleGlobalSpeech}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Tab Content Rendering */}
        {activeTab === 'archive' && (
          <div className="space-y-8">
            <RecordList
              records={heritageRecordsData}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
            />

            {/* Summary Stat Ribbon (Below main archive hero and search) */}
            <section aria-label="Thống kê nhanh bộ hồ sơ" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase block">Tổng bản ghi</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-[#5B1A18]">{stats.total}</span>
                  <span className="text-base text-[#6A5A52]">hồ sơ</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase flex items-center gap-1">
                  <FileAudio className="w-4 h-4 text-emerald-700 shrink-0" />
                  Âm thanh
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-emerald-800">{stats.audioCount}</span>
                  <span className="text-base text-[#6A5A52]">bài cổ</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase flex items-center gap-1">
                  <ImageIcon className="w-4 h-4 text-amber-700 shrink-0" />
                  Tư liệu ảnh
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-amber-800">{stats.photoCount}</span>
                  <span className="text-base text-[#6A5A52]">thực địa</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-blue-700 shrink-0" />
                  Phỏng vấn
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-blue-800">{stats.interviewCount}</span>
                  <span className="text-base text-[#6A5A52]">nghệ nhân</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#5B1A18] shrink-0" />
                  Chủ thể
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-[#5B1A18]">{stats.uniqueContributors}</span>
                  <span className="text-base text-[#6A5A52]">người giữ</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
                <span className="text-sm font-bold text-[#7A6458] uppercase flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
                  Đối chiếu
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-purple-800">49</span>
                  <span className="text-base text-[#6A5A52]">làng cổ</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'schema' && (
          <SchemaAndFieldDataView
            records={heritageRecordsData}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
          />
        )}

        {activeTab === 'spatial' && (
          <SpatialComparativeView ancientVillages={ancientVillagesData} />
        )}

        {activeTab === 'gemini' && <GeminiHeritageAdvisor />}

        {activeTab === 'sources' && (
          <SourcesAndEthicsView
            sources={researchSourcesData}
            records={heritageRecordsData}
            villages={ancientVillagesData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#2C1817] text-[#D8C7B8] border-t border-[#4E2725] py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8C547] text-[#5B1A18] flex items-center justify-center font-bold text-sm shrink-0">
                  QH
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  HỒ SƠ SỐ DÂN CA QUAN HỌ VÙNG VĂN HÓA CHÂU THỔ BẮC BỘ
                </h3>
              </div>
              <p className="text-base text-[#D8C7B8]/90 leading-relaxed max-w-lg">
                Đề tài số hóa di sản văn hóa phi vật thể tập trung vào cộng đồng người dân gốc Bắc Ninh (gồm vùng Bắc Giang cũ) 
                di cư ra Hà Nội, khảo sát thực địa 6 ngày tại CLB Quan họ Cầu Giấy và đối chiếu 49 làng Quan họ cổ Kinh Bắc.
              </p>
              <div className="text-base text-[#E8C547] flex items-start gap-2 pt-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mở công khai không cần đăng nhập • Không thu thập dữ liệu cá nhân • Không dùng ảnh máy sinh</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-base">
              <strong className="text-white uppercase tracking-wider block font-serif">Sinh viên thực hiện</strong>
              <p><span className="text-[#C8B8AB]">Họ và tên:</span> <strong className="text-white">Nguyễn Viết Hải</strong></p>
              <p><span className="text-[#C8B8AB]">Mã sinh viên:</span> <strong className="text-[#E8C547] font-mono">PH63500</strong></p>
              <p><span className="text-[#C8B8AB]">Nhóm học tập:</span> <strong className="text-white font-mono">Nhóm [01]</strong></p>
              <p><span className="text-[#C8B8AB]">Thực địa:</span> 6 ngày khảo sát thực tế</p>
            </div>

            <div className="md:col-span-4 space-y-3 text-base">
              <strong className="text-white uppercase tracking-wider block font-serif">Điều hướng & Ghi nhận</strong>
              <p className="text-[#D8C7B8]/90 leading-relaxed">
                Xem đầy đủ danh mục {researchSourcesData.length} nguồn tư liệu, đơn vị phát hành, năm công bố hoặc liên kết gốc và lời tri ân nghệ nhân đóng góp tư liệu:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('sources');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#E8C547] hover:bg-[#D4AF37] text-[#4A1513] font-bold text-base transition-colors inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Nguồn và Ghi nhận</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('archive');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#42201E] hover:bg-[#5B1A18] text-[#FDEBD0] border border-[#6E3633] font-semibold text-base transition-colors inline-flex items-center gap-2"
                >
                  <span>Kho 16 bản ghi</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#4E2725] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-base text-[#C8B8AB]">
            <span>© 2026 Hồ sơ số Dân ca Quan họ Bắc Bộ • Phục vụ học tập và bảo tồn văn hóa</span>
            <button
              type="button"
              onClick={() => {
                setActiveTab('sources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[44px] px-2 text-[#E8C547] hover:underline font-semibold inline-flex items-center"
            >
              Xem trang Nguồn và Ghi nhận →
            </button>
          </div>
        </div>
      </footer>

      {/* Record Detail Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Project Introduction Modal */}
      <ProjectIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
      />

      {/* Export Data Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        records={heritageRecordsData}
      />
    </div>
  );
}
