# Đặc tả Nghiệp vụ Trang Xử lý Chỉ đạo

## 1. Thành phần Giao diện & Ý nghĩa Component

### 1.1. Tab Danh sách Chỉ đạo
- **Tab Đang xử lý**: Hiển thị các chỉ đạo đang trong quá trình thực hiện hoặc chờ phê duyệt.
- **Tab Đã xử lý**: Hiển thị các chỉ đạo đã hoàn thành hoặc kết thúc.

### 1.2. Thanh Công cụ & Bộ lọc
- **Ô Tìm kiếm**: Tìm kiếm chỉ đạo theo Mã chỉ đạo hoặc Nội dung chỉ đạo.
- **Bộ lọc Trạng thái**: Lọc theo từng bước quy trình (*Chờ phân công, Đang xử lý, Đã có báo cáo, Chờ phê duyệt, Đã kết thúc*).
- **Bộ lọc Tình trạng thời hạn**: Lọc chỉ đạo theo tình trạng *Còn hạn* hoặc *Trễ hạn*.
- **Nút Tìm kiếm & Đặt lại**: Thực thi lọc hoặc đưa bộ lọc về mặc định.

### 1.3. Bảng Danh sách Chỉ đạo
- Hiển thị thông tin chỉ đạo gồm: STT, Nội dung chỉ đạo, Nhóm dữ liệu, Ngày chỉ đạo, Tình trạng thời hạn (kèm biểu tượng cảnh báo màu khi trễ hạn), Trạng thái quy trình và Nút xem chi tiết.

### 1.4. Form Chi tiết Hồ sơ Chỉ đạo (Modal Popup)
- **Thông tin chỉ đạo**: Hiển thị nội dung chỉ đạo, hạn xử lý, người giao, đường dẫn xem hình ảnh và danh sách tệp đính kèm văn bản. Bấm vào tệp để xem trực tiếp hoặc tải về.
- **Khu vực Phân công / Báo cáo theo Vai trò**:
  - *Lãnh đạo (bước Chờ phân công)*: Chọn Chuyên viên thực hiện, nhập *Nội dung xử lý* (tùy chọn, không bắt buộc) và bấm *Chuyển xử lý*.
  - *Chuyên viên (bước Đang xử lý)*: Nhập nội dung báo cáo kết quả, đính kèm tệp và bấm *Trình phê duyệt*. Khi bấm trình phê duyệt, hệ thống tự động lưu hình ảnh màn hình tại thời điểm đó vào báo cáo.
  - *Lãnh đạo (bước Đã có báo cáo)*: Xem xét báo cáo, chọn *Trình phê duyệt* (gửi Tỉnh) hoặc *Trả về* (yêu cầu làm lại).

---

## 2. Sơ đồ Tiến trình Quy trình & Bảng Mã màu Hex Trạng thái

Sơ đồ quy trình minh họa trực quan trạng thái tiến độ xử lý của chỉ đạo qua các nút mốc thời gian với bảng mã màu Hex quy chuẩn:

| Trạng thái Tiến trình | Mã màu Hex Nút Icon | Mã màu Hex Thẻ Trạng thái | Ý nghĩa |
|---|---|---|---|
| **Bước đã hoàn thành (`done`)** | Nền `#dcfce7`, icon `#166534` | Chữ `#166534`, nền `#f0fdf4`, viền `#bbf7d0` | Bước xử lý đã được phê duyệt / hoàn thành thành công |
| **Bước đang xử lý (`current`)** | Nền `#0284c7`, icon trắng `#ffffff` | Chữ `#0284c7`, nền `#e0f2fe`, viền `#bae6fd` | Bước hiện tại đang được cán bộ/lãnh đạo thụ lý xử lý |
| **Bước chưa tới (`future`)** | Nền `#f1f5f9`, icon `#94a3b8` | Nền `#f1f5f9`, chữ `#64748b` | Bước chưa tới trong luồng tiến trình |
| **Tên tiêu đề bước** | Màu chữ `#334155` | Màu chữ `#334155` | Tiêu đề tên của các bước trên sơ đồ tiến trình |

---

## 3. Luồng Nghiệp vụ Thao tác

1. **Phân công chỉ đạo**: Lãnh đạo mở hồ sơ -> Chọn chuyên viên xử lý -> Bấm "Chuyển xử lý" -> Xác nhận -> Chuyển sang bước Đang xử lý.
2. **Báo cáo kết quả**: Chuyên viên mở hồ sơ -> Nhập nội dung báo cáo & đính kèm tệp -> Bấm "Trình phê duyệt" -> Hệ thống tự động ghi nhận ảnh màn hình thời điểm trình -> Chuyển sang bước Đã có báo cáo.
3. **Phê duyệt / Trả về**: Lãnh đạo xem xét báo cáo -> Nếu đồng ý: Bấm "Trình phê duyệt" -> Nếu chưa đạt: Bấm "Trả về" kèm lý do yêu cầu chuyên viên chỉnh sửa lại.
