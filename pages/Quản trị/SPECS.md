# Đặc tả kỹ thuật (SPECS) — Phân hệ Quản trị

## 0. Shell / Sidebar
- Sidebar trái có nút **Thu gọn** (angles-left). Khi thu gọn: sidebar ẩn, hiện nút **Mở menu** (bars) trên topbar.
- Trạng thái đóng/mở được nhớ trong `localStorage` (`gialai_admin_sidebar_collapsed`).

## 1. Quản trị Dashboard & Layout & Biểu đồ
- **Dashboard & Layout**: Cho phép Thêm, Sửa, Xóa, Chia sẻ, cấu hình layout dạng prototype UI.
- **Loại biểu đồ**: Hiển thị danh sách 62 mẫu biểu đồ dạng phân trang (cỡ trang 10/20/50).

## 2. Quản trị Quy trình động
- **Danh sách quy trình**:
  - Tìm kiếm theo mã/tên. Lọc theo Cơ quan, Trạng thái (Bản nháp, Hoạt động) và Phiên bản qua các dropdown custom autocomplete. Cột Mã quy trình và cột Nhóm giám sát không hiển thị trên danh sách.
  - Chặn xóa quy trình đang "Hoạt động" và cảnh báo bằng Popup Modal lỗi.
- **Cấu hình Quy trình**:
  - Nút **Lưu** (lưu nháp) và nút **Phát hành** (chuyển sang Hoạt động; mờ đi nếu đã hoạt động).
  - Dropdown Cơ quan áp dụng: Hỗ trợ autocomplete (gõ tìm kiếm nhanh), ghim tìm kiếm sticky đầu. Khi chọn nhiều và vượt quá chiều rộng thực tế của dropdown, text hiển thị sẽ được cắt bằng dấu `...` và thêm badge số lượng dư `+ [số còn lại]` có màu xanh dương nhạt, cỡ chữ nhỏ hơn và font-weight thường. Khi hover chuột hiển thị tooltip bo góc hiển thị danh sách đầy đủ. Cấu hình Cơ quan áp dụng hiển thị rộng thành 1 hàng đầy đủ. Nhóm giám sát được loại bỏ khỏi cấu hình.
- **Thiết kế Luồng bước (UML)**:
  - Khóa luồng bước không cho sửa khi trạng thái quy trình là "Hoạt động".
  - **Sắp xếp thứ tự bước bằng Kéo thả (Drag & Drop)**: Hỗ trợ kéo thả các bước xử lý không cố định (không phải Start/End) trong danh sách để thay đổi thứ tự. Thứ tự mới sẽ tự động cập nhật liên kết `parentNodeId` và hành động `Chuyển xử lý` trỏ sang bước kế tiếp tương ứng.
  - **Cấu hình Cơ quan & Người xử lý theo Trạng thái**:
    - Trạng thái `Bắt đầu` (Khởi tạo chỉ đạo): Mặc định lưu tên người tạo chỉ đạo xuống backend, không hiển thị trên view.
    - Trạng thái `Chờ phân công`: Cho phép chọn nhiều cơ quan. Người xử lý mặc định là lãnh đạo của các cơ quan đó (không cho sửa). Lưu danh sách cơ quan được phân công.
    - Trạng thái `Đang xử lý`: Cơ quan mặc định là tất cả các cơ quan trong danh sách cơ quan được phân công (khóa chỉnh sửa). Người xử lý được chọn từ danh sách nhân viên trong các cơ quan đó dưới dạng dropdown nhóm nhân viên theo cơ quan, cho phép tìm kiếm theo cơ quan, theo tên và chọn nhiều người xử lý.
    - Trạng thái `Đã có báo cáo`: Cơ quan và người xử lý mặc định là danh sách cơ quan được phân công và lãnh đạo của cơ quan tương ứng (khóa chỉnh sửa).
    - Trạng thái `Đã kết thúc`, `Chờ phê duyệt` (hoặc `Phê duyệt báo cáo`): Cơ quan mặc định là "Tỉnh Gia Lai", người xử lý mặc định là người tạo chỉ đạo đã được lưu dưới backend (khóa chỉnh sửa).
    - Các trường là mặc định: Khóa tương tác chỉnh sửa (view-only), hiển thị tooltip chi tiết khi hover chuột.
  - **UML đồng bộ động bằng SVG overlay**: Sử dụng một lớp SVG overlay phủ trên sơ đồ để tính toán tọa độ (x, y) thực tế của các node hình tròn và tự động vẽ các đường mũi tên rẽ nhánh/quay lui hoặc đi thẳng dựa trên cấu hình hành động thực tế của từng bước.
  - Cấu hình hành động: Bỏ node `Bắt đầu` (Start) và `Kết thúc` (End) khỏi danh sách dropdown lựa chọn "Bước tiếp nhận" của các hành động. Trạng thái "Chờ phê duyệt" có thêm hành động "Trả xử lý" mặc định trỏ về bước liền trước (`parentNodeId`). Mặc định có 1 bước Chuyển xử lý.
  - Mô tả ngắn của bước: Bị khóa chỉnh sửa khi quy trình ở trạng thái Hoạt động.

## 3. Báo cáo thống kê chỉ đạo
- **Bộ lọc**: Vai trò (Tỉnh/Sở), Khoảng thời gian (Tuần/Tháng/Quý/Năm/Tùy chọn), Đơn vị (Sở hoặc Phòng ban).
- **Thống kê & Biểu đồ**: Hiển thị KPI chỉ đạo, biểu đồ tròn phân bổ trạng thái, biểu đồ đường xu hướng và bảng hiệu suất công việc kèm nút xuất dữ liệu (Excel/PDF/Word).

## 4. Xử lý chỉ đạo (Đơn vị mô phỏng)
- **Mô phỏng đa cấp**: Phân vai Sở (Lãnh đạo), Phòng ban, Cá nhân. Hiển thị dạng Danh sách hoặc Kanban (5 trạng thái).
- **Quỹ thời gian (SLA)**: Cảnh báo đồng hồ màu (Đỏ/Vàng/Xanh). Click vào đồng hồ mở lịch mốc thời gian. Hỗ trợ cảnh báo khoảng lùi thời gian khi phân công.
- **Popup Chi tiết hồ sơ**:
  - Cột trái: Thông tin văn bản, liên kết Dashboard, xem hình ảnh và nhật ký lịch sử (tô đỏ các sự kiện trễ hạn).
  - Cột phải: Form xử lý theo vai trò (Báo cáo, Phân công, Phê duyệt, Yêu cầu làm lại kèm lưu lịch sử phiên bản).
