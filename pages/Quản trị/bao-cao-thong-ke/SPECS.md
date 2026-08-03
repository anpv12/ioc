# Báo cáo & Thống kê Chỉ đạo (Quản trị)

## 1. Mục tiêu
Lọc theo khoảng ngày tạo / đơn vị / lãnh đạo → bảng tổng hợp → bấm số liệu xem chi tiết → xuất Excel.

Prototype UI (mock JS), chưa nối backend.

## 2. Tệp
- `index.html` — cấu trúc
- `style.css` — style màn
- `js/state.js` — mock data (~80 đơn vị, ~868 chỉ đạo: tháng 7 = 50, tháng 8 = 724), gom nhóm thống kê
- `js/ui.js` — UI, autocomplete, render bảng, xuất Excel

Phụ thuộc shared (không sửa trong màn này): `../shared/admin-base.css`, `../shared/admin-shared.js`  
CDN: Font Awesome 6.5, Flatpickr (+ locale vi), xlsx-js-style.

---

## 3. Logic chức năng

### 3.0 User Flow
1. Vào màn → view **Thống kê**, filter mặc định tháng hiện tại, tab Theo đơn vị.
2. Đổi tab / chỉnh filter → Lọc → bảng thống kê (sort Tổng nhận giảm dần).
3. Bấm ô số → xem **Báo cáo chi tiết** (theo đơn vị/lãnh đạo + chỉ số vừa bấm).
4. Ở chi tiết: lọc thêm / phân trang / Xuất Excel.
5. Quay lại thống kê → khôi phục filter trước khi bấm ô số.

Báo cáo chi tiết **chỉ** vào được bằng cách bấm  vào ô chỉ số ở bảng Thống kê.

### 3.1 Bộ lọc
**Từ ngày / Đến ngày tạo chỉ đạo:** Flatpickr (vi), `dd/mm/yyyy` — theo ngày tạo. Mặc định: đầu → cuối tháng hiện tại.

**Ô chọn nhiều** (Đơn vị, Lãnh đạo, Trạng thái, Người thực hiện):
- Gõ tìm (bỏ dấu).
- Checkbox + "Chọn tất cả" chỉ áp dụng mục đang hiện trên menu.
- Chưa chọn hoặc chọn hết → placeholder `Tất cả …`; 1 mục → tên; nhiều (chưa hết) → `Đã chọn N mục`.
- Tên dài hơn ô → cắt bằng `…`, hover xem đủ (tooltip).
- Nút **X** cạnh caret: xóa hết lựa chọn của ô đó. Chỉ hiện khi đang có chọn; ẩn khi ô bị khóa.

**Thứ tự ô:** Ngày tạo → Đơn vị → Lãnh đạo → Người thực hiện → Trạng thái.

**Ô lọc hiện theo view:**

| View | Ô lọc hiện |
|---|---|
| Thống kê – Theo đơn vị | Đơn vị |
| Thống kê – Theo lãnh đạo | Lãnh đạo Tỉnh |
| Báo cáo chi tiết | Đơn vị, Lãnh đạo Tỉnh, Người thực hiện, Trạng thái |

**Đổi tab Thống kê:** chỉ áp dụng filter của ô đang hiện. Tab Theo đơn vị bỏ qua filter Lãnh đạo; tab Theo lãnh đạo bỏ qua filter Đơn vị. Khoảng ngày luôn áp dụng.

**Khóa ô khi xem chi tiết:** ô đúng với dòng vừa bấm bị khóa (không đổi được), giữ giá trị đã chọn:
- Bấm từ tab Theo đơn vị → khóa ô Đơn vị.
- Bấm từ tab Theo lãnh đạo → khóa ô Lãnh đạo Tỉnh.
- Các ô còn lại (Người thực hiện, Trạng thái, ngày) vẫn lọc thêm được.

**Không có ô lọc cho:** Hạn xử lý, Ngày hoàn thành, Số ngày trễ hạn, Số ngày quá hạn — chỉ là cột ở bảng chi tiết.

**4 chỉ số thống kê** (tính từ `status` + đúng/quá hạn):

| Key | Điều kiện | Nhãn |
|-----|-----------|------|
| `on_time_completed` | Đã kết thúc ∧ Đúng hạn | Đã xử lý đúng hạn |
| `overdue_completed` | Đã kết thúc ∧ Quá hạn | Đã xử lý trễ hạn |
| `on_time_not_completed` | Chưa kết thúc ∧ Đúng hạn | Đang xử lý còn hạn |
| `overdue_not_completed` | Chưa kết thúc ∧ Quá hạn | Đang xử lý quá hạn |

| Nút | Hành vi |
|---|---|
| Lọc | Áp dụng filter, reset phân trang về trang đầu của bảng|
| Đặt lại | Về tháng hiện tại, xóa filter, reset phân trang về trang đầu của bảng |

**Bấm ô chỉ số:**
1. Lưu lại bộ lọc đang dùng.
2. Bảng chi tiết chỉ hiện chỉ đạo của đúng đơn vị/lãnh đạo thuộc dòng vừa bấm; ô lọc tương ứng bị khóa không cho đổi.
3. 
   - Bấm **Tổng nhận** → lấy tất cả chỉ đạo của đơn vị/lãnh đạo đó.
   - Bấm **Đúng hạn / Trễ hạn / Còn hạn / Quá hạn** → chỉ lấy chỉ đạo thỏa đúng điều kiện cột vừa bấm (ví dụ bấm “Quá hạn” thì chỉ hiện chỉ đạo đang quá hạn).
4. Chuyển sang bảng danh sách chi tiết.

**Quay lại thống kê:** lấy lại bộ lọc đã lưu ở bước 1, trở về bảng thống kê.

### 3.2 Tab thống kê
Chỉ hiện khi đang ở view Thống kê (Theo đơn vị / Theo lãnh đạo Tỉnh).

Đổi tab:
- Reset phân trang về trang đầu của bảng.
- Chỉ áp dụng filter của ô đang hiện; filter của ô ẩn (Đơn vị khi xem theo lãnh đạo, và ngược lại) không được dùng để tính số liệu (xem 3.1).

### 3.3 Bảng thống kê
Cột: **STT | Tên ĐV/LĐ | Tổng nhận | Đúng hạn | Trễ hạn | Còn hạn | Quá hạn**  
Header 2 tầng: **Đã xử lý** (Đúng hạn, Trễ hạn) | **Đang xử lý** (Còn hạn, Quá hạn).  
Sort mặc định: Tổng nhận giảm dần. 
Bấm vào ô số liệu → mở báo cáo chi tiết.

### 3.4 Bảng báo cáo chi tiết
Cột đầy đủ: **STT | Nội dung | Đơn vị | Người giao | Người thực hiện | Ngày tạo chỉ đạo | Hạn xử lý | Ngày hoàn thành | Số ngày trễ hạn | Số ngày quá hạn | Trạng thái**

Ẩn/hiện cột theo chỉ số vừa bấm:

| Chỉ số | Ngày hoàn thành | Số ngày trễ hạn | Số ngày quá hạn |
|---|:---:|:---:|:---:|
| Tổng nhận | Hiện | Ẩn | Ẩn |
| Đúng hạn (đã xử lý) | Hiện | Ẩn | Ẩn |
| Trễ hạn (đã xử lý) | Hiện | Hiện | Ẩn |
| Còn hạn (đang xử lý) | Ẩn | Ẩn | Ẩn |
| Quá hạn (đang xử lý) | Ẩn | Ẩn | Hiện |

(Các cột còn lại luôn hiện.)

**Tô đỏ "Hạn xử lý":** chỉ khi xem **Tổng nhận** — tô đỏ nếu chỉ đạo quá hạn. Không áp dụng ở 4 chỉ số còn lại.

**Căn lề:**
- Header: luôn căn giữa.
- Ô nội dung: STT / ngày / số ngày → căn giữa; chữ (Nội dung, Đơn vị, …) → căn trái.

- Sort mặc định: ngày tạo mới nhất trước.
- Số ngày trễ hạn / quá hạn: chữ đỏ.
- Công thức:
  - **Số ngày trễ hạn** = Ngày hoàn thành − Hạn xử lý (đã xong nhưng trễ; chỉ > 0).
  - **Số ngày quá hạn** = Hôm nay − Hạn xử lý (chưa xong và đã quá hạn; chỉ > 0).
  - Không áp dụng → `—`.
- Độ rộng cột theo trọng số riêng (`<colgroup>`), không chia đều.

### 3.5 Phân trang
10 / 20 / 50 (mặc định 10).

### 3.6 Xuất Excel
Giống đúng bảng đang hiện.
- Dòng 1: tiêu đề gộp ô, in đậm, nền `#BAE6FD`
- Dòng 2: Từ/Đến ngày tạo, nền `#E0F2FE`
- Header: chữ trắng, nền `#0284C7`
- Data: xen kẽ `#F0F9FF` / trắng; không xuống dòng; cột rộng theo nội dung
- File: `thong-ke-chi-dao.xlsx` | `bao-cao-chi-tiet-chi-dao.xlsx`

### 3.7 Dữ liệu mock
~868 chỉ đạo (tháng **7/2026: 50**, tháng **8/2026: 724**). Danh sách đơn vị trong `UNITS` (`js/state.js`).

**status (5):** Chờ phân công | Đang xử lý | Đã có báo cáo | Chờ phê duyệt | Đã kết thúc.  
**Field chính:** ngày tạo, đơn vị, người giao, người thực hiện, trạng thái, đúng/quá hạn, hạn xử lý, ngày hoàn thành, nội dung.

**5 chỉ số:** Tổng nhận | Đúng hạn | Trễ hạn | Còn hạn | Quá hạn.

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
| `#dc2626` | Chữ đỏ — số ngày trễ/quá hạn; hạn xử lý khi quá hạn (view Tổng) |
| `#047857` + `#10b981` | Header nhóm Đã xử lý (Đúng hạn / Trễ hạn) |
| `#b91c1c` + `#f87171` | Header nhóm Đang xử lý (Còn hạn / Quá hạn) |

## 5. Căn chỉnh trang (layout)

### Font
- Ô lọc, bảng, menu, calendar: **12px**
- Tiêu đề bảng: 16px; header thống kê: 11px; phân trang: 11px

### Ô lọc / Autocomplete
- Cao **40px**, radius 6px, border `#cbd5e1`, font 12px.
- Menu: cao tối đa 280px, rộng tối đa `min(420px, calc(100vw - 48px))`.
- Input luôn chừa `padding-right: 50px` (chỗ caret + nút X), không đổi khi ẩn/hiện nút X — tránh icon đè chữ. Selector: `.multiselect .multiselect-input` (≥ 2 class) để không bị rule chung ghi đè.
- Grid 6 cột theo thứ tự DOM. Ngày + Trạng thái: `1fr`; Đơn vị / Lãnh đạo / Người thực hiện: `1.5fr`. Ô ẩn thì cột còn lại tự dồn. Responsive: 2 cột ≤900px, 1 cột ≤700px.

### Bảng
- Cột cố định, có viền, chữ wrap trên UI.
- Thống kê: độ rộng cố định theo thứ tự cột.
- Chi tiết: độ rộng theo trọng số (`<colgroup>`), vì số cột đổi theo chỉ số.
- Căn lề chi tiết: xem 3.4.

### Ghi chú BE
- Sort: thống kê theo Tổng nhận giảm dần; chi tiết theo ngày tạo mới nhất.
- Lọc thời gian theo **ngày tạo**.
- Chỉ đạo chưa kết thúc: đúng/quá hạn = so sánh hạn xử lý với hôm nay (không gán cứng). Đã kết thúc: so sánh ngày hoàn thành với hạn xử lý.
- Khi nối API: thay mock data + hàm lọc/gom nhóm; format ngày `Y-m-d`.
