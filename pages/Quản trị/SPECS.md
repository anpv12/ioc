# Đặc tả Kỹ thuật & Nghiệp vụ (SPECS) — Phân hệ Quản trị

## 1. Cấu trúc Phân hệ & Component Chung

### 1.1 Khai báo Các Module Độc lập
Phân hệ Quản trị gồm 3 module nghiệp vụ chính:
- **Quản trị Quy trình động** (`quy-trinh-dong/index.html`): Quản lý mẫu quy trình xử lý công việc và phân công vai trò.
- **Báo cáo Thống kê** (`bao-cao-thong-ke/index.html`): Thống kê hiệu suất và tiến độ thực hiện chỉ đạo.
- **Xử lý Chỉ đạo** (`xu-ly-chi-dao/index.html`): Tiếp nhận, phân công, thực hiện và trình phê duyệt chỉ đạo.

## 2. Quản trị Quy trình động
- **Danh sách quy trình**:
  - Tìm kiếm theo mã/tên. Lọc theo Cơ quan, Nhóm giám sát, Trạng thái (Bản nháp, Hoạt động) và Phiên bản qua các dropdown custom autocomplete.
  - Chặn xóa quy trình đang "Hoạt động" và cảnh báo bằng Popup Modal lỗi.
- **Cấu hình Quy trình**:
  - Nút **Lưu** (lưu nháp) và nút **Phát hành** (chuyển sang Hoạt động; mờ đi nếu đã hoạt động).
  - Dropdown Cơ quan áp dụng, Nhóm giám sát: Hỗ trợ autocomplete (gõ tìm kiếm nhanh), ghim tìm kiếm sticky đầu. Khi chọn nhiều và vượt quá chiều rộng thực tế của dropdown, text hiển thị sẽ được cắt bằng dấu `...` và thêm badge số lượng dư `+ [số còn lại]` có màu xanh dương nhạt, cỡ chữ nhỏ hơn và font-weight thường. Khi hover chuột hiển thị tooltip bo góc hiển thị danh sách đầy đủ.
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

### 1.2 Component Khung Điều hướng (Sidebar Navigation & Shell)
- **Chức năng**:
  - Điều hướng người dùng giữa các module trong phân hệ Quản trị (Quy trình động, Báo cáo thống kê, Xử lý chỉ đạo).
  - Hỗ trợ thao tác mở rộng hoặc thu gọn danh mục menu.
  - Tự động lưu trạng thái thu gọn/mở rộng vào bộ nhớ cục bộ (`localStorage`).

## 4. Xử lý chỉ đạo (Đơn vị mô phỏng)
- **Mô phỏng đa cấp**: Phân vai Sở (Lãnh đạo), Phòng ban, Cá nhân. Hiển thị dạng Danh sách hoặc Kanban (5 trạng thái).
- **Quỹ thời gian (SLA)**: Cảnh báo đồng hồ màu (Đỏ/Vàng/Xanh). Click vào đồng hồ mở lịch mốc thời gian. Hỗ trợ cảnh báo khoảng lùi thời gian khi phân công.
- **Popup Chi tiết hồ sơ**:
  - Cột trái: Thông tin văn bản, liên kết Dashboard, xem hình ảnh và nhật ký lịch sử (tô đỏ các sự kiện trễ hạn).
  - Cột phải: Form xử lý theo vai trò (Báo cáo, Phân công, Phê duyệt, Yêu cầu làm lại kèm lưu lịch sử phiên bản).

## 5. Quản trị đơn vị (Quản trị viên đơn vị)
- Phạm vi hiện tại: chỉ Quản trị viên đơn vị tự cấu hình đúng 1 đơn vị của mình. Chưa làm màn hình danh sách đơn vị cho Quản trị viên tỉnh.
- **Thông tin đơn vị**: hiển thị Tên đơn vị, Loại hình, Địa chỉ, Điện thoại, Email (dữ liệu mẫu, không cho sửa ở giai đoạn này).
- **Người nhận mặc định**: hiển thị Avatar, Họ tên, Chức vụ, SĐT, Email, badge trạng thái "Đang hiệu lực" nếu đã cấu hình; hiển thị "Chưa cấu hình" nếu chưa có.
- Nút **Thiết lập / Sửa người nhận** mở Modal "Chọn người nhận mặc định": danh sách người dùng thuộc đơn vị hiện tại (dữ liệu mẫu), chọn đúng 1 người (single-select), có ô tìm kiếm theo tên, nút Hủy/Lưu. Lưu xong cập nhật lại khối Người nhận mặc định trên màn hình chính (Save = Populate).
