# Đặc tả Kỹ thuật & Nghiệp vụ: Trang Quản trị Quy trình Động (pages/Quản trị/quy-trinh-dong)

> Tệp `js/ui.js` được làm sạch mã nguồn Clean Code & DRY: Loại bỏ các phần tử DOM rác trong đối tượng `elements` (`notice`, `close`, `scopeContainer`, `filterScopeContainer`), dọn dẹp hàm chết `getActionName`, `renderFilterScopeChoices` và lược bỏ các thuộc tính rác legacy.

## 1. Khai báo các Component & Chức năng

- **Component Thanh Công cụ & Tìm kiếm**:
  - **Ô Tìm kiếm**: Tìm kiếm quy trình theo Tên quy trình hoặc Mã quy trình.
  - **Nút Bật/Tắt Bộ lọc**: Mở rộng hoặc thu gọn khung bộ lọc danh sách quy trình.
  - **Nút Tìm kiếm & Nút Làm mới**: Thực hiện lọc dữ liệu hoặc làm mới danh sách quy trình về mặc định.
  - **Nút Thêm mới**: Mở Form Editor để tạo một mẫu quy trình động mới ở dạng Bản nháp.

- **Component Bộ lọc Danh sách (Filter Panel)**:
  - **Bộ lọc Cơ quan**: Dropdown danh sách chọn nhiều (multiselect) để lọc quy trình áp dụng theo từng Cơ quan/Sở ngành.
  - **Bộ lọc Trạng thái**: Dropdown danh sách chọn nhiều để lọc quy trình theo trạng thái (*Bản nháp*, *Hoạt động*).
  - **Ô Lọc Phiên bản**: Nhập ký tự để lọc theo số hiệu phiên bản quy trình.

- **Component Bảng Danh sách Quy trình**:
  - Hiển thị danh sách các mẫu quy trình gồm các cột: Tên quy trình, Phiên bản, Cơ quan áp dụng, Trạng thái (Bản nháp / Hoạt động), Ngày tạo, Cột Xử lý (Nút xem/chỉnh sửa, Nút tạo bản sao, Nút xóa quy trình).
  - **Quy tắc Chặn xóa Quy trình Hoạt động**: Khi quy trình đang ở trạng thái *Hoạt động*, nút Xóa sẽ tự động chặn và hiển thị thông báo cảnh báo lỗi không cho phép xóa quy trình đang áp dụng.

- **Component Cụm Phân trang**:
  - Cung cấp các nút điều hướng chuyển trang (Trang đầu, Trang trước, Các trang số, Trang sau, Trang cuối).
  - Dropdown chọn số lượng bản ghi hiển thị trên mỗi trang (10, 20, 50 bản ghi/trang).

- **Component Form Editor Cấu hình Quy trình (Process Editor Overlay Modal)**:
  - **Thanh Header Editor**:
    - Tiêu đề modal và các nút thao tác: *Trở về* (hủy chỉnh sửa), *Tạo bản sao* (sao chép quy trình thành bản nháp mới), *Lưu nháp* (lưu thông tin quy trình), *Phát hành* (chuyển quy trình sang trạng thái Hoạt động).
  - **Thẻ Thông tin Quy trình (General Info Card)**:
    - Ô nhập Tên quy trình (bắt buộc, tối đa 120 ký tự).
    - Ô hiển thị Phiên bản quy trình (chỉ đọc, mặc định `1.0` đối với bản nháp mới).
    - Ô chọn Cơ quan áp dụng (multiselect autocomplete có tính năng tìm kiếm và rút gọn danh sách).
    - Ô nhập Mô tả quy trình.
  - **Thẻ Luồng Quy trình (Flow Workspace Card)**:
    - *Cột Danh sách bước xử lý*: Nút *Thêm bước mới*, danh sách các bước xử lý tích hợp tính năng Kéo thả (Drag & Drop) để sắp xếp thứ tự các bước (tự động cập nhật mối quan hệ nút cha `parentNodeId`).
    - *Cột Biểu đồ mô tả quy trình*: Sơ đồ đồ họa biểu diễn trực quan cấu trúc các bước và vẽ đường liên kết mũi tên điều hướng giữa các bước trong quy trình.

- **Component Popup Cấu hình Chi tiết Bước (Step Config Modal)**:
  - Cho phép người dùng chỉnh sửa thông tin của từng bước: Tên bước, Loại bước (Start, Task, Approval, End), Trạng thái bước (`waitingAssign`, `processing`, `reported`, `waitingApproval`, `completed`) và Phân quyền người xử lý.

- **Component Popup Cấu hình Hành động & Rẽ nhánh (Step Actions Modal)**:
  - Quản lý danh sách các hành động chuyển tiếp từ bước hiện tại đến các bước tiếp theo trong quy trình.
  - Thiết lập tên hành động (ví dụ: *Phân công*, *Nộp báo cáo*, *Trình Tỉnh*, *Trả về*), gán bước đích và tự động đồng bộ đường vẽ mũi tên chuyển tiếp trên Biểu đồ quy trình.

- **Component Popup Xác nhận & Toast Notification**:
  - Popup xác nhận người dùng trước khi thực hiện các hành động quan trọng (Phát hành quy trình, Tạo bản sao, Xóa quy trình).
  - Thông báo Toast ghi nhận kết quả thực hiện thành công.

---

## 2. Quy trình & Luồng Xử lý Nghiệp vụ (Business Workflow)

### 2.1 Vòng đời Mẫu Quy trình Động
1. **Tạo mới (Bản nháp)**: Khi người dùng nhấn *Thêm mới* hoặc *Tạo bản sao*, một mẫu quy trình mới được tạo ở trạng thái **Bản nháp** với phiên bản khởi tạo `1.0`.
2. **Chỉnh sửa & Cấu hình**: Người dùng tự do khai báo tên quy trình, chọn cơ quan áp dụng, thêm/xóa/sắp xếp thứ tự các bước và thiết lập hành động rẽ nhánh.
3. **Phát hành (Hoạt động)**:
   - Khi người dùng nhấn nút *Phát hành*, hệ thống kiểm tra điều kiện hợp lệ của quy trình (phải có bước bắt đầu Start, bước kết thúc End và đường nối luồng liên tục).
   - Sau khi Phát hành thành công, quy trình chuyển sang trạng thái **Hoạt động**.
   - Khi ở trạng thái **Hoạt động**: Quy trình bị khóa không cho phép sửa đổi thông tin cốt lõi, mờ nút Phát hành, và **ngăn chặn tuyệt đối thao tác xóa** để đảm bảo tính toàn vẹn dữ liệu cho các chỉ đạo đang chạy.
4. **Tạo bản sao (Clone)**: Người dùng có thể nhân bản một quy trình (kể cả quy trình đang Hoạt động) thành một mẫu quy trình mới ở dạng **Bản nháp** để thực hiện cải tiến hoặc điều chỉnh phiên bản.

### 2.2 Quy tắc Phân quyền Người xử lý theo Trạng thái Bước
Hệ thống áp dụng quy tắc phân quyền người xử lý theo từng loại trạng thái bước trong quy trình:
- **Trạng thái `Chờ phân công`**: Gán quyền mặc định cho Lãnh đạo các cơ quan được chọn áp dụng quy trình.
- **Trạng thái `Đang xử lý`**: Cho phép cấu hình chọn danh sách Chuyên viên thuộc phòng ban chuyên môn của cơ quan thực hiện nhiệm vụ.
- **Trạng thái `Đã có báo cáo`**: Gán quyền mặc định cho Lãnh đạo cơ quan xem xét và duyệt báo cáo.
- **Trạng thái `Chờ phê duyệt` & `Đã kết thúc`**: Gán quyền mặc định cho Lãnh đạo Tỉnh (Người ban hành chỉ đạo).

### 2.3 Luồng Chuyển tiếp & Rẽ nhánh Biểu đồ Quy trình
- Mọi thao tác thêm/sửa/xóa bước hoặc thay đổi thứ tự bước (kéo thả) đều tự động tính toán lại mối quan hệ liên kết và cập nhật ngay lập tức lên Biểu đồ mô tả quy trình.
- Các hành động rẽ nhánh (bao gồm luồng chuyển tiếp xuôi và luồng trả về) được tự động vẽ thành đường liên kết đồ họa với mũi tên hướng tới bước đích tương ứng.
