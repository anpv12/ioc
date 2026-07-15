# SPECS — p01: Tình hình dân cư theo giới tính

## Mục đích
Phân tích và trực quan hóa cơ cấu dân số tỉnh Gia Lai chia theo giới tính, bao gồm tổng số nhân khẩu, phân bố theo địa bàn và bản đồ choropleth.

## Chỉ số hiển thị
| ID element              | Tên chỉ số                          | Đơn vị     |
|-------------------------|-------------------------------------|------------|
| `metric-tong-nhan-khau` | Tổng nhân khẩu (Nam + Nữ)           | Người      |
| `metric-dien-tich`      | Diện tích tỉnh                      | Km²        |
| `metric-mat-do`         | Mật độ dân số                       | Người/Km²  |
| `metric-tre-em`         | Trẻ em (0-14 tuổi)                  | Nhân khẩu  |
| `metric-lao-dong`       | Người lao động (15-64 tuổi)         | Nhân khẩu  |
| `metric-nguoi-lon-tuoi` | Người lớn tuổi (Trên 65 tuổi)       | Nhân khẩu  |
| `metric-chart-high`     | Biểu đồ Top 5 nhân khẩu cao nhất    | —          |
| `metric-chart-low`      | Biểu đồ Top 5 nhân khẩu thấp nhất   | —          |
| `metric-map`            | Bản đồ phân bố dân cư               | —          |

## Nguồn dữ liệu
- **Nguồn:** Cục Cảnh sát quản lý hành chính về trật tự xã hội (C06)
- **Kỳ:** Năm 2026 – Tháng 06
- **Phạm vi:** Toàn tỉnh Gia Lai

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

## Layout (1920×929px)
- **Stage:** 1920×929px, position: relative
- **Header:** left 197, top 9, width 1529, height 85
- **Floatbar:** left 1868, top 660
- **Tabbar:** bottom 49px
- **Drawer:** right -360 → right 20 (khi open), width 340, height 763
