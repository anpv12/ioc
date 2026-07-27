# Đặc tả tính năng: Trang Xử lý Chỉ đạo (pages/Quản trị/xu-ly-chi-dao)

## 1. Cấu trúc tổng quan
- **Cụm Tìm kiếm & Bộ lọc**:
  - Ô tìm kiếm quy trình/chỉ đạo (280px), nút tìm kiếm (xanh lá), nút reset (hồng).
  - Bộ lọc Trạng thái xử lý (`175px`), Bộ lọc Tình trạng thời hạn (Còn hạn/Trễ hạn, `175px`), Bộ lọc Hạn xử lý đơn ngày Flatpickr (`175px`).
  - Nút bo góc đồng bộ 6px.
- **Bảng Danh sách Chỉ đạo**:
  - Các cột: STT (50px, center), Nội dung chỉ đạo (39%), Nhóm dữ liệu (12%), Ngày ban hành (13%, center), Hạn xử lý (14%, center với icon đồng hồ màu phân biệt: xanh là Còn hạn, đỏ là Trễ hạn, hover tooltip), Trạng thái (14%, center), Thao tác (70px, center).
- **Cụm Phân trang**:
  - Đầy đủ 5 nút: Trang đầu (`«`), Trang trước (`<`), Danh sách số trang (`1`, `2`...), Trang sau (`>`), Trang cuối (`»`).
- **Chi tiết Chỉ đạo (Detail overlay panel)**:
  - Tiêu đề "Chi tiết chỉ đạo ›" cỡ chữ 18px màu đen đồng bộ với Mã ID chỉ đạo.
  - Cột thông tin bên trái nền màu trắng thuần, không chia khung đóng hộp.
  - Tiêu đề mục sử dụng chữ thường chuẩn (Thông tin chỉ đạo, Báo cáo từ cấp dưới, Ghi chú thêm của đơn vị), loại bỏ icon rườm rà.
  - Thứ tự hiển thị: Thông tin chỉ đạo → Báo cáo từ cấp dưới → Ghi chú thêm của đơn vị (tuỳ chọn).
  - Mục **Hình ảnh**: Cho phép nhấn mở popup modal (`#imageViewerOverlay`) xem hình ảnh đính kèm chi tiết.
