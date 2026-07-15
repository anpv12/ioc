# SPECS — p01: Tình hình dân cư theo giới tính

## Mục đích
Phân tích và trực quan hóa cơ cấu dân số tỉnh Gia Lai chia theo giới tính, bao gồm tổng số nhân khẩu, phân bố theo địa bàn và bản đồ choropleth.


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

