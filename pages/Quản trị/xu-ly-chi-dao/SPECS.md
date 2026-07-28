# Đặc tả Kỹ thuật & Nghiệp vụ: Trang Xử lý Chỉ đạo (pages/Quản trị/xu-ly-chi-dao)

## 1. Khai báo các Component & Chức năng

- **Component Tab Danh sách**:
  - Phân chia 2 Tab danh sách chỉ đạo (*Đang xử lý* và *Đã xử lý*) hiển thị văn bản thuần không có số đếm.
  - Tự động duy trì màn hình Tab người dùng đang đứng khi thực hiện xong thao tác xử lý nghiệp vụ.

- **Component Tìm kiếm & Bộ lọc**:
  - **Ô Tìm kiếm**: Tìm kiếm chỉ đạo theo Mã chỉ đạo hoặc Nội dung chỉ đạo.
  - **Bộ lọc Trạng thái**: Lọc danh sách theo các trạng thái quy trình (`waitingAssign`, `processing`, `reported`, `waitingApproval`, `completed`).
  - **Bộ lọc Tình trạng thời hạn**: Lọc theo tình trạng thời hạn (*Tất cả*, *Còn hạn*, *Trễ hạn*).
  - **Bộ lọc Hạn xử lý**: Lịch đơn chọn lọc theo ngày hạn xử lý.
  - **Nút Tìm kiếm & Nút Đặt lại**: Thực hiện lọc dữ liệu hoặc xóa sạch thông tin lọc về mặc định.

- **Component Bảng Danh sách Chỉ đạo**:
  - Hiển thị danh sách bản ghi gồm các thông tin: STT, Nội dung chỉ đạo, Nhóm dữ liệu, Ngày ban hành, Tình trạng thời hạn xử lý (hiển thị biểu tượng cảnh báo thời hạn), Trạng thái quy trình và Nút mở xem chi tiết.

- **Component Cụm Phân trang**:
  - Cung cấp các nút điều hướng chuyển trang (Trang đầu, Trang trước, Các trang số, Trang sau, Trang cuối).
  - Dropdown chọn số lượng bản ghi hiển thị trên mỗi trang (ví dụ: 10, 20, 50 bản ghi/trang).

- **Component Form Chi tiết Chỉ đạo (Overlay Modal)**:
  - **Mục Thông tin Chỉ đạo**: Hiển thị Nội dung, Nhóm dữ liệu, Hạn xử lý, Người ban hành, Ngày ban hành, Liên kết sang Dashboard chuyên ngành và Ảnh đính kèm mẫu (`CD_DanCu_GiaLai_2026.png`).
  - **Mục Ghi chú thêm của Đơn vị**: Cho phép nhập ghi chú và chọn tệp đính kèm ở bước *Chờ phân công*; chuyển sang chế độ chỉ đọc khi chuyển sang các bước xử lý tiếp theo.
  - **Mục Chọn người xử lý & Chuyển xử lý**: Cung cấp ô dropdown chọn Chuyên viên xử lý (chỉ hiển thị họ và tên cán bộ) và nút *Chuyển xử lý* ở bước *Chờ phân công*; chuyển sang khối hiển thị người xử lý chỉ đọc khi ở các bước tiếp theo.
  - **Mục Nộp báo cáo Kết quả của Đơn vị**: Cung cấp ô nhập báo cáo kết quả kèm nút đính kèm file và nút *Trình phê duyệt* dành cho Chuyên viên ở bước *Đang xử lý*.
  - **Mục Xem xét Báo cáo & Trình Tỉnh**: Dành cho Lãnh đạo Sở ở bước *Đã có báo cáo*, gồm ô nhập nội dung, đính kèm tệp và 2 nút hành động: *Trình phê duyệt* (gửi Tỉnh) hoặc *Trả về* (gửi lại Chuyên viên làm lại kèm lưu lý do trả về).
  - **Mục Trạng thái Thông báo**: Bổ sung hiển thị ở dưới cùng Cột Trái khi xem chỉ đạo ở tab *Đã xử lý* cho các trạng thái:
    - `completed` (Đã kết thúc): *Chỉ đạo đã được hoàn thành và phê duyệt.*
    - `waitingApproval` (Chờ phê duyệt): *Chỉ đạo đang chờ Lãnh đạo Tỉnh phê duyệt.*
    - `processing` (Đang xử lý): *Chỉ đạo đang trong quá trình xử lý.*
    - `reported` (Đã có báo cáo): *Báo cáo đã được trình Lãnh đạo. Đang chờ xét duyệt.*
  - **Component Sơ đồ Luồng Quy trình (UML)**: Hiển thị minh họa trực quan luồng quy trình 7 node SVG, tự động cập nhật đánh dấu vị trí bước đang đứng và vẽ các đường luồng trả về khi bị từ chối.

- **Component Xem Hình ảnh Đính kèm (Image Viewer Modal)**:
  - Popup xem ảnh phóng to, hiển thị thông tin Dashboard đính kèm sắc nét ở trung tâm màn hình.

---

## 2. Quy trình & Luồng Xử lý Nghiệp vụ (Business Workflow)

1. **Quy tắc Cập nhật Dữ liệu trong Modal**:
   - Khi bấm các nút hành động (*Chuyển xử lý*, *Trình phê duyệt*, *Trả về*) và xác nhận thành công: Form modal **KHÔNG đóng lại**, tự động làm mới dữ liệu và sơ đồ luồng quy trình mới nhất ngay trong form, đồng thời bật thông báo Toast thành công. Form chỉ đóng khi người dùng chủ động đóng.

2. **Quy tắc Kiểm tra Dữ liệu Đầu vào (Inline Validation)**:
   - Khi nhấn các nút hành động (*Chuyển xử lý*, *Trình phê duyệt*, *Trả về*) mà chưa chọn người xử lý hoặc chưa nhập nội dung trong ô văn bản, hệ thống đánh dấu lỗi trực tiếp bên dưới ô nhập liệu, hoàn toàn không dùng thông báo Toast hoặc Popup để báo lỗi validate.

3. **Quy chuẩn Popup Xác nhận & Toast Notification**:
   - Mọi thao tác làm thay đổi trạng thái chỉ đạo đều bật Popup xác nhận với câu hỏi nghiệp vụ chung (ví dụ: *"Bạn có chắc chắn muốn trình phê duyệt báo cáo này?"*).
   - Sau khi xác nhận thành công, hệ thống bật thông báo Toast ghi nhận kết quả chung ngắn gọn (ví dụ: *"Đã chuyển xử lý thành công!"*, *"Đã trình phê duyệt thành công!"*, *"Đã trả về thành công!"*).

4. **Luồng Nghiệp vụ theo Vai trò**:
   - **Lãnh đạo Sở (`role: leader`)**:
     - Ở bước *Chờ phân công*: Chọn Chuyên viên từ dropdown và nhấn *Chuyển xử lý*.
     - Ở bước *Đã có báo cáo*: Kiểm tra báo cáo của Chuyên viên, nhập nội dung và chọn *Trình phê duyệt* (gửi Tỉnh) hoặc *Trả về* (gửi Chuyên viên làm lại).
     - Ở bước *Chờ phê duyệt*: Có 2 nút mô phỏng (*Tỉnh đồng ý* / *Tỉnh từ chối*) để kiểm tra phản hồi từ Tỉnh.
   - **Chuyên viên (`role: individual`)**:
     - Ở bước *Đang xử lý*: Nhập nội dung báo cáo kết quả, đính kèm tệp và nhấn *Trình phê duyệt*.
     - Khi bị Lãnh đạo Sở trả về: Xem lại lý do trả về trong thẻ báo cáo cũ, nhập báo cáo mới và trình lại.

---

## 3. Danh sách 5 Dữ liệu Mẫu (Data Prototype)

1. `CD-2026-TEST-01`: Trạng thái **Chờ phân công** (`waitingAssign`) — Sở TN&MT chưa phân công chuyên viên.
2. `CD-2026-TEST-02`: Trạng thái **Đang xử lý** (`processing`) — Sở KH&ĐT đã phân công Chuyên viên Nguyễn Văn An thực hiện.
3. `CD-2026-TEST-03`: Trạng thái **Đã có báo cáo** (`reported`) — Sở NN&PTNT Chuyên viên Trần Thị Bình đã nộp báo cáo kết quả.
4. `CD-2026-TEST-04`: Trạng thái **Chờ phê duyệt** (`waitingApproval`) — Sở Y tế Lãnh đạo Sở đã nộp báo cáo trình Tỉnh, đang chờ Tỉnh duyệt.
5. `CD-2026-TEST-05`: Trạng thái **Đã kết thúc** (`completed`) — Sở Giáo dục & Đào tạo chỉ đạo đã được Tỉnh phê duyệt hoàn thành.
