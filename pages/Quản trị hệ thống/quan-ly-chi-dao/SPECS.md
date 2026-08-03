# Đặc tả Nghiệp vụ Trang Quản lý chỉ đạo

## 1. Tổng quan
Trang Quản lý chỉ đạo thuộc phân hệ **Quản trị hệ thống** tỉnh Gia Lai. Trang cung cấp giao diện phân quyền quản lý chỉ đạo (quyền Xem chỉ đạo và quyền Sửa chỉ đạo) cho các Nhóm quyền (vai trò hệ thống) trên địa bàn tỉnh.

## 2. Giao diện & Thành phần Chính

### 2.1. Đầu trang & Nút Hành động
- **Tiêu đề trang**: Hiển thị tiêu đề **Quản trị hệ thống**.
- **Nút Lưu**: Nút màu xanh dương ở góc trên bên phải để lưu cấu hình phân quyền chỉ đạo.

### 2.2. Thanh công cụ Lọc
- **Ô tìm kiếm**: Nhập từ khóa tên nhóm quyền hoặc mã nhóm quyền để tìm kiếm.
- **Nút Tìm kiếm**: Kính lúp xanh lá, thực thi tìm kiếm theo từ khóa.
- **Nút Làm mới**: Xoay tròn hồng/đỏ, xóa từ khóa tìm kiếm và hiển thị lại toàn bộ danh sách.

### 2.3. Bảng Phân quyền Chỉ đạo theo Nhóm quyền
- **STT**: Thứ tự dòng bản ghi.
- **Mã nhóm quyền**: Mã định danh vai trò trong hệ thống.
- **Tên nhóm quyền**: Tên gọi vai trò (ví dụ: Super Administrator, Admin đơn vị, Lãnh đạo Tỉnh, Lãnh đạo Sở, Chuyên viên...).
- **Xem chỉ đạo**: Công tắc Bật/Tắt (Toggle Switch) cho phép vai trò được xem nội dung các chỉ đạo điều hành.
- **Sửa chỉ đạo**: Công tắc Bật/Tắt (Toggle Switch) cho phép vai trò được cập nhật, chỉnh sửa nội dung các chỉ đạo.

### 2.4. Phân quyền Mặc định Ban đầu
- **Lãnh đạo Tỉnh / Super Administrator / Admin đơn vị**: Bật cả 2 quyền (Xem chỉ đạo = Bật, Sửa chỉ đạo = Bật).
- **Lãnh đạo Sở / Chuyên viên**: Chỉ bật quyền Xem (Xem chỉ đạo = Bật, Sửa chỉ đạo = Tắt).

## 3. Luồng Thao tác Nghiệp vụ

1. **Bật/Tắt quyền**: Người dùng gạt trực tiếp các nút công tắc Toggle Switch tại cột **Xem chỉ đạo** hoặc **Sửa chỉ đạo** cho từng nhóm quyền.
2. **Lưu phân quyền**:
   - Bấm nút "Lưu" ở góc trên bên phải.
   - Hộp thoại hiển thị yêu cầu xác nhận: *"Bạn có chắc chắn muốn lưu phân quyền?"*.
   - Bấm "Đồng ý": Cấu hình mới được áp dụng và hệ thống hiển thị thông báo thành công ở góc màn hình.
