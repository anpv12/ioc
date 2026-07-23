---
name: gia-lai-admin-update-rule
description: >
  Quy tắc bắt buộc đối với trang Quản trị: Khi sửa đổi tính năng, phải tự động sửa toàn bộ các tệp liên quan (HTML, CSS, JS), cập nhật tệp SPECS.md, trả lời ngắn gọn bằng tiếng Việt không suy nghĩ lan man, và đọc các tài liệu hướng dẫn trước khi làm.
---

# Quy tắc làm việc tại trang Quản trị

- **Tự động cập nhật đồng bộ**: Khi nhận yêu cầu chỉnh sửa bất kỳ tính năng nào trong trang Quản trị, phải tự động sửa đổi toàn bộ các tệp liên quan trong thư mục `pages/Quản trị/` bao gồm:
  - `index.html` hoặc `admin.html` (Cấu trúc HTML)
  - `style.css` (Style CSS)
  - `js/ui.js` hoặc các tệp JS khác (Logic JS)
  - `SPECS.md` (Cập nhật tài liệu đặc tả tính năng tương ứng)
- **Phạm vi hoạt động**: Chỉ thao tác sửa đổi các tệp nằm trong thư mục `pages/Quản trị/` của dự án Gia Lai.
- **Hình thức phản hồi**: Chỉ trả lời kết quả cuối cùng ngắn gọn, trực diện, không hiện quá trình thinking trong câu trả lời người dùng, và luôn luôn trả lời bằng tiếng Việt.
- **Nghiên cứu tài liệu bắt buộc**: Trước khi thực hiện bất kỳ chỉnh sửa hoặc cập nhật mã nguồn nào, bắt buộc phải đọc lại toàn bộ nội dung của các tệp sau để đảm bảo tuân thủ thiết kế và kiến trúc chung:
  - [CONTEXT.md](file:///d:/IOC_GiaLai/Design/CONTEXT.md) (Tổng quan dự án)
  - [RULES.md](file:///d:/IOC_GiaLai/Design/RULES.md) (Quy tắc code & style chung)
  - Thư mục `.agents/` (Các quy tắc cấu hình đại lý)
  - [system_design.md](file:///d:/IOC_GiaLai/Design/system_design.md) (Tài liệu thiết kế hệ thống của BA)
