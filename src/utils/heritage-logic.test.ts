import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterHeritageRecords,
  validateHeritageRecord,
  calculateHeritageStats,
  searchAncientVillages,
  exportToJSON,
  exportToCSV,
} from './heritage-logic';
import { HeritageRecord, AncientVillage } from '../types/heritage';

const mockRecords: HeritageRecord[] = [
  {
    id: 'QH-HN-001',
    title: 'Nghi thức têm trầu cánh phượng tại CLB Quan họ Cầu Giấy',
    recordType: 'anh_thuc_dia',
    recordTypeLabel: 'Ảnh chụp thực địa',
    culturalZone: 'Châu thổ Bắc Bộ',
    community: 'Người dân gốc Bắc Ninh/Bắc Giang di cư tại Hà Nội',
    currentAdminPlace: 'Phường Dịch Vọng, Thành phố Hà Nội',
    originalAdminPlace: 'Làng Cầu Giấy, phủ Hoài Đức, tỉnh Hà Đông xưa',
    kinhBacReferenceVillage: 'Làng Diềm (Viêm Xá)',
    surveyDay: 'Ngày 1 (12/10/2026)',
    consentStatement: 'Nghệ nhân Nguyễn Thị Được đồng ý cho chụp ảnh và số hóa phục vụ cộng đồng.',
    contributor: {
      name: 'Nguyễn Thị Được',
      role: 'Nghệ nhân ưu tú',
      origin: 'Làng Diềm, Bắc Ninh',
    },
    usageScope: 'Phi thương mại, phục vụ nghiên cứu và trao truyền',
    communityQuote: 'Miếng trầu là đầu câu chuyện, têm cánh phượng cho khéo để tỏ lòng thành với bạn.',
    dialectGlossary: [{ term: 'Têm trầu cánh phượng', meaning: 'Cách têm trầu uốn vỏ cau như đuôi chim phượng' }],
    content: 'Ghi chép công đoạn têm trầu cánh phượng trong canh hát mở đầu.',
    fieldworkContext: 'Nhà văn hóa Dịch Vọng trong buổi sinh hoạt chiều Chủ nhật.',
    heritageElement: 'Nghi thức Mời trầu',
    sourceCitation: 'Khảo sát thực địa trực tiếp ngày 12/10/2026 & Đối chiếu dsvh.gov.vn',
  },
  {
    id: 'QH-HN-002',
    title: 'Băng âm thanh mộc: Giọng lề lối La rằng',
    recordType: 'audio_moc',
    recordTypeLabel: 'Âm thanh mộc',
    culturalZone: 'Châu thổ Bắc Bộ',
    community: 'Người dân gốc Bắc Ninh/Bắc Giang di cư tại Hà Nội',
    currentAdminPlace: 'Phường Kim Liên, Thành phố Hà Nội',
    originalAdminPlace: 'Phường Kim Liên, khu phố Đống Đa, Hà Nội',
    kinhBacReferenceVillage: 'Làng Bồ Sơn',
    surveyDay: 'Ngày 4 (15/10/2026)',
    consentStatement: 'Liền anh Nguyễn Văn Khang đồng ý thu âm giọng mộc không nhạc đệm.',
    contributor: {
      name: 'Nguyễn Văn Khang',
      role: 'Liền anh truyền dạy',
      origin: 'Làng Bồ Sơn, Bắc Ninh',
    },
    usageScope: 'Phi thương mại, giáo dục di sản',
    communityQuote: 'Lề lối là cốt tủy Quan họ, hát phải Vang, Rền, Nền, Nảy thì mới ra chất người Kinh Bắc.',
    dialectGlossary: [{ term: 'Lề lối', meaning: 'Hệ thống bài bản cổ nhất và khó nhất trong Quan họ' }],
    content: 'Bản thu âm điền dã mộc không nhạc đệm câu hát La rằng.',
    fieldworkContext: 'Buổi tập huấn luyện thanh cho học viên trẻ tại Hà Nội.',
    heritageElement: 'Kỹ thuật Vang - Rền - Nền - Nảy',
    sourceCitation: 'Băng ghi âm điền dã số 02 & Viện Âm nhạc Việt Nam vienamnhac.vn',
  },
];

test('filterHeritageRecords filters by search query correctly', () => {
  const result = filterHeritageRecords(mockRecords, { searchQuery: 'La rằng' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'QH-HN-002');
});

test('filterHeritageRecords filters by record type correctly', () => {
  const result = filterHeritageRecords(mockRecords, { recordType: 'anh_thuc_dia' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'QH-HN-001');
});

test('filterHeritageRecords filters by current place correctly', () => {
  const result = filterHeritageRecords(mockRecords, { currentPlace: 'Dịch Vọng' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'QH-HN-001');
});

test('validateHeritageRecord catches missing fields', () => {
  const invalidRecord: Partial<HeritageRecord> = {
    id: '',
    title: 'Chưa có tên',
  };
  const validation = validateHeritageRecord(invalidRecord);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.length > 0);
});

test('validateHeritageRecord enforces no district in currentAdminPlace rule', () => {
  const invalidPlaceRecord: Partial<HeritageRecord> = {
    id: 'QH-099',
    title: 'Hát canh test',
    recordType: 'audio_moc',
    sourceCitation: 'Nguồn điền dã',
    consentStatement: 'Đã đồng ý',
    originalAdminPlace: 'Xứ Kinh Bắc',
    currentAdminPlace: 'Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội', // Chứa 'Quận Cầu Giấy' -> vi phạm
  };
  const validation = validateHeritageRecord(invalidPlaceRecord);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.some((err) => err.includes('cấp huyện/quận')));
});

test('calculateHeritageStats counts accurately', () => {
  const stats = calculateHeritageStats(mockRecords);
  assert.equal(stats.total, 2);
  assert.equal(stats.audioCount, 1);
  assert.equal(stats.photoCount, 1);
  assert.equal(stats.uniqueContributors, 2);
});

test('searchAncientVillages filters villages', () => {
  const villages: AncientVillage[] = [
    {
      id: 'v1',
      name: 'Làng Diềm (Viêm Xá)',
      currentPlace: 'Phường Hòa Long, Thành phố Bắc Ninh',
      originalPlace: 'Làng Viêm Xá, tổng Phi Mô, phủ Từ Sơn',
      province: 'Bắc Ninh',
      chracteristics: 'Nơi có Đền Vua Bà Thủy tổ Quan họ',
      notableSongs: ['La rằng', 'Lúng liếng'],
    },
    {
      id: 'v2',
      name: 'Làng Thổ Hà',
      currentPlace: 'Xã Vân Hà, Tỉnh Bắc Giang',
      originalPlace: 'Làng Thổ Hà, huyện Việt Yên, phủ Lạng Giang',
      province: 'Bắc Giang',
      chracteristics: 'Làng ven sông Cầu cổ kính',
      notableSongs: ['Ngồi tựa mạn thuyền'],
    },
  ];

  const searchResult = searchAncientVillages(villages, 'Vua Bà');
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].name, 'Làng Diềm (Viêm Xá)');
});

test('exportToJSON and exportToCSV generate valid text outputs', () => {
  const jsonOutput = exportToJSON(mockRecords);
  const parsed = JSON.parse(jsonOutput);
  assert.equal(parsed.totalRecords, 2);

  const csvOutput = exportToCSV(mockRecords);
  assert.ok(csvOutput.includes('QH-HN-001'));
  assert.ok(csvOutput.includes('QH-HN-002'));
});
