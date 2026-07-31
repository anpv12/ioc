# SPECS — Báo cáo & Thống kê Chỉ đạo (Quản trị)

> Prototype UI — chưa nối backend. Dữ liệu mock trong `js/state.js`.

---

## 1. Mục tiêu

Màn quản trị cho phép:

- Lọc chỉ đạo theo kỳ thời gian, đơn vị, lãnh đạo Tỉnh
- Xem thống kê tổng hợp theo **đơn vị** hoặc **lãnh đạo Tỉnh**
- Drill-down từ ô số liệu → danh sách chỉ đạo chi tiết
- Xuất Excel (thống kê hoặc chi tiết)

---

## 2. Cấu trúc trang

```
Topbar (shared admin)
Breadcrumb + tiêu đề trang
└─ report-container
   ├─ report-filter-panel     ← Bộ lọc
   └─ report-table-section    ← Tabs + bảng + phân trang
Footer
Toast thông báo
```

**Layout chính**

| Thành phần | Chi tiết |
|------------|----------|
| Container | `display: flex; flex-direction: column; gap: 8px` |
| Panel / Section | Nền trắng, border `1px solid #e2e8f0`, radius `8px`, shadow nhẹ |
| Padding header panel | `10px 12px` |
| Padding nội dung filter | `10px 12px` |

---

## 3. Bộ lọc thống kê

### 3.1 Hàng thời gian (5 cột grid)

| Control | Mô tả |
|---------|--------|
| **Kỳ báo cáo** | Select: Từ ngày–Đến ngày / Ngày hiện tại / Tuần / Tháng (mặc định) / Quý / Năm |
| **Tháng / Tuần / Quý** | Period-picker (input + nút chevron). Ẩn khi chọn “Từ ngày–Đến ngày” hoặc “Ngày hiện tại” |
| **Năm** | Period-picker năm. Ẩn khi kỳ = rỗng hoặc “today” |
| **Từ ngày** | Flatpickr, format hiển thị `dd/mm/yyyy`, value ISO `Y-m-d` |
| **Đến ngày** | Flatpickr, cùng format |

**Logic kỳ**

- Đổi kỳ → tự set `periodValue` / `periodYear` theo ngày hiện tại → tính `fromDate` / `toDate` → cập nhật 2 datepicker.
- Chọn “Từ ngày – Đến ngày” → không tự ghi đè; user chọn thủ công rồi bấm **Lọc**.

### 3.2 Đơn vị / Lãnh đạo

- **Theo đơn vị** (tab unit): hiện multiselect Đơn vị, ẩn Lãnh đạo.
- **Theo lãnh đạo Tỉnh** (tab leader): hiện multiselect Lãnh đạo, ẩn Đơn vị.
- Ở view chi tiết (drill-down): hiện cả hai (nếu có).

**Multiselect**

- Trigger: text “Tất cả …” hoặc “Đã chọn N mục” / tên 1 mục.
- Menu: ô tìm kiếm + “Chọn tất cả” + danh sách checkbox.
- Tìm kiếm lọc theo `toLocaleLowerCase('vi')`.

### 3.3 Nút hành động

| Nút | Style |
|-----|--------|
| **Lọc** | Primary xanh `#0284c7`, chữ trắng, icon filter |
| **Đặt lại** | Border `#cbd5e1`, nền trắng, chữ `#334155`, icon rotate |

Reset: kỳ = Tháng, tháng/năm hiện tại, xóa chọn đơn vị/lãnh đạo, page = 1.

---

## 4. Khu vực bảng

### 4.1 Toolbar

- Tiêu đề + mô tả ngắn (thay đổi theo view).
- Nút **Quay lại thống kê** (ẩn khi đang ở thống kê).
- Nút **Xuất Excel** (primary).

### 4.2 Tabs thống kê

Hai tab: **Theo đơn vị** | **Theo lãnh đạo Tỉnh**.

- Chỉ hiện khi `viewMode = statistics`.
- Tab active: nền + border `#0284c7`, chữ trắng.
- Tab thường: border `#cbd5e1`, nền trắng, chữ `#334155`.

### 4.3 Bảng thống kê (`is-statistics`)

| Cột | Key | Ghi chú |
|-----|-----|---------|
| STT | — | Không sort |
| Tên đơn vị / Lãnh đạo Tỉnh | `dimension` | Sort được |
| Tổng nhận | `total` | Metric link |
| Đã xử lý (Đúng hạn) | `on_time_completed` | Metric link |
| Đã xử lý (Trễ hạn) | `overdue_completed` | Metric link |
| Đang xử lý (Còn hạn) | `on_time_not_completed` | Metric link |
| Đang xử lý (Quá hạn) | `overdue_not_completed` | Metric link |

- Mỗi ô số là nút `.metric-link` → drill-down.
- Sort mặc định: `total` desc.
- Header sort: icon `fa-sort` / `fa-sort-up` / `fa-sort-down`.

### 4.4 Bảng chi tiết (`is-detail`)

| Cột |
|-----|
| STT, Mã chỉ đạo, Nội dung, Đơn vị, Người giao, Người xử lý, Ngày ban hành, Hạn xử lý, Trạng thái, Đúng/Quá hạn |

- `table-layout: auto`, `min-width: 1550px`, horizontal scroll.
- Sort mặc định khi drill: `issueDate` desc.
- Ngày hiển thị `dd/mm/yyyy`.

### 4.5 Phân trang

- Info: “Hiển thị a–b trong tổng số N bản ghi”.
- Page size: 10 / 20 / 50.
- Nút trang: active nền `#0284c7` chữ trắng.

---

## 5. Logic dữ liệu

### Nguồn

`ReportState.mockDirectives` — 40 bản ghi mock (tháng 4–7/2026).

### Lọc

`getFilteredDirectives(filters)`:

- Thời gian theo `issueDate` ∈ `[fromDate, toDate]`
- `statuses` (hiện không expose UI)
- `units` / `leaders` (multiselect)

### Aggregate

`aggregateStats(rows, groupByKey)` với `groupByKey = 'unit' | 'assigner'`:

- `total`
- `on_time_completed` = Đã kết thúc + Đúng hạn
- `overdue_completed` = Đã kết thúc + Quá hạn
- `on_time_not_completed` = Chưa kết thúc + Đúng hạn
- `overdue_not_completed` = Chưa kết thúc + Quá hạn

### Drill-down

1. Click metric → lưu `drillDown { dimension, metric, groupBy, baseFilters }`
2. Gán filter đơn vị/lãnh đạo = dimension
3. `viewMode = 'detail'`
4. Back → khôi phục `baseFilters`, về statistics

### Xuất Excel

- Sheet “Báo cáo”, merge 2 dòng tiêu đề + khoảng thời gian.
- Tên file: `thong-ke-chi-dao.xlsx` hoặc `bao-cao-chi-tiet-chi-dao.xlsx`.

---

## 6. Design tokens & style UI

Trang dùng **admin design system** (xanh dương), không dùng token Dashboard (pink).

### Màu chính

| Token / giá trị | Dùng cho |
|-----------------|----------|
| `#0284c7` (`--admin-primary`) | Nút primary, tab active, metric link, border active |
| `#0369a1` (`--admin-primary-dark`) | Hover metric link |
| `#f0f9ff` (`--admin-primary-soft`) | Header bảng, hover row, hover option period |
| `#fff` | Nền panel, input, nút secondary |
| `#e2e8f0` / `#cbd5e1` (`--admin-line`) | Border panel, input, bảng, divider |
| `#1e293b` / `#334155` (`--admin-text`) | Tiêu đề, chữ chính |
| `#64748b` / `#94a3b8` (`--admin-muted`) | Mô tả, icon, placeholder phụ |
| `#f8fafc` (`--admin-surface`) | Hàng chẵn bảng chi tiết |

### Kích thước

| Thành phần | Giá trị |
|------------|---------|
| Input / select / multiselect trigger | `height: 40px`, border-radius `6px` |
| Nút (Lọc, Reset, Export, Tab, …) | `height: 30px`, radius `6px`, font `12px` |
| Ô bảng | `height: 35px`, padding `2px 6px` |
| Cột STT | `width: 42px`, căn giữa |
| Period-picker toggle | `36×38px` |
| Pagination button | `min 26×26px` |
| Multiselect menu max-height | `208px` |
| Period menu max-height | `190px` |

### Typography

- Font inherit từ admin base (hệ thống admin).
- Cỡ chữ chính: `--admin-fs-xs` ≈ **12px** (label filter, ô bảng, nút).
- Tiêu đề bảng: `--admin-fs-md` ≈ **16px**, weight 600.
- Label filter: 12px, weight 500.

### Border & radius

- Panel: `1px solid #e2e8f0`, radius `8px`.
- Input/button/menu: `1px solid #cbd5e1`, radius `6px`.
- Bảng: border ô phải + dưới `#e2e8f0`; header nền `#f0f9ff`.

### Hover / Active / Focus

| Element | Hành vi |
|---------|---------|
| `.metric-link` | Hover: nền trắng, màu `#0369a1`, `translateY(-1px)` |
| `.statistics-row` / `.detail-row` | Hover hàng: nền `#f0f9ff` |
| Tab / pagination active | Nền + border `#0284c7`, chữ trắng |
| Period / multiselect option | Hover: nền `#f0f9ff`, chữ `#0284c7` |
| Nút primary | Giữ màu primary (không đổi nền khi hover trong CSS hiện tại) |

### Placeholder

- Datepicker: `dd/mm/yyyy` (readonly + Flatpickr altInput).
- Multiselect search: `Tìm kiếm...`.
- Period input: không placeholder cố định; giá trị dạng `Tháng 7`, `Tuần 12`, năm số.

### Empty state

Một hàng: “Không có dữ liệu phù hợp.” — chữ muted, căn giữa.

---

## 7. File & phụ thuộc

| File | Vai trò |
|------|---------|
| `index.html` | Cấu trúc DOM |
| `style.css` | Style riêng màn báo cáo |
| `js/state.js` | Mock data + `ReportState` / `ReportData` |
| `js/ui.js` | Init, filter, render, drill-down, export |
| `../shared/admin-base.css` | Base admin |
| `../shared/admin-shared.js` | Shared admin |
| Flatpickr + locale `vn` | Datepicker |
| SheetJS (`xlsx`) | Xuất Excel |
| Font Awesome 6.5.1 | Icon |

---

## 8. Trạng thái chỉ đạo (mock)

`Chờ phân công` | `Đang xử lý` | `Đã có báo cáo` | `Chờ phê duyệt` | `Đã kết thúc`

`onTimeStatus`: `Đúng hạn` | `Quá hạn`

---

## 9. Responsive

`@media (max-width: 700px)`:

- Filter grid → 1 cột.
- Toolbar / pagination xếp dọc.
- Nút Export / Back full width flex.
