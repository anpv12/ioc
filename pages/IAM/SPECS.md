# Đặc tả trang: IAM (Identity and Access Management - Quản lý Phân quyền & Truy cập)

## 1. Mục tiêu
Quản lý người dùng, nhóm quyền, vai trò (Role-based Access Control - RBAC) và nhật ký truy cập cho hệ thống PM Giám sát, điều hành trung tâm tỉnh Gia Lai. Sidebar gồm 2 màn hình cùng cấp: **Quản lý cơ quan** (quản lý danh sách cơ quan/đơn vị, phòng ban trực thuộc và người phụ trách chính của từng cơ quan) và **Quản lý phòng ban** (quản lý toàn bộ phòng ban trong hệ thống, không giới hạn theo 1 cơ quan).

## 2. Cấu trúc tệp
- `index.html` — Cấu trúc HTML chính (Danh sách cơ quan, Danh sách phòng ban top-level, Form 1 - Thông tin cơ quan, Form 2 - Người phụ trách chính, Modal Thêm/Sửa/Xem phòng ban, Modal xác nhận xóa, Modal xác nhận thay đổi người phụ trách)
- `style.css` — Styling riêng cho trang IAM
- `js/ui.js` — Logic tương tác UI: danh sách cơ quan, danh sách phòng ban (top-level), phòng ban theo cơ quan, người phụ trách chính

## 3. Chức năng chính

### 3.1. Màn hình Danh sách cơ quan
Layout: Sidebar trái + Topbar + Breadcrumb + Card nội dung.

**Hàng filter:**
- Ô tìm kiếm (placeholder "Tìm kiếm ...") — lọc theo tên cơ quan, không phân biệt hoa thường, client-side.
- Nút "Tìm kiếm".
- Nút "Làm mới" → reset ô tìm kiếm + render lại toàn bộ danh sách + toast thành công "Đã làm mới dữ liệu thành công".
- Nút "+ Thêm cơ quan" (bên phải).

**Bảng — cột theo thứ tự:**
STT | Tên cơ quan | Người phụ trách | Địa chỉ | Đang quản lý | Hoạt động | Xử lý

- **Đang quản lý**: checkbox readonly, màu xanh đồng bộ với toggle Hoạt động.
  - `checked = true` nếu tài khoản đang đăng nhập có quyền quản lý cơ quan đó (`managedByCurrentUser`).
  - Tooltip "Bạn đang được gán quyền quản lý cơ quan này" khi checked.
- **Hoạt động**: toggle switch, bật/tắt trực tiếp trên danh sách.
- **Xử lý**: 4 nút hành động mỗi dòng:
  - Xem (icon mắt) → mở Form 1 ở chế độ Xem.
  - Sửa (icon bút chì) → mở Form 1 ở chế độ Sửa.
  - Xóa (icon thùng rác) → mở modal xác nhận xóa trước khi xóa.
  - Cấu hình người phụ trách chính (icon user-gear) → chỉ hiện khi "Đang quản lý" = true, mở Form 2.
- **Người phụ trách**: hiển thị tên người phụ trách chính hiện tại của cơ quan; được cập nhật tự động sau khi lưu ở Form 2. Nếu chưa có ai được cấu hình, hiển thị **"Chưa cấu hình"** (màu chữ phụ).

**Sidebar:** gồm 2 mục cùng cấp — "Quản lý cơ quan" (mặc định active) và "Quản lý phòng ban" — click để chuyển màn hình, cập nhật tiêu đề trang + breadcrumb tương ứng.

### 3.1b. Màn hình "Quản lý phòng ban" (top-level, toàn hệ thống)
Cùng cấp với Danh sách cơ quan trên sidebar; layout tương tự (filter-row + bảng + phân trang).

**Hàng filter:**
- Ô tìm kiếm (placeholder "Tìm kiếm ...") — lọc theo **tên phòng ban**, không phân biệt hoa thường, client-side.
- Nút "Tìm kiếm".
- Nút "Làm mới" → reset ô tìm kiếm + render lại + toast "Đã làm mới dữ liệu thành công".
- Nút "+ Thêm mới" (bên phải) → mở Modal Thêm phòng ban (field Cơ quan bắt buộc chọn).

**Bảng — cột theo thứ tự:** STT | Tên phòng ban | Cơ quan | Mô tả | Hoạt động | Xử lý
- **Cơ quan**: tên cơ quan tương ứng (`agencyId` → `agenciesData.name`).
- **Hoạt động**: badge "Hoạt động" (xanh) / "Không hoạt động" (xám).
- **Xử lý**: nút 3 chấm mở dropdown gồm Xem (readonly) / Sửa / Xóa (dùng modal xác nhận xóa chung).

**Phân trang** cuối bảng, page size = 10.

### 3.2. Form 1 — Thông tin cơ quan (full-page)
Bấm Thêm / Sửa / Xem sẽ ẩn danh sách và hiện form full-page thay thế.

**Trường (dấu `*` đỏ = bắt buộc):**
1. Tên cơ quan *
2. Cơ quan cấp trên (dropdown, có option "-- Không có --", loại trừ chính cơ quan đang sửa)
3. Địa chỉ trụ sở
4. Số tầng * (input number, ẩn spin arrows)
5. Vị trí * (dạng "lat, lng") + khu vực bản đồ minh họa bên dưới, cập nhật theo tọa độ nhập
6. Mô tả (textarea)
7. Hoạt động (toggle switch) — hiển thị dạng một hàng riêng, switch và nhãn căn trái, không kéo giãn giữa card

**Nút cuối phần thông tin cơ quan:**
- Trái: "Trở về danh sách"
- Phải: "Lưu" (chỉ hiện ở chế độ Thêm/Sửa, ẩn ở chế độ Xem)

**Chế độ hoạt động:**
- Thêm mới: form trống, **ẩn hoàn toàn** block Danh sách phòng ban.
- Sửa: pre-fill dữ liệu, **hiện** block Danh sách phòng ban của đúng cơ quan.
- Xem chi tiết: toàn bộ field disabled/readonly, chỉ còn nút "Trở về danh sách", **hiện** block Danh sách phòng ban ở trạng thái khóa hoàn toàn: ẩn nút "+ Thêm mới", disable ô tìm kiếm/nút Tìm kiếm/Làm mới, menu 3 chấm mỗi dòng chỉ còn "Xem" (không cho Sửa/Xóa).

Validate bắt buộc trước khi Lưu (Tên cơ quan, Số tầng, Vị trí đúng định dạng `lat, lng`); lỗi hiển thị màu đỏ ngay dưới field.

### 3.3. Block "Danh sách phòng ban thuộc cơ quan" (trong Form 1)
Chỉ hiện ở chế độ Sửa/Xem, gắn theo cơ quan đang mở.

**Hàng filter:** ô tìm kiếm, nút "Tìm kiếm", nút "Làm mới" (reset tìm kiếm + reload danh sách phòng ban + toast "Đã làm mới dữ liệu thành công"), nút "+ Thêm mới" (bên phải, mở Modal Thêm phòng ban).

**Bảng — cột:** STT | Tên phòng ban | Mô tả | Hoạt động | Xử lý
- Hoạt động: badge "Hoạt động" (xanh) / "Không hoạt động" (xám).
- Xử lý: nút 3 chấm (⋮) mở dropdown menu gồm:
  - Chỉnh sửa (icon bút) → mở Modal Sửa phòng ban.
  - Xóa (icon thùng rác) → mở modal xác nhận trước khi xóa.

Có phân trang đơn giản ở cuối bảng (Trang x/y, nút Trước/Sau).

### 3.4. Modal Thêm / Sửa / Xem phòng ban (dùng chung cho block trong Form 1 và màn hình top-level)
Kích thước vừa (~480–520px). Tiêu đề: "Thêm phòng ban" / "Chỉnh sửa phòng ban" / "Xem thông tin phòng ban".

**Trường:**
1. Cơ quan * (select) — **chỉ hiện khi mở từ màn hình "Quản lý phòng ban" top-level** (`context = 'top'`); ẩn khi mở từ block phòng ban trong Form 1 (`context = 'agency'`, cơ quan đã được xác định theo ngữ cảnh). Khi Thêm mới từ top-level: để trống ("-- Chọn --"). Khi Sửa: pre-fill + cho phép đổi cơ quan.
2. Tên phòng ban * (text)
3. Mô tả (textarea)
4. Hoạt động (toggle switch, mặc định bật)

**Chế độ Xem:** toàn bộ field disabled, ẩn nút "Lưu", nút còn lại đổi thành "Đóng".

**Nút cuối modal (chế độ Thêm/Sửa):** Trái "Hủy", Phải "Lưu".

**Logic:** validate Tên phòng ban * bắt buộc; Cơ quan * bắt buộc khi `context = 'top'`; lưu thành công → đóng modal + render lại cả bảng phòng ban đang mở (Form 1 và/hoặc top-level) + toast thành công; Hủy/Đóng hoặc click ra ngoài → đóng modal không lưu.

### 3.5. Form 2 — Cấu hình người phụ trách chính (full-page)
Chỉ mở được khi tài khoản đang đăng nhập có quyền quản lý ít nhất 1 cơ quan (`managedByCurrentUser = true`).

**Luồng:**
1. Dropdown "Cơ quan": chỉ liệt kê cơ quan mà user hiện tại được gán quyền quản lý.
2. Combo tìm kiếm "Nhân viên": chỉ hiện nhân viên thuộc cơ quan đã chọn.
   - Mỗi option hiển thị format "Tên đăng nhập – Tên đầy đủ" (ví dụ: "AnNV – Nguyễn Văn An").
   - Tìm kiếm theo cả tên đăng nhập và họ tên.
   - Mở dropdown khi focus vào ô: nếu ô đang hiển thị đúng lựa chọn đã chốt trước đó (chưa gõ sửa), hiện toàn bộ danh sách nhân viên của cơ quan thay vì lọc theo chuỗi hiển thị đầy đủ.
3. Sau khi chọn nhân viên → hiện ngay block thông tin chi tiết: Tên đăng nhập, Tên đầy đủ, Email, Số điện thoại, Ngày sinh, Giới tính, Cơ quan, Phòng ban.
4. Nút cuối form: Trái "Trở về", Phải "Lưu người phụ trách chính".

**Pre-fill người phụ trách đã lưu:**
- Khi mở Form 2 (từ nút user-gear hoặc mặc định cơ quan đầu tiên được quản lý): nếu cơ quan đã có người phụ trách được lưu trước đó (`primaryManagerAssignments[agencyId]` hoặc đối chiếu `agency.manager` với `staffData`) → tự động chọn đúng nhân viên đó, hiển thị "Tên đăng nhập – Tên đầy đủ" trong ô Nhân viên và hiện block chi tiết.
- Khi đổi sang cơ quan khác trong dropdown "Cơ quan": nếu cơ quan mới đã có người phụ trách đã lưu → pre-fill lại nhân viên + chi tiết; nếu chưa có → để trống.

**Xác nhận khi đổi người phụ trách:** khi bấm "Lưu người phụ trách chính", nếu cơ quan đó **đã có** người phụ trách trước đó và nhân viên mới chọn **khác** nhân viên cũ → hiện modal xác nhận "Xác nhận thay đổi người phụ trách" (nội dung nêu rõ tên cơ quan, người cũ, người mới; nút Hủy | Xác nhận). Chỉ khi bấm Xác nhận mới ghi nhận thay đổi. Nếu chưa có người phụ trách cũ, hoặc chọn đúng người cũ, thì lưu thẳng không hỏi.

**Logic lưu:** hệ thống ghi nhận nhân viên được chọn làm người phụ trách chính của cơ quan (`primaryManagerAssignments[agencyId]`) và **cập nhật cột "Người phụ trách"** tương ứng ngoài màn hình Danh sách cơ quan.

## 4. Dữ liệu mock
- **Cơ quan** (`agenciesData`, 10 bản ghi): `id, name, manager, address, active, parentId, floors, lat, lng, description, managedByCurrentUser`.
  - 3 cơ quan có `managedByCurrentUser = true` (id 1, 2, 8) để test luồng Form 2 và nút "Cấu hình người phụ trách chính".
  - 4 cơ quan có `manager: ''` (id 4, 5, 8, 10) để test hiển thị "Chưa cấu hình".
- **Phòng ban** (`departmentsData`, 29 bản ghi, 2–3 phòng ban/cơ quan): `id, agencyId, name, description, active`.
- **Nhân viên** (`staffData`, 12 bản ghi): `id, username, fullName, email, phone, birthday, gender, agencyId, department`.
- `primaryManagerAssignments`: map `{ agencyId: staffId }` lưu người phụ trách chính đã cấu hình (mock, chưa có backend). Nếu rỗng, hệ thống đối chiếu `agency.manager` với `staffData` để suy ra người phụ trách đã lưu trước đó (phục vụ pre-fill Form 2).

## 5. Yêu cầu kỹ thuật
- HTML/CSS/Vanilla JavaScript, không dùng framework.
- Không hardcode màu/font-size/spacing tùy tiện; tận dụng class dùng chung sẵn có (`.card`, `.filter-row`, `.search-wrap`, `.btn-primary`, `.btn-reset`, `.form-input`, `.modal-overlay`, `.switch`...).
- `input[type=number]` luôn ẩn spin arrows.
- Modal xác nhận xóa dùng chung cho cả Cơ quan và Phòng ban (phân biệt bằng ngữ cảnh `type`).
- Modal Thêm/Sửa/Xem phòng ban dùng chung cho block trong Form 1 và màn hình top-level (phân biệt bằng ngữ cảnh `context`: `'agency'` | `'top'`).
- Modal xác nhận thay đổi người phụ trách chính (Form 2) khi ghi đè lên người phụ trách đã có trước đó.
- Toast (success/error) dùng chung cho toàn bộ thao tác Thêm/Sửa/Xóa/Làm mới/Lưu.
- Khi mở Form 1 hoặc Form 2 thì ẩn danh sách chính; bấm "Trở về"/"Trở về danh sách" thì hiện lại danh sách.
- Sidebar 2 mục "Quản lý cơ quan" / "Quản lý phòng ban" đồng bộ trạng thái active với view đang hiển thị.
