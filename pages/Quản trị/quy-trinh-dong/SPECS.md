# Đặc tả Nghiệp vụ: Trang Quản trị Quy trình Động (pages/Quản trị/quy-trinh-dong)

## 1. Danh sách các Component & Ý nghĩa Chức năng

- **Component Thanh Công cụ & Tìm kiếm**:
  - **Ô Tìm kiếm**: Tìm kiếm quy trình theo Tên quy trình hoặc Mã quy trình.
  - **Nút Bật/Tắt Bộ lọc**: Mở rộng hoặc thu gọn khung bộ lọc danh sách quy trình.
  - **Nút Tìm kiếm & Nút Làm mới**: Lọc dữ liệu hoặc xóa sạch điều kiện lọc để về mặc định.
  - **Nút Thêm mới**: Mở Form Editor để tạo một mẫu quy trình động mới ở dạng Bản nháp.

- **Component Bộ lọc Danh sách (Filter Panel)**:
  - **Bộ lọc Cơ quan**: Dropdown chọn nhiều (multiselect) để lọc quy trình áp dụng theo từng Cơ quan/Sở ngành.
  - **Bộ lọc Trạng thái**: Dropdown chọn nhiều để lọc quy trình theo trạng thái (*Bản nháp*, *Hoạt động*).
  - **Ô Lọc Phiên bản**: Nhập ký tự để lọc theo số hiệu phiên bản quy trình.

- **Component Bảng Danh sách Quy trình**:
  - Hiển thị danh sách các mẫu quy trình gồm các cột: Tên quy trình, Phiên bản, Cơ quan áp dụng, Trạng thái (Bản nháp / Hoạt động), Ngày tạo, Cột Xử lý (Nút xem/chỉnh sửa, Nút tạo bản sao, Nút xóa quy trình).
  - **Quy tắc Chặn xóa Quy trình Hoạt động**: Khi quy trình đang ở trạng thái *Hoạt động*, nút Xóa sẽ tự động chặn và hiển thị thông báo cảnh báo lỗi không cho phép xóa quy trình đang áp dụng.

- **Component Cụm Phân trang**:
  - Các nút điều hướng chuyển trang (Trang đầu, Trang trước, Các trang số, Trang sau, Trang cuối).
  - Dropdown chọn số lượng bản ghi hiển thị trên mỗi trang (10, 20, 50 bản ghi/trang).

- **Component Form Editor Cấu hình Quy trình (Process Editor Overlay Modal)**:
  - **Thanh Header Editor**:
    - Tiêu đề modal và các nút thao tác: *Trở về* (hủy chỉnh sửa), *Tạo bản sao* (sao chép quy trình thành bản nháp mới), *Lưu nháp* (lưu thông tin quy trình), *Phát hành* (chuyển quy trình sang trạng thái Hoạt động).
  - **Thẻ Thông tin Quy trình**:
    - Ô nhập Tên quy trình (bắt buộc, tối đa 120 ký tự).
    - Ô hiển thị Phiên bản quy trình (chỉ đọc, mặc định `1.0` đối với bản nháp mới).
    - Ô chọn Cơ quan áp dụng (multiselect autocomplete có tính năng tìm kiếm và rút gọn danh sách).
    - Ô nhập Mô tả quy trình.
  - **Thẻ Luồng Quy trình**:
    - *Danh sách bước xử lý*: Nút *Thêm bước mới*, danh sách các bước xử lý tích hợp tính năng Kéo thả để sắp xếp thứ tự các bước.
    - *Biểu đồ mô tả quy trình*: Sơ đồ biểu diễn trực quan cấu trúc các bước và đường liên kết mũi tên điều hướng giữa các bước trong quy trình.

- **Component Popup Cấu hình Chi tiết Bước (Step Config Modal)**:
  - Chỉnh sửa thông tin của từng bước: Tên bước, Loại bước (Bắt đầu, Xử lý, Duyệt, Kết thúc), Trạng thái bước và Phân quyền người xử lý.

- **Component Popup Cấu hình Hành động & Rẽ nhánh (Step Actions Modal)**:
  - Quản lý danh sách các hành động chuyển tiếp từ bước hiện tại đến các bước tiếp theo trong quy trình (ví dụ: *Phân công*, *Nộp báo cáo*, *Trình Tỉnh*, *Trả về*), gán bước đích và tự động đồng bộ trên Biểu đồ quy trình.

- **Component Popup Xác nhận & Toast Notification**:
  - Popup xác nhận người dùng trước khi thực hiện các hành động quan trọng (Phát hành quy trình, Tạo bản sao, Xóa quy trình, Thay đổi thứ tự/chỉnh sửa/xóa bước).
  - Thông báo Toast ghi nhận kết quả thực hiện thành công.

---

## 2. Luồng Nghiệp vụ (Business Workflow)

### 2.1 Vòng đời Mẫu Quy trình Động
1. **Tạo mới (Bản nháp)**: Nhấn *Thêm mới* hoặc *Tạo bản sao* để tạo mẫu quy trình mới ở trạng thái **Bản nháp** với phiên bản khởi tạo `1.0`.
2. **Chỉnh sửa & Cấu hình**: Khai báo tên quy trình, chọn cơ quan áp dụng, thêm/xóa/sắp xếp thứ tự các bước và thiết lập hành động rẽ nhánh.
3. **Phát hành (Hoạt động)**:
   - Nhấn nút *Phát hành*, hệ thống kiểm tra điều kiện hợp lệ của quy trình (phải có bước Bắt đầu, bước Kết thúc và đường nối luồng liên tục).
   - Sau khi Phát hành thành công, quy trình chuyển sang trạng thái **Hoạt động**.
   - Khi ở trạng thái **Hoạt động (Đã phát hành)**: Quy trình bị khóa không cho phép sửa đổi thông tin cốt lõi, khóa không cho phép sửa Cơ quan áp dụng và Người xử lý (hiển thị dạng chỉ đọc Read-only), và ngăn chặn tuyệt đối thao tác xóa.
4. **Tạo bản sao (Clone)**: Nhân bản một quy trình (kể cả quy trình đang Hoạt động) thành một mẫu quy trình mới ở dạng **Bản nháp** để thực hiện cải tiến hoặc điều chỉnh phiên bản.

- **Hàm ràng buộc kiểm tra độc lập (`isOrgAssignedToOtherProcess`)**: Mỗi cơ quan chỉ được thuộc về **tối đa 1 quy trình duy nhất**. Hệ thống sử dụng hàm kiểm tra độc lập `isOrgAssignedToOtherProcess(orgName, currentEditingId)` để kiểm tra bất kỳ cơ quan nào trước khi hiển thị, chọn hoặc lưu. Nếu cơ quan đã thuộc về quy trình khác (`true`), hệ thống tự động khóa vô hiệu hóa (`disabled`, `pointer-events: none`), dập tắt sự kiện click tầng Capture, ép bỏ tích chọn (`checked = false`), loại khỏi nút *Chọn tất cả (chưa áp dụng)* và tự động lọc bỏ khi Lưu quy trình.

### 2.2 Quy tắc Phân quyền & Cơ quan Xử lý theo Trạng thái Bước
- **Trạng thái `Chờ phân công`**:
  - **Cơ quan xử lý**: Mặc định lấy tự động từ danh sách **Cơ quan áp dụng** ở phần Thông tin quy trình, hiển thị ở chế độ Chỉ đọc (Read-only).
  - **Người xử lý**: Mặc định để rỗng (`assignees = []`), không gán tự động khi tạo bước mới hoặc chuyển trạng thái sang *Chờ phân công*. Người dùng tự chọn cán bộ từ danh sách Lãnh đạo đại diện các cơ quan (có ô gõ tìm kiếm phẳng và thẻ số dư `+N` dạng viên thuốc nhỏ gọn).
- **Trạng thái `Đang xử lý`**: Mặc định để rỗng (`assignees = []`), người dùng tự chọn nhân sự bao gồm Lãnh đạo và Chuyên viên thuộc các cơ quan xử lý.
- **Trạng thái `Đã có báo cáo`**: Gán quyền mặc định cho Lãnh đạo cơ quan xem xét và duyệt báo cáo.
- **Trạng thái `Chờ phê duyệt` & `Đã kết thúc`**: Gán quyền mặc định cho Lãnh đạo Tỉnh (Người ban hành chỉ đạo).

### 2.3 Luồng Chuyển tiếp & Rẽ nhánh Biểu đồ Quy trình
- **Bảo toàn luồng chuyển tiếp tuần tự**: Tự động liên kết bước hiện tại đến bước tiếp theo trong chuỗi quy trình. Các bước ở trạng thái *Chờ phê duyệt* tự động tạo thêm luồng trả về liên kết tới bước xử lý phía trước.
- **Hộp thoại xác nhận thao tác bước**: Tích hợp dialog xác nhận cho cả 3 thao tác: Kéo thả thay đổi thứ tự bước, Lưu chỉnh sửa thông tin bước, Xóa bước xử lý.
- Mọi thao tác thêm/sửa/xóa bước hoặc thay đổi thứ tự bước đều tự động tính toán lại mối quan hệ liên kết và cập nhật ngay lập tức lên Biểu đồ mô tả quy trình.