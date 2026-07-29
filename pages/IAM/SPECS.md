# Đặc tả trang: IAM (Identity and Access Management - Quản lý Phân quyền & Truy cập)

## 1. Mục tiêu
Quản lý người dùng, nhóm quyền, vai trò (Role-based Access Control - RBAC) và nhật ký truy cập cho hệ thống PM Giám sát, điều hành trung tâm tỉnh Gia Lai.

## 2. Cấu trúc tệp
- `index.html` — Cấu trúc HTML chính
- `style.css` — Styling riêng cho trang IAM
- `js/ui.js` — Logic tương tác UI, danh sách người dùng & nhóm quyền

## 3. Chức năng chính
- Quản lý Tài khoản (Danh sách người dùng, trạng thái kích hoạt, gán vai trò)
- Quản lý Nhóm quyền & Vai trò (Lãnh đạo, Người thực thi, Quản trị hệ thống)
- Nhật ký truy cập (Audit log)
- Quản lý cơ quan

## 3.1 Quản lý cơ quan
### Note quan trọng (dựng UI)
> **Dựng lại toàn bộ hiện trường từ UI hiện có của IOC KHÁNH HÒA.**  
> Chỉ bổ sung tính năng mới **Người phụ trách chính**.  
> Giữ nguyên layout, component, style, interaction sẵn có của màn Quản lý cơ quan; không redesign.

### 3.1.1 Thêm mới Cột Người phụ trách trên danh sách cơ quan 
- Hiển thị **tên đầy đủ** của người phụ trách chính.
- Nếu chưa có → hiển thị **"Chưa cấu hình"** (màu chữ phụ #bbbdcd). 
- Vị trí cột: sau cột Địa chỉ.
- Thứ tự cột bảng:  
  **STT | Tên cơ quan | Địa chỉ | Người phụ trách | Hoạt động | Xử lý**

### 3.1.2. Thêm Field Người phụ trách chính trong Form Thêm/Sửa
- Bắt buộc (*).
- Custom dropdown danh sách nhân viên:
  - Item hiển thị: `username - fullName` (vd: `HoaCM - Châu Minh Hoa`)
  - Nhóm theo phòng ban (group header)
  - Chỉ chọn 1 nhân viên
  - Hover item chưa chọn: nền xám #f3f5f9
  - Item đã chọn: nền xanh nhạt #e5f2ff, chữ xanh #68beff
  - Cho phép clear field (nút ×) nhưng khi nhấn Lưu vẫn bắt buộc phải chọn 1 người phụ trách chính
  - Placeholder `"-- Chọn --"` (chữ xám #bbb6b7)
  - Ô tìm kiếm theo tên trên đầu panel (lọc client-side)
- Sau khi chọn, trigger hiển thị: `username - fullName - phòng ban`.

### 3.1.3. Modal xác nhận đổi người phụ trách chính
- Chỉ hiện khi đang **Sửa** và giá trị Người phụ trách chính thay đổi so với dữ liệu gốc.
- Hiển thị card so sánh **Hiện tại** → **Người mới**:  
  tên (`username - fullName`) kèm **phòng ban**.
- Bấm **Xác nhận** mới cho phép lưu; **Hủy** thì đóng modal, giữ form.

### 3.1.4. Hiển thị Người phụ trách chính ở Form Xem chi tiết *(TÍNH NĂNG MỚI)*
- Dạng `username - fullName - phòng ban`.

