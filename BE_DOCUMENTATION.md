# TÀI LIỆU CHI TIẾT DỰ ÁN BACKEND (CHECK ZONE BE - .NET 8 WEB API)

## 1. TỔNG QUAN VỀ KIẾN TRÚC BACKEND

- **Framework:** ASP.NET Core 8 Web API (`.NET 8.0`)
- **Database Engine:** MySQL Database (kết nối qua Entity Framework Core `Pomelo.EntityFrameworkCore.MySql`)
- **Authentication:** JWT Bearer Token Authentication (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **Third-party Integrations:** Discord Webhook Notifications (`DiscordNotificationService.cs`), Cloudflare Turnstile Verification.

---

## 2. DANH SÁCH ENTITIES VÀ SCHEMA CƠ SỞ DỮ LIỆU (MYSQL)

### 2.1 Entity `LegitProfile.cs` (Bảng `LegitProfiles`)

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string Img { get; set; } = "https://images.domain.com/default-avatar.png";

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
        public string Telegram { get; set; } = "@verified_merchant";

        [Required]
        [Column("insurance", TypeName = "decimal(15, 2)")]
        public decimal Insurance { get; set; } = 0m;

        [Required]
        [Column("success_trans")]
        public int SuccessTrans { get; set; } = 0;

        [Required]
        [MaxLength(7)]
        [Column("join_date")]
        public string JoinDate { get; set; } = string.Empty; // Định dạng MM/YYYY

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

---

### 2.2 Entity `ScamReport.cs` (Bảng `ScamReports`)

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

---

### 2.3 Entity `BlogArticle.cs` (Bảng `BlogArticles`)

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

---

## 3. DANH SÁCH DTO (DATA TRANSFER OBJECTS) & QUY TẮC VALIDATION

### 3.1 `CreateLegitProfileDto.cs`
```csharp
using System.ComponentModel.DataAnnotations;

namespace CheckZone.Api.DTOs
{
    public class CreateLegitProfileDto
    {
        [Required(ErrorMessage = "Tên thương hiệu không được để trống")]
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
        public string JoinDate { get; set; } = string.Empty; // MM/YYYY

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

---

## 4. DANH SÁCH ENDPOINTS API (CONTROLLERS)

| HTTP Method | API Endpoint Route | Yêu cầu Authentication | Mô tả chức năng |
| :---: | :--- | :---: | :--- |
| **POST** | `/api/auth/login` | Không | Đăng nhập Admin, trả về JWT Token (`Password: Abczyy1@@!`) |
| **GET** | `/api/public/legits` | Không | Lấy danh sách thương nhân uy tín công khai |
| **GET** | `/api/public/legits/{idOrSlug}` | Không | Xem chi tiết 1 hồ sơ theo ID số hoặc Slug tùy chỉnh |
| **POST** | `/api/admin/legits` | Có (`Bearer JWT`) | Cấp mới 1 hồ sơ thương nhân uy tín |
| **PUT** | `/api/admin/legits/{id}` | Có (`Bearer JWT`) | Cập nhật thông tin hồ sơ uy tín theo ID |
| **DELETE** | `/api/admin/legits/{id}` | Có (`Bearer JWT`) | Thu hồi / gỡ bỏ hồ sơ uy tín |
| **POST** | `/api/public/reports` | Không | Gửi báo cáo tố cáo scam mới (Có gửi Discord Webhook) |
| **GET** | `/api/public/blogs/{idOrSlug}` | Không | Lấy chi tiết bài viết tin tức SEO chuẩn theo Slug |
| **POST** | `/api/admin/blogs` | Có (`Bearer JWT`) | Đăng bài viết tin tức mới kèm Meta SEO fields |
| **PUT** | `/api/admin/blogs/{id}` | Có (`Bearer JWT`) | Cập nhật nội dung & thông tin SEO bài viết tin tức |

---

## 5. CÁC TÍNH NĂNG ĐẶC BIỆT Ở BACKEND
1. **EF Core Migrations tự động:** Tự động tạo và cập nhật các cột mới như `account_holder_name`, `meta_description`, `meta_keywords`, `author` vào MySQL Database khi app chạy.
2. **Discord Webhook Notification:** Tự động gửi thông báo trực tiếp sang Discord channel khi có tố cáo lừa đảo hoặc đăng ký hồ sơ uy tín mới.
