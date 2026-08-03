# Báo cáo & Thống kê Chỉ đạo (Quản trị)

## 1. Mục tiêu
Lọc theo khoảng ngày tạo / đơn vị / lãnh đạo → bảng tổng hợp → bấm số liệu xem chi tiết (báo cáo) → xuất Excel.

Prototype UI (mock JS), chưa nối backend.

## 2. Tệp
- `index.html` — cấu trúc
- `style.css` — style màn
- `js/state.js` — mock data (80 đơn vị, ~244 chỉ đạo: tháng 7 = 50 dòng, tháng 8 = 100 dòng), aggregate
- `js/ui.js` — UI, autocomplete, render bảng, xuất Excel

Phụ thuộc shared (không sửa trong màn này): `../shared/admin-base.css`, `../shared/admin-shared.js`  
CDN: Font Awesome 6.5, Flatpickr (+ locale vi), xlsx-js-style.

---

## 3. Logic chức năng

### 3.0 User Flow
1. Vào màn → view **Thống kê**, filter mặc định tháng hiện tại, tab Theo đơn vị.
2. Đổi tab / chỉnh filter → Lọc → bảng thống kê (sort Tổng nhận DESC).
3. Bấm ô số → **drill-down** sang Báo cáo chi tiết (filter dimension + metric; cột theo metric).
4. Ở chi tiết: lọc thêm / phân trang / Xuất Excel.
5. Quay lại thống kê → restore filter trước khi drill-down.

Báo cáo chi tiết **chỉ** vào được qua drill-down (không có entry khác).

### 3.1 Bộ lọc
**Từ ngày tạo chỉ đạo / Đến ngày tạo chỉ đạo:** Flatpickr (vi), `dd/mm/yyyy` — theo `issueDate`. Mặc định: đầu → cuối tháng hiện tại.

**Autocomplete** (Đơn vị, Lãnh đạo/Người giao, Trạng thái, Người thực hiện, Tình trạng):
- Gõ tìm trên ô input (normalize bỏ dấu).
- Checkbox + "Chọn tất cả" chỉ áp dụng mục đang hiện.
- Label: chưa chọn **hoặc chọn hết** → placeholder `Tất cả …`; 1 mục → tên; nhiều (chưa hết) → `Đã chọn N mục`.

**Thứ tự:** Ngày tạo (1) → Đơn vị (2) → Người giao (3) → Người thực hiện (4) → Trạng thái (5) → Tình trạng (6).

**Báo cáo chi tiết chỉ vào được qua drill-down** (bấm 1 ô số ở bảng Thống kê) — không có đường vào trực tiếp khác. Vì vậy filter/cột phụ thuộc đúng 1 chỉ số đang xem:

| View | Filter hiện |
|---|---|
| Thống kê – Theo đơn vị | Đơn vị |
| Thống kê – Theo lãnh đạo | Lãnh đạo Tỉnh |
| Báo cáo chi tiết (mọi chỉ số) | Đơn vị, Người giao, Người thực hiện, Trạng thái |
| Báo cáo chi tiết – chỉ số **Tổng chỉ đạo** | + **Tình trạng** |
| Báo cáo chi tiết – 4 chỉ số còn lại (Đúng hạn/Trễ hạn/Còn hạn/Quá hạn) | không có Tình trạng (đã cố định theo chỉ số đang xem) |

**Không có filter riêng cho:** Hạn xử lý, Ngày hoàn thành, Số ngày trễ hạn, Số ngày quá hạn — 4 field này chỉ tồn tại dưới dạng **cột** ở Báo cáo chi tiết (mục 3.4), không có ô lọc tương ứng.

**Tình trạng** (derive từ `status` + `onTimeStatus`, không lưu riêng):

| Key | Điều kiện | Nhãn |
|-----|-----------|------|
| `on_time_completed` | Đã kết thúc ∧ Đúng hạn | Đã xử lý đúng hạn |
| `overdue_completed` | Đã kết thúc ∧ Quá hạn | Đã xử lý trễ hạn |
| `on_time_not_completed` | Chưa kết thúc ∧ Đúng hạn | Đang xử lý còn hạn |
| `overdue_not_completed` | Chưa kết thúc ∧ Quá hạn | Đang xử lý quá hạn |

| Nút | Hành vi |
|---|---|
| Lọc | Áp dụng filter, trang 1 |
| Đặt lại | Về tháng hiện tại, xóa filter, trang 1 |

**Drill-down:** lưu filter hiện tại (`baseFilters`), gán dimension (unit/leader), gán `situations = [metric]` nếu metric ≠ `total`.  
**Quay lại thống kê:** restore `baseFilters`, xóa drill-down.

### 3.2 Tab thống kê
Chỉ hiện ở view Thống kê (Theo đơn vị / Theo lãnh đạo Tỉnh). Đổi tab → trang 1.

### 3.3 Bảng thống kê
Cột: **STT | Tên ĐV/LĐ | Tổng nhận | Đúng hạn | Trễ hạn | Còn hạn | Quá hạn**  
Header 2 tầng: **Đã xử lý** (Đúng hạn, Trễ hạn) | **Đang xử lý** (Còn hạn, Quá hạn). Sort mặc định: Tổng nhận DESC. Ô số = drill-down sang báo cáo chi tiết.

### 3.4 Bảng báo cáo chi tiết
Cột đầy đủ: **STT | Nội dung | Đơn vị | Người giao | Người thực hiện | Ngày tạo chỉ đạo | Hạn xử lý | Ngày hoàn thành | Số ngày trễ hạn | Số ngày quá hạn | Trạng thái | Tình trạng**

Không phải cột nào cũng luôn hiện — **ẩn/hiện đúng theo 1 chỉ số đang drill-down** (matrix bắt buộc tuân thủ):

| Chỉ số drill-down | Ngày hoàn thành | Số ngày trễ hạn | Số ngày quá hạn | Tình trạng |
|---|:---:|:---:|:---:|:---:|
| Tổng chỉ đạo | Hiện | Ẩn | Ẩn | Hiện |
| Đúng hạn (đã xử lý) | Hiện | Ẩn | Ẩn | Ẩn |
| Trễ hạn (đã xử lý) | Hiện | Hiện | Ẩn | Ẩn |
| Còn hạn (đang xử lý) | Ẩn | Ẩn | Ẩn | Ẩn |
| Quá hạn (đang xử lý) | Ẩn | Ẩn | Hiện | Ẩn |

(STT, Nội dung, Đơn vị, Người giao, Người thực hiện, Ngày tạo chỉ đạo, Hạn xử lý, Trạng thái: luôn hiện ở mọi chỉ số.)

**Căn lề bảng chi tiết:**
- Header (`<th>`): **luôn căn giữa** mọi cột.
- Nội dung (`<td>`):
  - **Căn giữa:** STT, Ngày tạo chỉ đạo, Hạn xử lý, Ngày hoàn thành, Số ngày trễ hạn, Số ngày quá hạn.
  - **Căn trái:** Nội dung, Đơn vị, Người giao, Người thực hiện, Trạng thái, Tình trạng.

- Sort mặc định: Ngày tạo mới nhất trước (`issueDate` DESC).
- "Số ngày trễ hạn" / "Số ngày quá hạn": tô đỏ text (`#dc2626`).
- Công thức:
  - Số ngày trễ hạn = Ngày hoàn thành − Hạn xử lý (đã hoàn thành nhưng trễ; chỉ giá trị > 0).
  - Số ngày quá hạn = Ngày hiện tại − Hạn xử lý (chưa hoàn thành và đã quá hạn; chỉ giá trị > 0).
  - Không áp dụng → `—`.
- Nhãn cột Tình trạng dùng chung 1 nguồn với filter "Tình trạng".
- Độ rộng cột theo trọng số riêng từng cột qua `<colgroup>` sinh động (không chia đều, không dùng `nth-child` vì số cột đổi theo chỉ số drill-down).

### 3.5 Phân trang
10 / 20 / 50 (mặc định 10).

### 3.6 Xuất Excel
Đồng bộ tuyệt đối với bảng đang hiển thị (cùng 1 nguồn cột — xem mục 3.4).
- Dòng 1: tiêu đề merge, in đậm, nền `#BAE6FD`
- Dòng 2: Từ/Đến ngày tạo, nền `#E0F2FE`
- Header: chữ trắng, nền `#0284C7`
- Data: xen kẽ `#F0F9FF` / trắng; **không wrap**; cột auto width theo nội dung
- File: `thong-ke-chi-dao.xlsx` | `bao-cao-chi-tiet-chi-dao.xlsx`

### 3.7 Dữ liệu
Mock: ~244 chỉ đạo (tháng **7/2026: 50 dòng**, tháng **8/2026: 100 dòng**); **80 đơn vị** tên thực tế.  
**status (5):** Chờ phân công | Đang xử lý | Đã có báo cáo | Chờ phê duyệt | Đã kết thúc.  
**Field chính:** `issueDate`, `unit`, `assigner`, `assignee`, `status`, `onTimeStatus` (`Đúng hạn`|`Quá hạn`), `dueDate`, `completedDate`, `title`.

**Metrics:** `total` | `on_time_completed` | `overdue_completed` | `on_time_not_completed` | `overdue_not_completed`

---

## 4. Mã màu

| Mã | Dùng |
|---|---|
| `#0284c7` | Primary: nút, tab, ô số, focus, Excel header |
| `#f1f5f9` | Header bảng |
| `#e0f2fe` | Hover ô; hover nút Đặt lại |
| `#f8fafc` | Hover dòng |
| `#fff` / `#cbd5e1` | Nền / viền |
| `#334155` | Chữ chính |
| `#dc2626` | Chữ đỏ — cột Số ngày trễ hạn / Số ngày quá hạn |
| `#047857` + `#10b981` | Header nhóm "Đã xử lý": Đúng hạn / Trễ hạn (bảng Thống kê) |
| `#b91c1c` + `#f87171` | Header nhóm "Đang xử lý": Còn hạn / Quá hạn (bảng Thống kê) |

## 5. Căn chỉnh trang (layout)

### Font
- `--admin-fs-xs` → **12px** (ô lọc, bảng, menu, calendar)
- Tiêu đề bảng: 16px; header thống kê: 11px; phân trang: 11px

### Ô lọc / Autocomplete
- **Kích thước ô:** cao **40px**, radius 6px, border `#cbd5e1`, font 12px.
- Menu: max-height 280px, max-width `min(420px, calc(100vw - 48px))`.
- Layout: CSS Grid 6 cột, gap cố định; Đơn vị `span 2` (= 2 ô + gap). Responsive: 2 cột ≤900px, 1 cột ≤700px.

### Bảng
- `table-layout: fixed`, border cột đầy đủ, nội dung wrap trên UI.
- Bảng Thống kê: giữ nguyên độ rộng cố định theo `nth-child` (số cột luôn cố định).
- Bảng chi tiết: độ rộng cột theo trọng số riêng qua `<colgroup>` sinh động (không dùng `nth-child` vì số cột đổi theo chỉ số drill-down).
- **Căn lề bảng chi tiết:** header luôn căn giữa; ô nội dung text căn trái; ô STT / ngày tháng / số ngày căn giữa (chi tiết mục 3.4).

### Ghi chú BE
Sort thống kê: Tổng nhận DESC. Chi tiết: `issueDate` DESC. Lọc thời gian theo **ngày tạo**. Công thức Số ngày trễ hạn / Số ngày quá hạn tính như mục 3.4.  
Khi nối API: thay `mockDirectives`, `getFilteredDirectives`, `aggregateStats`; đồng bộ format ngày `Y-m-d`.