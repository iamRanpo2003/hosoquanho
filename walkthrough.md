# Security Summary & Compliance Verification

## 1. Bảo vệ khóa API (API Key Security Audit)

Toàn bộ mã nguồn của ứng dụng đã được rà soát để đảm bảo không có khóa API nào lọt vào kho mã nguồn công khai hoặc tệp chạy trên trình duyệt:

- **Vị trí đọc khóa duy nhất (Server-side only):** `server.ts` đọc khóa `process.env.GEMINI_API_KEY` trực tiếp trên máy chủ Express và khởi tạo `GoogleGenAI` ở phía server. Không có khóa mặc định hoặc khóa cứng trong mã nguồn.
- **Tệp cấu hình môi trường:** `.gitignore` đã loại trừ `.env*` (trừ `!.env.example`). Tệp `.env.example` chỉ chứa giá trị giữ chỗ `"MY_GEMINI_API_KEY"`, không chứa khóa thật.
- **Đóng gói phía trình duyệt (Browser bundle):**
  - `vite.config.ts` không chèn biến môi trường bí mật vào `define` của Vite.
  - `src/` không sử dụng bất kỳ biến `VITE_*` nào chứa bí mật và không import thư viện `@google/genai` (chỉ gọi tới endpoint nội bộ `/api/gemini/analyze-quanho`).
- **Xử lý lỗi & Nhật ký an toàn (Sanitized logging):** `server.ts` không in `process.env.GEMINI_API_KEY` ra màn hình hay nhật ký (`console.log`/`console.error`), đồng thời chỉ ghi log mã trạng thái/thông báo rút gọn nếu gọi API gặp sự cố để tránh lộ header xác thực.
- **Khuyến nghị vận hành:** Nếu từng có khóa bị lộ trước khi triển khai cấu trúc này, cần thu hồi khóa cũ và tạo khóa mới trong mục quản lý **Secrets** của môi trường chạy (không dán khóa vào mã nguồn).

## 2. Xác minh hoạt động và tuân thủ dữ liệu (Verification)

- **Truy cập công khai:** Mở trực tiếp không cần đăng nhập hoặc cửa sổ ẩn danh; không thu thập dữ liệu cá nhân.
- **Giới hạn câu trả lời Gemini:** `server.ts` ghép toàn bộ dữ liệu thực trong ứng dụng (`heritageRecordsData`, `ancientVillagesData`, `researchSourcesData`, `fieldworkJournalData`) vào ngữ cảnh và ràng buộc câu trả lời: nếu thông tin không có trong dữ liệu ứng dụng thì trả về *"Ứng dụng chưa có thông tin này."* kèm gợi ý nguồn chính thống và luôn trích tên nguồn đã dùng.
- **Không dùng ảnh máy sinh:** Toàn bộ ảnh minh họa sinh tự động đã được xóa khỏi `src/assets/images/` và gỡ khỏi dữ liệu bản ghi; các mục thiếu ảnh gốc được ghi nhận trung thực là chưa có ảnh gốc điền dã.
- **Địa danh sau sắp xếp năm 2025:** Sử dụng đơn vị hành chính 2 cấp (Hà Nội và Tỉnh Bắc Ninh sau sáp nhập với Bắc Giang) và giữ nguyên địa danh cũ để đối chiếu.
- **Kiểm tra đơn vị & Trình duyệt:** Chạy kiểm thử đơn vị (`tsx --test`), kiểm tra biên dịch/lint và kiểm tra giao diện thực tế ở chiều rộng 1440px và 360px.
