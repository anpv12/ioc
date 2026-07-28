# Ghi chú deploy nginx — Step 2

## Hướng đi khuyến nghị
Prototype HTML tĩnh → nginx phục vụ file trực tiếp, không cần Node/PHP runtime trên server.

## Bước triển khai
1. Copy (hoặc git clone) toàn bộ repo lên server.
2. Sửa `root` trong `gialai.conf` thành đường dẫn tuyệt đối tới thư mục dự án.
3. Bật site: symlink/copy vào `sites-enabled` hoặc `conf.d`.
4. `nginx -t` rồi reload nginx.
5. Trên máy dev: mỗi khi thêm folder trong `pages/`, chạy `node tools/generate-routes.js` rồi deploy lại (ít nhất file `shared/js/routes.js`).

## Điểm cần lưu ý
- Folder Unicode (`Quản trị`): filesystem UTF-8 + `charset utf-8;` trong nginx.
- Chưa có backend API → không cần `proxy_pass`.
- Approach navigation thật (B): không dùng SPA fallback `try_files ... /index.html`.
- HTTPS: thêm `listen 443 ssl` + certificate khi lên production.
