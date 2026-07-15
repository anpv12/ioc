# System Design — Dashboard Phân tích Tình hình Dân cư Tỉnh Gia Lai

## Mục tiêu nghiệp vụ
Cung cấp cho lãnh đạo tỉnh Gia Lai một hệ thống trực quan hóa số liệu dân cư theo thời gian thực, hỗ trợ:
- Theo dõi biến động dân số theo nhiều chiều phân tích
- Ra chỉ đạo trực tiếp trên từng chỉ số cần xử lý
- Giám sát tiến độ xử lý từ chuyên viên và xem kết quả phản hồi

---

## Vai trò người dùng

| Vai trò     | Mô tả                                                                 |
|-------------|-----------------------------------------------------------------------|
| **Lãnh đạo**   | Xem dashboard, tạo chỉ đạo trên từng chỉ số, theo dõi kết quả      |
| **Chuyên viên** | Nhận chỉ đạo, cập nhật trạng thái xử lý và nội dung báo cáo       |

---

## Luồng nghiệp vụ chính

### Luồng Chỉ đạo — Báo cáo — Giám sát
```
Lãnh đạo
  └─ Xem dashboard → phát hiện chỉ số bất thường
       └─ Mở Bảng chỉ đạo → chọn chỉ số → nhập nội dung → đặt thời hạn → Lưu

Chuyên viên
  └─ Vào Quản trị chỉ đạo → xem danh sách chỉ đạo
       └─ Chọn chỉ đạo → cập nhật trạng thái + báo cáo tiến độ → Lưu

Lãnh đạo
  └─ Quay lại dashboard → các chỉ số có chỉ đạo hiển thị trạng thái rõ ràng
```

---

## Tính năng

### 1. Dashboard tổng quan
- Hiển thị các chỉ số dân cư theo bộ lọc Năm / Tháng
- Biểu đồ Top 5 địa phương nhân khẩu cao nhất và thấp nhất
- Bản đồ choropleth phân bố dân cư theo đơn vị hành chính

### 2. Bảng chỉ đạo (Event Panel)
- Lãnh đạo tạo chỉ đạo trực tiếp trên dashboard
- Chọn chỉ số cụ thể để gắn chỉ đạo (không phải hàng dữ liệu)
- Các chỉ số đang có chỉ đạo hiển thị dấu hiệu nhận biết trực quan (màu viền + icon cờ)
- Danh sách chỉ đạo có trạng thái: **Chưa xử lý / Đang xử lý / Đã hoàn thành**

### 3. Quản trị chỉ đạo (Admin Panel)
- Chuyên viên xem toàn bộ danh sách chỉ đạo
- Cập nhật trạng thái xử lý
- Nhập báo cáo tiến độ / kết quả
- Lãnh đạo xem kết quả báo cáo trực tiếp trên dashboard

---

## Danh sách màn hình

| Mã   | Tên màn hình                        | Trạng thái    |
|------|-------------------------------------|---------------|
| p01  | Tình hình dân cư theo giới tính     | ✅ Hoàn thành |
| p02  | Tình hình dân cư theo độ tuổi       | 📋 Chưa làm   |
| p03  | Tình hình dân cư theo mức sinh      | 📋 Chưa làm   |
| p04  | Tình hình dân cư theo dân tộc       | 📋 Chưa làm   |
| p05  | Tình hình dân cư theo tôn giáo      | 📋 Chưa làm   |
| p06  | Tình hình tham gia Bảo hiểm         | 📋 Chưa làm   |

---

## Nguồn dữ liệu
Cục Cảnh sát quản lý hành chính về trật tự xã hội — **C06**

---

## Quy trình thiết kế

> Bất kỳ ai (người hoặc AI) trước khi thiết kế một màn hình mới đều phải đọc theo thứ tự sau:

1. **`system_design.md`** — hiểu nghiệp vụ, vai trò, luồng, tính năng
2. **Phần Design System bên dưới** — nắm chuẩn chung về màu, font, spacing
3. **`pages/pXX/SPECS.md`** của màn hình cần làm — yêu cầu riêng
4. **Tham chiếu `pages/p01`** như màn hình mẫu đã hoàn chỉnh

**Nguyên tắc bắt buộc:**
- Không hardcode giá trị màu, font-size, spacing — luôn dùng token
- Mỗi màn hình phải nhất quán về khoảng cách, kiểu chữ, màu sắc với các màn hình khác
- Mọi thay đổi chuẩn chung phải cập nhật vào tài liệu này

---

## Design System

### Layout
- Stage: `1920 × 929px`, tất cả card dùng `position: absolute`
- Tabbar: cao `49px`, cố định ở bottom
- Header: cao `85px`, cố định ở top

### Typography — chỉ dùng token, không hardcode px

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--fs-xs` | 12px | Metadata, nhãn phụ |
| `--fs-sm` | 14px | Label, text trong form, item list |
| `--fs-md` | 16px | Body text mặc định |
| `--fs-lg` | 18px | Tiêu đề nhỏ, filter label |
| `--fs-xl` | 20px | Tên chỉ số trên card |
| `--fs-2xl` | 24px | Tiêu đề section, chart header |
| `--fs-3xl` | 28px | Số liệu lớn trên card |
| `--fs-4xl` | 32px | Số liệu nổi bật nhất |

Font: `'Roboto', Helvetica, Arial, sans-serif` — token `--font-family`

### Màu sắc — chỉ dùng token, không hardcode hex

| Token | Dùng cho |
|-------|----------|
| `--pink` | Border card, button chính, gradient header |
| `--magenta` | Tiêu đề nhấn, số liệu quan trọng |
| `--blue` | Số liệu nam, biểu đồ xanh |
| `--salmon` | Số liệu nữ, biểu đồ hồng |
| `--text-dark` | Văn bản chính |
| `--text-muted` | Văn bản phụ, placeholder |
| `--status-pending-*` | Trạng thái chưa xử lý (cam) |
| `--status-processing-*` | Trạng thái đang xử lý (xanh dương) |
| `--status-completed-*` | Trạng thái hoàn thành (xanh lá) |

### Spacing
- Padding card: tối đa `10px` (đơn) hoặc `5px 10px`
- Không tự thêm `margin-top / margin-bottom` quá `10px`
- Gap giữa các element: `6px` (nhỏ), `10px` (vừa), `14px` (lớn)
