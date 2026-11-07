import { HeritageRecord, AncientVillage } from '../types/heritage';

/**
 * Lọc danh sách bản ghi theo các tiêu chí tìm kiếm đa chiều
 */
export function filterHeritageRecords(
  records: HeritageRecord[],
  filters: {
    searchQuery?: string;
    recordType?: string;
    currentPlace?: string;
    heritageElement?: string;
  }
): HeritageRecord[] {
  const query = (filters.searchQuery || '').trim().toLowerCase();
  const type = filters.recordType || 'all';
  const place = (filters.currentPlace || 'all').toLowerCase();
  const element = (filters.heritageElement || 'all').toLowerCase();

  return records.filter((item) => {
    // Lọc theo loại tư liệu
    if (type !== 'all' && item.recordType !== type) {
      return false;
    }

    // Lọc theo địa bàn hành chính hiện nay
    if (place !== 'all' && !item.currentAdminPlace.toLowerCase().includes(place)) {
      return false;
    }

    // Lọc theo yếu tố thực hành di sản
    if (element !== 'all' && !item.heritageElement.toLowerCase().includes(element)) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm (mã, tên, nội dung, người cung cấp, địa danh)
    if (query) {
      const matchText = [
        item.id,
        item.title,
        item.content,
        item.currentAdminPlace,
        item.originalAdminPlace,
        item.contributor.name,
        item.contributor.role,
        item.communityQuote,
        item.heritageElement,
        item.kinhBacReferenceVillage,
      ]
        .join(' ')
        .toLowerCase();

      if (!matchText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Kiểm tra tính hợp lệ của một bản ghi theo quy chuẩn của hồ sơ số
 * - Không bỏ trống nguồn
 * - Địa danh hiện nay phải ghi đúng đơn vị hành chính cấp xã/phường + tỉnh/thành phố (không ghi huyện)
 * - Phải có sự đồng ý của chủ thể di sản
 */
export function validateHeritageRecord(record: Partial<HeritageRecord>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!record.id?.trim()) errors.push('Mã tư liệu không được để trống.');
  if (!record.title?.trim()) errors.push('Tên tư liệu không được để trống.');
  if (!record.recordType) errors.push('Loại tư liệu không được để trống.');
  if (!record.sourceCitation?.trim()) errors.push('Nguồn tư liệu kiểm chứng không được để trống.');
  if (!record.consentStatement?.trim()) errors.push('Câu đồng ý của người cung cấp tư liệu không được để trống.');
  if (!record.currentAdminPlace?.trim()) errors.push('Địa danh hiện nay không được để trống.');
  if (!record.originalAdminPlace?.trim()) errors.push('Địa danh tại thời điểm tư liệu không được để trống.');

  // Kiểm tra quy định "không ghi cấp huyện" trong địa danh hiện nay
  if (record.currentAdminPlace) {
    const forbiddenDistrictKeywords = ['quận ', 'huyện ', 'thị xã '];
    const lower = record.currentAdminPlace.toLowerCase();
    for (const kw of forbiddenDistrictKeywords) {
      if (lower.includes(kw)) {
        errors.push(`Địa danh hiện nay không được ghi cấp huyện/quận: "${record.currentAdminPlace}". Quy định: Tên xã/phường, Tỉnh/Thành phố.`);
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Tính toán số liệu thống kê hồ sơ số
 */
export function calculateHeritageStats(records: HeritageRecord[]) {
  const total = records.length;
  const audioCount = records.filter((r) => r.recordType === 'audio_moc').length;
  const photoCount = records.filter((r) => r.recordType === 'anh_thuc_dia').length;
  const videoCount = records.filter((r) => r.recordType === 'video_trich_doan').length;
  const interviewCount = records.filter((r) => r.recordType === 'phong_van_sau').length;
  const scoreCount = records.filter((r) => r.recordType === 'ky_am_loi_co').length;
  const artifactCount = records.filter((r) => r.recordType === 'hien_vat_dao_cu').length;

  const uniqueContributors = new Set(records.map((r) => r.contributor.name)).size;
  const ancientVillagesReferenced = new Set(records.map((r) => r.kinhBacReferenceVillage)).size;

  return {
    total,
    audioCount,
    photoCount,
    videoCount,
    interviewCount,
    scoreCount,
    artifactCount,
    uniqueContributors,
    ancientVillagesReferenced,
  };
}

/**
 * Tìm kiếm trong danh mục 49 làng Quan họ cổ Kinh Bắc
 */
export function searchAncientVillages(villages: AncientVillage[], query: string): AncientVillage[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return villages;

  return villages.filter(
    (v) =>
      v.name.toLowerCase().includes(cleanQuery) ||
      v.currentPlace.toLowerCase().includes(cleanQuery) ||
      v.originalPlace.toLowerCase().includes(cleanQuery) ||
      v.province.toLowerCase().includes(cleanQuery) ||
      v.chracteristics.toLowerCase().includes(cleanQuery)
  );
}

/**
 * Xuất dữ liệu bản ghi thành chuỗi JSON
 */
export function exportToJSON(records: HeritageRecord[]): string {
  return JSON.stringify(
    {
      project: 'Hồ sơ số Dân ca Quan họ vùng văn hóa Châu thổ Bắc Bộ',
      culturalZone: 'Châu thổ Bắc Bộ',
      community: 'Người dân gốc Bắc Ninh / Bắc Giang di cư ra Hà Nội',
      exportDate: new Date().toISOString(),
      totalRecords: records.length,
      records,
    },
    null,
    2
  );
}

/**
 * Xuất dữ liệu bản ghi thành chuỗi CSV (hỗ trợ mở trong Excel, Google Sheets)
 */
export function exportToCSV(records: HeritageRecord[]): string {
  const headers = [
    'Mã tư liệu',
    'Tên tư liệu',
    'Loại tư liệu',
    'Địa danh hiện nay',
    'Địa danh thời điểm tư liệu',
    'Làng cổ đối chiếu',
    'Người cung cấp',
    'Nội dung',
    'Lời nói cộng đồng',
    'Nguồn kiểm chứng',
    'Đồng thuận sử dụng',
  ];

  const escapeCSV = (text: string) => {
    if (!text) return '""';
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = records.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.title),
    escapeCSV(r.recordTypeLabel),
    escapeCSV(r.currentAdminPlace),
    escapeCSV(r.originalAdminPlace),
    escapeCSV(r.kinhBacReferenceVillage),
    escapeCSV(`${r.contributor.name} (${r.contributor.role})`),
    escapeCSV(r.content),
    escapeCSV(r.communityQuote),
    escapeCSV(r.sourceCitation),
    escapeCSV(r.consentStatement),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Xuất báo cáo điền dã tổng hợp Markdown
 */
export function exportToMarkdownReport(records: HeritageRecord[]): string {
  const stats = calculateHeritageStats(records);
  let md = `# BÁO CÁO HỒ SƠ SỐ DÂN CA QUAN HỌ Ở VÙNG VĂN HÓA CHÂU THỔ BẮC BỘ
**Cộng đồng:** Người dân gốc Bắc Ninh / Bắc Giang di cư ra Hà Nội
**Địa bàn khảo sát:** Thành phố Hà Nội (Trọng tâm: Phường Dịch Vọng, Phường Kim Liên)
**Vùng đối chiếu:** 49 Làng Quan họ cổ vùng Kinh Bắc (Bắc Ninh - Bắc Giang)
**Người lập hồ sơ:** Nguyễn Viết Hải (Mã SV: PH63500) - Nhóm: [01]
**Thời gian điền dã:** 6 ngày khảo sát thực tế

---
## 1. TỔNG QUAN DỮ LIỆU THỰC ĐỊA
- **Tổng số bản ghi thực tế:** ${stats.total} bản ghi
- **Âm thanh mộc thu âm điền dã:** ${stats.audioCount} bản
- **Ảnh chụp thực địa:** ${stats.photoCount} ảnh
- **Video trích đoạn diễn xướng:** ${stats.videoCount} video
- **Phỏng vấn sâu nghệ nhân & học viên:** ${stats.interviewCount} bài
- **Ký âm bản cổ:** ${stats.scoreCount} bản
- **Hiện vật trang phục đạo cụ:** ${stats.artifactCount} hiện vật
- **Chủ thể di sản cung cấp tư liệu:** ${stats.uniqueContributors} cá nhân nghệ nhân/liền anh/liền chị

---
## 2. DANH MỤC CÁC BẢN GHI TƯ LIỆU ĐIỀN DÃ
`;

  records.forEach((r, idx) => {
    md += `
### ${idx + 1}. [${r.id}] ${r.title}
- **Loại tư liệu:** ${r.recordTypeLabel}
- **Địa danh hiện nay:** ${r.currentAdminPlace}
- **Địa danh thời điểm tư liệu:** ${r.originalAdminPlace}
- **Làng cổ Kinh Bắc đối chiếu:** ${r.kinhBacReferenceVillage}
- **Người cung cấp:** ${r.contributor.name} (${r.contributor.role} - Gốc: ${r.contributor.origin})
- **Đồng thuận của chủ thể:** "${r.consentStatement}"
- **Phạm vi sử dụng:** ${r.usageScope}
- **Tiếng nói của chính cộng đồng:**
  > "${r.communityQuote}"
- **Nội dung tóm tắt:** ${r.content}
- **Nguồn tư liệu kiểm chứng:** ${r.sourceCitation}
`;
  });

  return md;
}
