# Đặc tả Nghiệp vụ Tổng quan — Phân hệ Quản trị chỉ đạo

## 1. Tổng quan Phân hệ
Phân hệ Quản trị chỉ đạo tỉnh Gia Lai phục vụ việc thiết lập mẫu quy trình, theo dõi tiến độ xử lý chỉ đạo điều hành và tổng hợp báo cáo thống kê hiệu suất công việc. Phân hệ bao gồm 3 phân hệ nghiệp vụ chính:

1. **Quản trị Quy trình động**: Xây dựng, cấu hình và phát hành các mẫu quy trình xử lý công việc.
2. **Xử lý Chỉ đạo**: Phân công, thực hiện, báo cáo kết quả và trình duyệt chỉ đạo điều hành.
3. **Báo cáo Thống kê**: Thống kê, phân tích tiến độ thực hiện chỉ đạo theo đơn vị và theo lãnh đạo.

## 2. Quản trị Quy trình Động
- **Danh sách mẫu quy trình**: Tìm kiếm theo tên hoặc mã quy trình. Cho phép lọc theo cơ quan áp dụng, nhóm giám sát và trạng thái. Quy trình đang ở trạng thái Hoạt động không được phép xóa.
- **Cấu hình thông tin quy trình**: Hỗ trợ chọn cơ quan áp dụng và nhóm giám sát. Khi chọn nhiều cơ quan, giao diện tự động thu gọn và hiển thị danh sách đầy đủ khi rê chuột.
- **Thiết kế sơ đồ quy trình**:
  - Hỗ trợ kéo thả để thay đổi thứ tự các bước xử lý. Sơ đồ liên kết đường đi giữa các bước tự động cập nhật tương ứng.
  - Mỗi bước được cấu hình danh sách hành động (Chuyển xử lý, Báo cáo, Trình duyệt, Trả về).
  - Đối với quy trình đã phát hành, sơ đồ các bước được khóa không cho chỉnh sửa để đảm bảo tính ổn định.

## 3. Xử lý Chỉ đạo
- **Theo dõi đa dạng**: Hỗ trợ xem danh sách công việc ở dạng Bảng dữ liệu hoặc Bảng Kanban theo các trạng thái xử lý.
- **Đồng hồ thời hạn (SLA)**: Theo dõi quỹ thời gian xử lý công việc kèm cảnh báo màu (Đúng hạn, Sắp đến hạn, Trễ hạn).
- **Hồ sơ chi tiết chỉ đạo**:
  - Xem văn bản chỉ đạo, xem tệp đính kèm và xem nhật ký tiến độ xử lý.
  - Cán bộ thực hiện nhập nội dung báo cáo kết quả và trình duyệt. Hệ thống tự động ghi nhận hình ảnh màn hình tại thời điểm nộp báo cáo.

## 4. Báo cáo Thống kê Chỉ đạo
- **Bộ lọc kỳ báo cáo**: Lọc chỉ đạo theo Tuần, Tháng, Quý, Năm hoặc khoảng ngày tùy chọn.
- **Thống kê 2 chiều**: Thống kê theo Đơn vị thực hiện hoặc theo Lãnh đạo chỉ đạo.
- **Chi tiết chỉ đạo (Drill-down)**: Nhấp vào số liệu thống kê để xem danh sách chỉ đạo chi tiết tương ứng.
- **Xuất dữ liệu**: Xuất bảng báo cáo thống kê ra tệp Excel.
