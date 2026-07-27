# RULES — Quy tắc bắt buộc của dự án Gia Lai

> Đây là tài liệu quy tắc tổng hợp và là file đầu tiên phải đọc trước mọi công việc trong dự án.
> Không được thay đổi file, chạy Git hoặc thực hiện hành động làm thay đổi trạng thái khi chưa trình bày phương án và nhận xác nhận rõ ràng từ người dùng.

---

## 1. Thứ tự đọc bắt buộc

Trước mỗi công việc, phải đọc đầy đủ theo thứ tự:

1. `RULES.md`
2. `CONTEXT.md`
3. `system_design.md`
4. `.agents/skills/gia-lai-dashboard/SKILL.md`
5. `pages/[man-hinh]/SPECS.md` của màn hình đang làm, nếu có
6. Tham chiếu `pages/dashboard` khi thiết kế hoặc sửa giao diện

Phải tuân thủ đồng thời toàn bộ quy định trong các tài liệu trên. Nếu có mâu thuẫn, dừng lại, trình bày điểm mâu thuẫn và hỏi người dùng quyết định.

---

## 2. Quy trình xác nhận trước khi thay đổi

Trước mọi hành động có khả năng thay đổi file hoặc trạng thái dự án, phải:

1. Trình bày ngắn gọn mục tiêu, phương án thực hiện, các file dự kiến ảnh hưởng và rủi ro đáng chú ý.
2. Hỏi người dùng có đồng ý thực hiện hay không.
3. Chờ người dùng trả lời rõ ràng như: `OK`, `làm đi`, `cập nhật đi`, `đồng ý` hoặc câu tương đương.
4. Chỉ thực hiện đúng phạm vi đã trình bày và được xác nhận.
5. Chỉ làm đúng những gì người dùng yêu cầu trực tiếp, không tự tiện thêm bất kỳ chức năng, giao diện, hoặc logic nào khác ngoài các yêu cầu được chỉ định.

Quy trình này áp dụng cho:

- Tạo, sửa, đổi tên, di chuyển hoặc xóa file/thư mục.
- Chạy formatter hoặc công cụ có thể tự sửa file.
- Cài đặt hay thay đổi dependency, cấu hình hoặc môi trường.
- `git add`, `git commit`, tạo/chuyển nhánh, merge, rebase, push và pull.
- Mọi thao tác khác có thể thay đổi working tree, Git metadata, remote hoặc dữ liệu dự án.

Một yêu cầu mô tả công việc chưa được xem là quyền bỏ qua bước xác nhận. Luôn phải trình bày phương án và nhận xác nhận riêng trước khi thay đổi.

Nếu phạm vi phải thay đổi đáng kể so với phương án đã được duyệt, phải dừng và xin xác nhận lại.

Các thao tác chỉ đọc như xem file, tìm kiếm, kiểm tra trạng thái và phân tích không cần xác nhận, nhưng vẫn phải đọc tài liệu theo thứ tự bắt buộc.

---

## 3. Quy trình Git bắt buộc

- Tuyệt đối không push trực tiếp vào `main`.
- Chỉ push lên nhánh làm việc; việc merge vào `main` thuộc quyền của người dùng qua Pull Request.
- Trước pull, push, commit, merge, rebase, tạo hoặc chuyển nhánh: trình bày phương án và chờ xác nhận.
- Trước pull phải kiểm tra nhánh hiện tại và thay đổi cục bộ bằng thao tác chỉ đọc.
- Không ghi đè hoặc xóa thay đổi cục bộ của người dùng.
- Sau Git operation phải kiểm tra và báo rõ nhánh, commit, trạng thái đồng bộ và xung đột nếu có.

### Đồng bộ quy tắc sau khi pull

Sau mỗi pull:

1. Tự động kiểm tra xem `CONTEXT.md`, `system_design.md` hoặc skill dự án có thay đổi hay không.
2. Nếu không thay đổi, báo `RULES.md` vẫn đồng bộ.
3. Nếu có thay đổi, đọc lại các file nguồn, lập danh sách quy tắc mới hoặc quy tắc đã đổi và đề xuất nội dung cập nhật cho `RULES.md`.
4. Hỏi người dùng xác nhận riêng trước khi ghi thay đổi vào `RULES.md`.
5. Chỉ cập nhật sau khi người dùng xác nhận.

Không được tự ghi `RULES.md` ngay sau pull vì điều đó vi phạm quy trình xác nhận trước khi thay đổi file.

---

## 4. Quy trình khi người dùng yêu cầu “cập nhật rule”

Khi nhận yêu cầu cập nhật rule:

1. Đọc `RULES.md`, `CONTEXT.md`, `system_design.md` và skill dự án.
2. Tổng hợp quy tắc mới, phần bị thay thế và ảnh hưởng dự kiến.
3. Trình bày nội dung đề xuất cho người dùng.
4. Hỏi xác nhận.
5. Chỉ sau khi được xác nhận mới sửa `RULES.md` và các tài liệu nguồn được người dùng cho phép.

---

## 5. Quy tắc làm việc và kiểm chứng

- Phản hồi ngắn gọn, đúng trọng tâm.
- Rà soát code trước khi báo hoàn thành.
- `Save = Populate`: sau khi lưu dữ liệu, phải xác nhận giao diện hiển thị đúng.
- Chỉ sửa các file thuộc phạm vi được xác nhận.
- Không làm mất hoặc ghi đè thay đổi không liên quan của người dùng.
- Sau khi sửa phải kiểm tra phù hợp với mức độ rủi ro: cú pháp, đường dẫn, trạng thái Git và hành vi giao diện liên quan.

---

## 6. Quy tắc code

- Không hardcode màu, font-size hoặc spacing.
- Trang Dashboard sử dụng CSS token từ `shared/css/tokens.css` và nền tảng từ `shared/css/base.css`.
- Trang Admin/Quản trị dùng hệ token và CSS riêng mang màu chủ đạo xanh dương; không import `shared/css/tokens.css` hoặc `shared/css/base.css` của Dashboard vì đây là hai design system độc lập.
- DRY: không lặp logic hoặc style; tái sử dụng shared CSS và shared JS.
- Mỗi màn hình phải nhất quán về khoảng cách, kiểu chữ và màu sắc với các màn hình khác.
- Mọi thay đổi chuẩn chung phải cập nhật tài liệu thiết kế sau khi được người dùng xác nhận.
- Padding card tối đa `10px` hoặc `5px 10px`.
- Không tự thêm `margin-top` hoặc `margin-bottom` lớn hơn `10px`.
- Gap chuẩn: `6px` nhỏ, `10px` vừa, `14px` lớn.
- `input[type=number]` luôn phải ẩn spin arrows bằng CSS.
- Datepicker chỉ sử dụng Flatpickr.
- Không dùng nhiều nhánh `if/else` cho nhiều nguồn của cùng một field; phải xác định rõ nguồn dữ liệu.

### Phân tách file của mỗi trang

Mỗi trang phải nằm trong một thư mục độc lập theo cấu trúc:

```text
pages/<ten-trang>/
├── index.html hoặc admin.html
├── style.css
└── js/
    ├── state.js
    ├── ui.js
    ├── charts.js (nếu có biểu đồ)
    └── map.js (nếu có bản đồ)
```

- HTML chỉ chứa cấu trúc; không đặt `<style>` hoặc `<script>` inline trong HTML.
- CSS và JavaScript phải được tải từ file ngoài.
- Logic dùng chung đặt trong `shared/js/`; CSS dùng chung đặt trong `shared/css/`; không sao chép lặp giữa các trang.
- Khi cần sửa giao diện, phải chỉnh selector gốc; không thêm rule override chồng chéo để vá lỗi.

### Quy tắc CSS bổ sung

- Mỗi selector chỉ có một rule chịu trách nhiệm chính; không tạo các selector gần giống nhau chỉ để ghi đè liên tiếp.
- Với bố cục flex, dùng tỷ lệ `flex` thay vì hardcode chiều rộng cho các phần tử con. Ví dụ: phần `card-tong` dùng `flex: 2`, phần `stats-side` dùng `flex: 1`.
- Không dùng `align-self: flex-end` hoặc `margin-bottom` trong flex layout nếu không có lý do bố cục rõ ràng.

---

## 7. Design System

### Layout

- Stage chuẩn: `1920 × 929px`.
- Card trên dashboard sử dụng `position: absolute` thông qua `.abs`.
- Không thêm `position: relative` vào `.metric-block` vì sẽ phá layout.
- Tabbar cao `49px`, cố định ở bottom.
- Header dashboard cao `85px`, cố định ở top.

### Typography

- Font chung: `'Roboto', Helvetica, Arial, sans-serif` qua token `--font-family`.
- Chỉ sử dụng các token cỡ chữ:
  - `--fs-xs`: `12px`
  - `--fs-sm`: `14px`
  - `--fs-md`: `16px`
  - `--fs-lg`: `18px`
  - `--fs-xl`: `20px`
  - `--fs-2xl`: `24px`
  - `--fs-3xl`: `28px`
  - `--fs-4xl`: `32px`

### Màu sắc

- Dùng token `--pink` cho border card, nút chính và gradient header.
- Dùng `--magenta` cho tiêu đề nhấn và số liệu quan trọng.
- Dùng `--blue` cho số liệu nam và biểu đồ xanh.
- Dùng `--salmon` cho số liệu nữ và biểu đồ hồng.
- Dùng `--text-dark`, `--text-muted` cho văn bản.
- Dùng nhóm token `--status-pending-*`, `--status-processing-*`, `--status-completed-*` cho trạng thái.

### Thứ tự tải JavaScript dashboard

1. `state.js`
2. `ui.js`
3. `charts.js`
4. `map.js`

---

## 8. Quy tắc nghiệp vụ chỉ đạo

- Chỉ đạo gắn vào `.metric-block` — khối chỉ số, không gắn vào hàng dữ liệu hoặc điểm chart.
- Tạo chỉ đạo trong Event Panel (Drawer): chọn metric, nhập nội dung, đặt thời hạn và lưu.
- Quản trị chỉ đạo được mở bằng nút trong Drawer và hiển thị trong Admin Panel overlay.
- Trạng thái chỉ đạo gồm: `Chưa xử lý`, `Đang xử lý`, `Đã hoàn thành`.
- Badge trạng thái dùng `fa-flag` cho cam/xanh hoặc `fa-flag-checkered` cho xanh lá.
- Khóa localStorage: `gialai_directives`.
- Field định danh: `metricId`.
- Chuyên viên cập nhật trạng thái và báo cáo tiến độ/kết quả.
- Lãnh đạo phải xem được trạng thái và kết quả báo cáo trực tiếp trên dashboard.

---

## 9. Phạm vi và bối cảnh dự án

- Dự án hiện là prototype UI, chưa kết nối backend.
- Nguồn dữ liệu nghiệp vụ: Cục Cảnh sát quản lý hành chính về trật tự xã hội — C06.
- Vai trò chính: Lãnh đạo và Chuyên viên.
- Dashboard hỗ trợ theo dõi dữ liệu dân cư, phát hiện bất thường, tạo chỉ đạo, theo dõi xử lý và xem kết quả phản hồi.

---

## 10. Nguồn quy tắc

`RULES.md` được tổng hợp từ:

- `CONTEXT.md`
- `system_design.md`
- `.agents/skills/gia-lai-dashboard/SKILL.md`
- Các quy tắc bổ sung được người dùng xác nhận trong quá trình làm việc

Khi có khác biệt, không được tự ý lựa chọn. Phải báo người dùng và chờ quyết định.
