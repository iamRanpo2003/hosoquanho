/**
 * Định nghĩa cấu trúc dữ liệu Hồ sơ số Dân ca Quan họ
 */

export type RecordType = 
  | 'audio_moc'          // Âm thanh mộc / Băng ghi âm điền dã
  | 'anh_thuc_dia'       // Ảnh chụp thực địa
  | 'video_trich_doan'   // Video trích đoạn diễn xướng
  | 'phong_van_sau'      // Phỏng vấn sâu nghệ nhân
  | 'ky_am_loi_co'       // Ký âm / Lời bản cổ
  | 'hien_vat_dao_cu';   // Hiện vật / Trang phục đạo cụ

export interface HeritageRecord {
  id: string; // Mã tư liệu, ví dụ: QH-HN-001
  title: string; // Tên tư liệu
  recordType: RecordType;
  recordTypeLabel: string;
  culturalZone: string; // Vùng văn hóa Châu thổ Bắc Bộ
  community: string; // Cộng đồng di cư Bắc Ninh/Bắc Giang tại Hà Nội
  
  // Đơn vị hành chính hiện nay: Tên xã hoặc phường, rồi đến tên tỉnh hoặc thành phố (KHÔNG ghi cấp huyện)
  currentAdminPlace: string; 
  
  // Địa danh tại thời điểm tư liệu: Giữ nguyên tên gốc lịch sử
  originalAdminPlace: string;
  
  // Vùng đối chiếu Kinh Bắc tương ứng (trong 49 làng Quan họ cổ)
  kinhBacReferenceVillage: string;
  
  // Thời điểm khảo sát (trong 6 ngày khảo sát điền dã)
  surveyDay: string; // Ví dụ: Ngày 1 (12/10/2026)
  
  // Lời đồng thuận của người cung cấp tư liệu
  consentStatement: string; 
  
  // Người cung cấp tư liệu
  contributor: {
    name: string;
    role: string; // Nghệ nhân ưu tú, Liền anh, Liền chị, Học viên trẻ
    age?: number;
    origin: string; // Quê quán gốc (ví dụ: Làng Diềm, Bắc Ninh)
  };
  
  // Phạm vi được phép sử dụng
  usageScope: string;
  
  // Tiếng của chính cộng đồng: Trích nguyên văn lời người cung cấp (không diễn giải lại)
  communityQuote: string;
  
  // Thuật ngữ / từ ngữ bản địa kèm chú giải
  dialectGlossary: Array<{
    term: string;
    meaning: string;
  }>;
  
  // Nội dung tư liệu chi tiết
  content: string;
  
  // Bối cảnh thu thập tư liệu thực địa
  fieldworkContext: string;
  
  // Kỹ thuật hoặc nghi thức liên quan (Vang, Rền, Nền, Nảy, Mời trầu, Hát đối, Giã bạn...)
  heritageElement: string;
  
  // Nguồn tư liệu kiểm chứng (không để trống)
  sourceCitation: string;
  sourceUrl?: string;
  
  // Dữ liệu nghe thử âm thanh làn điệu (nếu là audio/bài hát)
  audioSample?: {
    songName: string;
    genre: 'le_loi' | 'vat' | 'gia_ban'; // Giọng lề lối, giọng vặt, giọng giã bạn
    notes: string;
    pitchPattern: number[]; // Tần số nốt nhạc để mô phỏng âm mộc qua Web Audio API
  };

  // Trạng thái tư liệu ảnh / video thực địa (không dùng ảnh máy sinh thay thế hiện vật/di tích/nghệ nhân thật)
  imageUrl?: string;
  imageCaption?: string;
  imageAttribution?: ImageAttribution;
  mediaStatus?: string;
  nonPublicNote?: string;
}

export interface ImageAttribution {
  author: string;
  license: string;
  year: string;
  sourceName: string;
  sourceUrl: string;
  isReferencePhoto: boolean;
}

export interface AncientVillage {
  id: string;
  name: string; // Tên làng cổ (ví dụ: Làng Diềm / Viêm Xá)
  currentPlace: string; // Đơn vị hành chính sau sắp xếp năm 2025
  originalPlace: string; // Địa danh gốc lịch sử và tên cũ trước 07/2025
  province: 'Bắc Ninh' | 'Bắc Giang'; // Vùng Kinh Bắc trước 07/2025 (nay đều thuộc Tỉnh Bắc Ninh)
  chracteristics: string;
  notableSongs: string[];
  imageUrl?: string;
  imageCaption?: string;
  imageAttribution?: ImageAttribution;
}

export interface ResearchSource {
  id: string;
  name: string;
  type: 'chinh_thong' | 'nghien_cuu_bao_chi' | 'hanh_chinh_dien_da';
  organization: string;
  year: string;
  url: string;
  extractedContent: string;
  verifiedStatus: string;
}
