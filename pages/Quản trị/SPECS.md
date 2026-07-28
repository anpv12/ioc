# Đặc tả Kỹ thuật & Nghiệp vụ (SPECS) — Phân hệ Quản trị

## 1. Cấu trúc Phân hệ & Component Chung

### 1.1 Khai báo Các Module Độc lập
Phân hệ Quản trị gồm 3 module nghiệp vụ chính:
- **Quản trị Quy trình động** (`quy-trinh-dong/index.html`): Quản lý mẫu quy trình xử lý công việc và phân công vai trò.
- **Báo cáo Thống kê** (`bao-cao-thong-ke/index.html`): Thống kê hiệu suất và tiến độ thực hiện chỉ đạo.
- **Xử lý Chỉ đạo** (`xu-ly-chi-dao/index.html`): Tiếp nhận, phân công, thực hiện và trình phê duyệt chỉ đạo.

**Quy tắc phân tách File JS & Thứ tự Nạp (Load Order)**:
- Mỗi module đều phân tách tệp `data.js` (chứa toàn bộ dữ liệu mẫu, không chứa logic UI) và `ui.js` (chứa logic UI và DOM).
- Thứ tự nạp JS bắt buộc: `admin-shared.js` → `data.js` → `ui.js`.

### 1.2 Component Khung Điều hướng (Sidebar Navigation & Shell)
- **Chức năng**:
  - Điều hướng người dùng giữa các module trong phân hệ Quản trị (Quy trình động, Báo cáo thống kê, Xử lý chỉ đạo).
  - Hỗ trợ thao tác mở rộng hoặc thu gọn danh mục menu.
  - Tự động lưu trạng thái thu gọn/mở rộng vào bộ nhớ cục bộ (`localStorage`).

### 1.3 Component Hộp thoại Xác nhận & Thông báo (Confirm Dialog & Toast Notification)
- **Chức năng**:
  - Hiển thị hộp thoại xác nhận với câu hỏi nghiệp vụ chung trước khi thực hiện các thao tác quan trọng (Chuyển xử lý, Trình phê duyệt, Trả về).
  - Tự động hiển thị thông báo Toast ghi nhận kết quả thao tác thành công sau khi người dùng xác nhận.

---

## 2. Danh sách Component & Chức năng theo Module

### 2.1 Module Quản trị Quy trình động

#### Component Danh sách Quy trình
- **Chức năng**:
  - Tìm kiếm quy trình theo mã hoặc tên quy trình.
  - Bộ lọc danh sách theo Cơ quan áp dụng, Phiên bản và Trạng thái (Bản nháp / Hoạt động).
  - Ngăn chặn thao tác xóa đối với các quy trình đang ở trạng thái Hoạt động.

#### Component Cấu hình Luồng & Bước Quy trình
- **Chức năng**:
  - Khai báo thông tin tên, mô tả và danh sách các bước xử lý trong quy trình.
  - Chọn danh sách Cơ quan áp dụng quy trình.
  - Sắp xếp thứ tự thực hiện giữa các bước (thay đổi vị trí bước).
  - Tự động cập nhật sơ đồ luồng chuyển tiếp và vẽ mũi tên liên kết giữa các bước.
  - Hỗ trợ lưu nháp hoặc phát hành quy trình để áp dụng vào thực tế.

#### Component Cấu hình Người xử lý theo Trạng thái Bước
- **Chức năng**:
  - Gán quyền và vai trò xử lý cho từng bước trong quy trình:
    - *Chờ phân công*: Lãnh đạo các cơ quan được chọn áp dụng.
    - *Đang xử lý*: Chuyên viên thuộc phòng ban chuyên môn của cơ quan.
    - *Đã có báo cáo*: Lãnh đạo cơ quan xem xét báo cáo.
    - *Chờ phê duyệt / Đã kết thúc*: Lãnh đạo Tỉnh (Người ban hành chỉ đạo).

---

### 2.2 Module Báo cáo Thống kê Chỉ đạo

#### Component Bộ lọc Thống kê
- **Chức năng**:
  - Lọc dữ liệu báo cáo theo Vai trò (Tỉnh / Sở), Đơn vị thực hiện và Khoảng thời gian.

#### Component Biểu đồ & Bảng Thống kê Hiệu suất
- **Chức năng**:
  - Tổng hợp tỷ lệ phân bổ chỉ đạo theo các trạng thái xử lý (biểu đồ tròn).
  - Thống kê xu hướng thực hiện chỉ đạo theo thời gian (biểu đồ đường).
  - Bảng tổng hợp hiệu suất xử lý chỉ đạo chi tiết theo từng đơn vị/phòng ban.
  - Xuất dữ liệu thống kê ra các định dạng tệp (Excel / PDF / Word).

---

### 2.3 Module Xử lý Chỉ đạo

#### Component Bộ lọc & Phân loại Tab Danh sách
- **Chức năng**:
  - Phân loại chỉ đạo thành 2 danh sách theo Tab (*Đang xử lý* và *Đã xử lý*) phù hợp với từng vai trò người dùng.
  - Tìm kiếm chỉ đạo theo Mã chỉ đạo hoặc Nội dung chỉ đạo.
  - Lọc danh sách theo Trạng thái quy trình, Tình trạng thời hạn (Còn hạn / Trễ hạn) và Lịch chọn hạn xử lý.

#### Component Bảng Danh sách Chỉ đạo
- **Chức năng**:
  - Hiển thị danh sách các chỉ đạo gồm: STT, Nội dung chỉ đạo, Nhóm dữ liệu, Ngày ban hành, Tình trạng thời hạn xử lý, Trạng thái quy trình.
  - Cung cấp nút thao tác mở Form Chi tiết chỉ đạo.
  - Tích hợp cụm Phân trang và tùy chỉnh số lượng bản ghi hiển thị trên mỗi trang.

#### Component Form Chi tiết Chỉ đạo (Overlay Modal)
- **Chức năng**:
  - **Mục Thông tin Chỉ đạo**: Hiển thị chi tiết nội dung chỉ đạo, nhóm dữ liệu, thời hạn xử lý, người ban hành, ngày ban hành, liên kết tới trang Dashboard chuyên ngành và hình ảnh đính kèm.
  - **Mục Ghi chú Thêm của Đơn vị**: Cho phép nhập bổ sung ghi chú và tệp đính kèm ở bước phân công; chuyển sang chế độ chỉ đọc khi sang các bước tiếp theo.
  - **Mục Chọn người xử lý & Phân công**: Cho phép Lãnh đạo Sở chọn Chuyên viên xử lý từ danh sách (chỉ hiển thị họ tên) để chuyển giao công việc.
  - **Mục Báo cáo Kết quả của Đơn vị**: Nơi Chuyên viên nhập nội dung báo cáo kết quả và đính kèm tệp gửi lên Lãnh đạo; lưu trữ lịch sử báo cáo qua các lần nộp/trả về.
  - **Mục Xem xét & Trình Tỉnh**: Cho phép Lãnh đạo Sở nhập báo cáo tổng hợp để trình Tỉnh phê duyệt hoặc thực hiện Trả về yêu cầu Chuyên viên chỉnh sửa bổ sung (lưu lại lý do trả về).
  - **Mục Trạng thái Thông báo**: Hiển thị tóm tắt tiến độ và kết quả phê duyệt của chỉ đạo khi chuyển sang tab *Đã xử lý*.
  - **Mục Sơ đồ Luồng Quy trình (UML)**: Hiển thị minh họa trực quan các bước trong quy trình động và đánh dấu vị trí bước hiện tại của chỉ đạo.

#### Component Xem Hình ảnh Đính kèm (Image Viewer Modal)
- **Chức năng**:
  - Hiển thị phóng to hình ảnh đính kèm Dashboard để người dùng kiểm tra chi tiết số liệu.

---

## 3. Quy trình & Luồng Nghiệp vụ (Business Workflow)

### 3.1 Vòng đời 5 Trạng thái của Chỉ đạo
1. **Chờ phân công** (`waitingAssign`): Chỉ đạo được ban hành từ Tỉnh gửi về Sở, Lãnh đạo Sở tiếp nhận và chưa phân công cán bộ xử lý.
2. **Đang xử lý** (`processing`): Lãnh đạo Sở phân công cho Chuyên viên; Chuyên viên tiếp nhận và tiến hành thực hiện nhiệm vụ.
3. **Đã có báo cáo** (`reported`): Chuyên viên nộp báo cáo kết quả; Lãnh đạo Sở xem xét (có thể *Trả về* cho Chuyên viên làm lại hoặc *Trình Tỉnh*).
4. **Chờ phê duyệt** (`waitingApproval`): Lãnh đạo Sở đã trình báo cáo lên Tỉnh; đang chờ Lãnh đạo Tỉnh xem xét phê duyệt (có thể *Đồng ý* hoặc *Từ chối*).
5. **Đã kết thúc** (`completed`): Tỉnh đồng ý phê duyệt báo cáo; chỉ đạo chính thức hoàn thành.

### 3.2 Quy tắc Phân loại Tab theo Vai trò Người dùng
- **Vai trò Lãnh đạo Sở (`leader`)**:
  - *Tab Đang xử lý*: Chứa các chỉ đạo ở trạng thái `Chờ phân công` và `Đã có báo cáo` (cần Lãnh đạo thao tác phân công hoặc xét duyệt).
  - *Tab Đã xử lý*: Chứa các chỉ đạo ở trạng thái `Đang xử lý` (đã giao chuyên viên), `Chờ phê duyệt` (đã trình Tỉnh) và `Đã kết thúc`.
- **Vai trò Chuyên viên (`individual`)**:
  - *Tab Đang xử lý*: Chứa các chỉ đạo ở trạng thái `Đang xử lý` (cần Chuyên viên làm và nộp báo cáo).
  - *Tab Đã xử lý*: Chứa các chỉ đạo ở trạng thái `Đã có báo cáo` (đã nộp cho Lãnh đạo), `Chờ phê duyệt` và `Đã kết thúc`.

### 3.3 Tương tác & Xử lý Dữ liệu trong Modal Chi tiết
- **Làm mới dữ liệu tại chỗ**: Sau khi thực hiện các hành động (*Chuyển xử lý*, *Trình phê duyệt*, *Trả về*), Form modal không đóng lại mà tự động làm mới dữ liệu và sơ đồ luồng quy trình mới nhất, đồng thời bật thông báo Toast thành công. Form chỉ đóng khi người dùng chủ động đóng.
- **Xác nhận thao tác**: Mọi hành động làm thay đổi trạng thái chỉ đạo đều yêu cầu người dùng xác nhận qua hộp thoại Confirm với câu hỏi nghiệp vụ chung trước khi thực hiện.
