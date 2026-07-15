---
name: gia-lai-dashboard
description: >
  Skill cho dự án Dashboard Phân tích Dân cư Tỉnh Gia Lai. Kích hoạt khi làm việc với bất kỳ file nào trong thư mục Thiết kế của dự án Gia Lai. Chứa toàn bộ quy trình, kiến thức tích lũy, quy tắc code và nghiệp vụ.
---

# Gia Lai Dashboard — Skill

## Quy trình làm việc
- **Bao giờ cũng hỏi xác nhận** trước khi code, đợi "ok" / "làm đi" mới thực hiện
- Phản hồi ngắn gọn, đúng trọng tâm
- Rà soát code trước khi báo xong
- **Save = Populate**: sau lưu data, phải xác nhận UI hiển thị đúng
- **Git: tuyệt đối không push vào `main`** — chỉ push lên nhánh làm việc, merge vào main là quyền của user qua PR trên GitHub

## Quy tắc code
- Không hardcode — dùng CSS token từ `shared/css/tokens.css`
- DRY — không lặp logic, tái sử dụng shared CSS/JS
- Padding tối đa `5px 10px`, không thêm margin > 10px tùy tiện
- `input[type=number]`: luôn ẩn spin arrows bằng CSS
- Datepicker: chỉ dùng **Flatpickr**
- Không `if/else` nhiều nguồn cho 1 field — trỏ đích danh nguồn dữ liệu

## Kiến trúc quan trọng
- Stage: `1920×929px`, card dùng `position: absolute` (`.abs`)
- **Không** thêm `position: relative` vào `.metric-block` — sẽ phá layout
- JS load order: `state.js` → `ui.js` → `charts.js` → `map.js`

## Nghiệp vụ Chỉ đạo
- Chỉ đạo gắn vào **metric-block** (card chỉ số), không phải hàng dữ liệu hay điểm chart
- Tạo chỉ đạo: **Drawer (Event Panel)** → chọn metric → nhập → lưu
- Quản trị: nút trong Drawer → Admin Panel overlay
- Badge: `fa-flag` (cam/xanh) hoặc `fa-flag-checkered` (xanh lá) theo trạng thái
- State key localStorage: `gialai_directives`, field định danh: `metricId`

## Tài liệu dự án
- `CONTEXT.md` — đọc đầu tiên, tổng quan dự án
- `system_design.md` — tài liệu BA (nghiệp vụ, không kỹ thuật)
- `pages/p[xx]-[ten]/SPECS.md` — đặc tả từng trang
