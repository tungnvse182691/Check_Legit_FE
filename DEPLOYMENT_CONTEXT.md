# 🚀 CHECK ZONE - DEPLOYMENT CONTEXT & ARCHITECTURE DOCUMENTATION

Dài văn bản tài liệu hướng dẫn và thông số cấu hình triển khai (Deployment Guide) dành cho Hệ thống **Check Zone** (Frontend React 19 / Vite & Backend C# .NET 8 Web API).

---

## 1. 🔑 Environment Variables (Biến môi trường)

### 1.1 Frontend (React / Vite)
Tất cả các biến môi trường cho Frontend được khai báo trong file `.env` (thư mục gốc Frontend) và được Vite nạp thông qua tiền tố `VITE_`.

| Tên biến (Key) | Bắt buộc | Mô tả chức năng & Giá trị mặc định |
| :--- | :---: | :--- |
| `VITE_API_BASE_URL` | **Có** | URL gốc gọi API Backend. Mặc định nếu không truyền sẽ dùng `https://becheckzone-production.up.railway.app/api` (Production) hoặc `http://localhost:5247/api` (Local). |
| `VITE_IMGBB_API_KEY` | **Có** | API Key từ ImgBB để hỗ trợ Upload ảnh trực tiếp từ trình duyệt (dùng cho Tố cáo và Thumbnail bài viết Blog). |
| `VITE_TURNSTILE_SITEKEY` | **Có** | Site Key từ Cloudflare Turnstile để hiển thị Widget chống Spam Bot tại Form Tố Cáo. |

---

### 1.2 Backend (C# ASP.NET Core .NET 8)
Backend đọc cấu hình từ file `appsettings.json` / `appsettings.Development.json` hoặc các biến môi trường của hệ thống (OS Environment Variables).

| Cấu hình Node / OS Variable | Bắt buộc | Mô tả chức năng & Giá trị |
| :--- | :---: | :--- |
| `ConnectionStrings:DefaultConnection` | **Có** | Chuỗi kết nối MySQL Database khi chạy Local. Ví dụ: `Server=localhost;Port=3306;Database=CheckZoneDb;Uid=root;Pwd=12345;` |
| `MYSQLHOST` / `MYSQL_URL` | Tuỳ chọn | Tên miền/IP của MySQL Server trên môi trường Cloud (Railway/1Panel). Khi biến này tồn tại, Backend sẽ ưu tiên ghi đè chuỗi kết nối local. |
| `MYSQLPORT` | Tuỳ chọn | Port kết nối MySQL (Mặc định: `3306`). |
| `MYSQLDATABASE` | Tuỳ chọn | Tên Cơ sở dữ liệu (Database Name). |
| `MYSQLUSER` | Tuỳ chọn | Username đăng nhập MySQL. |
| `MYSQLPASSWORD` | Tuỳ chọn | Mật khẩu đăng nhập MySQL. |
| `Jwt:Key` | **Có** | Khóa bí mật dùng để ký và xác thực JWT Token đăng nhập Admin. Mặc định: `CheckZone_Super_Secret_Key_For_JWT_Auth_2026_!@#` |
| `Jwt:Issuer` | **Có** | Tên bên phát hành token (`CheckZoneApi`). |
| `Jwt:Audience` | **Có** | Tên bên nhận token (`CheckZoneFrontend`). |
| `Turnstile:SecretKey` | **Có** | Secret Key của Cloudflare Turnstile để Backend xác minh CAPTCHA token hợp lệ. |
| `Discord:WebhookUrl` | **Có** | URL Webhook của kênh Discord Admin để nhận thông báo tự động khi có Đơn Tố Cáo mới hoặc Thư Liên Hệ mới. |
| `PORT` | Tuỳ chọn | Cổng mạng Backend lắng nghe (Mặc định: `8080`). |

---

## 2. 🌐 CORS & Network Configuration (Backend)

### 2.1 Cấu hình CORS (Cross-Origin Resource Sharing)
Trong [Program.cs](file:///d:/check-legit/check_legit_BE/CheckZone.Api/Program.cs), policy CORS `AllowFrontend` được thiết lập với chế độ linh hoạt nhất (`SetIsOriginAllowed(_ => true)`):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

- **AllowOrigins**: Cho phép tất cả tên miền Client (Bao gồm Domain chính thức trên 1Panel, Vercel, localhost,...).
- **AllowMethods**: Cho phép đầy đủ `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.
- **AllowHeaders**: Cho phép mọi Header truyền lên (Bao gồm `Authorization`, `Content-Type`, `X-Requested-With`).
- **AllowCredentials**: Cho phép truyền Cookie / Authentication Headers.

### 2.2 Cổng lắng nghe (Listen Port) & Middleware Can thiệp
- **Cổng lắng nghe (Listen Port)**:
  Backend khởi chạy và lắng nghe trên `http://0.0.0.0:{PORT}` (Mặc định là port `8080` nếu không đặt biến `PORT`).
- **Middleware HTTPS Redirection**:
  **Đã tắt `app.UseHttpsRedirection()`**. Lý do: Nginx / 1Panel Reverse Proxy đã chịu trách nhiệm SSL Offloading. Việc bật HTTPS Redirection ở Backend có thể gây lỗi vòng lặp `Too Many Redirects`.
- **Tự động Auto-Migration**:
  Khi ứng dụng Backend khởi chạy, dịch vụ sẽ tự động chạy `context.Database.Migrate()` để cập nhật bảng MySQL và `DbInitializer.Initialize(context)` để seed dữ liệu mẫu ban đầu mà không cần thao tác CLI thủ công.

---

## 3. 🏗️ Build & Publish Pipeline

### 3.1 Frontend Production Build
Chạy các lệnh sau tại thư mục gốc của Frontend:

```bash
# 1. Cài đặt dependencies
npm install

# 2. Kiểm tra type check
npx tsc --noEmit

# 3. Build gói sản phẩm Production
npm run build
```
- **Thư mục đầu ra (Output Directory)**: `dist/`
- Thư mục `dist/` này chứa toàn bộ static files (`index.html`, `assets/*.js`, `assets/*.css`) sẵn sàng trỏ Nginx root đến.

### 3.2 Backend C# Publish (.NET 8)
Chạy lệnh sau tại thư mục `check_legit_BE/CheckZone.Api`:

```bash
# Publish phiên bản Release độc lập cho Linux x64
dotnet publish CheckZone.Api.csproj -c Release -r linux-x64 --self-contained false -o ./publish
```
- **Thư mục đầu ra (Output Directory)**: `check_legit_BE/CheckZone.Api/publish/`
- File thực thi chính: `CheckZone.Api.dll` (Chạy bằng lệnh `dotnet CheckZone.Api.dll`).

---

## 4. 🧭 Web Server Rules (Nginx / 1Panel Config cho React Router)

Vì Frontend là ứng dụng Single Page Application (SPA) dùng `react-router-dom`, bạn **BẮT BUỘC** phải cấu hình Nginx fallback `try_files` về `index.html` để tránh lỗi `404 Not Found` khi người dùng F5 hoặc truy cập trực tiếp các đường dẫn như `/reports`, `/legit`, `/about`, `/news/slug`:

```nginx
server {
    listen 80;
    server_name checkzone.vn www.checkzone.vn; # Thay bằng Domain thực tế của bạn

    root /www/wwwroot/checkzone-frontend/dist; # Đường dẫn tới thư mục build dist
    index index.html;

    # Cấu hình Single Page Application (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests về Backend .NET 8 trên 1Panel
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'keep-alive';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 5. 📑 CHI TIẾT MÃ NGUỒN & CÁC LUỒNG CHỨC NĂNG DỰ ÁN

### 5.1 Kiến trúc tổng quan hệ thống (System Architecture)
Hệ thống **Check Zone** được thiết kế theo mô hình Client-Server hiện đại:
- **Frontend (Client)**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7. Dùng `AppContext` quản lý trạng thái toàn cục (State Management).
- **Backend (API)**: C# ASP.NET Core 8 Web API, Entity Framework Core 8 (EF Core), Pomelo MySQL Provider.
- **Cơ sở dữ liệu (Database)**: MySQL 8.0.
- **Tích hợp bên thứ ba (Third-party Services)**:
  - **Discord Webhook**: Gửi thông báo khẩn cấp khi có Tố Cáo mới hoặc Thư Liên Hệ mới.
  - **ImgBB API**: Lưu trữ và quản lý hình ảnh bằng chứng / ảnh đại diện bài viết.
  - **Cloudflare Turnstile**: Chống Spam Bot nộp báo cáo rác.

---

### 5.2 Mô tả Chi tiết Các Phân Hệ & Luồng Dữ Liệu (Data Flows)

#### A. Phân hệ Tố Cáo Lừa Đảo (Scam Reports Module)
- **Entities & DTOs**:
  - `ScamReport`: Chứa thông tin Kẻ lừa đảo (`Name`, `Phone`, `BankName`, `AccountNumber`, `Amount`, `Victim`, `Facebook`, `Desc`, `Category`, `Images` dạng JSON list, `Status` ["Đang chờ duyệt", "Đã duyệt", "Từ chối"]).
- **API Endpoints**:
  - `GET /api/public/scams`: Lấy danh sách các đơn tố cáo đã được phê duyệt.
  - `GET /api/public/scams/{id}`: Lấy thông tin chi tiết 1 đơn tố cáo.
  - `POST /api/public/scams`: Nộp đơn tố cáo mới (gửi kèm Cloudflare Turnstile token).
  - `GET /api/admin/scams`: Lấy toàn bộ đơn tố cáo (Dành cho Admin).
  - `PUT /api/admin/scams/{id}/status`: Admin duyệt / từ chối đơn tố cáo.
  - `DELETE /api/admin/scams/{id}`: Admin xóa đơn tố cáo.
- **Luồng xử lý (Workflow)**:
  1. Người dùng vào trang `/report`, điền bằng chứng & ảnh hóa đơn (tải lên ImgBB).
  2. Frontend gửi request lên `POST /api/public/scams`.
  3. Controller gọi `DiscordNotificationService` bắn Embed thông báo đỏ `🚨 PHÁT HIỆN TỐ CÁO LỪA ĐẢO MỚI` tới kênh Discord Admin.
  4. Đơn ở trạng thái `"Đang chờ duyệt"`. Admin vào `/admin/scams` bấm Duyệt -> Trạng thái đổi thành `"Đã duyệt"` và hiển thị ra công khai ở Trang chủ & Trang Danh sách lừa đảo.

---

#### B. Phân hệ Hồ Sơ Uy Tín / Legit (Legit Profiles Module)
- **Entities & DTOs**:
  - `LegitProfile`: Chứa thông tin người bán uy tín (`Name`, `Phone`, `BankName`, `AccountNumber`, `Services`, `ReputationScore`, `GuaranteeAmount`, `AvatarUrl`, `SocialLinks`, `IsVerified`).
- **API Endpoints**:
  - `GET /api/public/legit`: Lấy danh sách hồ sơ uy tín đã xác thực.
  - `GET /api/public/legit/{id}`: Xem thông tin chi tiết và số tiền ký quỹ bảo hiểm.
  - `POST /api/admin/legit`, `PUT /api/admin/legit/{id}`, `DELETE /api/admin/legit/{id}`: Admin thêm/sửa/xóa hồ sơ uy tín.
- **Luồng xử lý (Workflow)**:
  - Cho phép người dùng tra cứu nhanh Số điện thoại / Số tài khoản ngân hàng để kiểm tra người bán có nằm trong danh sách Ký Quỹ Uy Tín hay không.

---

#### C. Phân hệ Tin Tức & Blog SEO (Blog Articles Module)
- **Entities & DTOs**:
  - `BlogArticle`: Bài viết tin tức (`Title`, `Category`, `Slug`, `Status` ["Đã đăng", "Nháp"], `Content`, `Thumbnail`, `CreatedAt`).
- **API Endpoints**:
  - `GET /api/public/blogs`: Lấy danh sách bài viết đã xuất bản.
  - `GET /api/public/blogs/{slug}`: Lấy chi tiết bài viết theo Slug hoặc ID cho trang `BlogDetail.tsx`.
  - `POST /api/admin/blogs`, `PUT /api/admin/blogs/{id}`, `DELETE /api/admin/blogs/{id}`: Admin biên tập bài viết SEO.
- **Luồng xử lý (Workflow)**:
  1. Admin soạn tin tức tại trang `/admin/settings` (Tab Bài viết & Tin tức SEO), chọn ảnh đại diện (Tải lên ImgBB hoặc dán URL).
  2. Bài viết được lưu xuống Database MySQL.
  3. Ngoài trang chủ hiển thị 6 bài mới nhất, người dùng bấm vào bài viết sẽ chuyển hướng tới `/news/:slug` và tải toàn bộ nội dung chi tiết.

---

#### D. Phân hệ Liên Hệ Ban Vận Hành (Contact & Support Module)
- **API Endpoints**:
  - `POST /api/public/contact`: Tiếp nhận thư khiếu nại / hợp tác từ trang `/about`.
- **Luồng xử lý (Workflow)**:
  1. Người dùng điền Form Liên hệ tại trang `/about` (`Name`, `Email`, `Message`).
  2. Request gửi lên `POST /api/public/contact`.
  3. `DiscordNotificationService` tạo Embed xanh lá (`📩 YÊU CẦU LIÊN HỆ BAN VẬN HÀNH MỚI`) và gửi thông báo trực tiếp về kênh Discord của Admin.

---

#### E. Phân hệ Xác Thực Admin (Authentication & Security)
- **API Endpoints**:
  - `POST /api/auth/login`: Đăng nhập Admin.
- **Luồng xử lý (Workflow)**:
  1. Admin nhập Username/Password tại `/login`.
  2. Backend kiểm tra tài khoản, mã hóa và trả về JWT Bearer Token.
  3. Frontend lưu Token vào `localStorage` và gửi kèm Header `Authorization: Bearer <token>` trong các yêu cầu gọi API Admin.
