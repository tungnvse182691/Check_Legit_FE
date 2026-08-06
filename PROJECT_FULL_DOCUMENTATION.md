# BỘ TÀI LIỆU TOÀN DIỆN DỰ ÁN CHECK ZONE (FRONTEND & BACKEND)

Tài liệu này tổng hợp đầy đủ 100% thông tin kiến trúc, mã nguồn, DTOs, Schemas, Validation rules và danh sách APIs của dự án Check Zone để bạn gửi trực tiếp cho Gemini / AI / Developer.

---

# 🅰️ PHẦN 1: TÀI LIỆU CHI TIẾT FRONTEND (FE)

## 1. THƯ VIỆN & CẤU HÌNH CÔNG NGHỆ (TECH STACK)
- **Framework Core:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`), TypeScript v5.8
- **Build Tool:** Vite v6 (`vite: ^6.2.3`)
- **Routing:** React Router v7 (`react-router-dom: ^7.15.1`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite: ^4.1.14`), Vanilla CSS utilities
- **Icons:** Lucide React (`lucide-react: ^0.546.0`), Material Symbols Outlined
- **State Management:** Custom React Context API (`src/context/AppContext.tsx`)
- **API Client:** Browser `fetch` API với Custom DTO Mappers & JWT Bearer Header Authentication

## 2. NỘI DUNG FILE `package.json`

```json
{
  "name": "checkzone-fe",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-router-dom": "^7.15.1",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}
```

## 3. CẤU TRÚC INTERFACE FRONTEND (`src/context/AppContext.tsx`)

```typescript
export interface LegitProfile {
  id: number;
  name: string;             // Tên thương hiệu / Người bán *
  role: string;             // Lĩnh vực hoạt động *
  score: number;            // Điểm uy tín (1-100)
  img: string;              // URL Logo / Ảnh đại diện *
  desc: string;             // Hồ sơ năng lực / Giới thiệu *
  phone: string;            // Hotline / Zalo *
  telegram: string;         // Telegram handle (@verified_merchant)
  insurance: number;        // Tiền ký quỹ bảo lãnh (VNĐ) *
  successTrans: number;     // Số giao dịch thành công
  joinDate: string;         // Thời gian gia nhập (MM/YYYY)
  businessType: string;     // Loại hình kinh doanh
  facebook?: string;        // Fanpage / Profile Facebook
  address?: string;         // Địa chỉ cửa hàng / trụ sở
  website?: string;         // Website thương hiệu
  accountNumber?: string;   // Số tài khoản ngân hàng đã xác thực
  bankName?: string;        // Tên ngân hàng đã xác thực
  slug?: string;            // Đường dẫn URL tùy chỉnh (VD: topzone_shop)
}

export interface ScamReport {
  id: string;
  name: string;             // Tên đối tượng lừa đảo *
  accountHolderName?: string;// Tên chủ tài khoản ngân hàng
  phone?: string;           // Số điện thoại
  bankName: string;         // Tên ngân hàng
  accountNumber: string;    // Số tài khoản ngân hàng
  desc: string;             // Mô tả hành vi scam *
  type: string;             // Loại hình lừa đảo
  amount: number;           // Số tiền thiệt hại
  status: string;           // Đang chờ duyệt / Đã phê duyệt
  victim: string;           // Nạn nhân (Mặc định: Ẩn danh)
  tags: string[];
  facebook?: string;
  images: string[];         // Bằng chứng hình ảnh
  createdAt: string;
  category: number;
}

export interface BlogArticle {
  id: string;
  title: string;            // Tiêu đề bài viết *
  category: string;         // Thể loại bài viết
  createdAt: string;
  slug: string;             // URL Thân thiện SEO
  status: "Đã đăng" | "Bản nháp";
  content: string;          // Nội dung bài viết
  thumbnail: string;        // Ảnh đại diện
  metaDescription?: string; // Thẻ mô tả SEO 150-160 ký tự
  metaKeywords?: string;    // Từ khóa SEO
  author?: string;          // Tác giả bài viết
}
```

## 4. HÀM SUBMIT API & UPLOAD ẢNH (HTTP HANDLERS)

```typescript
// Cấp mới Hồ sơ Legit
const addLegitProfile = async (profile: Omit<LegitProfile, "id" | "score" | "successTrans" | "joinDate">) => {
  const currentDate = new Date();
  const joinDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  
  const payload = {
    name: profile.name,
    role: profile.role,
    score: 100,
    img: profile.img,
    desc: profile.desc,
    phone: profile.phone,
    telegram: profile.telegram,
    insurance: profile.insurance,
    successTrans: 0,
    joinDate: joinDate,
    businessType: profile.businessType || profile.role,
    facebook: profile.facebook || "",
    address: profile.address || "",
    website: profile.website || "",
    accountNumber: profile.accountNumber || "",
    bankName: profile.bankName || "",
    slug: profile.slug || ""
  };

  const res = await fetch(`${API_BASE_URL}/admin/legits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return res.ok;
};

// Cập nhật Hồ sơ Legit
const updateLegitProfile = async (id: number, updatedProfile: Partial<LegitProfile>) => {
  const res = await fetch(`${API_BASE_URL}/admin/legits/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updatedProfile)
  });
  return res.ok;
};

// Upload ảnh trực tiếp lên ImgBB
const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  const apiKey = "49299870d79f975d7cbf058f2d0d7d39";
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  if (data.success && data.data?.url) {
    setImgUrl(data.data.url);
  }
};
```

---

# 🅱️ PHẦN 2: TÀI LIỆU CHI TIẾT BACKEND (BE - .NET 8 API)

## 1. TỔNG QUAN HỆ THỐNG BACKEND
- **Framework:** ASP.NET Core 8 Web API (`.NET 8.0`)
- **Database:** MySQL (kết nối qua `Pomelo.EntityFrameworkCore.MySql`)
- **Authentication:** JWT Bearer Token Auth (`login: admin / Abczyy1@@!`)
- **Discord Integration:** Auto Webhook notification cho Scam Report & Đăng ký Legit mới

## 2. ENTITIES VÀ SCHEMA CƠ SỞ DỮ LIỆU C#

### 2.1 Entity `LegitProfile.cs`
```csharp
namespace CheckZone.Api.Entities
{
    public class LegitProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Required]
        [Range(0, 100)]
        [Column("score")]
        public int Score { get; set; } = 100;

        [Required]
        [MaxLength(4096)]
        [Column("img")]
        public string Img { get; set; } = string.Empty;

        [Required]
        [Column("desc", TypeName = "text")]
        public string Desc { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("telegram")]
        public string Telegram { get; set; } = "";

        [Required]
        [Column("insurance", TypeName = "decimal(15, 2)")]
        public decimal Insurance { get; set; } = 0m;

        [Required]
        [Column("success_trans")]
        public int SuccessTrans { get; set; } = 0;

        [Required]
        [MaxLength(7)]
        [Column("join_date")]
        public string JoinDate { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("business_type")]
        public string BusinessType { get; set; } = string.Empty;

        [MaxLength(512)]
        [Column("facebook")]
        public string? Facebook { get; set; }

        [MaxLength(500)]
        [Column("address")]
        public string? Address { get; set; }

        [MaxLength(255)]
        [Column("website")]
        public string? Website { get; set; }

        [MaxLength(100)]
        [Column("account_number")]
        public string? AccountNumber { get; set; }

        [MaxLength(100)]
        [Column("bank_name")]
        public string? BankName { get; set; }

        [MaxLength(255)]
        [Column("slug")]
        public string? Slug { get; set; }
    }
}
```

### 2.2 Entity `ScamReport.cs`
```csharp
namespace CheckZone.Api.Entities
{
    public class ScamReport
    {
        [Key]
        [Required]
        [MaxLength(20)]
        [Column("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("account_holder_name")]
        public string? AccountHolderName { get; set; }

        [MaxLength(20)]
        [Column("phone")]
        public string? Phone { get; set; }

        [MaxLength(100)]
        [Column("bank_name")]
        public string BankName { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("account_number")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [Column("desc", TypeName = "text")]
        public string Desc { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("type")]
        public string Type { get; set; } = string.Empty;

        [Required]
        [Column("amount", TypeName = "decimal(15, 2)")]
        public decimal Amount { get; set; } = 0m;

        [Required]
        [MaxLength(50)]
        [Column("status")]
        public string Status { get; set; } = "Đang chờ duyệt";

        [Required]
        [MaxLength(100)]
        [Column("victim")]
        public string Victim { get; set; } = "Ẩn danh";

        [Required]
        [Column("tags")]
        public List<string> Tags { get; set; } = new List<string>();

        [MaxLength(512)]
        [Column("facebook")]
        public string? Facebook { get; set; }

        [Required]
        [Column("images")]
        public List<string> Images { get; set; } = new List<string>();

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("category")]
        public ScamCategory Category { get; set; } = ScamCategory.FinancialScam;
    }
}
```

### 2.3 Entity `BlogArticle.cs`
```csharp
namespace CheckZone.Api.Entities
{
    public class BlogArticle
    {
        [Key]
        [Required]
        [MaxLength(20)]
        [Column("id")]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("category")]
        public string Category { get; set; } = "Cảnh báo phổ thông";

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(255)]
        [Column("slug")]
        public string Slug { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("status")]
        public string Status { get; set; } = "Đã đăng";

        [Column("content", TypeName = "text")]
        public string? Content { get; set; }

        [MaxLength(2048)]
        [Column("thumbnail")]
        public string Thumbnail { get; set; } = string.Empty;

        [Column("meta_description", TypeName = "text")]
        public string? MetaDescription { get; set; }

        [Column("meta_keywords", TypeName = "text")]
        public string? MetaKeywords { get; set; }

        [MaxLength(100)]
        [Column("author")]
        public string Author { get; set; } = "Ban Biên Tập Check Zone";
    }
}
```

## 3. DANH SÁCH DTO VÀ QUY TẮC VALIDATION

### 3.1 `CreateLegitProfileDto.cs`
```csharp
namespace CheckZone.Api.DTOs
{
    public class CreateLegitProfileDto
    {
        [Required(ErrorMessage = "Tên thương hiệu là bắt buộc")]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Role { get; set; } = string.Empty;

        [Required]
        [Range(0, 100)]
        public int Score { get; set; } = 100;

        [Required]
        [StringLength(4096)]
        public string Img { get; set; } = string.Empty;

        [Required]
        public string Desc { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Telegram { get; set; } = "";

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Insurance { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int SuccessTrans { get; set; }

        [Required]
        [StringLength(7)]
        public string JoinDate { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string BusinessType { get; set; } = string.Empty;

        [StringLength(512)]
        public string? Facebook { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(255)]
        public string? Website { get; set; }

        [StringLength(100)]
        public string? AccountNumber { get; set; }

        [StringLength(100)]
        public string? BankName { get; set; }

        [StringLength(255)]
        public string? Slug { get; set; }
    }
}
```

## 4. DANH SÁCH REST API ENDPOINTS

| HTTP Method | Endpoint Route | Authorization Header | Mô tả |
| :---: | :--- | :---: | :--- |
| **POST** | `/api/auth/login` | Không | Đăng nhập Admin (`admin` / `Abczyy1@@!`) |
| **GET** | `/api/public/legits` | Không | Danh sách thương nhân uy tín công khai |
| **GET** | `/api/public/legits/{idOrSlug}` | Không | Chi tiết 1 thương nhân theo ID hoặc Slug |
| **POST** | `/api/admin/legits` | `Bearer JWT` | Cấp mới hồ sơ uy tín |
| **PUT** | `/api/admin/legits/{id}` | `Bearer JWT` | Cập nhật thông tin hồ sơ uy tín |
| **DELETE** | `/api/admin/legits/{id}` | `Bearer JWT` | Thu hồi / gỡ bỏ hồ sơ uy tín |
| **POST** | `/api/public/reports` | Không | Gửi báo cáo tố cáo scam mới |
| **GET** | `/api/public/blogs/{idOrSlug}` | Không | Chi tiết bài viết SEO theo Slug |
| **POST** | `/api/admin/blogs` | `Bearer JWT` | Đăng bài viết tin tức mới kèm Meta SEO |
| **PUT** | `/api/admin/blogs/{id}` | `Bearer JWT` | Cập nhật bài viết tin tức & Meta SEO |
