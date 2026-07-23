# SPECS — Phân hệ Quản trị

Phân hệ Quản trị gồm 6 màn hình chức năng chính, hoạt động dưới dạng prototype UI (quản lý state trên bộ nhớ tạm thời).

## 1. Quản lý Dashboard & Layout & Loại biểu đồ
- **Quản lý Dashboard**: Danh sách tĩnh (3 bản ghi). Cho phép Thêm mới, Sửa, Xem, Chia sẻ, Quản lý thành viên, Cấu hình và Xóa.
- **Quản lý Layout**: Danh sách tĩnh (10 bản ghi). Cho phép Thêm mới, Sửa và Xóa.
- **Loại biểu đồ**: Danh sách phân trang (62 bản ghi, cỡ trang 10/20/50) hiển thị tên, mã, nhóm và ảnh thumb của biểu đồ.

## 2. Quản trị Quy trình động
- **Danh sách**: Tìm kiếm theo tên/mã; lọc theo Cơ quan, Nhóm giám sát, Hoạt động, Phiên bản.
- **Cấu hình Quy trình**:
  - Thông tin chung: Tên, phiên bản, nhóm giám sát (chọn đơn), cơ quan áp dụng (chọn nhiều tag-chip), mô tả.
  - Luồng quy trình: Cột trái hiển thị danh sách bước; cột phải hiển thị biểu đồ UML trực quan (cho phép Zoom/Pan).
  - Cấu hình bước: "Thêm bước mới" cấu hình tên bước, trạng thái, cơ quan xử lý (chọn nhiều), người xử lý tự động gán theo cơ quan, mô tả.
  - Bước quyết định (hình thoi): Dành cho trạng thái "Phê duyệt báo cáo" gồm 2 nhánh rẽ trực tiếp trên UML là Phê duyệt và Từ chối.
  - Tạo bản sao: Sao chép luồng, tự động tăng phiên bản (+0.1) và mở form chỉnh sửa.

## 3. Báo cáo thống kê chỉ đạo
- **Bộ lọc**: Vai trò (Lãnh đạo Tỉnh/Sở), Khoảng thời gian (Tuần/Tháng/Quý/Năm/Tùy chọn), Từ ngày/Đến ngày, Đơn vị (Sở/Ban/Ngành đối với vai trò Tỉnh; chuyển thành danh sách các Phòng chuyên môn đối với vai trò Sở).
- **KPI**: Tổng số chỉ đạo, số hoàn thành (tỷ lệ đúng/trễ hạn), số đang xử lý (tỷ lệ trong/quá hạn), tỷ lệ yêu cầu làm lại.
- **Biểu đồ**: Biểu đồ tròn (Phân bổ 5 trạng thái nghiệp vụ, có tooltip và nhãn phụ chú thích nguồn số liệu) và Biểu đồ đường (Xu hướng so sánh Tiếp nhận mới và Đã hoàn thành).
- **Bảng hiệu suất**: Thống kê số lượng việc giao, hoàn thành, đúng hạn, yêu cầu làm lại theo Sở hoặc Phòng chuyên môn. Hỗ trợ nút xuất Excel, PDF, Word giả lập.

## 4. Xử lý chỉ đạo (Đơn vị mô phỏng)
Mô phỏng quy trình tiếp nhận, giao việc và báo cáo chỉ đạo đa cấp (Tỉnh → Sở → Phòng → Cá nhân).

### 4.1. Bộ lọc và Chế độ hiển thị
- **Mô phỏng vai trò**: Chuyển đổi linh hoạt giữa 3 vai trò: Sở (Leader), Phòng (Department), Cá nhân (Individual).
- **Chế độ hiển thị**: Dạng Danh sách (Table) và Kanban. Cả 2 sử dụng chung 5 trạng thái nghiệp vụ:
  1. *Cần phân công*: Chỉ đạo mới đến hoặc bị trả về chưa phân công.
  2. *Đang xử lý*: Đang tự xử lý hoặc cấp dưới đang thực hiện.
  3. *Chờ duyệt*: Đã nộp báo cáo và đang chờ cấp trên phê duyệt.
  4. *Cần duyệt*: Cấp dưới đã nộp báo cáo, chờ tài khoản hiện tại phê duyệt.
  5. *Đã hoàn thành*: Đã được phê duyệt kết quả cuối cùng.
- **Bộ lọc**: Ô tìm kiếm (Enter/click nút tìm để áp dụng), bộ lọc trạng thái (chọn đơn), khoảng ngày hạn xử lý (Flatpickr), và tình trạng quỹ thời gian (Còn hạn, Sắp đến hạn, Trễ hạn).

### 4.2. Quỹ thời gian & Cảnh báo hạn (SLA)
- **Cảnh báo màu**: Hiển thị biểu tượng đồng hồ: Đỏ (trễ hạn/quá deadline), Vàng (sắp đến hạn, <= 3 ngày), Xanh lá (còn hạn, > 3 ngày).
- **Lịch quỹ thời gian**: Click vào đồng hồ mở popover lịch, tô màu đánh dấu 3 mốc: Ngày ban hành (Start), Ngày hiện tại (Today) và Hạn xử lý (Deadline).
- **Cảnh báo khoảng lùi**: Khi phân công đa cấp, nếu `Hạn xử lý của Tỉnh` trừ đi `Tổng khoảng lùi (số ngày nộp trước hạn của các cấp con)` nhỏ hơn `Ngày hiện tại`, hệ thống hiển thị cảnh báo đỏ và yêu cầu Lãnh đạo Sở điều chỉnh lại hạn xử lý con trước khi "Chuyển xử lý".

### 4.3. Popup Chi tiết Hồ sơ (Bố cục 2 cột)
- **Cột trái**: Thông tin chỉ đạo, tệp đính kèm và Accordion "Lịch sử xử lý văn bản" (mặc định đóng, ghi nhận nhật ký tất cả sự kiện, người thực hiện, hành động và file đính kèm). Các sự kiện xử lý sau hạn được tô nền đỏ nhạt trong lịch sử.
- **Cột phải (Biểu mẫu tương tác theo vai trò & trạng thái)**:
  - **Sở trực tiếp**: Hiện biểu mẫu nhập báo cáo, đính kèm file và nút "Trình duyệt báo cáo".
  - **Sở phân công**: Dropdown chọn quy trình động. Tự động hiển thị các node đơn vị thực thi bên dưới. Nút "Chuyển xử lý" kích hoạt chạy luồng con.
  - **Phòng / Cá nhân**: Nhập nội dung báo cáo, chọn tệp và nút "Trình duyệt báo cáo" gửi lên cấp trên trực tiếp.
  - **Quy trình duyệt & Yêu cầu làm lại**: Cấp trên xem báo cáo và file của cấp dưới, có quyền "Phê duyệt" để chuyển tiếp hoặc "Yêu cầu làm lại" (bắt buộc nhập lý do). Báo cáo cũ được lưu thành phiên bản lịch sử độc lập, không bị ghi đè.
  - **Tỉnh từ chối phê duyệt**: Hồ sơ chuyển về "Cần xử lý" tại Sở. Lãnh đạo Sở có 2 tùy chọn xử lý:
    1. *Kế thừa quy trình & yêu cầu làm lại*: Giữ nguyên cây thực thi, chuyển trạng thái riêng các node con bị lỗi về "Cần làm lại" để xử lý lại, các node con khác được giữ nguyên dữ liệu báo cáo cũ.
    2. *Chọn lại quy trình*: Hủy quy trình hiện tại để thiết lập và chạy lại vòng xử lý hoàn toàn mới.

### 4.4. Dữ liệu chạy thử
- **CD-2026-TEST-01**: Khởi tạo ở vai trò Sở (Cần phân công), còn hạn. Dùng để chạy thử quy trình phân công đa cấp qua 3 vai trò.
- **CD-2026-TEST-02**: Khởi tạo ở trạng thái Đang xử lý trực tiếp, tình trạng Trễ hạn. Dùng để kiểm tra việc tiếp tục báo cáo, phê duyệt và hoàn thành sau hạn (ghi nhận sự kiện sau hạn nền đỏ nhạt trong nhật ký).
