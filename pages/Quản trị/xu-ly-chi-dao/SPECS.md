# Đặc tả Nghiệp vụ: Trang Quản lý Xử lý Chỉ đạo (pages/Quản trị/xu-ly-chi-dao)

## 1. Danh sách các Component & Ý nghĩa Chức năng

- **Component Tab Danh sách Chỉ đạo**:
  - Phân chia 2 Tab hiển thị danh sách chỉ đạo: *Đang xử lý* và *Đã xử lý*.
  - Giữ nguyên Tab người dùng đang xem sau khi hoàn thành thao tác xử lý nghiệp vụ.

- **Component Tìm kiếm & Bộ lọc**:
  - **Ô Tìm kiếm**: Tìm kiếm chỉ đạo theo mã chỉ đạo hoặc nội dung chỉ đạo.
  - **Bộ lọc Trạng thái**: Lọc danh sách theo các trạng thái quy trình (*Chờ phân công*, *Đang xử lý*, *Đã có báo cáo*, *Chờ phê duyệt*, *Đã kết thúc*).
  - **Bộ lọc Tình trạng thời hạn**: Lọc chỉ đạo theo tình trạng thời hạn (*Tất cả*, *Còn hạn*, *Trễ hạn*).
  - **Bộ lọc Hạn xử lý**: Lịch đơn chọn ngày để lọc danh sách theo hạn xử lý.
  - **Nút Tìm kiếm & Nút Đặt lại**: Thực hiện lọc dữ liệu hoặc xóa các điều kiện lọc về mặc định.

- **Component Bảng Danh sách Chỉ đạo**:
  - Hiển thị danh sách các chỉ đạo gồm các cột: STT, Nội dung chỉ đạo, Nhóm dữ liệu, Ngày chỉ đạo, Tình trạng thời hạn xử lý (có biểu tượng cảnh báo khi trễ hạn/sắp đến hạn), Trạng thái quy trình và Nút mở xem chi tiết chỉ đạo.

- **Component Cụm Phân trang**:
  - Các nút điều hướng chuyển trang (Trang đầu, Trang trước, Các trang số, Trang sau, Trang cuối).
  - Dropdown chọn số lượng bản ghi hiển thị trên mỗi trang (10, 20, 50 bản ghi/trang).

- **Component Form Chi tiết Chỉ đạo (Overlay Modal)**:
  - **Mục Thông tin Chỉ đạo**: Hiển thị Nội dung, Nhóm dữ liệu, Hạn xử lý, Người giao chỉ đạo, Ngày chỉ đạo, Liên kết sang Dashboard chuyên ngành, Đường dẫn xem hình ảnh/sơ đồ và Danh sách tệp đính kèm gốc của chỉ đạo.
    - Bấm vào **tệp PDF**: Tự động mở xem nội dung tệp.
    - Bấm vào **tệp Word / Excel**: Tự động tải xuống tệp.
  - **Mục Chọn người xử lý & Chuyển xử lý**: Dành cho Lãnh đạo ở bước *Chờ phân công*, gồm ô Autocomplete gõ tìm kiếm Chuyên viên và nút *Chuyển xử lý*. Chuyển sang hiển thị tên người xử lý khi ở các bước tiếp theo.
  - **Mục Nộp báo cáo Kết quả**: Dành cho Chuyên viên ở bước *Đang xử lý*, gồm ô nhập nội dung báo cáo kết quả, đính kèm tệp và nút *Trình phê duyệt*.
  - **Mục Xem xét Báo cáo & Trình Tỉnh**: Dành cho Lãnh đạo ở bước *Đã có báo cáo*, gồm ô nhập nội dung xem xét/từ chối, đính kèm tệp và 2 nút thao tác: *Trình phê duyệt* (gửi Tỉnh) hoặc *Trả về* (gửi Chuyên viên thực hiện lại).
  - **Mục Thẻ Báo cáo đã nộp**: Hiển thị nội dung báo cáo đã gửi của các bước trước đó và các tệp đính kèm đi kèm.
  - **Component Sơ đồ Luồng Quy trình (UML)**: Sơ đồ minh họa trực quan các bước trong luồng xử lý chỉ đạo, đánh dấu vị trí bước hiện tại, vẽ đường luồng trả về khi bị từ chối và áp dụng quy chuẩn mã màu cố định (hardcode) theo trạng thái từng bước:
    - **Bước đã hoàn thành (`done`)**: Nút tròn icon (nền `#dcfce7`, icon `#166534`, không viền), thẻ trạng thái *Đã hoàn thành* (chữ `#166534`, nền `#f0fdf4`, viền `#bbf7d0`).
    - **Bước đang xử lý (`current`)**: Nút tròn icon (nền `#0284c7`, icon trắng `#ffffff`, không viền), thẻ trạng thái *Đang ở bước này* (chữ `#0284c7`, nền `#e0f2fe`, viền `#bae6fd`).
    - **Bước chưa tới (`future`)**: Nút tròn icon (nền `#f1f5f9`, icon `#94a3b8`, không viền).
    - **Tên bước xử lý (`.uml-canvas-title`)**: Cố định màu Xám dịu nhẹ `#334155` cho tất cả các bước.

- **Component Xem Hình ảnh Đính kèm (Image Viewer Modal)**:
  - Popup xem ảnh phóng to thông tin Dashboard hoặc sơ đồ đính kèm.

---

## 2. Luồng Nghiệp vụ (Business Workflow)

1. **Quy tắc Cập nhật Dữ liệu trong Modal**:
   - Khi thực hiện thành công các thao tác (*Chuyển xử lý*, *Trình phê duyệt*, *Trả về*): Form modal giữ nguyên mở, tự động cập nhật dữ liệu và sơ đồ luồng quy trình mới nhất, đồng thời hiển thị thông báo Toast thành công.

2. **Quy tắc Kiểm tra Dữ liệu Đầu vào (Inline Validation)**:
   - Khi chưa chọn người xử lý hoặc chưa nhập nội dung báo cáo/lý do trả về mà nhấn nút hành động, hệ thống hiển thị câu chữ báo lỗi trực tiếp bên dưới ô nhập liệu tương ứng.

3. **Thông báo Xác nhận & Toast**:
   - Mọi thao tác chuyển trạng thái đều yêu cầu người dùng xác nhận qua Popup xác nhận trước khi thực hiện.
   - Hiển thị thông báo Toast ngắn gọn sau khi hoàn thành thao tác.

4. **Phân quyền thao tác theo Vai trò**:
   - **Lãnh đạo (`leader`)**:
     - Bước *Chờ phân công*: Chọn Chuyên viên và nhấn *Chuyển xử lý*.
     - Bước *Đã có báo cáo*: Xem xét báo cáo, nhập ý kiến và chọn *Trình phê duyệt* hoặc *Trả về*.
     - Bước *Chờ phê duyệt*: Mô phỏng kết quả phê duyệt của Tỉnh (*Tỉnh đồng ý* / *Tỉnh từ chối*).
   - **Chuyên viên (`individual`)**:
     - Bước *Đang xử lý*: Nhập báo cáo, đính kèm tệp và chọn *Trình phê duyệt*.
     - Khi bị trả về: Nhập báo cáo điều chỉnh và trình lại.
