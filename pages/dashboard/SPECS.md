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

## Các Cập Nhật Mới (Gia Lai Dashboard V20)
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
