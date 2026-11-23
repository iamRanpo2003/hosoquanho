import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  heritageRecordsData,
  ancientVillagesData,
  researchSourcesData,
  fieldworkJournalData,
} from './src/data/heritage-records';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '64kb' }));

// Khởi tạo client Gemini hoàn toàn phía máy chủ từ biến môi trường (không bao giờ gửi khóa xuống trình duyệt hay ghi ra nhật ký)
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Xây dựng ngữ cảnh dữ liệu nội bộ duy nhất để giới hạn câu trả lời của Gemini
function buildGroundedKnowledgeBase(): string {
  const recordsContext = heritageRecordsData
    .map(
      (r) =>
        `- [${r.id}] ${r.title} (${r.recordTypeLabel})\n` +
        `  Địa danh hiện nay (sau 07/2025): ${r.currentAdminPlace} | Tên cũ/gốc: ${r.originalAdminPlace}\n` +
        `  Làng cổ đối chiếu: ${r.kinhBacReferenceVillage} | Người cung cấp: ${r.contributor.name} (${r.contributor.role})\n` +
        `  Yếu tố di sản: ${r.heritageElement}\n` +
        `  Lời cộng đồng: "${r.communityQuote}"\n` +
        `  Từ vựng bản địa: ${r.dialectGlossary.map((g) => `${g.term} (${g.meaning})`).join('; ')}\n` +
        `  Nội dung: ${r.content}\n` +
        `  Nguồn: ${r.sourceCitation}`
    )
    .join('\n');

  const villagesContext = ancientVillagesData
    .map(
      (v) =>
        `- ${v.name}: Hiện nay ${v.currentPlace} (Trước đây: ${v.originalPlace}). Đặc trưng: ${v.chracteristics}. Bài tiêu biểu: ${v.notableSongs.join(', ')}.`
    )
    .join('\n');

  const sourcesContext = researchSourcesData
    .map(
      (s) =>
        `- ${s.name} | Đơn vị: ${s.organization} | Năm: ${s.year} | Đường dẫn: ${s.url} | Phạm vi: ${s.extractedContent}`
    )
    .join('\n');

  const journalContext = fieldworkJournalData
    .map((j) => `- ${j.day} (${j.date}) tại ${j.location}: ${j.activity}. ${j.details}`)
    .join('\n');

  return `
=== KHO DỮ LIỆU HỒ SƠ SỐ TRONG ỨNG DỤNG (16 BẢN GHI THỰC TẾ) ===
${recordsContext}

=== DANH MỤC ĐỐI CHIẾU CÁC LÀNG QUAN HỌ CỔ KINH BẮC ===
${villagesContext}

=== NHẬT KÝ 6 NGÀY KHẢO SÁT THỰC ĐỊA ===
${journalContext}

=== DANH SÁCH NGUỒN CHÍNH THỐNG VÀ THAM KHẢO CỦA ỨNG DỤNG ===
${sourcesContext}
`.trim();
}

const GROUNDED_KNOWLEDGE_BASE = buildGroundedKnowledgeBase();

// Health endpoint (chỉ trả về trạng thái hoạt động, không lộ thông tin nhạy cảm hay khóa)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Server-side Gemini AI route giới hạn nghiêm ngặt trong dữ liệu của ứng dụng
app.post('/api/gemini/analyze-quanho', async (req: Request, res: Response) => {
  try {
    const { mode, content, context } = req.body ?? {};

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Nội dung truy vấn không được để trống.' });
    }

    const sanitizedContent = content.trim().slice(0, 1000);
    const sanitizedContext = typeof context === 'string' ? context.trim().slice(0, 500) : '';

    const aiClient = getGeminiClient();
    if (!aiClient) {
      return res.status(503).json({
        error:
          'Dịch vụ hỏi đáp Gemini chưa sẵn sàng do máy chủ chưa được cấu hình biến môi trường cần thiết trong mục Settings > Secrets.',
      });
    }

    const systemInstruction = `
Bạn là trợ lý tra cứu của ứng dụng "Hồ sơ số Dân ca Quan họ vùng văn hóa Châu thổ Bắc Bộ".

QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
1. CHỈ TRẢ LỜI DỰA TRÊN DỮ LIỆU ĐƯỢC CUNG CẤP BÊN DƯỚI (16 bản ghi [QH-HN-001..016], danh mục làng cổ đối chiếu, nhật ký 6 ngày điền dã và danh sách nguồn của ứng dụng). Tuyệt đối KHÔNG sử dụng kiến thức bên ngoài, KHÔNG tự suy diễn, KHÔNG tự bịa thêm tên người, sự kiện, số liệu, năm tháng hoặc địa danh ngoài dữ liệu được cung cấp.
2. KHI DỮ LIỆU KHÔNG CÓ THÔNG TIN: Nếu câu hỏi nằm ngoài dữ liệu có sẵn trong ứng dụng (hoặc dữ liệu có sẵn không đủ để trả lời chắc chắn), bạn BẮT BUỘC phải bắt đầu câu trả lời bằng đúng cụm từ:
   "Ứng dụng chưa có thông tin này."
   Sau đó nêu rõ khía cạnh nào chưa có trong 16 bản ghi/dữ liệu ứng dụng, và gợi ý người dùng tra cứu tại các nguồn chính thống phù hợp có trong danh sách nguồn của ứng dụng (ví dụ: Cục Di sản văn hóa - dsvh.gov.vn, Viện Âm nhạc Việt Nam - vienamnhac.vn, Ủy ban Nhà nước về người Việt Nam ở nước ngoài - scov.gov.vn, Ủy ban Quốc gia UNESCO Việt Nam / TTXVN - nvsk.vnanet.vn, Cổng thông tin Dân ca Quan họ Bắc Ninh - quanhobacninh.vn).
3. TRÍCH DẪN NGUỒN BẮT BUỘC: Cuối MỌI câu trả lời, luôn phải có một mục rõ ràng:
   "Nguồn dữ liệu đã sử dụng trong ứng dụng:"
   Liệt kê chính xác mã bản ghi (ví dụ: [QH-HN-001], [QH-HN-002]...) và tên nguồn kiểm chứng / đơn vị phát hành tương ứng đã dùng (hoặc ghi rõ các nguồn chính thống gợi ý tra cứu nếu ứng dụng chưa có thông tin).
4. ĐÁNH DẤU PHẦN CHƯA KIỂM CHỨNG: Nếu có chi tiết nào cần đối chiếu thêm ở tài liệu gốc (như năm phát hành chưa ghi trong nguồn), hãy đánh dấu rõ "[Cần đối chiếu thêm từ nguồn gốc]".
5. GIỌNG VĂN & CHÍNH TẢ: Tiếng Việt đúng chính tả, dấu câu thống nhất, thái độ khiêm nhường của người học hỏi, tôn trọng chủ thể di sản, không phán xét đúng sai.

${GROUNDED_KNOWLEDGE_BASE}
`;

    let userPrompt = '';
    switch (mode) {
      case 'technique_guidance':
        userPrompt = `Dựa CHỈ trên dữ liệu trong ứng dụng, hãy giải thích kỹ thuật xướng âm (Vang, Rền, Nền, Nảy) liên quan đến câu hỏi: "${sanitizedContent}". Nếu không có thông tin trong dữ liệu ứng dụng, hãy trả lời "Ứng dụng chưa có thông tin này." và gợi ý nguồn chính thống.`;
        break;
      case 'counter_singing':
        userPrompt = `Dựa CHỈ trên dữ liệu trong ứng dụng, hãy trả lời về bài đối đáp hoặc làn điệu liên quan đến: "${sanitizedContent}". Nếu bài hát/thông tin không có trong 16 bản ghi hoặc danh mục làng cổ của ứng dụng, hãy trả lời "Ứng dụng chưa có thông tin này." và gợi ý nguồn chính thống.`;
        break;
      case 'explain_term':
        userPrompt = `Dựa CHỈ trên từ điển bản địa và dữ liệu trong ứng dụng, hãy giải nghĩa: "${sanitizedContent}". Nếu từ/tục lệ không có trong dữ liệu ứng dụng, hãy trả lời "Ứng dụng chưa có thông tin này." và gợi ý nguồn chính thống.`;
        break;
      case 'canh_hat_etiquette':
        userPrompt = `Dựa CHỈ trên dữ liệu nghi thức và canh hát có trong ứng dụng, hãy trả lời về: "${sanitizedContent}". Nếu không có trong dữ liệu ứng dụng, hãy trả lời "Ứng dụng chưa có thông tin này." và gợi ý nguồn chính thống.`;
        break;
      default:
        userPrompt = `Dựa CHỈ trên dữ liệu có sẵn trong ứng dụng, trả lời câu hỏi: "${sanitizedContent}". ${sanitizedContext ? `Ngữ cảnh bổ sung: ${sanitizedContext}` : ''}`;
        break;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    const resultText = response.text?.trim() || 'Ứng dụng chưa nhận được nội dung phản hồi từ mô hình.';

    return res.json({
      result: resultText,
      mode: typeof mode === 'string' ? mode : 'custom_prompt',
      groundedOnly: true,
    });
  } catch (err: unknown) {
    // Tuyệt đối không in toàn bộ object lỗi hay headers/cấu hình có thể chứa thông tin nhạy cảm
    const status = (err as { status?: number })?.status;
    console.error(`Lỗi gọi dịch vụ Gemini phía máy chủ (mã trạng thái: ${status ?? 'unknown'})`);

    if (status === 400 || status === 403) {
      return res.status(502).json({
        error: 'Khóa cấu hình dịch vụ Gemini trên máy chủ không hợp lệ hoặc đã bị thu hồi. Vui lòng kiểm tra lại trong Settings > Secrets.',
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error: 'Hệ thống đang tạm hết hạn mức truy vấn Gemini. Vui lòng thử lại sau ít phút.',
      });
    }

    return res.status(500).json({
      error: 'Không thể kết nối dịch vụ hỏi đáp di sản lúc này. Vui lòng thử lại sau.',
    });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
}

startServer();
