# SPECS — p01: Tình hình dân cư theo giới tính

## Mục đích
Tôi đang thiết kế chức năng tạo chỉ đạo trên dashboard quy trình: Lãnh đạo tạo chỉ đạo trên dashboard qua event panel

## Files
| File            | Vai trò                                                 |
|-----------------|---------------------------------------------------------|
| `index.html`    | HTML structure, link CSS/JS                             |
| `style.css`     | Drawer, Admin Panel, Badge/Indicator, Modal             |
| `js/state.js`   | METRIC_LABELS, directives state, localStorage           |
| `js/ui.js`      | Drawer, form, applyDirectiveIndicators, Admin controls  |
| `js/charts.js`  | Chart.js render 2 biểu đồ cột ngang                    |
| `js/map.js`     | SVG choropleth map từ GeoJSON thực tế                   |

## JS Load Order (quan trọng)
```html
<script src="./js/state.js"></script>   <!-- 1. state trước -->
<script src="./js/ui.js"></script>      <!-- 2. ui dùng state -->
<script src="./js/charts.js"></script>  <!-- 3. chart độc lập -->
<script src="./js/map.js"></script>     <!-- 4. map độc lập -->
```

## Tính năng Chỉ đạo
- **Tạo:** Drawer (Event Panel) → chọn metric → nhập nội dung → lưu
- **Hiển thị trên card:** viền màu + icon `fa-flag` (cam/xanh/cờ ca rô)
- **Xử lý:** Admin Panel → chọn chỉ đạo → cập nhật trạng thái + báo cáo
- **Trạng thái:** Chưa xử lý → Đang xử lý → Đã hoàn thành

---

# LOGIC NGHIỆP VỤ

## 1. Vai trò

| Vai trò | Màn hình | Quyền |
|---|---|---|
| Lãnh đạo Tỉnh | Dashboard | Tạo chỉ đạo, phê duyệt / từ chối kết quả |
| Lãnh đạo Sở | Quản trị → Xử lý chỉ đạo | Xem báo cáo chuyên viên, trình Tỉnh hoặc trả về |
| Chuyên viên | Quản trị → Xử lý chỉ đạo | Tiếp nhận, xử lý, nộp báo cáo |

## 2. Hai cấp dữ liệu

- Một chỉ đạo gửi tới một hoặc nhiều đơn vị; mỗi đơn vị có trạng thái riêng.
- Trạng thái chỉ đạo (cấp cha) hiển thị trên thẻ ở danh sách.
- Trạng thái đơn vị (cấp con) hiển thị trong tab *Chi tiết đơn vị*.
- Toàn bộ đơn vị đạt `Kết thúc` → chỉ đạo chuyển `Kết thúc`.

## 3. Vòng đời trạng thái

```
Chờ phân công → Đang xử lý → Đã có báo cáo → Chờ phê duyệt → Kết thúc
                                   ↓ Trả về              ↓ Từ chối
                             (Chuyên viên)            Bị từ chối
```

| Trạng thái | Việc đang ở |
|---|---|
| Chờ phân công | Lãnh đạo Sở |
| Đang xử lý | Chuyên viên |
| Đã có báo cáo | Lãnh đạo Sở |
| Chờ phê duyệt | Lãnh đạo Tỉnh |
| Kết thúc | — |
| Bị từ chối | Chuyên viên |

## 4. Phê duyệt / Từ chối

Chỉ thao tác được khi đối tượng ở trạng thái `Chờ phê duyệt`.

### 4.1. Ngoài màn danh sách — ẩn nút

| Điều kiện | Nút Phê duyệt / Từ chối |
|---|---|
| Chỉ đạo 1 đơn vị + `Chờ phê duyệt` | Hiện |
| Chỉ đạo nhiều đơn vị hoặc toàn tỉnh — mọi trạng thái | Ẩn |
| Trạng thái khác | Ẩn |

Chỉ đạo nhiều đơn vị: phê duyệt / từ chối từng đơn vị trong tab *Chi tiết đơn vị*.

### 4.2. Trong tab Chi tiết đơn vị — luôn hiện, khoá theo trạng thái

| Trạng thái đơn vị | Phê duyệt | Từ chối |
|---|---|---|
| Chờ phê duyệt | Mở | Mở |
| Chờ phân công | Khoá | Khoá |
| Đang xử lý | Khoá | Khoá |
| Đã có báo cáo | Khoá | Khoá |
| Kết thúc | Khoá | Khoá |
| Bị từ chối | Khoá | Khoá |

### 4.3. Phê duyệt hàng loạt

- Nút *Phê duyệt các đơn vị đã chọn* chỉ mở khi nhóm đang chọn có ít nhất 1 đơn vị `Chờ phê duyệt`.
- Chỉ đơn vị `Chờ phê duyệt` chuyển sang `Kết thúc`; đơn vị trạng thái khác giữ nguyên.

### 4.4. Kết quả

| Thao tác | Kết quả |
|---|---|
| Phê duyệt 1 đơn vị | Đơn vị → `Kết thúc`. Toàn bộ đơn vị `Kết thúc` → chỉ đạo `Kết thúc` |
| Từ chối 1 đơn vị | Đơn vị → `Bị từ chối`. Bắt buộc nhập lý do, cho phép đính kèm tệp. Lý do hiển thị lại trên thẻ chỉ đạo |

## 5. Sửa / Xoá chỉ đạo

| Thao tác | Điều kiện |
|---|---|
| Sửa | Chỉ khi chỉ đạo ở `Chờ phân công` |
| Xoá | Chỉ khi chỉ đạo ở `Chờ phân công` |

- Đơn vị đã tiếp nhận chỉ đạo: chỉ được thêm mới, không được gỡ bỏ. Hiển thị biểu tượng ổ khoá thay nút xoá; cố gỡ thì báo lỗi và chặn lưu.
- Không có cảnh báo tĩnh hay tooltip hover về việc khoá đơn vị — chỉ báo bằng toast khi thao tác sai.
- Hạn xử lý: tạo mới không chọn được ngày quá khứ, mặc định gợi ý 7 ngày. Sửa chỉ đạo cũ được giữ hạn cũ.

## 6. Danh sách chỉ đạo

| Tab | Trạng thái |
|---|---|
| Đang thực hiện | Chờ phân công, Đang xử lý, Đã có báo cáo, Chờ phê duyệt, Bị từ chối |
| Đã xử lý | Kết thúc |

- **Bộ lọc:** đơn vị xử lý (chọn nhiều) · trạng thái (chọn nhiều) · tình trạng hạn Trong hạn / Quá hạn (chọn nhiều) · khoảng ngày tạo · tìm kiếm theo nội dung, nhóm dữ liệu, cơ quan.
- **Tổng chỉ đạo** = tổng số đơn vị nhận chỉ đạo.
- **Đơn vị đã báo cáo** = số đơn vị ở `Đã có báo cáo`, `Chờ phê duyệt` hoặc `Kết thúc`.
- **Cảnh báo hạn:** chỉ đạo chưa `Kết thúc` đối chiếu hạn xử lý với ngày hiện tại để hiện biểu tượng quá hạn / sắp đến hạn.

## 7. Chỉ đạo toàn tỉnh

- Gửi tới toàn bộ 105 cơ quan, đơn vị. Hiển thị nhãn *Chỉ đạo toàn tỉnh* thay vì liệt kê từng đơn vị.
- Áp dụng ràng buộc mục 4.1: không phê duyệt / từ chối được từ ngoài danh sách.
- Chọn "Chỉ đạo toàn tỉnh" → khởi tạo đủ 105 đơn vị. Bỏ chọn bất kỳ đơn vị con nào → tự động bỏ trạng thái toàn tỉnh.

---

## Các Cập Nhật Mới (Gia Lai Dashboard V20)

> Ghi chú kỹ thuật cho DEV — bổ sung cho phần Logic nghiệp vụ ở trên.

1. **Thông báo Drawer:** Đổi câu thông báo thành `"Có X chỉ đạo cần xử lý"`.
2. **Hiển thị Đơn vị:** Loại bỏ badge trạng thái bên cạnh tên từng đơn vị trong card drawer; bổ sung giả lập chỉ đạo toàn tỉnh với 105 đơn vị (`isAllProvince`).
3. **Xem/Tải file đính kèm:** 
   - Click file PDF: Tự động mở tab mới để xem trước.
   - Click file Word/Excel (`.doc`, `.docx`, `.xls`, `.xlsx`): Tự động kích hoạt tải xuống.
   - Click file Ảnh (`.png`, `.jpg`,...): Mở modal phóng to ảnh.
4. **Nhãn Trạng thái:** Đổi nhãn `"Trạng thái chung"` thành `"Trạng thái"` trong modal chi tiết.
5. **Thống kê tiếp nhận:** Đổi dòng hiển thị từ `"Tổng tiếp nhận: X"` thành `"Tổng chỉ đạo: X đơn vị | Đơn vị đã báo cáo: Y"`.
6. **Đồng bộ Typography & Tokens:** Áp dụng `var(--font-family)` và các token `--fs-*` (`--fs-2xs`, `--fs-xs`, `--fs-sm`,...) toàn bộ hệ thống.
7. **Ràng buộc Hạn xử lý:** Khóa chọn ngày quá khứ trên lịch Flatpickr (`minDate: 'today'`), mặc định gợi ý 7 ngày tới, và thêm validation kiểm tra ngày trong tương lai khi tạo mới.
8. **Đồng bộ Style Lịch & Bộ lọc:** Đã chuẩn hóa phông chữ, font size (`var(--font-family)`, `var(--fs-xs)`), viền và bộ màu Slate/Grayscale nhã nhặn cho toàn bộ bộ lọc và bảng lịch Flatpickr popover.
9. **Màu Tag Chip & Sửa Lỗi Scroll:** Đổi màu nền thẻ chọn multiselect (`.fms-tag`) sang màu xanh nhạt (`#f4faff`) đồng bộ với màu hover của dropdown, đồng thời bổ sung container sticky cố định nền trắng (`#drawerStickyHeader`) để sửa triệt để lỗi phần tử cuộn bị lọt lên dưới thanh thông báo.
10. **Loại bỏ nhãn Dev Only:** Cập nhật nhãn bộ chọn vai trò mô phỏng thành `"Mô phỏng chức vụ"` và đặt màu chữ đỏ nổi bật (`#dc2626`).
11. **Đồng bộ Thẻ Lọc "Chỉ đạo toàn tỉnh":** Loại bỏ inline style màu xanh lá đậm cũ, chuyển sang màu nền xanh nhạt (`#f4faff`, viền `#bae6fd`, chữ `#0369a1`) đồng bộ với style tag chip chung.
12. **Giới hạn Chiều cao Ô Lọc (Tối đa 2 Dòng):** Cập nhật logic JS hiển thị 1 tag chip + badge số lượng (`+N`) khi chọn nhiều item, kết hợp CSS `max-height: 58px` và `overflow: hidden` đảm bảo ô hiển thị bộ lọc không bao giờ bị vỡ hay tràn quá 2 dòng.
13. **Đồng bộ Thao tác Tự tạo "Chỉ đạo toàn tỉnh":** Khắc phục giá trị lưu đơn vị khi chọn Chỉ đạo toàn tỉnh, đảm bảo tự tạo mới chỉ đạo toàn tỉnh khởi tạo đầy đủ 105 đơn vị, hiển thị icon sơ đồ lá cây xanh lá `<i class="fa-solid fa-sitemap"></i> Chỉ đạo toàn tỉnh`, thống kê `105 đơn vị` và khớp bộ lọc hoàn toàn như bản mô phỏng. Bổ sung logic đồng bộ checkbox: tự động bỏ chọn "Chỉ đạo toàn tỉnh" nếu người dùng bỏ chọn bất kỳ đơn vị con nào.
14. **Tương thích Dữ liệu Cũ "Toàn tỉnh":** Bổ sung logic tương thích ngược tại modal chi tiết (Tab 1 & Tab 2) cho các dữ liệu cũ đã lưu `Toàn tỉnh` trong localStorage, tự động map sang hiển thị `Chỉ đạo toàn tỉnh (105 đơn vị)` và khởi tạo danh sách 105 cơ quan xử lý.
15. **Ràng buộc Đơn vị xử lý ở luồng Sửa chỉ đạo:** Khi mở modal `Chỉnh sửa chỉ đạo điều hành`, các đơn vị đã tiếp nhận chỉ đạo được lưu vào `lockedAgencies` và bị khoá — chỉ được **thêm mới**, không được xoá. Cụ thể:
    - Checkbox trong `#formAgencyDropdown` của đơn vị đã tiếp nhận bị `disabled` và gắn class `.ms-opt-locked` (xem mục 16 — không còn tooltip `title`).
    - Tag chip của đơn vị bị khoá hiển thị icon `fa-lock` (class `.ms-tag-chip-locked`) thay cho dấu `×`; nếu vẫn bấm sẽ hiện toast lỗi.
    - Bỏ chọn `Chỉ đạo toàn tỉnh` (`clearAllAgencyForm`) / `toggleSelectAllAgencyForm` vẫn giữ lại toàn bộ đơn vị đã tiếp nhận.
    - Guard tại `saveDirectiveFromModal` chặn submit nếu thiếu đơn vị đã khoá; bước merge `dir.agencies` giữ lại mọi đơn vị cũ không có trong danh sách mới (tránh mất tiến độ khi nâng lên toàn tỉnh do `generate105Agencies` dùng tên viết tắt khác dropdown).
    - `lockedAgencies` được reset ở luồng Thêm mới và khi đóng modal. Không còn hint tĩnh `#formAgencyLockHint` (đã xoá — xem mục 16).
16. **Loại bỏ Cảnh báo & Tooltip Khoá Đơn vị:** Đã xoá hoàn toàn dòng cảnh báo `#formAgencyLockHint` ("Chỉ được thêm đơn vị mới, không thể xoá đơn vị đã tiếp nhận chỉ đạo") khỏi modal Thêm/Sửa chỉ đạo, đồng thời bỏ toàn bộ tooltip `title` khi rê chuột lên đơn vị đã khoá (option trong dropdown, option "Chỉ đạo toàn tỉnh" và icon ổ khoá trên chip). Ràng buộc nghiệp vụ giữ nguyên: checkbox đơn vị đã tiếp nhận vẫn `disabled`, chip vẫn hiển thị icon ổ khoá `fa-lock` thay cho nút xoá làm chỉ dấu trực quan. Khi Lãnh đạo thực sự thao tác sai (bấm xoá chip đã khoá, hoặc bấm Cập nhật sau khi bỏ đơn vị đã tiếp nhận), hệ thống chỉ báo bằng toast lỗi — không dùng hint tĩnh hay tooltip hover.
17. **Sửa Lỗi Khe hở Sticky Header & Ghim Phân trang (tab "Chi tiết đơn vị"):** Nguyên nhân gốc: `.modal-tab-content` vừa là vùng cuộn vừa có `padding: 18px`, mà `position: sticky; top: 0` của `.history-table th` neo theo padding box — tạo khe hở đúng 18px giữa mép trên vùng nhìn và vị trí header dính, khiến nền navy của `<thead><tr>` và các hàng dữ liệu cuộn lọt lên phía trên header. Đã bỏ `padding` khỏi class chung và tách trách nhiệm theo từng tab: `#tabContentInfo { padding: 18px }`, `#tabContentHistory { padding: 0 18px; overflow-x: auto }` — khe hở về 0 ở mọi mức cuộn. Thanh phân trang được ghim cố định ở đáy vùng cuộn bằng `#tabContentHistory .directive-pagination { position: sticky; bottom: 0; z-index: 3; margin-top: 10px }`, nền `#fafafa` sẵn có của `.directive-pagination` che nội dung cuộn phía sau. Dọn kèm: bỏ inline `background:#0b3d91` trên `<thead><tr>` (màu do `.history-table th` chịu trách nhiệm), bỏ inline `overflow-x:auto` trên `#tabContentHistory` và inline `display:flex; margin-top:16px` trên khối phân trang (đã có trong CSS, `margin-top` đưa về `10px` theo chuẩn spacing). Giới hạn đã biết: ở viewport hẹp hơn stage chuẩn `1920×929` khiến bảng phải cuộn ngang, thanh phân trang chỉ phủ hết chiều rộng content-box nên nội dung bên phải có thể lộ ra cạnh nó — ngoài phạm vi thiết kế stage cố định.
18. **Ô Lọc Drawer — Chiều cao Cố định 1 Hàng:** Bộ lọc trong Drawer (`.filter-multiselect-display` — Đơn vị / Trạng thái / Tình trạng hạn) trước đây cao thay đổi theo nội dung (32px / 44px / 48px) nên 3 ô lệch nhau và hàng lọc nhảy; nguyên nhân là `flex-wrap: wrap` cộng `.fms-tag` để `white-space: normal` khiến tên đơn vị dài tự xuống dòng bên trong tag (đo được `tagHeight` 28px→40px, nội dung cần `scrollHeight` 70px so với `clientHeight` 56px ở ô rộng 120–140px → bị cắt ngang giữa hàng). Đã cố định: ô lọc dùng `height: 32px` + `flex-wrap: nowrap` (bỏ `min-height`/`max-height`) để cả 3 ô luôn thẳng nhau và chỉ 1 hàng; `.fms-tag` thêm `max-width: 100%; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis` để tag co lại và tên dài cắt bằng dấu `…`; `.fms-count-badge` thêm `flex-shrink: 0` để badge `+N` không bị bóp; `.fms-placeholder` thêm `white-space: nowrap`. Kiểm chứng: cả 3 ô đều `32px`, `scrollHeight == clientHeight` (không cắt nội dung), badge `+N` và chevron luôn nằm trong khung. Lưu ý: `.multiselect-display` của form modal (mục 12) là hệ khác, giữ nguyên `max-height: 58px`.
19. **Ràng buộc Thao tác Phê duyệt / Từ chối theo Trạng thái:** Chỉ trạng thái `Chờ phê duyệt` mới thao tác được. Hai nơi render khác nhau:
    - **Ngoài màn danh sách (menu Drawer) — ẩn hẳn:** chỉ hiện hai nút khi chỉ đạo có **đúng 1 đơn vị** và `dir.status === 'Chờ phê duyệt'`. Chỉ đạo **nhiều đơn vị hoặc toàn tỉnh** không được đi luồng này ở mọi trạng thái, vì `executeConfirmApprove` ở cấp chỉ đạo sẽ set toàn bộ `dir.agencies` sang `Kết thúc` bằng một click — phải phê duyệt/từ chối từng đơn vị trong tab Chi tiết đơn vị. Biến điều khiển: `showApproveReject`.
    - **Trong form chi tiết (tab "Chi tiết đơn vị") — luôn hiện, chỉ `disabled`:** `canApprove = canReject = (a.status === 'Chờ phê duyệt')`. Các trạng thái khác đều khoá cả hai nút: chưa báo cáo (`Chờ phân công`, `Đang xử lý`), `Đã có báo cáo`, đã duyệt (`Kết thúc`), đã từ chối (`Bị từ chối`). Style nút gom vào biến `btnShared` thay vì lặp 4 chuỗi inline.
    - **Nút "Phê duyệt các đơn vị đã chọn"**: `updateCbAllAgencies` chỉ mở nút khi trong các đơn vị đang chọn có ít nhất 1 đơn vị `Chờ phê duyệt`; `executeConfirmApprove` (nhánh `approveAllAgenciesFlag`) cũng chỉ chuyển `Chờ phê duyệt → Kết thúc`.
20. **Data mock phủ đủ Ma trận Trạng thái × Số đơn vị:** Bổ sung 4 chỉ đạo nhiều đơn vị cho 4 trạng thái trước đây chỉ có ở dạng 1 đơn vị: `dir_mock_multi_reported` (Đã có báo cáo), `dir_mock_multi_waiting` (Chờ phê duyệt — **toàn bộ 105 đơn vị** đều ở `Chờ phê duyệt`), `dir_mock_multi_rejected` (Bị từ chối), `dir_mock_multi_finished` (Kết thúc). Tổng 16 chỉ đạo, phủ đủ 6 trạng thái × 2 dạng (1 đơn vị / nhiều đơn vị) = 12/12 ô. `generate105Agencies(dueStr, forcedStatus)` và `generateRealAgencies(dueStr, forcedStatus)` nhận thêm tham số `forcedStatus` để gán cùng một trạng thái cho toàn bộ đơn vị, và mảng `statuses` của hai hàm được bổ sung `Chờ phê duyệt` + `Bị từ chối` (trước chỉ có 4 trạng thái nên đơn vị chưa bao giờ ở `Chờ phê duyệt`, khiến nút Phê duyệt luôn bị khoá). `report`/`attachments` sinh theo trạng thái thực (chỉ có báo cáo khi đã ở `Đã có báo cáo` trở đi). `DATA_VERSION` bump `v30 → v31` để nạp lại mock.
