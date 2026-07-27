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

- **Shared CSS**: `shared/admin-base.css`
- **Shared JS**: `shared/admin-shared.js` — sidebar inject, collapse, toast, confirm
- **Sidebar**: inject từ `ADMIN_SIDEBAR_HTML` trong `admin-shared.js` (single source of truth)
- **Entry redirect**: `admin.html` → `quy-trinh-dong/index.html`

---

## 0. Shell / Sidebar

- Sidebar trái inject bằng JS (`loadSharedLayout(navId)`), không hardcode trong HTML.
- Nút **Thu gọn** (`angles-left`). Khi thu gọn: sidebar ẩn, hiện nút **Mở menu** (`bars`) trên topbar.
- Trạng thái đóng/mở nhớ trong `localStorage('gialai_admin_sidebar_collapsed')`.
- 3 nav-item: Quy trình động · Báo cáo thống kê · Xử lý chỉ đạo.

---

## 1. Quản trị Quy trình động

### 1.1 Danh sách quy trình
- Tìm kiếm theo mã/tên. Lọc theo Cơ quan, Trạng thái (Bản nháp / Hoạt động) và Phiên bản.
- Chặn xóa quy trình đang **Hoạt động**, cảnh báo bằng popup lỗi.

### 1.2 Cấu hình luồng bước
- Nút **Lưu** (lưu nháp) và **Phát hành** (chuyển sang Hoạt động; mờ khi đã hoạt động).
- Dropdown Cơ quan áp dụng: autocomplete, truncate + badge `+N`, tooltip đầy đủ khi hover.
- Drag & Drop sắp xếp bước (trừ Start/End); tự động cập nhật `parentNodeId`.
- SVG overlay động: vẽ mũi tên theo cấu hình hành động thực tế.

### 1.3 Cấu hình Cơ quan & Người xử lý theo Trạng thái bước

| Trạng thái bước | Cơ quan | Người xử lý |
|----------------|---------|-------------|
| `Chờ phân công` | Chọn nhiều cơ quan | Lãnh đạo các cơ quan (mặc định, khóa) |
| `Đang xử lý` | Cơ quan đã phân công (khóa) | Chuyên viên từ dropdown nhóm, cho phép tìm kiếm và chọn nhiều |
| `Đã có báo cáo` | Cơ quan đã phân công (khóa) | Lãnh đạo cơ quan (khóa) |
| `Chờ phê duyệt / Đã kết thúc` | Tỉnh Gia Lai (khóa) | Người tạo chỉ đạo (khóa) |

---

## 2. Báo cáo thống kê chỉ đạo

- **Bộ lọc**: Vai trò (Tỉnh / Sở), Khoảng thời gian, Đơn vị.
- **Biểu đồ tròn** phân bổ trạng thái + **biểu đồ đường** xu hướng.
- **Bảng hiệu suất** theo Sở/Phòng, nút xuất Excel / PDF / Word.

---

## 3. Xử lý chỉ đạo

### 3.1 Trạng thái chỉ đạo (5 trạng thái)

| # | Trạng thái | Mô tả |
|---|-----------|-------|
| 1 | **Chờ phân công** | Chỉ đạo mới từ Tỉnh, chưa giao cho cấp dưới |
| 2 | **Đang xử lý** | Đã chuyển xuống cấp dưới, đang trong quá trình xử lý |
| 3 | **Đã có báo cáo** | Cấp dưới đã nộp báo cáo, chờ Sở xem xét |
| 4 | **Chờ phê duyệt** | Sở đã trình Tỉnh, chờ Tỉnh phê duyệt |
| 5 | **Đã kết thúc** | Tỉnh đã phê duyệt, chỉ đạo hoàn thành |

### 3.2 Tab hiển thị

| Tab | Hiển thị khi trạng thái là |
|-----|--------------------------|
| **Đang xử lý** | Chờ phân công, Đang xử lý, Đã có báo cáo (đang cần hành động) |
| **Đã xử lý** | Chờ phê duyệt (đã gửi Tỉnh), Đã kết thúc |

> **Lưu ý:** Tab "Đang xử lý" và "Đã xử lý" thể hiện góc nhìn của từng vai trò — cùng 1 chỉ đạo có thể ở tab khác nhau tùy người xem.

### 3.3 Luồng nghiệp vụ chi tiết

```
[Lãnh đạo Tỉnh — Dashboard]
   │  Tạo chỉ đạo: Nội dung + Hạn xử lý + Nhóm dữ liệu + Hình ảnh chụp màn hình
   │  Trạng thái ban đầu: "Chờ phân công"
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 1 — Lãnh đạo Sở phân công (Tab: Đang xử lý)              │
│                                                                  │
│ Form Chi tiết hiển thị:                                          │
│   • Nội dung chỉ đạo                                            │
│   • Nhóm dữ liệu (Dân cư / PAHT / Giáo dục / Kinh tế XH /     │
│     Cán bộ CC / Văn bản ĐH / CSDL Tài chính / Hành chính công) │
│   • Hạn xử lý                                                   │
│   • Người tạo (= người nhận báo cáo ở bước phê duyệt)         │
│   • Ngày tạo                                                    │
│   • Link → trang Dashboard chứa thông tin chỉ đạo              │
│   • Hình ảnh chụp màn hình lúc tạo chỉ đạo                    │
│   • [Option] Ghi chú thêm + đính kèm file của Sở              │
│   • Danh sách báo cáo từ cấp dưới (rỗng ở bước này)           │
│   • Cột phải: Sơ đồ UML quy trình đang áp dụng                │
│   • Danh sách nhân viên để chọn chuyển xử lý                  │
│     (lấy từ cấu hình "Đang xử lý" trong Quy trình động)       │
│                                                                  │
│ Hành động: Chọn nhân viên → nhấn [Chuyển xử lý]               │
│   → Trạng thái: "Chờ phân công" → "Đang xử lý"               │
│   → Sở: chỉ đạo chuyển sang Tab "Đã xử lý"                   │
│   → Cấp dưới: chỉ đạo xuất hiện ở Tab "Đang xử lý"           │
└─────────────────────────────────────────────────────────────────┘
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 2 — Cấp dưới xử lý & báo cáo (Tab: Đang xử lý)          │
│                                                                  │
│ Form Chi tiết hiển thị: tất cả thông tin Sở gửi xuống          │
│ Hành động: Nhập báo cáo (text) + đính kèm file → [Trình duyệt]│
│   → Trạng thái: "Đang xử lý" → "Đã có báo cáo"               │
│   → Cấp dưới: chỉ đạo chuyển sang Tab "Đã xử lý"             │
│   → Sở: chỉ đạo xuất hiện lại ở Tab "Đang xử lý"             │
└─────────────────────────────────────────────────────────────────┘
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 3 — Sở xem xét & trình Tỉnh (Tab: Đang xử lý)           │
│          Trạng thái: "Đã có báo cáo"                            │
│                                                                  │
│ Form Chi tiết hiển thị: Báo cáo + file đính kèm của cấp dưới  │
│ Hành động A: [Trả về] — Nhập lý do → trạng thái trở về Bước 2│
│ Hành động B: [Trình Tỉnh] — Nhập báo cáo Sở + đính kèm file  │
│   → Trạng thái: "Đã có báo cáo" → "Chờ phê duyệt"            │
│   → Sở: chỉ đạo chuyển sang Tab "Đã xử lý"                   │
└─────────────────────────────────────────────────────────────────┘
   ▼
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 4 — Tỉnh phê duyệt                                        │
│                                                                  │
│ Nếu Tỉnh chấp nhận:                                            │
│   → Trạng thái: "Chờ phê duyệt" → "Đã kết thúc"             │
│ Nếu Tỉnh không chấp nhận:                                      │
│   → Quay lại Bước 3 (trạng thái: "Đã có báo cáo")            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Form Chi tiết hồ sơ

#### Cột trái — Thông tin chỉ đạo
| Field | Mô tả |
|-------|-------|
| Nội dung chỉ đạo | Text đầy đủ |
| Nhóm dữ liệu | Badge tag: Dân cư / PAHT / Giáo dục / Kinh tế XH / Cán bộ CC / Văn bản ĐH / CSDL Tài chính / Hành chính công |
| Hạn xử lý | Date + SLA color |
| Người tạo | Tên Lãnh đạo Tỉnh — sẽ là người nhận báo cáo ở Bước 4 |
| Ngày tạo | Date |
| Link | Hyperlink → trang Dashboard tương ứng |
| Hình ảnh | Ảnh chụp màn hình Dashboard lúc tạo chỉ đạo |
| Ghi chú Sở (option) | Text + file đính kèm (không bắt buộc) |
| Báo cáo cấp dưới | Danh sách báo cáo được nộp (text + file), hiển thị khi có |

#### Cột phải — Sơ đồ & Hành động
| Element | Mô tả |
|---------|-------|
| Sơ đồ UML | Sơ đồ luồng của quy trình đang áp dụng (lấy từ Quy trình động) |
| Danh sách nhân viên | Chọn người xử lý (theo cấu hình bước "Đang xử lý" trong Quy trình động) |
| Nút hành động | Thay đổi theo bước và vai trò (xem 3.3) |

### 3.5 Phân vai mô phỏng

| `roleSelect` | Vai trò | Tab "Đang xử lý" | Tab "Đã xử lý" |
|-------------|---------|-----------------|----------------|
| `leader` | Lãnh đạo Sở | Chờ phân công, Đã có báo cáo | Đang xử lý (đã giao), Chờ phê duyệt, Đã kết thúc |
| `department` | Trưởng phòng | Chờ nhận, Đang phân công CV | Đã hoàn thành |
| `individual` | Chuyên viên | Đang xử lý | Đã nộp báo cáo, Đã kết thúc |

### 3.6 Dữ liệu prototype (3 hồ sơ mẫu)

| Hồ sơ | Stage | Vai trò thấy |
|-------|-------|-------------|
| TEST-01 | `accepted` (Chờ phân công) | leader |
| TEST-02 | `staffProcessing` (Đang xử lý — CV đang làm) | leader, department, individual |
| TEST-03 | `sentProvince` (Chờ phê duyệt) | leader, department, individual |

### 3.7 Liên kết phân hệ

- **Nguồn directives**: `localStorage('gialai_directives')` — đồng bộ từ Dashboard
- **Nguồn processes**: `localStorage('gialai_processes')` — đồng bộ từ Quy trình động
- **Danh sách nhân viên** bước "Đang xử lý": lấy từ cấu hình `nodes[].assignees` trong process đang áp dụng
