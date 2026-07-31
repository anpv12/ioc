# Báo cáo & Thống kê Chỉ đạo (Quản trị)

## 1. Mục tiêu
Lọc theo kỳ / đơn vị / lãnh đạo → bảng tổng hợp (theo đơn vị hoặc lãnh đạo) → bấm số liệu xem chi tiết → xuất Excel.

## 2. Tệp
- `index.html` — cấu trúc
- `style.css` — style màn
- `js/state.js` — mock data, bộ lọc, aggregate
- `js/ui.js` — UI, render, Excel

---

## 3. Logic chức năng

### 3.1 Bộ lọc
**Kỳ báo cáo:** Từ ngày–Đến ngày | Ngày hiện tại | Tuần | **Tháng (mặc định)** | Quý | Năm  
- Đổi kỳ → tự điền Tháng/Tuần/Quý + Năm theo hiện tại, tính Từ/Đến ngày.  
- Ẩn ô Tháng/Tuần/Quý + Năm khi chọn “Từ ngày–Đến ngày” hoặc “Ngày hiện tại”.  
- “Ngày hiện tại” → khóa 2 ô ngày.  
- Giá trị Tuần/Tháng/Quý đã chọn không bị ghi đè về mặc định khi mở lại.

**Từ ngày / Đến ngày:** Flatpickr (vi), `dd/mm/yyyy`. Kỳ sẵn có ghi đè; “Từ–Đến” chọn thủ công, bấm **Lọc** mới áp dụng.

**Đơn vị / Lãnh đạo:** Multiselect (checkbox + tìm kiếm, không phân biệt hoa thường, chuẩn hóa tiếng Việt).  
- Tab Theo đơn vị → chỉ Đơn vị; Theo lãnh đạo → chỉ Lãnh đạo; chi tiết → cả hai.  
- Nút: chưa chọn → `Tất cả …`; 1 mục → tên; nhiều → `Đã chọn N mục`.  
- “Chọn tất cả” chỉ tác động checkbox dữ liệu (không tính ô tìm).

| Nút | Hành vi |
|-----|---------|
| Lọc | Áp dụng khoảng ngày, trang 1, render |
| Đặt lại | Kỳ=Tháng hiện tại, bỏ chọn ĐV/LĐ, trang 1 |

### 3.2 Tab
Chỉ hiện khi view thống kê. Đổi tab → trang 1, render theo chiều tương ứng.

### 3.3 Bảng thống kê
Cột: **STT | Tên ĐV/LĐ | Tổng nhận | Đúng hạn | Trễ hạn | Còn hạn | Quá hạn**  
Header 2 tầng: nhóm **Đã xử lý** (Đúng/Trễ hạn) + **Đang xử lý** (Còn/Quá hạn).

| Cột | Điều kiện |
|-----|-----------|
| Tổng nhận | Mọi chỉ đạo thỏa lọc |
| Đúng hạn | Đã kết thúc ∧ Đúng hạn |
| Trễ hạn | Đã kết thúc ∧ Quá hạn |
| Còn hạn | ≠ Đã kết thúc ∧ Đúng hạn |
| Quá hạn | ≠ Đã kết thúc ∧ Quá hạn |

- Nhóm theo `unit` hoặc `assigner`. Ô số = nút drill-down.  
- Sort mặc định: Tổng nhận ↓. Click header đổi tăng/giảm.

### 3.4 Chi tiết (drill-down)
Bấm ô số → lọc đúng ĐV/LĐ + metric → bảng chi tiết, sort Ngày ban hành ↓, trang 1.  
Cột: **STT | Mã | Nội dung | Đơn vị | Người giao | Người xử lý | Ngày BH | Hạn XL | Trạng thái | Đúng/Quá hạn**  
**Quay lại** → khôi phục filter trước drill-down, sort Tổng nhận ↓, trang 1.

### 3.5 Phân trang
10 / 20 / 50 dòng (mặc định 10). Đổi size hoặc sort → trang 1.  
Text: `Hiển thị a–b trong tổng số N bản ghi`.

### 3.6 Xuất Excel
Dòng 1: tiêu đề (merge). Dòng 2: Từ–Đến ngày (merge). Từ dòng 3: data theo view.  
File: `thong-ke-chi-dao.xlsx` | `bao-cao-chi-tiet-chi-dao.xlsx`.

### 3.7 Dữ liệu
**Trạng thái:** Chờ phân công | Đang xử lý | Đã có báo cáo | Chờ phê duyệt | Đã kết thúc  
**Đúng/Quá hạn:** Đúng hạn | Quá hạn  
Mock: 40 chỉ đạo (4–7/2026). Nối API chỉ thay nguồn, giữ cách đếm cột.

---

## 4. Màu & kích thước

| Mã | Dùng |
|----|------|
| `#0284c7` | Primary: nút Lọc/Xuất, tab active, ô số, trang active, ngày chọn, focus viền ô lọc |
| `#dbeafe` | Hover ô số liệu / ô bảng (chữ giữ `#0284c7` / `#334155`) |
| `#f0f9ff` | Header bảng, hover hàng, hover item menu, soft primary |
| `#fff` | Nền panel, input, nút phụ, menu |
| `#e2e8f0` / `#cbd5e1` | Viền panel / ô lọc / bảng / menu |
| `#1e293b` / `#334155` | Chữ chính |
| `#64748b` / `#94a3b8` | Chữ phụ, icon, placeholder, empty |
| `#f8fafc` | Hàng chẵn chi tiết; nền ô disabled |

### Style chung ô lọc
Áp dụng thống nhất cho: period-picker, input ngày, multiselect trigger, select (nếu có).

| Trạng thái | Style |
|------------|--------|
| Mặc định | Cao 40px, radius 6px, border `#cbd5e1`, nền `#fff`, chữ `#334155`, font 12px, pad ngang 10px |
| Hover / Focus / Mở | Viền `#0284c7`, không box-shadow |
| Disabled | Nền `#f8fafc`, chữ `#64748b`, cursor not-allowed |
| Placeholder | `#94a3b8`, font 12px, weight 400 |
| Label nhóm lọc | `#334155`, font 12px, weight 500 |

**Menu dropdown** (period / multiselect / panel tháng Flatpickr):  
border `#cbd5e1`, radius 6px, nền `#fff`, shadow `0 6px 16px rgb(15 23 42 / 12%)`, pad 6px; item cao ~32px, pad ngang 8px, font 12px `#334155`; hover nền `#f0f9ff` chữ `#0284c7`; mở/đóng fade + slide 160ms.

**Nút lọc:** Lọc / Xuất — nền + viền `#0284c7`, chữ trắng, cao 30px. Đặt lại / phụ — nền `#fff`, viền `#cbd5e1`, chữ `#334155`, cao 30px.

### Bảng & khác

| Thành phần | Size |
|------------|------|
| Ô body bảng | cao 35px, pad 2×6, font 12px |
| Header thống kê (merge) | cao 26–28px, font 11px, pad 1×4 |
| Cột STT | 42px, center |
| Cột tên ĐV/LĐ (thống kê) | 18% |
| Cột Mã chỉ đạo (chi tiết) | 120px cố định |
| Nội dung (chi tiết) | min 340px, nowrap; bảng min 1550px |
| Empty | `Không có dữ liệu phù hợp.` `#64748b` |
| Placeholder ngày / search | `dd/mm/yyyy` · `Tìm kiếm...` |

### Header đúng/trễ hạn (chỉ header, số liệu giữ primary)
- **Đúng hạn**, **Còn hạn**: nền `#ecfdf5`, chữ `#047857`, gạch dưới `#10b981`.  
- **Trễ hạn**, **Quá hạn**: nền `#fef2f2`, chữ `#b91c1c`, gạch dưới `#f87171`.  
- Ô số liệu: đồng màu primary `#0284c7` (không tô xanh/đỏ từng số).

### Flatpickr
- Calendar: border `#cbd5e1`, radius 6px, font 12px, shadow như menu app.  
- Header tháng / năm: cùng size (cao 28px), font 12px weight 500, màu `#334155`, **không border**, nền trong suốt; hover nền `#f0f9ff` chữ `#0284c7`. Chọn tháng bằng dropdown mặc định (vẫn chọn được).  
- Ngày chọn: nền `#0284c7`; hover ngày: `#f0f9ff`.
