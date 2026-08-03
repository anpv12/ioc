# Đặc tả Nghiệp vụ Trang Quản trị quyền

## 1. Tổng quan
Trang Quản trị quyền thuộc phân hệ **Quản trị hệ thống** tỉnh Gia Lai. Trang phục vụ việc quản lý danh sách các nhóm quyền (vai trò) và phân quyền chức năng trong toàn bộ hệ thống, hỗ trợ tìm kiếm, lọc trạng thái, thêm mới, xem chi tiết, chỉnh sửa và xóa nhóm quyền.

## 2. Mô hình Phân quyền 2 Lớp

### 2.1. Lớp 1: Quyền Chức năng (Menu & Màn hình)
- Xác định tài khoản thuộc nhóm quyền nào sẽ có quyền truy cập và hiển thị các phân hệ, menu hoặc tính năng tương ứng trên hệ thống.

### 2.2. Lớp 2: Phân công Dữ liệu (Phạm vi công việc)
- Lãnh đạo Tỉnh: Theo dõi và giám sát toàn bộ các chỉ đạo điều hành trên toàn tỉnh.
- Lãnh đạo Sở: Theo dõi và quản lý các chỉ đạo thuộc phạm vi Sở phụ trách.
- Chuyên viên: Tiếp nhận, theo dõi và xử lý các chỉ đạo được phân công trực tiếp cho cá nhân.

## 3. Thành phần Giao diện & Ý nghĩa Component

### 3.1. Header & Thanh điều hướng
- **Đầu trang**: Hiển thị logo Tỉnh Gia Lai, tiêu đề **Quản trị hệ thống**, thông tin tài khoản người dùng và thông báo.
- **Menu chính**: Cho phép chuyển đổi giữa các phân hệ Dashboard, Quản trị chỉ đạo và Quản trị hệ thống.

### 3.2. Thanh công cụ Lọc & Thao tác
- **Ô tìm kiếm**: Tìm kiếm nhóm quyền theo từ khóa tên hoặc mã nhóm quyền.
- **Nút Tìm kiếm**: Kích hoạt lọc dữ liệu theo từ khóa nhập.
- **Nút Làm mới**: Khôi phục điều kiện lọc về mặc định và hiển thị lại toàn bộ danh sách.
- **Dropdown Trạng thái**: Lọc nhóm quyền đang Hoạt động hoặc Không hoạt động.
- **Nút Thêm mới**: Mở màn hình tạo nhóm quyền mới.

### 3.3. Bảng Danh sách Nhóm quyền
- **Mã nhóm quyền**: Mã định danh duy nhất của vai trò trong hệ thống.
- **Tên nhóm quyền**: Tên hiển thị của nhóm quyền (ví dụ: Lãnh đạo Tỉnh, Lãnh đạo Sở, Chuyên viên...).
- **Mô tả**: Tóm tắt phạm vi trách nhiệm và chức năng của nhóm quyền.
- **Trạng thái**: Thể hiện nhóm quyền đang Hoạt động hay Không hoạt động.
- **Nút Tùy chọn (3 chấm)**: Mở menu thao tác nhanh gồm Xem chi tiết, Chỉnh sửa, và Xóa.

### 3.4. Form Popup (Thêm mới / Chỉnh sửa / Xem chi tiết)
- **Mã nhóm quyền & Tên nhóm quyền**: Các trường thông tin bắt buộc.
- **Mô tả**: Thông tin bổ sung về nhóm quyền.
- **Cây phân quyền chức năng**: Danh sách các menu và tính năng hệ thống được sắp xếp theo dạng phân cấp. Chọn nhóm cha sẽ tự động chọn tất cả nhóm con bên dưới.
- **Công tắc Trạng thái**: Bật hoặc tắt trạng thái hoạt động của nhóm quyền.
- **Nút Trở về**: Đóng form mà không lưu thay đổi.
- **Nút Lưu**: Kích hoạt xác nhận và lưu dữ liệu.
- **Chế độ Xem chi tiết**: Khóa tất cả các trường dữ liệu, chỉ cho phép đọc thông tin.

### 3.5. Hộp thoại Xác nhận & Thông báo
- **Hộp thoại Xác nhận**: Hiển thị yêu cầu xác nhận từ người dùng trước khi Lưu hoặc Xóa.
- **Thông báo Toast**: Hiển thị thông báo thành công xanh góc màn hình sau khi hoàn tất thao tác.

## 4. Luồng Thao tác Nghiệp vụ

1. **Thêm mới**: Bấm "Thêm mới" -> Nhập tên, mã nhóm quyền và tích chọn danh sách quyền -> Bấm "Lưu" -> Xác nhận "Đồng ý" -> Lưu thành công và nạp lại bảng.
2. **Chỉnh sửa**: Bấm nút 3 chấm -> Chọn "Sửa" -> Chỉnh sửa thông tin hoặc quyền -> Bấm "Lưu" -> Xác nhận "Đồng ý" -> Cập nhật thành công.
3. **Xem chi tiết**: Bấm nút 3 chấm -> Chọn "Xem" -> Mở form ở chế độ chỉ đọc -> Bấm "Trở về" để đóng.
4. **Xóa**: Bấm nút 3 chấm -> Chọn "Xóa" -> Xác nhận "Đồng ý" -> Xóa nhóm quyền khỏi hệ thống.
