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
- **Phải hỏi trước khi thực hiện sửa file** : phải trình bày ý kiến với người dùng để họ đồng ý với các thay đổi sẽ thực hiện trên các file và đảm bảo rằng không có sự hiểu nhầm.
- **Không được tự động tạo thêm file** : không được tạo thêm các file không yêu cầu.
- **Không tự ý push/pull code từ git về**: Khi nào người dùng yêu cầu thì mới được push/pull.
- **Không tự ý sửa đổi thiết kế của người dùng**: Phải theo sát yêu cầu và thiết kế của người dùng, không được tự ý thay đổi.
- **Specs.md**: chỉ để ghi luồng nghiệp vụ, mô tả xem form đó có các component gì, các component đó có ý nghĩa gì, trình bày thao tác của component đó một cách đơn giản, không đề cập đền phần style trong đây. 
