# Đặc tả Nghiệp vụ Trang Quản trị Quy trình Động

## 1. Thành phần Giao diện & Ý nghĩa Component

### 1.1. Thanh Công cụ & Lọc Dữ liệu
- **Ô Tìm kiếm**: Tìm kiếm mẫu quy trình theo Tên quy trình hoặc Mã quy trình.
- **Khung Bộ lọc Mở rộng**:
  - Dropdown Cơ quan áp dụng: Lọc danh sách quy trình áp dụng cho từng Cơ quan/Sở ngành.
  - Dropdown Trạng thái: Lọc theo quy trình ở trạng thái *Bản nháp* hoặc *Hoạt động*.
- **Nút Tìm kiếm & Nút Làm mới**: Thực thi lọc dữ liệu hoặc khôi phục các điều kiện lọc về mặc định.
- **Nút Thêm mới**: Mở màn hình thiết kế mẫu quy trình mới.

### 1.2. Bảng Danh sách Quy trình
- Hiển thị danh sách mẫu quy trình gồm các cột: Tên quy trình, Phiên bản, Cơ quan áp dụng, Trạng thái và Nút thao tác (Xem/Sửa, Tạo bản sao, Xóa).
- **Ràng buộc bảo vệ**: Quy trình ở trạng thái *Hoạt động* bị cấm xóa để bảo vệ dữ liệu đang áp dụng.

### 1.3. Khung Thiết kế Quy trình (Process Editor)
- **Thông tin chung**: Nhập Tên quy trình, Phiên bản, Chọn các Cơ quan áp dụng và Nhập mô tả. Mỗi cơ quan chỉ được thuộc về tối đa 1 mẫu quy trình duy nhất.
- **Danh sách bước xử lý**:
  - Thêm, sửa, xóa các bước trong quy trình.
  - Hỗ trợ Kéo thả để thay đổi vị trí thứ tự các bước.
- **Sơ đồ quy trình (Diagram)**: Minh họa trực quan các bước và đường nối chuyển tiếp công việc giữa các bước.

## 2. Luồng Nghiệp vụ

1. **Tạo mẫu quy trình (Bản nháp)**: Nhấn "Thêm mới" hoặc "Tạo bản sao" -> Quy trình khởi tạo ở trạng thái Bản nháp (phiên bản 1.0).
2. **Cấu hình các bước xử lý**: Thêm các bước xử lý, phân công nhóm người thực hiện cho từng bước và thiết lập các hành động chuyển tiếp.
3. **Phát hành quy trình**:
   - Bấm "Phát hành", hệ thống kiểm tra tính hợp lệ của luồng bước (phải có bước Bắt đầu và Kết thúc).
   - Khi đã **Phát hành (Hoạt động)**: Quy trình được chuyển sang chế độ chỉ đọc, cấm chỉnh sửa cơ cấu các bước và cấm xóa.
4. **Tạo bản sao (Clone)**: Sao chép một quy trình hiện có thành một bản nháp mới để cập nhật hoặc cải tiến phiên bản.