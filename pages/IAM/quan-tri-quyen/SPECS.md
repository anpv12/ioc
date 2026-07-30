# Đặc tả Nghiệp vụ Trang Quản lý Nhóm Quyền (IAM)

## 1. Tổng quan
Trang Quản lý nhóm quyền thuộc phân hệ Quản trị hệ thống (IAM) tỉnh Gia Lai. Trang phục vụ việc quản lý danh sách các nhóm quyền (vai trò) trong toàn bộ hệ thống, hỗ trợ tìm kiếm, lọc trạng thái, thêm mới, xem chi tiết, chỉnh sửa và xóa nhóm quyền.

## 2. Mô hình Phân quyền 2 Lớp (Function & Data Scope Architecture)

Hệ thống áp dụng Mô hình Phân quyền 2 Lớp độc lập và chặt chẽ nhằm giải quyết bài toán bảo mật dữ liệu thực tế:
### 2.1. Lớp 1: Quyền Chức năng (RBAC - Cấu hình tại IAM)
- **Vai trò**: Cấu hình tại Cây phân quyền trong trang IAM.
- **Ý nghĩa**: Đóng vai trò là công tắc tính năng (Feature Flag). Xác định tài khoản có được phép truy cập và hiển thị màn hình / giao diện tương ứng hay không (ví dụ: Quyền *"Xem chỉ đạo"* cho phép người dùng mở giao diện chỉ đạo).

### 2.2. Lớp 2: Bộ lọc Phân công Dữ liệu (Data Scope & Assignment Filter)
- **Vai trò**: Hệ thống tự động lọc dữ liệu dựa trên Context và ID người dùng đang đăng nhập (`currentUser.id`).
- **Phạm vi truy cập theo Vai trò**:
  1. **Lãnh đạo Tỉnh**: Xem toàn bộ các chỉ đạo do Tỉnh ban hành trên tất cả các Card chỉ số (`metric-block`).
  2. **Lãnh đạo Sở**: Xem toàn bộ các chỉ đạo thuộc Sở của mình quản lý.
  3. **Chuyên viên**:
     - **Trên Card chỉ số (`metric-block`)**: Nút Cờ Chỉ đạo chỉ sáng/hiển thị nếu chỉ số đó có chỉ đạo được giao đích danh cho Chuyên viên đó (`assignedUserId == currentUser.id`).
     - **Trong Drawer Chỉ đạo (Event Panel)**: Danh sách chỉ đạo tự động lọc `WHERE assignedUserId == currentUser.id`, chỉ hiển thị đúng các công việc mà Chuyên viên đó được phân công xử lý, ẩn hoàn toàn các chỉ đạo khác.

## 3. Thành phần giao diện & Ý nghĩa Component

### 3.1. Thanh điều hướng bên trái (Left Sidebar)
- **Ý nghĩa**: Cho phép chuyển đổi giữa các phân hệ quản trị trong hệ thống IAM (Quản lý cơ quan, Quản lý phòng ban, Quản trị quyền).

### 3.2. Đầu trang & Thanh đường dẫn (TopBar & Breadcrumb)
- **Ý nghĩa**: Hiển thị thông tin thương hiệu hệ thống, thông tin tài khoản người dùng đang đăng nhập và vị trí trang hiện tại.

### 3.3. Thanh công cụ & Bộ lọc (Filter Toolbar)
- **Ô nhập từ khóa tìm kiếm**: Nhập mã, tên nhóm quyền hoặc mô tả để tìm kiếm.
- **Nút Icon Lọc**: Bật/Tắt hiển thị Khung bộ lọc mở rộng.
- **Dropdown chọn Trạng thái**: Lọc danh sách theo trạng thái Hoạt động / Không hoạt động.
- **Nút Tìm kiếm**: Thực thi tìm kiếm dữ liệu theo điều kiện lọc.
- **Nút Làm mới**: Khôi phục các điều kiện lọc về mặc định và tải lại danh sách đầy đủ.
- **Nút Thêm mới**: Mở form để người dùng tạo nhóm quyền mới.

### 3.4. Bảng danh sách nhóm quyền (Role Table)
- **Ý nghĩa**: Hiển thị danh sách các nhóm quyền trong hệ thống.
- **Các cột dữ liệu**:
  - Mã nhóm quyền: Mã định danh vai trò.
  - Tên nhóm quyền: Tên gọi của nhóm quyền.
  - Mô tả: Tóm tắt phạm vi và chức năng của nhóm quyền.
  - Trạng thái: Thể hiện nhóm quyền đang Hoạt động hay Không hoạt động.
  - Nút Tùy chọn (3 chấm): Mở popup các thao tác Xem, Sửa, Xóa.

### 3.5. Form Popup (Thêm mới / Chỉnh sửa / Xem chi tiết)
- **Mã nhóm quyền**: Ô nhập mã định danh (bắt buộc).
- **Tên nhóm quyền**: Ô nhập tên nhóm quyền (bắt buộc).
- **Mô tả**: Ô nhập thông tin mô tả nhóm quyền.
- **Khung cây phân quyền**: Danh sách các quyền chức năng được sắp xếp theo cấu trúc hình cây phân cấp 2 cấp và 3 cấp (Dashboard, Chỉ đạo, Quản trị hệ thống...). Người dùng tick chọn các quyền gán cho nhóm (bắt buộc chọn ít nhất 1 quyền).
  - Chọn nhóm cha sẽ tự động chọn tất cả các nhóm con bên dưới.
  - Chọn nhóm con sẽ tự động cập nhật trạng thái chọn lên nhóm cha.
- **Công tắc Trạng thái**: Bật/Tắt trạng thái Hoạt động của nhóm quyền.
- **Nút Trở về**: Đóng form và hủy bỏ thao tác.
- **Nút Lưu**: Kiểm tra dữ liệu nhập và kích hoạt Popup Xác nhận trước khi lưu.
- **Chế độ Xem chi tiết**: Khóa tất cả các trường nhập liệu và cây phân quyền, chỉ cho phép người dùng xem thông tin mà không được chỉnh sửa.

### 3.6. Popup Xác nhận thao tác (Confirm Dialog)
- **Ý nghĩa**: Hiển thị hộp thoại xác nhận trước khi thực hiện các thao tác quan trọng (Thêm mới, Cập nhật, Xóa).
- **Nút Hủy**: Hủy bỏ thao tác, giữ nguyên trạng thái hiện tại.
- **Nút Đồng ý**: Thực thi thao tác và hiển thị thông báo thành công.

### 3.7. Popup Thông báo thành công (Toast Notification)
- **Ý nghĩa**: Hiển thị thông báo ngắn gọn ở góc màn hình sau khi hoàn tất thành công các thao tác Thêm mới, Cập nhật hoặc Xóa. Tự động ẩn sau một khoảng thời gian ngắn.

### 3.8. Thanh phân trang (Pagination)
- **Dropdown số lượng bản ghi**: Chọn số lượng bản ghi hiển thị trên mỗi trang.
- **Thông tin trang**: Hiển thị dải bản ghi đang xem trên tổng số bản ghi.
- **Các nút chuyển trang**: Điều hướng sang trang trước, trang sau hoặc trang cụ thể.

## 4. Luồng thao tác nghiệp vụ

1. **Thêm mới nhóm quyền**: Nhấn "Thêm mới" -> Nhập thông tin và chọn quyền chức năng -> Nhấn "Lưu" -> Xác nhận "Đồng ý" -> Lưu dữ liệu, đóng form và hiển thị thông báo thành công.
2. **Chỉnh sửa nhóm quyền**: Nhấn menu 3 chấm -> Chọn "Sửa" -> Thay đổi thông tin -> Nhấn "Lưu" -> Xác nhận "Đồng ý" -> Cập nhật dữ liệu, đóng form và hiển thị thông báo thành công.
3. **Xem chi tiết nhóm quyền**: Nhấn menu 3 chấm -> Chọn "Xem" -> Form mở ở chế độ chỉ xem -> Nhấn "Trở về" để đóng form.
4. **Xóa nhóm quyền**: Nhấn menu 3 chấm -> Chọn "Xóa" -> Xác nhận "Đồng ý" -> Xóa khỏi danh sách và hiển thị thông báo thành công.
