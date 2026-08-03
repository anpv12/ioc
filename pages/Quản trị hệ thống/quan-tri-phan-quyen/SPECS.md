# Đặc tả Nghiệp vụ Trang Quản trị phân quyền

## 1. Tổng quan
Trang Quản trị phân quyền thuộc phân hệ **Quản trị hệ thống** tỉnh Gia Lai. Trang cung cấp giao diện gán các nhóm quyền (vai trò hệ thống) cho cán bộ, nhân viên thuộc các cơ quan, phòng ban trên địa bàn tỉnh.

## 2. Giao diện Phân quyền 2 Cột

### 2.1. Cột Trái: Danh sách Người dùng theo Cấu trúc Cơ quan
- **Cấu trúc cây 3 cấp**:
  - **Cơ quan**: Tên đơn vị/cơ quan, kèm ô chọn để chọn toàn bộ nhân viên thuộc cơ quan.
  - **Phòng ban**: Tên phòng/ban chuyên môn, kèm ô chọn để chọn toàn bộ nhân viên thuộc phòng ban.
  - **Nhân viên**: Tên cán bộ/nhân viên cụ thể.
- **Thao tác Mở/Đóng**:
  - Nhấp vào tên Cơ quan hoặc Phòng ban để mở/đóng danh mục con bên dưới.
  - Khi mở danh mục, tên các mục bên trong đổi màu xanh làm nổi bật khu vực đang theo dõi.
- **Ô tìm kiếm người dùng**: Lọc nhanh nhân viên, phòng ban hoặc cơ quan theo tên.

### 2.2. Cột Phải: Danh sách Nhóm quyền
- **Danh sách nhóm quyền**: Danh sách các vai trò hệ thống (*Super Administrator, Admin đơn vị, Lãnh đạo Tỉnh, Lãnh đạo Sở, Chuyên viên...*) kèm ô tích chọn.
- **Ô tìm kiếm nhóm quyền**: Lọc nhanh tên nhóm quyền.

## 3. Thành phần Nút Thao tác
- **Nút Lưu (Xanh dương)**: Lưu cấu hình gán quyền cho các người dùng đang được chọn.
- **Nút Hủy phân quyền (Đỏ)**: Gỡ bỏ toàn bộ nhóm quyền của các người dùng đang được chọn.

## 4. Luồng Thao tác Nghiệp vụ

1. **Gán quyền cho người dùng**:
   - Bước 1: Tích chọn một hoặc nhiều nhân viên (hoặc chọn toàn bộ phòng ban/cơ quan) ở Cột Trái.
   - Bước 2: Hệ thống hiển thị các nhóm quyền tương ứng ở Cột Phải. Tích chọn hoặc bỏ tích các nhóm quyền mong muốn.
   - Bước 3: Bấm nút "Lưu" -> Hộp thoại hiển thị *"Bạn có chắc chắn muốn lưu phân quyền?"* -> Bấm "Đồng ý" -> Lưu thành công, thông báo hiển thị góc màn hình, giữ nguyên trạng thái danh mục đang mở.

2. **Hủy phân quyền của người dùng**:
   - Bước 1: Tích chọn cán bộ/nhân viên cần xóa quyền ở Cột Trái.
   - Bước 2: Bấm nút "Hủy phân quyền" -> Hộp thoại hiển thị *"Bạn có chắc chắn muốn hủy phân quyền?"* -> Bấm "Đồng ý" -> Gỡ bỏ toàn bộ quyền và thông báo hoàn tất.
