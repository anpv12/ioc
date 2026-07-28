# Đặc tả trang: IAM (Identity and Access Management - Quản lý Phân quyền & Truy cập)

## 1. Mục tiêu
Quản lý cơ quan/đơn vị cho hệ thống PM Giám sát, điều hành trung tâm tỉnh Gia Lai. Sidebar gồm 1 màn hình: **Quản lý cơ quan** (danh sách cơ quan, form thêm/sửa/xem thông tin cơ quan kèm người phụ trách chính).

> **Đã loại bỏ:** toàn bộ màn hình/form/block liên quan **Phòng ban**; Form 2 cấu hình người phụ trách chính riêng; cột **Đang quản lý**; nút cấu hình người phụ trách trên danh sách.

## 2. Cấu trúc tệp
- `index.html` — Cấu trúc HTML chính (Danh sách cơ quan, Form thông tin cơ quan Thêm/Sửa, Form xem chi tiết, Modal xác nhận xóa, Modal xác nhận đổi người phụ trách)
- `style.css` — Styling riêng cho trang IAM
- `js/ui.js` — Logic tương tác UI: danh sách cơ quan, form thêm/sửa/xem, phân trang, dropdown nhân viên, modal xác nhận

## 3. Chức năng chính

### 3.1. Màn hình Danh sách cơ quan
Layout: Sidebar trái + Topbar + vùng tiêu đề/breadcrumb + Card nội dung.

**Tiêu đề trang & đường dẫn:**
- Tiêu đề trang (page-title) nằm trên.
- Breadcrumb nằm ngay bên dưới tiêu đề (không cùng hàng ngang): dạng `Quản trị hệ thống > [màn hình hiện tại]`.
- Chỉ header / tiêu đề cột được in đậm; chữ chi tiết (giá trị ô, nội dung form xem) dùng font-weight thường.

**Hàng filter:**
- Ô tìm kiếm (placeholder "Tìm kiếm ...") — lọc theo tên cơ quan, không phân biệt hoa thường, client-side.
- Nút "Tìm kiếm".
- Nút "Làm mới" → reset ô tìm kiếm + render lại toàn bộ danh sách + toast thành công "Đã làm mới dữ liệu thành công".
- Nút "+ Thêm mới" (bên phải).

**Bảng — cột theo thứ tự:**
STT | Tên cơ quan | Địa chỉ | Người phụ trách | Hoạt động | Xử lý

- **Tên cơ quan**: cột rộng hơn (min-width ~240px), không xuống dòng.
- **Địa chỉ**: cột thu hẹp; nếu dài thì cắt bằng ellipsis (`text-overflow: ellipsis`), hover hiện đủ qua `title`.
- **Người phụ trách** *(TÍNH NĂNG MỚI)*: hiển thị tên người phụ trách chính của cơ quan (lấy từ field `manager`). Nếu chưa có, hiển thị **"Chưa cấu hình"** (màu chữ phụ). Được cập nhật khi lưu Form thông tin cơ quan. Nằm sau cột Địa chỉ.
- **Hoạt động**: badge text — "Hoạt động" (nền xanh nhạt, chữ xanh đậm) / "Không hoạt động" (nền đỏ nhạt, chữ đỏ). **Không** dùng switch toggle trên danh sách. Cột `white-space: nowrap` để không xuống dòng.
- **Xử lý**: nút 3 chấm (⋮) mở dropdown menu gồm:
  - Xem (icon mắt) → mở Form ở chế độ Xem.
  - Sửa (icon bút chì) → mở Form ở chế độ Sửa.
  - Xóa (icon thùng rác) → mở modal xác nhận xóa trước khi xóa.

**Phân trang** cuối bảng:
- Bên trái: select cỡ trang (10 / 20 / 50) + text "Hiển thị x-y/total".
- Bên phải: nút điều hướng trang (đầu / trước / số trang / sau / cuối).

**Sidebar:** 1 mục "Quản lý cơ quan" (mặc định active).

### 3.2. Form — Thông tin cơ quan (Thêm / Sửa)
Bấm Thêm / Sửa sẽ ẩn danh sách và hiện form full-page thay thế.

**Trường (dấu `*` đỏ = bắt buộc):**
1. Tên cơ quan *
2. Cơ quan cấp trên (custom dropdown, placeholder "-- Chọn --", loại trừ chính cơ quan đang sửa; cho phép clear ×; empty = không có cấp trên)
3. **Người phụ trách chính** * *(TÍNH NĂNG MỚI)*: custom dropdown danh sách nhân viên
   - Hiển thị: `username - fullName` (vd: `HoaCM - Châu Minh Hoa`)
   - Nhóm theo phòng ban (group header)
   - Chỉ chọn 1 nhân viên
   - Hover item chưa chọn: nền xám
   - Item đã chọn: nền xanh nhạt
   - Cho phép clear (nút ×) nhưng khi Lưu vẫn bắt buộc phải chọn 1 người
   - Placeholder "-- Chọn --" (chữ xám)
4. Địa chỉ trụ sở
5. Số tầng * + Vị trí * (cùng 1 dòng, 2 cột)
   - Số tầng: input number, ẩn spin arrows
   - Vị trí: dạng "lat, lng" + khu vực bản đồ minh họa bên dưới (Leaflet nếu khả dụng, fallback placeholder), cập nhật theo tọa độ nhập
6. Mô tả (textarea)
7. Hoạt động (toggle switch) — hiển thị dạng một hàng riêng, switch và nhãn căn trái

**Nút form Thêm/Sửa (cuối form, trong card):**
- **Trở về**: nền xanh nhạt (`#E4F2FF`), chữ xanh `#0091FF` — bên trái.
- **Lưu**: nền xanh `#0091FF`, chữ trắng — bên phải.
- Trong card: section title cố định **"Thông tin cơ quan"**.

**Nút màn xem chi tiết (góc phải vùng tiêu đề trang):**
- **Chỉnh sửa** + **Trở về**: cùng style nền xanh nhạt, chữ xanh.

**Chế độ hoạt động:**
- Thêm mới: form trống; tiêu đề trang "Thêm cơ quan".
- Sửa: pre-fill dữ liệu (gồm Người phụ trách chính); tiêu đề trang "Cấu hình cơ quan".
- Validate bắt buộc trước khi Lưu (Tên cơ quan, Người phụ trách chính, Số tầng, Vị trí đúng định dạng `lat, lng`); lỗi hiển thị màu đỏ ngay dưới field.
- **Sau Lưu thành công (Thêm hoặc Sửa):** chuyển sang màn **xem chi tiết** của bản ghi vừa lưu — **không** quay về danh sách.

**Xác nhận đổi người phụ trách chính** *(TÍNH NĂNG MỚI)*:
- Khi đang **Sửa** và giá trị Người phụ trách chính thay đổi so với dữ liệu gốc → hiện modal xác nhận trước khi lưu.
- Hiển thị card so sánh **Hiện tại** → **Người mới**: tên (`username - fullName`) kèm **phòng ban**.
- Người dùng bấm Xác nhận mới cho phép lưu; Hủy thì đóng modal, giữ form.

### 3.3. Form — Xem chi tiết cơ quan
Bấm Xem sẽ ẩn danh sách và hiện form xem full-page.

- Nút góc trên phải: **Chỉnh sửa** (mở form Sửa cùng id) + **Trở về** (về danh sách).
- Hiển thị dạng **label: value** gọn gàng (không dùng ô input disabled rộng); giá trị chi tiết không in đậm:
  - Tên cơ quan
  - Cơ quan cấp trên
  - Người phụ trách chính *(TÍNH NĂNG MỚI)*
  - Số tầng
  - Tình trạng hoạt động (text "Hoạt động" / "Không hoạt động")
  - Địa chỉ
  - Vị trí bản đồ
  - Mô tả
- Bản đồ minh họa bên dưới (cập nhật theo tọa độ).

### 3.4. Dropdown chung (Cơ quan cấp trên + Người phụ trách chính)
- Placeholder: "-- Chọn --" (chữ xám)
- Item đang chọn: nền xanh nhạt (`#E5F2FF`)
- Hover item chưa chọn: nền xám (`#F3F5F9`)
- Border xanh khi focus/open (`#0091FF`)
- Chỉ chọn 1 item
- Cho phép clear (nút ×)
- Dropdown **Người phụ trách chính** là *(TÍNH NĂNG MỚI)* — nhóm theo phòng ban, hiển thị `username - fullName`.

### 3.5. Textfield hover / focus
- Tất cả `.form-input`: hover và focus cùng màu border xanh `#0091FF`.

## 4. Dữ liệu mock
- **Cơ quan** (`agenciesData`, 10 bản ghi): `id, name, manager, address, active, parentId, floors, lat, lng, description`.
  - `manager`: chuỗi hiển thị `username - fullName` hoặc rỗng.
  - Một số bản ghi có `manager: ''` để test hiển thị "Chưa cấu hình" và validate bắt buộc khi sửa.
  - Một số bản ghi có `active: false` để test badge "Không hoạt động" màu đỏ.
- **Nhân viên** (`employeesData`): `id, username, fullName, department` — dùng cho dropdown Người phụ trách chính, nhóm theo `department`.

## 5. Yêu cầu kỹ thuật
- HTML/CSS/Vanilla JavaScript, không dùng framework.
- Không hardcode màu/font-size/spacing tùy tiện; tận dụng class dùng chung sẵn có (`.card`, `.filter-row`, `.search-wrap`, `.btn-primary`, `.btn-reset`, `.form-input`, `.modal-overlay`, `.switch`...).
- `input[type=number]` luôn ẩn spin arrows.
- Modal xác nhận xóa: icon cảnh báo giữa, tiêu đề "Xác nhận xoá", nút đỏ full-width "Xác nhận", link "Hủy" bên dưới.
- Modal xác nhận đổi người phụ trách chính dùng khi Sửa; hiển thị phòng ban của nhân viên.
- Toast (success/error) dùng chung cho toàn bộ thao tác Thêm/Sửa/Xóa/Làm mới/Lưu.
- Khi mở Form thì ẩn danh sách chính; bấm "Trở về danh sách" / "Trở về" thì hiện lại danh sách.
- Cột "Người phụ trách", dropdown "Người phụ trách chính" và modal xác nhận đổi người phụ trách chính là **TÍNH NĂNG MỚI**.
- Typography: chỉ header / tiêu đề cột in đậm; chữ chi tiết (ô bảng, giá trị form xem) dùng font-weight thường.
- Breadcrumb đặt dưới tiêu đề trang; nút Chỉnh sửa/Trở về (xem chi tiết) nằm góc phải vùng tiêu đề; nút Trở về/Lưu (form Thêm/Sửa) nằm cuối form.
- Cột bảng: STT | Tên cơ quan | Địa chỉ | Người phụ trách | Hoạt động | Xử lý.
- Cột Tên cơ quan: min-width rộng hơn, không xuống dòng; cột Địa chỉ: ellipsis khi dài; cột Hoạt động: nowrap.
- Sau Lưu (Thêm/Sửa) thành công: mở màn xem chi tiết bản ghi vừa lưu, không quay danh sách.
