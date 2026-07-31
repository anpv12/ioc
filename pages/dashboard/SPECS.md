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

