import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Server-side Gemini AI route for Quan họ heritage analysis
app.post('/api/gemini/analyze-quanho', async (req: Request, res: Response) => {
  try {
    const { mode, content, context } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Nội dung truy vấn không được để trống.' });
    }

    if (!aiClient) {
      // Fallback response if API key is not yet configured in runtime environment
      return res.json({
        result: `[Phản hồi tham chiếu di sản]: Bạn đang tìm hiểu về "${content}". Trong thực hành Quan họ cổ Kinh Bắc và cộng đồng di cư tại Hà Nội, kỹ thuật "Vang - Rền - Nền - Nảy" cùng nghệ thuật hát đối lề lối đòi hỏi sự hòa quyện giữa liền anh và liền chị. Vui lòng cấu hình GEMINI_API_KEY để nhận luận giải chuyên sâu từ mô hình Gemini.`,
        mode,
        isFallback: true,
      });
    }

    const systemInstruction = `
Bạn là Chuyên gia Cố vấn Di sản Dân ca Quan họ vùng văn hóa Châu thổ Bắc Bộ, đồng hành cùng dự án Hồ sơ số Dân ca Quan họ (khảo sát thực địa cộng đồng di cư Bắc Ninh/Bắc Giang tại Hà Nội, cụ thể là CLB Quan họ Cầu Giấy và đối chiếu 49 làng Quan họ cổ Kinh Bắc).
Nguyên tắc ứng xử và học thuật:
1. Giữ giọng của người học hỏi, tôn trọng cộng đồng, không phán xét đúng/sai giữa lối hát làng xã xưa và sinh hoạt CLB đô thị nay.
2. Nắm vững 4 tiêu chuẩn kỹ thuật cổ: "Vang" (âm thanh phóng ra khoáng đạt), "Rền" (rung ngân âm sắc trong vòm họng), "Nền" (bắt nhịp nâng đỡ bè bạn), "Nảy" (hạt ngọc luyến láy tinh tế ở cuống họng).
3. Nắm vững tiến trình một Canh hát truyền thống:
   - Giọng Lề lối (La rằng, Tình tang, Cây trúc xinh, Đương quan đương lội...)
   - Giọng Vặt (hát đối đáp phong phú về tình bạn, tình yêu quê hương)
   - Giọng Giã bạn (Con nhện giăng mùng, Chia rẽ đôi nơi, Người ơi người ở đừng về, Chuông vàng gác cửa tam quan...)
4. Trả lời bằng tiếng Việt chuẩn mực, giàu tính học thuật văn hóa dân gian, trang trọng, giải thích cặn kẽ các từ ngữ cổ và phong tục (miếng trầu cánh phượng, tục kết chạ, anh Hai, chị Hai...).
`;

    let userPrompt = '';
    switch (mode) {
      case 'technique_guidance':
        userPrompt = `Hãy phân tích kỹ thuật xướng âm (Vang, Rền, Nền, Nảy) và cách thể hiện làn điệu cho câu hát/bài hát Quan họ sau: "${content}". Lưu ý bối cảnh hát mộc không nhạc đệm.`;
        break;
      case 'counter_singing':
        userPrompt = `Trong canh hát Quan họ cổ, đối với câu hát/làn điệu sau: "${content}", hãy gợi ý các câu hát đối/bài đối xứng hợp về làn điệu, âm luật và tình ý, kèm theo lời giải thích vì sao hai câu này đối đáp nhau.`;
        break;
      case 'explain_term':
        userPrompt = `Hãy giải nghĩa từ ngữ cổ/phương ngữ hoặc tục lệ Quan họ sau: "${content}". Giải thích ý nghĩa văn hóa, cách dùng trong canh hát và bối cảnh cộng đồng Kinh Bắc cũng như khi truyền dạy ở Hà Nội.`;
        break;
      case 'canh_hat_etiquette':
        userPrompt = `Hãy hướng dẫn nghi thức, quy chuẩn giao tiếp, cách têm trầu cánh phượng, cử chỉ mời trầu và văn hóa ứng xử "chơi Quan họ" xoay quanh tình huống/nội dung: "${content}".`;
        break;
      default:
        userPrompt = `Dựa trên bối cảnh di sản Quan họ tại Hà Nội và Kinh Bắc: ${content}. ${context ? `Bối cảnh bổ sung: ${context}` : ''}`;
        break;
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    const resultText = response.text || 'Không có phản hồi được trả về.';

    return res.json({
      result: resultText,
      mode,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return res.status(500).json({
      error: 'Không thể kết nối dịch vụ cố vấn di sản. Vui lòng thử lại sau.',
      details: error?.message,
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
