# Đặc tả kỹ thuật (SPECS) — Phân hệ Quản trị

## 1. Quản trị Dashboard & Layout & Biểu đồ
- **Dashboard & Layout**: Cho phép Thêm, Sửa, Xóa, Chia sẻ, cấu hình layout dạng prototype UI.
- **Loại biểu đồ**: Hiển thị danh sách 62 mẫu biểu đồ dạng phân trang (cỡ trang 10/20/50).

## 2. Quản trị Quy trình động
- **Danh sách quy trình**:
  - Tìm kiếm theo mã/tên. Lọc theo Cơ quan, Nhóm giám sát (8 nhóm theo danh sách thông giám sát), Trạng thái (Bản nháp, Hoạt động) và Phiên bản.
  - Chặn xóa quy trình đang "Hoạt động" và cảnh báo bằng Popup Modal lỗi.
- **Cấu hình Quy trình**:
  - Nút **Lưu** (lưu nháp) và nút **Phát hành** (chuyển sang Hoạt động; mờ đi nếu đã hoạt động).
  - Dropdown Cơ quan áp dụng: Hỗ trợ "Chọn tất cả", ô tìm kiếm nhanh ghim đầu (sticky), tự động thu gọn `... và +[số lượng]` theo pixel thực tế khi tràn dòng.
- **Thiết kế Luồng bước (UML)**:
  - Khóa luồng bước không cho sửa khi trạng thái quy trình là "Hoạt động".
  - Trạng thái bước: 5 trạng thái (Phân công xử lý, Đang xử lý, Đã có báo cáo, Chờ phê duyệt, Đã kết thúc).
  - Cơ quan xử lý & Người xử lý: Hỗ trợ tìm kiếm nhanh ghim đầu, Chọn tất cả, tự động thu gọn theo pixel. Người xử lý được ánh xạ tự động từ Cơ quan xử lý và khóa chọn.
  - Mô tả ngắn của bước: Bị khóa chỉnh sửa khi quy trình ở trạng thái Hoạt động.
  - Cấu hình hành động: Cấu hình trực tiếp hoặc qua Popup riêng. Mặc định có 1 bước Chuyển xử lý. Trạng thái "Chờ phê duyệt" có thêm hành động "Trả xử lý" mặc định trỏ về bước liền trước (`parentNodeId`) thay vì bước start. Nếu có cả Chuyển và Trả xử lý, UML tự động hiển thị hình thoi rẽ nhánh quyết định.

## 3. Báo cáo thống kê chỉ đạo
- **Bộ lọc**: Vai trò (Tỉnh/Sở), Khoảng thời gian (Tuần/Tháng/Quý/Năm/Tùy chọn), Đơn vị (Sở hoặc Phòng ban).
- **Thống kê & Biểu đồ**: Hiển thị KPI chỉ đạo, biểu đồ tròn phân bổ trạng thái, biểu đồ đường xu hướng và bảng hiệu suất công việc kèm nút xuất dữ liệu (Excel/PDF/Word).

## 4. Xử lý chỉ đạo (Đơn vị mô phỏng)
- **Mô phỏng đa cấp**: Phân vai Sở (Lãnh đạo), Phòng ban, Cá nhân. Hiển thị dạng Danh sách hoặc Kanban (5 trạng thái).
- **Quỹ thời gian (SLA)**: Cảnh báo đồng hồ màu (Đỏ/Vàng/Xanh). Click vào đồng hồ mở lịch mốc thời gian. Hỗ trợ cảnh báo khoảng lùi thời gian khi phân công.
- **Popup Chi tiết hồ sơ**:
  - Cột trái: Thông tin văn bản, liên kết Dashboard, xem hình ảnh và nhật ký lịch sử (tô đỏ các sự kiện trễ hạn).
  - Cột phải: Form xử lý theo vai trò (Báo cáo, Phân công, Phê duyệt, Yêu cầu làm lại kèm lưu lịch sử phiên bản).
