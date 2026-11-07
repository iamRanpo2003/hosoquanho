import React, { useState } from 'react';
import { HeritageRecord } from '../types/heritage';
import { 
  X, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText, 
  Copy, 
  Check, 
  CheckCircle2 
} from 'lucide-react';
import { exportToJSON, exportToCSV, exportToMarkdownReport } from '../utils/heritage-logic';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: HeritageRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, records }) => {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'md'>('json');
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const getExportContent = () => {
    switch (selectedFormat) {
      case 'json':
        return exportToJSON(records);
      case 'csv':
        return exportToCSV(records);
      case 'md':
        return exportToMarkdownReport(records);
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    let mimeType = 'text/plain;charset=utf-8';
    let ext = 'txt';

    if (selectedFormat === 'json') {
      mimeType = 'application/json;charset=utf-8';
      ext = 'json';
    } else if (selectedFormat === 'csv') {
      // Add UTF-8 BOM so Microsoft Excel renders Vietnamese characters cleanly
      const bom = '\uFEFF';
      const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ho_So_So_Dan_Ca_Quan_Ho_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    } else if (selectedFormat === 'md') {
      mimeType = 'text/markdown;charset=utf-8';
      ext = 'md';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ho_So_So_Dan_Ca_Quan_Ho_${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const content = getExportContent();
    navigator.clipboard.writeText(content).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-6 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-6 flex items-start justify-between gap-4 border-b border-[#E8C547]/30">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
              XUẤT DỮ LIỆU MỞ
            </span>
            <h2 className="font-serif font-bold text-xl text-white">
              Xuất Tệp Hồ Sơ Số Dân Ca Quan Họ
            </h2>
            <p className="text-xs text-[#FDEBD0]/80">
              Cung cấp dữ liệu mở cho cộng đồng, nghệ nhân và các nhà nghiên cứu văn hóa dân gian sử dụng lại
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

        {/* Content */}
        <div className="p-6 space-y-5 text-[#2C2420]">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5B1A18] block uppercase tracking-wider">
              Chọn định dạng tệp cần xuất:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'json',
                  label: 'Định dạng JSON',
                  desc: 'Phục vụ lập trình, API và lưu trữ số hóa',
                  icon: <FileJson className="w-5 h-5 text-amber-700" />,
                },
                {
                  id: 'csv',
                  label: 'Bảng tính CSV',
                  desc: 'Mở bằng Excel hoặc Google Sheets chuẩn tiếng Việt',
                  icon: <FileSpreadsheet className="w-5 h-5 text-emerald-700" />,
                },
                {
                  id: 'md',
                  label: 'Báo cáo Markdown',
                  desc: 'Văn bản báo cáo điền dã hoàn chỉnh',
                  icon: <FileText className="w-5 h-5 text-purple-700" />,
                },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-3.5 rounded-xl text-left transition-all border ${
                    selectedFormat === fmt.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] shadow-xs'
                      : 'bg-white text-[#3A2D26] border-[#E3D9C9] hover:bg-[#FAF4EA]'
                  }`}
                >
                  <div className="mb-2">{fmt.icon}</div>
                  <strong className="text-xs font-serif block">{fmt.label}</strong>
                  <p className={`text-[11px] leading-snug mt-1 ${
                    selectedFormat === fmt.id ? 'text-[#E8C547]' : 'text-[#7A6458]'
                  }`}>
                    {fmt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#7A6458]">Xem trước dữ liệu ({records.length} bản ghi):</span>
              <button
                onClick={handleCopy}
                className="text-xs text-[#5B1A18] hover:text-[#742321] font-semibold flex items-center gap-1"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'Đã sao chép!' : 'Sao chép nội dung'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-white rounded-xl border border-[#D8CCBA] text-xs font-mono text-[#382D27] h-44 overflow-y-auto overflow-x-auto whitespace-pre">
              {getExportContent().slice(0, 1500)}...
            </pre>
          </div>

          {/* Community Notice */}
          <div className="p-3 bg-[#EAF2EC] rounded-xl border border-[#C5DDD0] text-xs text-[#20452C] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Dữ liệu được cấp phép theo tôn chỉ phi thương mại, phục vụ nghiên cứu, giáo dục và trao truyền cộng đồng.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EA] px-6 py-4 border-t border-[#E3D9C9] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#D8CCBA] text-[#5A4A42] text-xs font-semibold hover:bg-[#FAF8F5]"
          >
            Đóng
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-xs font-semibold hover:bg-[#742321] flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Tải tệp .{selectedFormat} về máy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
