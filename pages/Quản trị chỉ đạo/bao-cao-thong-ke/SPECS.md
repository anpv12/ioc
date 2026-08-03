# Đặc tả Nghiệp vụ Trang Báo cáo & Thống kê Chỉ đạo

## 1. Tổng quan
Màn hình Báo cáo & Thống kê phục vụ việc tổng hợp, theo dõi hiệu suất xử lý các chỉ đạo điều hành của tỉnh Gia Lai theo khoảng thời gian, theo đơn vị thực hiện hoặc theo lãnh đạo chỉ đạo, hỗ trợ xem chi tiết số liệu và xuất báo cáo ra tệp Excel.

## 2. Các Thành phần Giao diện & Ý nghĩa Component

### 2.1. Bộ lọc Thống kê
- **Kỳ báo cáo**: Chọn theo Tuần, Tháng (mặc định), Quý, Năm hoặc khoảng "Từ ngày - Đến ngày". Khi thay đổi kỳ báo cáo, hệ thống tự động điền khoảng thời gian tương ứng.
- **Từ ngày / Đến ngày**: Chọn khoảng thời gian thống kê cụ thể.
- **Bộ lọc Đơn vị / Lãnh đạo**: Dropdown cho phép chọn một hoặc nhiều Đơn vị thực hiện hoặc Lãnh đạo chỉ đạo để lọc số liệu.
- **Nút Lọc**: Áp dụng điều kiện lọc và nạp lại bảng số liệu.
- **Nút Đặt lại**: Khôi phục bộ lọc về kỳ Tháng hiện tại và bỏ chọn tất cả đơn vị/lãnh đạo.

### 2.2. Tab Chuyển đổi Thống kê
- **Theo đơn vị**: Tổng hợp tình hình xử lý chỉ đạo phân nhóm theo từng Đơn vị/Sở ngành.
- **Theo lãnh đạo**: Tổng hợp tình hình xử lý chỉ đạo phân nhóm theo Lãnh đạo ban hành.

### 2.3. Bảng Thống kê Tổng hợp
- **Cấu trúc cột**:
  - STT | Tên Đơn vị / Lãnh đạo | Tổng nhận | Đã xử lý (Đúng hạn / Trễ hạn) | Đang xử lý (Còn hạn / Quá hạn)
- **Xem chi tiết số liệu (Drill-down)**: Nhấp trực tiếp vào con số thống kê trên bảng để mở bảng danh sách các chỉ đạo chi tiết tạo nên con số đó.

### 2.4. Bảng Chi tiết Chỉ đạo (Drill-down View)
- Hiển thị danh sách các chỉ đạo thuộc chỉ số được nhấp xem, bao gồm: Mã chỉ đạo, Nội dung chỉ đạo, Đơn vị thực hiện, Người giao, Ngày ban hành, Hạn xử lý và Trạng thái thời hạn.
- **Nút Quay lại**: Trở về màn hình bảng thống kê tổng hợp ban đầu.

### 2.5. Xuất Báo cáo Excel
- Nút **Xuất Excel**: Xuất toàn bộ dữ liệu bảng thống kê hoặc bảng chi tiết ra tệp Excel (.xlsx) phục vụ công tác báo cáo.

---

## 3. Bảng Mã màu Hex Quy chuẩn Trạng thái Tiến trình & Giao diện

| Mã màu Hex | Phạm vi sử dụng & Trạng thái |
|---|---|
| `#0284c7` | Màu chủ đạo (Primary): Nút Lọc / Xuất Excel, Tab đang chọn, Con số thống kê nhấp xem, Ngày được chọn |
| `#dbeafe` | Nền hover khi di chuột qua ô con số thống kê hoặc dòng dữ liệu |
| `#f0f9ff` | Nền tiêu đề bảng thống kê, hàng đang di chuột, item menu mở rộng |
| `#ffffff` | Nền trắng khung bảng, ô nhập liệu, nút phụ |
| `#e2e8f0` / `#cbd5e1` | Viền khung bảng, đường chia cột và viền ô lọc |
| `#1e293b` / `#334155` | Màu chữ tiêu đề và nội dung dữ liệu chính |
| `#64748b` / `#94a3b8` | Màu chữ phụ, icon hỗ trợ, thông báo trống dữ liệu |
| `#f8fafc` | Nền hàng chẵn bảng chi tiết, nền ô không tương tác (disabled) |
