# ĐẶC TẢ CHỨC NĂNG — Màn hình Dashboard Tình hình dân cư theo giới tính

## Phạm vi

Tài liệu đặc tả chức năng chỉ đạo điều hành trên màn hình Dashboard: Lãnh đạo Tỉnh ban hành chỉ đạo gắn với từng chỉ số, theo dõi tiến độ xử lý của các đơn vị và phê duyệt kết quả cuối cùng.

## Danh mục tệp

| Tệp | Nội dung |
|---|---|
| `index.html` | Cấu trúc HTML, khai báo tham chiếu CSS và JavaScript |
| `style.css` | Định dạng bảng chỉ đạo, hộp thoại, chỉ báo trạng thái |
| `js/state.js` | Danh mục chỉ số, dữ liệu chỉ đạo, lưu trữ cục bộ |
| `js/ui.js` | Xử lý giao diện bảng chỉ đạo, biểu mẫu, chỉ báo trên thẻ chỉ số |
| `js/charts.js` | Kết xuất hai biểu đồ cột ngang |
| `js/map.js` | Kết xuất bản đồ phân bố dân cư dạng SVG |

## Thứ tự nạp JavaScript

Bắt buộc theo đúng thứ tự sau; `ui.js` sử dụng dữ liệu do `state.js` khai báo:

```html
<script src="./js/state.js"></script>
<script src="./js/ui.js"></script>
<script src="./js/charts.js"></script>
<script src="./js/map.js"></script>
```

---

# PHẦN I — LOGIC NGHIỆP VỤ

## 1. Vai trò người dùng

| Vai trò | Màn hình làm việc | Quyền hạn |
|---|---|---|
| Lãnh đạo Tỉnh | Dashboard | Ban hành chỉ đạo; phê duyệt hoặc từ chối kết quả |
| Lãnh đạo Sở | Quản trị — Xử lý chỉ đạo | Xem xét báo cáo của chuyên viên; trình Tỉnh hoặc trả về |
| Chuyên viên | Quản trị — Xử lý chỉ đạo | Tiếp nhận, thực hiện và nộp báo cáo |

## 2. Cấu trúc dữ liệu hai cấp

Mỗi chỉ đạo được ban hành tới một hoặc nhiều đơn vị. Mỗi đơn vị có trạng thái xử lý độc lập.

| Cấp | Vị trí hiển thị |
|---|---|
| Trạng thái chỉ đạo | Thẻ chỉ đạo tại danh sách |
| Trạng thái đơn vị | Thẻ *Chi tiết đơn vị* trong hộp thoại chi tiết |

Chỉ đạo chuyển sang `Kết thúc` khi và chỉ khi toàn bộ đơn vị đã đạt `Kết thúc`.

## 3. Vòng đời trạng thái

```
Chờ phân công → Đang xử lý → Đã có báo cáo → Chờ phê duyệt → Kết thúc
                                   │                    │
                            Trả về │                    │ Từ chối
                                   ↓                    ↓
                             Chuyên viên            Bị từ chối
```

| Trạng thái | Chủ thể chịu trách nhiệm xử lý |
|---|---|
| Chờ phân công | Lãnh đạo Sở |
| Đang xử lý | Chuyên viên |
| Đã có báo cáo | Lãnh đạo Sở |
| Chờ phê duyệt | Lãnh đạo Tỉnh |
| Bị từ chối | Chuyên viên |
| Kết thúc | Không |

## 4. Quyền phê duyệt và từ chối

Lãnh đạo Tỉnh chỉ được phê duyệt hoặc từ chối đối tượng đang ở trạng thái `Chờ phê duyệt`.

### 4.1. Tại danh sách chỉ đạo

Hệ thống ẩn hai chức năng Phê duyệt và Từ chối, trừ trường hợp chỉ đạo chỉ có một đơn vị và đang ở trạng thái `Chờ phê duyệt`.

| Điều kiện | Hiển thị chức năng |
|---|---|
| Chỉ đạo một đơn vị, trạng thái `Chờ phê duyệt` | Có |
| Chỉ đạo nhiều đơn vị hoặc chỉ đạo toàn tỉnh, mọi trạng thái | Không |
| Các trạng thái còn lại | Không |

Đối với chỉ đạo nhiều đơn vị, việc phê duyệt và từ chối thực hiện riêng cho từng đơn vị tại thẻ *Chi tiết đơn vị*.

### 4.2. Tại thẻ Chi tiết đơn vị

Hệ thống luôn hiển thị hai chức năng cho mọi dòng và vô hiệu hoá theo trạng thái:

| Trạng thái đơn vị | Phê duyệt | Từ chối |
|---|---|---|
| Chờ phê duyệt | Khả dụng | Khả dụng |
| Chờ phân công | Vô hiệu | Vô hiệu |
| Đang xử lý | Vô hiệu | Vô hiệu |
| Đã có báo cáo | Vô hiệu | Vô hiệu |
| Bị từ chối | Vô hiệu | Vô hiệu |
| Kết thúc | Vô hiệu | Vô hiệu |

### 4.3. Phê duyệt theo lô

Chức năng *Phê duyệt các đơn vị đã chọn* khả dụng khi nhóm đơn vị đang chọn có tối thiểu một đơn vị ở trạng thái `Chờ phê duyệt`. Khi thực hiện, hệ thống chỉ chuyển các đơn vị `Chờ phê duyệt` sang `Kết thúc`; các đơn vị ở trạng thái khác giữ nguyên.

### 4.4. Kết quả thao tác

| Thao tác | Kết quả |
|---|---|
| Phê duyệt một đơn vị | Đơn vị chuyển sang `Kết thúc`. Khi toàn bộ đơn vị đạt `Kết thúc`, chỉ đạo chuyển sang `Kết thúc` |
| Từ chối một đơn vị | Đơn vị chuyển sang `Bị từ chối`. Hệ thống yêu cầu nhập lý do từ chối và cho phép đính kèm tài liệu. Lý do được lưu và hiển thị trên thẻ chỉ đạo |

## 5. Điều kiện chỉnh sửa và xoá

| Thao tác | Điều kiện |
|---|---|
| Chỉnh sửa | Chỉ đạo ở trạng thái `Chờ phân công` |
| Xoá | Chỉ đạo ở trạng thái `Chờ phân công` |

**Ràng buộc đơn vị xử lý.** Ở chế độ chỉnh sửa, các đơn vị đã tiếp nhận chỉ đạo chỉ được bổ sung thêm, không được gỡ bỏ. Hệ thống hiển thị biểu tượng khoá thay cho nút xoá tại các đơn vị này; trường hợp người dùng vẫn thực hiện thao tác gỡ, hệ thống hiển thị thông báo lỗi và không cho phép lưu.

**Hạn xử lý.** Khi tạo mới, hệ thống không cho phép chọn ngày trong quá khứ và mặc định đề xuất thời hạn 7 ngày kể từ ngày ban hành. Khi chỉnh sửa chỉ đạo đã có, hệ thống cho phép giữ nguyên thời hạn cũ.

## 6. Danh sách chỉ đạo

| Thẻ | Trạng thái thuộc thẻ |
|---|---|
| Đang thực hiện | Chờ phân công, Đang xử lý, Đã có báo cáo, Chờ phê duyệt, Bị từ chối |
| Đã xử lý | Kết thúc |

**Điều kiện lọc:** đơn vị xử lý (nhiều lựa chọn) · trạng thái (nhiều lựa chọn) · tình trạng hạn Trong hạn hoặc Quá hạn (nhiều lựa chọn) · khoảng thời gian tạo · từ khoá theo nội dung, nhóm dữ liệu và cơ quan.

**Chỉ tiêu thống kê trên thẻ chỉ đạo:**

| Chỉ tiêu | Cách tính |
|---|---|
| Tổng chỉ đạo | Tổng số đơn vị được giao chỉ đạo |
| Đơn vị đã báo cáo | Số đơn vị ở trạng thái `Đã có báo cáo`, `Chờ phê duyệt` hoặc `Kết thúc` |

**Cảnh báo thời hạn.** Hệ thống đối chiếu hạn xử lý với ngày hiện tại đối với các chỉ đạo chưa `Kết thúc` và hiển thị chỉ báo quá hạn hoặc sắp đến hạn.

## 7. Chỉ đạo toàn tỉnh

Là trường hợp chỉ đạo được ban hành tới toàn bộ 105 cơ quan, đơn vị trên địa bàn tỉnh.

- Hệ thống hiển thị nhãn *Chỉ đạo toàn tỉnh* thay cho danh sách liệt kê từng đơn vị.
- Áp dụng đầy đủ ràng buộc tại mục 4.1: không phê duyệt hoặc từ chối được từ danh sách chỉ đạo.
- Khi người dùng chọn *Chỉ đạo toàn tỉnh*, hệ thống khởi tạo đủ 105 đơn vị. Khi người dùng bỏ chọn bất kỳ đơn vị thành phần nào, hệ thống tự động huỷ trạng thái toàn tỉnh.

---

# PHẦN II — ĐẶC TẢ GIAO DIỆN

## A. Bảng chỉ đạo điều hành

Mở từ nút chức năng trên thanh công cụ nổi. Nút mang chỉ báo số lượng chỉ đạo cần xử lý.

**Bố cục theo chiều dọc:** thông báo số chỉ đạo cần xử lý · hai thẻ danh sách kèm nút Thêm mới · ô tìm kiếm kèm nút Tìm kiếm và Làm mới · ba ô lọc · hai ô chọn khoảng thời gian · danh sách thẻ chỉ đạo · thanh phân trang.

**Quy cách các ô nhập và nút trong khu vực lọc:** chiều cao thống nhất `32px`, cỡ chữ `--fs-xs`. Biểu tượng bên trong ô nhập dùng cỡ nhỏ hơn một bậc là `--fs-2xs`.

**Khoảng cách:** `6px` giữa các hàng trong khu vực lọc, `10px` giữa các khối chức năng.

**Ba ô lọc — Đơn vị, Trạng thái, Tình trạng hạn:**

- Chiều cao cố định một hàng, không giãn theo số lượng lựa chọn.
- Khi chọn nhiều mục, hệ thống hiển thị thẻ của mục đầu tiên kèm chỉ báo số lượng còn lại dạng `+N`. Tên vượt quá bề ngang được rút gọn bằng dấu ba chấm.
- Danh sách lựa chọn có bề ngang tối thiểu `240px`, chiều cao tối đa `280px`, mỗi mục nằm trọn một dòng. Danh sách của ô lọc cuối hàng canh theo mép phải để không vượt khỏi khung.

**Ô chọn thời gian:** sử dụng bộ chọn lịch Flatpickr, bề ngang `354px`, ô ngày `46×38px`.

**Nội dung thẻ chỉ đạo:** tiêu đề · chỉ báo trạng thái · chỉ báo cảnh báo hạn · danh sách đơn vị hoặc nhãn *Chỉ đạo toàn tỉnh* · tài liệu Lãnh đạo đính kèm · nội dung báo cáo hoặc lý do từ chối · chỉ tiêu thống kê · hạn xử lý và ngày tạo · nút mở danh mục chức năng.

**Danh mục chức năng trên thẻ chỉ đạo:**

| Chức năng | Điều kiện hiển thị |
|---|---|
| Xem | Luôn hiển thị |
| Sửa | Chỉ đạo ở `Chờ phân công` |
| Xoá | Chỉ đạo ở `Chờ phân công` |
| Phê duyệt, Từ chối | Chỉ đạo một đơn vị và ở `Chờ phê duyệt` |

Khu vực danh sách chỉ cuộn theo chiều dọc.

## B. Hộp thoại Thêm mới và Chỉnh sửa chỉ đạo

**Các trường nhập theo thứ tự:** nhóm dữ liệu · trang dữ liệu · chỉ số · đơn vị xử lý · nội dung chỉ đạo · hạn xử lý · người chỉ đạo · tài liệu đính kèm.

**Trường Đơn vị xử lý:** cho phép chọn nhiều đơn vị, kèm lựa chọn *Chỉ đạo toàn tỉnh* để chọn đủ 105 đơn vị. Hiển thị thẻ của mục đầu tiên kèm chỉ báo `+N`, chiều cao tối đa hai dòng.

**Ở chế độ Chỉnh sửa:** các đơn vị đã tiếp nhận chỉ đạo hiển thị biểu tượng khoá thay cho nút xoá và bị vô hiệu hoá thao tác bỏ chọn. Hệ thống không sử dụng dòng cảnh báo cố định hay chú giải khi trỏ chuột; chỉ hiển thị thông báo lỗi khi người dùng thực hiện thao tác gỡ.

**Trường Hạn xử lý:** sử dụng bộ chọn lịch Flatpickr, mặc định đề xuất 7 ngày kể từ ngày ban hành. Ở chế độ tạo mới không cho phép chọn ngày trong quá khứ.

## C. Hộp thoại Chi tiết chỉ đạo

Gồm hai thẻ: **Thông tin chỉ đạo** và **Chi tiết đơn vị**.

Thẻ *Chi tiết đơn vị* trình bày dạng bảng với các cột: ô chọn · Đơn vị thực hiện · Người phụ trách · Thời hạn · Trạng thái · Kết quả · Thao tác.

- Dòng tiêu đề bảng cố định tại đỉnh vùng cuộn.
- Thanh phân trang cố định tại đáy vùng cuộn, cho phép chọn 5, 10, 25, 50 hoặc 100 dòng trên một trang.
- Cột Kết quả trình bày nội dung báo cáo và tài liệu đính kèm của đơn vị.
- Cột Thao tác luôn hiển thị hai chức năng Phê duyệt và Từ chối, khả dụng theo quy định tại mục 4.2.
- Khi người dùng chọn nhiều đơn vị, chức năng *Phê duyệt các đơn vị đã chọn* xuất hiện tại góc phải thanh thẻ.

## D. Hộp thoại Từ chối phê duyệt báo cáo

Gồm trường bắt buộc **Lý do từ chối** dạng nhập nhiều dòng và trường đính kèm tài liệu, hình ảnh. Hệ thống không cho phép gửi khi trường Lý do từ chối còn trống.

## E. Thao tác với tài liệu đính kèm

| Định dạng | Hành vi khi chọn |
|---|---|
| PDF | Mở thẻ trình duyệt mới để xem trước |
| Word, Excel | Tải xuống |
| Hình ảnh | Mở hộp thoại phóng to |

## F. Dữ liệu mô phỏng

Bộ dữ liệu gồm 16 chỉ đạo mẫu, bao phủ đủ 12 tổ hợp của 6 trạng thái và 2 hình thức ban hành (một đơn vị và nhiều đơn vị), trong đó có một chỉ đạo toàn tỉnh với toàn bộ 105 đơn vị cùng ở trạng thái `Chờ phê duyệt`.

Dữ liệu được lưu tại bộ nhớ cục bộ của trình duyệt. Mỗi lần thay đổi cấu trúc dữ liệu mô phỏng, bắt buộc tăng số hiệu phiên bản dữ liệu để hệ thống khởi tạo lại; nếu không, dữ liệu đã lưu từ phiên trước sẽ tiếp tục được sử dụng và thay đổi mới không có hiệu lực.

## G. Bộ chọn Mô phỏng chức vụ

Khối chức năng tại góc dưới bên trái màn hình, nhãn *Mô phỏng chức vụ*. Cho phép chuyển đổi vai trò người dùng hiện hành phục vụ kiểm thử phân quyền. Đây là công cụ của bản mẫu, không thuộc phạm vi hệ thống chính thức.

## H. Quy ước trình bày

- Cỡ chữ sử dụng token `--fs-2xs` đến `--fs-4xl`, không khai báo giá trị pixel trực tiếp.
- Màu sắc sử dụng token. Màu trạng thái dùng nhóm `--status-pending-*`, `--status-processing-*`, `--status-completed-*`.
- Khoảng cách sử dụng ba giá trị `6px`, `10px`, `14px`.
- Các ô nhập và nút cùng một hàng phải có chiều cao bằng nhau.
