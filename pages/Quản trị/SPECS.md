# Đặc tả kỹ thuật (SPECS) — Phân hệ Quản trị

> Cập nhật lần cuối: 2026-07-27 | Nhánh: TrinhNNT3

---

## Kiến trúc Component-Based

Phân hệ Quản trị tách thành 3 module độc lập:

| Module | Đường dẫn | Mô tả |
|--------|-----------|-------|
| Quy trình động | `quy-trinh-dong/index.html` | Cấu hình mẫu quy trình xử lý |
| Báo cáo thống kê | `bao-cao-thong-ke/index.html` | Thống kê và biểu đồ chỉ đạo |
| Xử lý chỉ đạo | `xu-ly-chi-dao/index.html` | Xử lý chỉ đạo theo quy trình động |

- **Shared CSS**: `shared/admin-base.css` — layout, sidebar, tokens, top-bar, buttons, toast
- **Shared JS**: `shared/admin-shared.js` — sidebar collapse, toast, confirm dialog
- **Entry redirect**: `admin.html` → `quy-trinh-dong/index.html`

---

## 0. Shell / Sidebar

- Sidebar trái có nút **Thu gọn** (`angles-left`). Khi thu gọn: sidebar ẩn, hiện nút **Mở menu** (`bars`) trên topbar.
- Trạng thái đóng/mở được nhớ trong `localStorage` (`gialai_admin_sidebar_collapsed`).
- 3 nav-item trong nhóm Quản trị: Quy trình động · Báo cáo thống kê · Xử lý chỉ đạo.

---

## 1. Quản trị Quy trình động

### 1.1 Danh sách quy trình
- Tìm kiếm theo mã/tên. Lọc theo Cơ quan, Trạng thái (Bản nháp / Hoạt động) và Phiên bản.
- Chặn xóa quy trình đang **Hoạt động**, cảnh báo bằng popup lỗi.
- Phiên bản tự động tăng khi Phát hành (readonly, không cho sửa tay).

### 1.2 Cấu hình luồng bước (Process Editor)
- Nút **Lưu** (lưu nháp) và **Phát hành** (chuyển sang Hoạt động; mờ khi đã hoạt động).
- Dropdown Cơ quan áp dụng: autocomplete, ghim tìm kiếm sticky đầu, truncate + badge `+N` khi overflow, tooltip đầy đủ khi hover.

### 1.3 UML / Biểu đồ luồng
- Khóa luồng bước khi quy trình **Hoạt động**.
- **Drag & Drop** sắp xếp thứ tự bước (trừ Start/End); tự động cập nhật `parentNodeId` và hành động.
- SVG overlay động: tính toán tọa độ thực tế, vẽ mũi tên rẽ nhánh/quay lui/thẳng theo cấu hình hành động.
- Cấu hình Cơ quan & Người xử lý theo Trạng thái:

| Trạng thái bước | Cơ quan | Người xử lý |
|----------------|---------|-------------|
| `Chờ phân công` | Chọn nhiều cơ quan | Lãnh đạo các cơ quan (mặc định, khóa) |
| `Đang xử lý` | Cơ quan đã phân công (khóa) | Chuyên viên từ dropdown nhóm, hỗ trợ tìm kiếm |
| `Đã có báo cáo` | Cơ quan đã phân công (khóa) | Lãnh đạo cơ quan (khóa) |
| `Chờ phê duyệt / Kết thúc` | Tỉnh Gia Lai (khóa) | Người tạo chỉ đạo từ backend (khóa) |

---

## 2. Báo cáo thống kê chỉ đạo

- **Bộ lọc**: Vai trò (Tỉnh / Sở), Khoảng thời gian (Tuần / Tháng / Quý / Năm / Tùy chọn), Đơn vị.
- **KPI**: Tổng tiếp nhận, Đã hoàn thành (đúng/trễ hạn %), Đang xử lý (trong/quá hạn %), Tỷ lệ yêu cầu làm lại.
- **Biểu đồ tròn** phân bổ trạng thái + **biểu đồ đường** xu hướng tiếp nhận vs hoàn thành.
- **Bảng hiệu suất** theo Sở/Phòng kèm nút xuất Excel / PDF / Word.

---

## 3. Xử lý chỉ đạo

### 3.1 Luồng nghiệp vụ thực tế

```
[Dashboard — Lãnh đạo Tỉnh]
    │  Ban hành chỉ đạo (gắn deadline, văn bản)
    ▼
[Xử lý chỉ đạo — Lãnh đạo Sở (role: leader)]
    │  Tiếp nhận → Chọn mẫu quy trình động → Kích hoạt
    ▼
[Theo quy trình động]
    │  Chuyên viên nhận việc (role: individual)
    │  → Xử lý → Nộp báo cáo
    ▼
    │  Lãnh đạo Sở duyệt nội bộ (role: leader)
    │  → Trình Tỉnh
    ▼
[Lãnh đạo Tỉnh phê duyệt → Hoàn thành]
```

### 3.2 Dữ liệu prototype (giả lập)

Phân hệ cung cấp **3 hồ sơ mẫu** thể hiện đầy đủ các trạng thái:

| Hồ sơ | Stage | Mô tả |
|-------|-------|-------|
| `TEST-01` | `accepted` | Chờ Lãnh đạo Sở chọn quy trình |
| `TEST-02` | `staffProcessing` | Chuyên viên đang xử lý (executionTree đa cấp) |
| `TEST-03` | `sentProvince` | Chờ Tỉnh phê duyệt |

### 3.3 Hiển thị và tương tác

- **Chỉ Danh sách** (Kanban đã bỏ).
- **Lọc**: Trạng thái, Hạn xử lý (date range), Tình trạng (Còn hạn / Sắp đến / Trễ hạn).
- **Quỹ thời gian (SLA)**: Đồng hồ màu. Click mở lịch mốc thời gian.
- **Popup Chi tiết**: Cột trái thông tin + nhật ký; cột phải form xử lý theo vai trò.

### 3.4 Phân vai mô phỏng

| roleSelect | Vai trò | Hành động hiển thị |
|-----------|---------|-------------------|
| `leader` | Lãnh đạo Sở | Phân công quy trình, duyệt nội bộ, trình Tỉnh |
| `department` | Trưởng phòng | Xem tổng quan phòng |
| `individual` | Chuyên viên | Nhận việc, nộp báo cáo |

### 3.5 Liên kết phân hệ

- **Nguồn directives**: `localStorage('gialai_directives')` — đồng bộ từ Dashboard.
- **Nguồn processes**: `localStorage('gialai_processes')` — đồng bộ từ Quy trình động.
