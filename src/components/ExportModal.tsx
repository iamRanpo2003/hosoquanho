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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div 
        className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E3D9C9] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5B1A18] text-[#FDEBD0] p-4 sm:p-6 flex items-start justify-between gap-3 border-b border-[#E8C547]/30">
          <div className="space-y-1.5 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E8C547] text-[#4A1513] text-xs font-mono font-bold">
              XUẤT DỮ LIỆU MỞ
            </span>
            <h2 id="export-modal-title" className="font-serif font-bold text-xl text-white">
              Xuất Tệp Hồ Sơ Số Dân Ca Quan Họ
            </h2>
            <p className="text-base text-[#FDEBD0]/90">
              Cung cấp dữ liệu cho cộng đồng, nghệ nhân và nhà nghiên cứu sử dụng phi thương mại
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors flex items-center justify-center shrink-0"
            aria-label="Đóng cửa sổ xuất tệp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-[#2C2420] overflow-y-auto">
          {/* Format Selection */}
          <div className="space-y-2.5">
            <span className="text-sm font-bold text-[#5B1A18] block uppercase tracking-wider">
              Chọn định dạng tệp cần xuất:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'json',
                  label: 'Định dạng JSON',
                  desc: 'Phục vụ lưu trữ số hóa',
                  icon: <FileJson className="w-5 h-5 text-amber-700" />,
                },
                {
                  id: 'csv',
                  label: 'Bảng tính CSV',
                  desc: 'Mở bằng Excel tiếng Việt',
                  icon: <FileSpreadsheet className="w-5 h-5 text-emerald-700" />,
                },
                {
                  id: 'md',
                  label: 'Báo cáo Markdown',
                  desc: 'Văn bản báo cáo hoàn chỉnh',
                  icon: <FileText className="w-5 h-5 text-purple-700" />,
                },
              ].map((fmt) => (
                <button
                  type="button"
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as 'json' | 'csv' | 'md')}
                  className={`min-h-[72px] p-3.5 rounded-xl text-left transition-all border ${
                    selectedFormat === fmt.id
                      ? 'bg-[#5B1A18] text-[#FDEBD0] border-[#5B1A18] shadow-xs'
                      : 'bg-white text-[#3A2D26] border-[#E3D9C9] hover:bg-[#FAF4EA]'
                  }`}
                >
                  <div className="mb-1.5">{fmt.icon}</div>
                  <strong className="text-base font-serif block">{fmt.label}</strong>
                  <span className={`text-sm leading-snug mt-0.5 block ${
                    selectedFormat === fmt.id ? 'text-[#E8C547]' : 'text-[#6A574C]'
                  }`}>
                    {fmt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-[#7A6458]">Xem trước dữ liệu ({records.length} bản ghi):</span>
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-3 py-2 rounded-lg border border-[#D8CCBA] bg-white text-sm text-[#5B1A18] hover:bg-[#FAF4EA] font-semibold flex items-center gap-1.5"
              >
                {hasCopied ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                <span>{hasCopied ? 'Đã sao chép!' : 'Sao chép nội dung'}</span>
              </button>
            </div>
            <div className="w-full overflow-x-auto rounded-xl border border-[#D8CCBA] bg-white">
              <pre className="p-3.5 text-sm font-mono text-[#382D27] h-44 overflow-y-auto whitespace-pre">
                {getExportContent().slice(0, 1500)}...
              </pre>
            </div>
          </div>

          {/* Community Notice */}
          <div className="p-3.5 bg-[#EAF2EC] rounded-xl border border-[#C5DDD0] text-base text-[#20452C] flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Dữ liệu được xuất chỉ gồm phần đã có sự đồng thuận công khai, phục vụ nghiên cứu, giáo dục phi thương mại.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4EA] px-4 sm:px-6 py-4 border-t border-[#E3D9C9] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-lg bg-white border border-[#D8CCBA] text-[#5A4A42] text-base font-semibold hover:bg-[#FAF8F5]"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#5B1A18] text-[#FDEBD0] text-base font-semibold hover:bg-[#742321] flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Tải tệp .{selectedFormat} về máy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
