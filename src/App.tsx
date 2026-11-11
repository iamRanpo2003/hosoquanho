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
  Heart, 
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
        {/* Top Summary Stat Ribbon (Visible in Archive View) */}
        {activeTab === 'archive' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase block">Tổng bản ghi</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#5B1A18]">{stats.total}</span>
                <span className="text-xs text-[#8C7A70]">hồ sơ số</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase flex items-center gap-1">
                <FileAudio className="w-3.5 h-3.5 text-emerald-700" />
                Âm thanh mộc
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-emerald-800">{stats.audioCount}</span>
                <span className="text-xs text-[#8C7A70]">bài bản cổ</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                Ảnh điền dã
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-amber-800">{stats.photoCount}</span>
                <span className="text-xs text-[#8C7A70]">tư liệu thực địa</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                Phỏng vấn sâu
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-blue-800">{stats.interviewCount}</span>
                <span className="text-xs text-[#8C7A70]">nghệ nhân</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#5B1A18]" />
                Chủ thể di sản
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#5B1A18]">{stats.uniqueContributors}</span>
                <span className="text-xs text-[#8C7A70]">liền anh/chị</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E3D9C9] shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-[#7A6458] uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                Làng cổ đối chiếu
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-purple-800">49</span>
                <span className="text-xs text-[#8C7A70]">làng Kinh Bắc</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Rendering */}
        {activeTab === 'archive' && (
          <RecordList
            records={heritageRecordsData}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
          />
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
          <SourcesAndEthicsView sources={researchSourcesData} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#2C1817] text-[#D8C7B8] border-t border-[#4E2725] py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8C547] text-[#5B1A18] flex items-center justify-center font-bold text-sm">
                  QH
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  HỒ SƠ SỐ DÂN CA QUAN HỌ Ở VÙNG VĂN HÓA CHÂU THỔ BẮC BỘ
                </h3>
              </div>
              <p className="text-xs text-[#D8C7B8]/80 leading-relaxed max-w-lg">
                Đề tài số hóa di sản văn hóa phi vật thể tập trung vào cộng đồng người dân gốc Bắc Ninh/Bắc Giang 
                di cư ra Hà Nội, khảo sát điền dã thực tế tại CLB Quan họ Cầu Giấy và CLB Đống Đa, 
                đối chiếu với 49 làng Quan họ cổ Kinh Bắc theo công ước UNESCO 2003.
              </p>
              <div className="text-xs text-[#E8C547] flex items-center gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo tồn nguyên vẹn - Tôn trọng chủ thể di sản - Phi thương mại</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <strong className="text-white uppercase tracking-wider block font-serif">Sinh viên thực hiện</strong>
              <p><span className="text-[#A48F82]">Họ và tên:</span> <strong className="text-white">Nguyễn Viết Hải</strong></p>
              <p><span className="text-[#A48F82]">Mã sinh viên:</span> <strong className="text-[#E8C547] font-mono">PH63500</strong></p>
              <p><span className="text-[#A48F82]">Nhóm học tập:</span> <strong className="text-white font-mono">Nhóm [01]</strong></p>
              <p><span className="text-[#A48F82]">Thời gian điền dã:</span> 6 ngày khảo sát thực tế</p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <strong className="text-white uppercase tracking-wider block font-serif">Tri ân cộng đồng</strong>
              <p className="text-[#D8C7B8]/80 leading-relaxed italic">
                Trân trọng cảm ơn các Nghệ nhân ưu tú, các cặp Liền anh - Liền chị và các bạn trẻ tại 
                CLB Dân ca Quan họ Cầu Giấy, CLB Quan họ Đống Đa đã đồng thuận chia sẻ và trao truyền di sản.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#4E2725] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9E8B7F]">
            <span>© 2026 Hồ sơ số Dân ca Quan họ Bắc Bộ • Phát triển vì mục đích học tập và bảo tồn văn hóa</span>
            <span>Thiết kế đáp ứng tốt trên điện thoại di động và máy tính</span>
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
