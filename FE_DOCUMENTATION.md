# TÀI LIỆU CHI TIẾT DỰ ÁN FRONTEND (CHECK ZONE FE)

## 1. THƯ VIỆN & CẤU HÌNH CÔNG NGHỆ (TECH STACK)

- **Framework Core:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`), TypeScript v5.8
- **Build Tool:** Vite v6 (`vite: ^6.2.3`)
- **Routing:** React Router v7 (`react-router-dom: ^7.15.1`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite: ^4.1.14`), Vanilla CSS utilities
- **Icons:** Lucide React (`lucide-react: ^0.546.0`), Material Symbols Outlined
- **State Management:** Custom React Context API (`src/context/AppContext.tsx`)
- **Form Management:** Native Uncontrolled & Controlled React Hooks State (`useState`, `useRef`)
- **API Client:** Standard Browser `fetch` API với Custom DTO Mappers & JWT Bearer Header Authentication

---

## 2. NỘI DUNG FILE `package.json`

```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
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

---

## 3. CẤU TRÚC INTERFACE DỮ LIỆU FRONTEND (`src/context/AppContext.tsx`)

### 3.1 `LegitProfile` (Hồ Sơ Uy Tín / Thương Nhân Ký Quỹ)
```typescript
export interface LegitProfile {
  id: number;
  name: string; // Tên thương hiệu / Người bán
  role: string; // Lĩnh vực hoạt động (VD: Thương mại điện tử & Đồ công nghệ)
  score: number; // Điểm uy tín (1-100)
  img: string; // URL Ảnh đại diện / Logo thương nhân (ImgBB upload hoặc URL)
  desc: string; // Hồ sơ năng lực / Giới thiệu kinh doanh
  phone: string; // Số điện thoại Hotline / Zalo
  telegram: string; // Telegram handle (VD: @techglobal)
  insurance: number; // Tiền ký quỹ bảo lãnh (VNĐ)
  successTrans: number; // Số giao dịch thành công
  joinDate: string; // Thới gian gia nhập (MM/YYYY)
  businessType: string; // Lĩnh vực kinh doanh
  facebook?: string; // Trang cá nhân / Fanpage Facebook
  address?: string; // Địa chỉ trụ sở / Cửa hàng
  website?: string; // Website bán hàng
  accountNumber?: string; // Số tài khoản ngân hàng đã xác thực
  bankName?: string; // Tên ngân hàng đã xác thực
  slug?: string; // Đường dẫn tùy chỉnh URL slug (VD: topzone_shop)
}
```

---

## 4. HÀM XỬ LÝ SUBMIT & GỌI API (HTTP REQUEST HANDLERS)

### 4.1 Hàm Cấp Mới Hồ Sơ Legit (`addLegitProfile`)
```typescript
const addLegitProfile = async (profile: Omit<LegitProfile, "id" | "score" | "successTrans" | "joinDate">): Promise<boolean> => {
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

  try {
    const res = await fetch(`${API_BASE_URL}/admin/legits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      await fetchLegits();
      return true;
    }
    return false;
  } catch (e) {
    console.error("Lỗi khi thêm hồ sơ legit:", e);
    return false;
  }
};
```

### 4.2 Hàm Cập Nhật Hồ Sơ Legit (`updateLegitProfile`)
```typescript
const updateLegitProfile = async (id: number, updatedProfile: Partial<LegitProfile>): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/legits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedProfile)
    });

    if (res.ok) {
      await fetchLegits();
      return true;
    }
    return false;
  } catch (e) {
    console.error("Lỗi khi cập nhật hồ sơ legit:", e);
    return false;
  }
};
```

### 4.3 Upload Ảnh Đại Diện Trực Tiếp Lên ImgBB
```typescript
const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chỉ chọn file định dạng hình ảnh.");
    return;
  }

  setIsUploadingAvatar(true);
  try {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "49299870d79f975d7cbf058f2d0d7d39";
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success && data.data?.url) {
      setImgUrl(data.data.url);
    } else {
      alert("Không thể tải ảnh lên ImgBB.");
    }
  } catch (error) {
    console.error("Lỗi khi tải ảnh:", error);
  } finally {
    setIsUploadingAvatar(false);
  }
};
```

---

## 5. MÃ NGUỒN COMPONENT QUẢN LÝ CẤP HỒ SƠ LEGIT (`src/pages/AdminLegitManagement.tsx`)

Component quản lý toàn bộ giao diện Cấp mới/Cập nhật Hồ sơ Uy tín và Bảng danh sách thương nhân bảo chứng:

```tsx
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LegitProfile } from "../context/AppContext";
import { DataTable, ColumnDef, BulkAction } from "../components/DataTable";
import { Trash2, Phone, Send, Calendar, Shield, MapPin, Globe, CreditCard } from "lucide-react";

const PREDEFINED_SECTORS = [
  "Thương mại điện tử & Đồ công nghệ",
  "Thời trang, Giày dép & Phụ kiện",
  "Bất động sản & Cho thuê nhà đất",
  "Dịch vụ Du lịch & Vé máy bay",
  "Tiền điện tử, Crypto & GameFi",
  "Tài chính, Tín dụng & Trung gian GD",
  "Thuốc & Thực phẩm chức năng",
  "Khác / Thương mại tự do"
];

export function AdminLegitManagement() {
  const { legitList, addLegitProfile, updateLegitProfile, deleteLegitProfile } = useApp();
  
  // State Form nhập liệu
  const [name, setName] = useState("");
  const [role, setRole] = useState("Thương mại điện tử & Đồ công nghệ");
  const [insurance, setInsurance] = useState("50000000");
  const [desc, setDesc] = useState("");
  const [telegram, setTelegram] = useState("");
  const [phone, setPhone] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [facebook, setFacebook] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [slug, setSlug] = useState("");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [successNotif, setSuccessNotif] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const insuranceValue = Number(insurance) || 0;

  function getLiveTier(val: number) {
    if (val >= 500000000) {
      return {
        label: "Hạng Kim Cương (Bảo chứng cao cấp)",
        className: "bg-cyan-50 text-cyan-900 border border-cyan-300",
        icon: "diamond"
      };
    } else if (val >= 100000000) {
      return {
        label: "Hạng Bạch Kim (Bảo chứng trung cấp)",
        className: "bg-slate-50 text-slate-700 border border-slate-300",
        icon: "shield_lock"
      };
    } else {
      return {
        label: "Hạng Vàng (Bảo chứng phổ thông)",
        className: "bg-amber-50 text-amber-800 border border-amber-200",
        icon: "workspace_premium"
      };
    }
  }

  const liveTier = getLiveTier(insuranceValue);

  const resetForm = () => {
    setName("");
    setDesc("");
    setTelegram("");
    setPhone("");
    setImgUrl("");
    setInsurance("50000000");
    setFacebook("");
    setAddress("");
    setWebsite("");
    setAccountNumber("");
    setBankName("");
    setSlug("");
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg("");
    setSuccessNotif("");

    if (!name.trim()) {
      setAlertMsg("Vui lòng nhập tên thương hiệu / tiểu thương.");
      return;
    }

    if (!desc.trim()) {
      setAlertMsg("Vui lòng bổ sung phần mô tả năng lực kinh doanh.");
      return;
    }

    const defaultPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80";
    const finalImg = imgUrl.trim() || defaultPlaceholder;

    if (editingId !== null) {
      const success = await updateLegitProfile(editingId, {
        name: name.trim(),
        role: role.trim(),
        desc: desc.trim(),
        insurance: insuranceValue,
        telegram: telegram.trim(),
        phone: phone.trim(),
        img: finalImg,
        businessType: role.trim(),
        facebook: facebook.trim(),
        address: address.trim(),
        website: website.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
        slug: slug.trim()
      });
      if (success) {
        setSuccessNotif(`Đã cập nhật hồ sơ thương nhân: "${name.trim()}" thành công.`);
        resetForm();
      }
    } else {
      const success = await addLegitProfile({
        name: name.trim(),
        role: role.trim(),
        desc: desc.trim(),
        insurance: insuranceValue,
        telegram: telegram.trim(),
        phone: phone.trim(),
        img: finalImg,
        businessType: role.trim(),
        facebook: facebook.trim(),
        address: address.trim(),
        website: website.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
        slug: slug.trim()
      });
      if (success) {
        setSuccessNotif(`Đã cấp hồ sơ ký quỹ uy tín thành công cho: "${name.trim()}".`);
        resetForm();
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      <header className="bg-white border-b border-outline-variant px-6 py-6 sticky top-0 z-10 shadow-sm">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-900">Quản lý danh sách uy tín</h1>
          <span className="bg-[#2e7d32] text-white px-4 py-2 rounded-2xl font-mono text-xs font-bold">
            {legitList.length} Thương nhân hợp tác
          </span>
        </div>
      </header>

      <div className="w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Form Cấp/Sửa Hồ sơ (Rộng 6/12) */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-5">
          <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#2e7d32]">
              {editingId !== null ? "Cập nhật hồ sơ Legit" : "Cấp hồ sơ Legit mới"}
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Tên thương hiệu *</label>
                  <input
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none"
                    placeholder="Ví dụ: Tech Global Store"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Đường dẫn tùy chỉnh (Slug)</label>
                  <input
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm font-mono focus:border-[#2e7d32] outline-none"
                    placeholder="Ví dụ: topzone_shop"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Lĩnh vực hoạt động *</label>
                  <input
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2e7d32] uppercase text-[10px] mb-1">Tiền bảo lãnh ký quỹ (VNĐ) *</label>
                  <input
                    type="number"
                    className="w-full border-2 border-[#2e7d32]/30 rounded-xl px-4 py-3 text-sm font-mono font-black text-[#2e7d32] focus:border-[#2e7d32] outline-none"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-emerald-800 uppercase text-[10px] mb-1">Số tài khoản đã xác thực</label>
                  <input
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 text-sm font-mono font-bold"
                    placeholder="Ví dụ: 190382918390"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-800 uppercase text-[10px] mb-1">Ngân hàng đã xác thực</label>
                  <input
                    className="w-full border-2 border-emerald-200 rounded-xl px-4 py-3 text-sm"
                    placeholder="Ví dụ: MB Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">Mô tả / Hồ sơ năng lực *</label>
                <textarea
                  rows={3}
                  className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white text-xs py-3.5 rounded-xl font-extrabold uppercase tracking-widest shadow-md"
              >
                {editingId !== null ? "Lưu cập nhật hồ sơ" : "Xác nhận cấp hồ sơ uy tín"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
```
