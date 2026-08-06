import React, { useState } from "react";
import { useApp, LegitProfile } from "../context/AppContext";
import { AnimatedTable, ColumnDef, BulkAction } from "../components/AnimatedTable";
import { Trash2, Shield, Calendar, Phone, Send } from "lucide-react";

const PREDEFINED_SECTORS = [
  "Thương mại điện tử & Đồ công nghệ",
  "Freelancer & Sáng tạo nội dung",
  "Dịch vụ & Tư vấn chuyên nghiệp",
  "Thời trang & Mỹ phẩm",
  "Thực phẩm & F&B",
  "Mẹ & Bé",
  "Giáo dục & Khóa học",
  "Du lịch & Vé máy bay",
  "Tài chính & Bảo hiểm",
  "Dịch vụ trung gian (Giao dịch trung gian)"
];

export function AdminLegitManagement() {
  const { legitList, addLegitProfile, deleteLegitProfile, updateLegitProfile } = useApp();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
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
  const [successNotif, setSuccessNotif] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAlertMsg("Vui lòng chỉ chọn file ảnh (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAlertMsg("Dung lượng ảnh không được vượt quá 5MB.");
      return;
    }

    setAlertMsg("");
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "49299870d79f975d7cbf058f2d0d7d39";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data && resData.data.url) {
          setImgUrl(resData.data.url);
          setIsUploadingAvatar(false);
          return;
        }
      }
      // ImgBB returned non-ok or no URL → show error, do NOT fallback to base64
      setAlertMsg("Tải ảnh lên thất bại. Vui lòng thử lại hoặc dán URL ảnh trực tiếp vào ô bên dưới.");
    } catch (err) {
      console.error("ImgBB upload error:", err);
      setAlertMsg("Lỗi kết nối khi tải ảnh lên. Vui lòng dán URL ảnh trực tiếp vào ô bên dưới.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const insuranceValue = Number(insurance) || 0;

  function getLiveTier(val: number) {
    if (val >= 500000000) {
      return {
        label: "Hạng Kim Cương (Bảo chứng cao nhất)",
        className: "bg-cyan-50 text-cyan-800 border border-cyan-200",
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
    setSlug("");
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
    setEditingId(null);
  };

  const handleEditClick = (item: LegitProfile) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug || "");
    setRole(item.role);
    setInsurance(item.insurance.toString());
    setDesc(item.desc);
    setTelegram(item.telegram);
    setPhone(item.phone);
    setImgUrl(item.img);
    setFacebook(item.facebook || "");
    setAddress(item.address || "");
    setWebsite(item.website || "");
    setAccountNumber(item.accountNumber || "");
    setBankName(item.bankName || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setAlertMsg("Vui lòng bổ dung phần mô tả tóm tắt năng lực kinh doanh.");
      return;
    }

    if (isNaN(insuranceValue) || insuranceValue <= 0) {
      setAlertMsg("Số tiền ký quỹ quỹ bảo hiểm phải là số dương hợp lệ.");
      return;
    }

    const defaultPlaceholder = "https://lh3.googleusercontent.com/aida-public/AB6AXuDKJ968Ro0Hzvi8zHp06GmLG63LozZe4NRvKhYCn5yYkPBsnsqfkGxNSYIVzs4lS-POI9dJ6jAkQf6sD-vfdHIDtRjTZt5qxga6QElHZZi8hh14MMbRsMjcPQ6I8mJBxflquF_-Day2hvABActcMHynjkDfrGLqrV2kTspaYVY23YkiaipC_0TeFQOxHxl9LM4TE-dbgwMegvZlElmVN3pqZPFObemSNzfEp9wu0_tgVPRuCXFTUY4UCprdbpksNSqX8bEQ7xrBNGdH";
    const finalImg = imgUrl.trim() || defaultPlaceholder;

    if (editingId !== null) {
      const success = await updateLegitProfile(editingId, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        role: role.trim(),
        desc: desc.trim(),
        insurance: insuranceValue,
        telegram: telegram.trim() ? (telegram.startsWith("@") ? telegram.trim() : `@${telegram.trim()}`) : "@verified_merchant",
        phone: phone.trim() || "09x xxx xxxx",
        img: finalImg,
        businessType: role.trim(),
        facebook: facebook.trim(),
        address: address.trim(),
        website: website.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim()
      });
      if (success) {
        setSuccessNotif(`Đã cập nhật thông tin thành công cho đơn vị: "${name.trim()}".`);
        resetForm();
      }
    } else {
      await addLegitProfile({
        name: name.trim(),
        slug: slug.trim() || undefined,
        role: role.trim(),
        desc: desc.trim(),
        insurance: insuranceValue,
        score: 100,
        successTrans: 1,
        telegram: telegram.trim() ? (telegram.startsWith("@") ? telegram.trim() : `@${telegram.trim()}`) : "@verified_merchant",
        phone: phone.trim() || "09x xxx xxxx",
        img: finalImg,
        joinDate: new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).substring(3),
        businessType: role.trim(),
        facebook: facebook.trim(),
        address: address.trim(),
        website: website.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim()
      });
      setSuccessNotif(`Đã cấp hồ sơ ký quỹ uy tín thành công cho đơn vị: "${name.trim()}".`);
      resetForm();
    }
  };

  const handleDelete = async (id: string | number, merchantName: string) => {
    if (confirm(`Bạn có chắc chắn muốn THU HỒI hồ sơ & GỠ BỎ mọi chứng nhận uy tín của tiểu thương: "${merchantName}" khỏi hệ thống?`)) {
      await deleteLegitProfile(id);
      setSuccessNotif(`Đã gỡ bỏ chứng chỉ ký quỹ của "${merchantName}".`);
    }
  };

  // Define Columns
  const columns: ColumnDef<LegitProfile>[] = [
    {
      key: "name",
      header: "Nhãn thương nhân",
      sortable: true,
      className: "w-72 min-w-[260px]",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.img}
            alt={item.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-extrabold text-[13px] text-slate-900 leading-tight capitalize whitespace-nowrap">{item.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">{item.role}</p>
          </div>
        </div>
      )
    },
    {
      key: "insurance",
      header: "Xếp hạng bảo chứng",
      sortable: true,
      className: "w-32 min-w-[120px]",
      sortAccessor: (item) => item.insurance,
      cell: (item) => {
        const profileTier = getLiveTier(item.insurance);
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide whitespace-nowrap ${profileTier.className}`}>
            <span className="material-symbols-outlined text-[10px] align-middle">{profileTier.icon}</span>
            {profileTier.label.split(" (")[0]}
          </span>
        );
      }
    },
    {
      key: "insuranceValue",
      header: "Quỹ ký quỹ",
      sortable: true,
      className: "w-28 min-w-[100px]",
      sortAccessor: (item) => item.insurance,
      cell: (item) => (
        <span className="font-mono font-black text-slate-800 text-xs">
          {item.insurance.toLocaleString("vi-VN")}đ
        </span>
      )
    },
    {
      key: "actions",
      header: "Tuỳ chọn",
      className: "w-40 min-w-[150px] text-right",
      cell: (item) => (
        <div className="flex gap-2 justify-end items-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleEditClick(item)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">edit</span>
            <span>Sửa</span>
          </button>
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Thu hồi</span>
          </button>
        </div>
      )
    }
  ];

  // Define Expandable Details View
  const renderExpandableLegit = (item: LegitProfile) => {
    const profileTier = getLiveTier(item.insurance);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-medium">
        
        {/* Left Info Column */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5 text-slate-650">
            <Send className="w-4 h-4 text-sky-500" />
            <span className="font-bold text-slate-500">Telegram:</span>
            <a 
              href={`https://t.me/${item.telegram.replace("@", "")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 hover:underline font-extrabold"
              onClick={(e) => e.stopPropagation()}
            >
              {item.telegram}
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-slate-650">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-500">Hotline/Zalo:</span>
            <span className="font-bold font-mono">{item.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-650">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-500">Ngày tham gia:</span>
            <span className="font-bold">{item.joinDate || "Vừa xong"}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-650">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-500">Xếp hạng ký quỹ:</span>
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide ${profileTier.className}`}>
              {profileTier.label}
            </span>
          </div>

          {item.facebook && (
            <div className="flex items-center gap-2.5 text-slate-650">
              <span className="material-symbols-outlined text-base text-blue-600 font-bold">link</span>
              <span className="font-bold text-slate-500">Facebook:</span>
              <a href={item.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold" onClick={(e) => e.stopPropagation()}>
                {item.facebook}
              </a>
            </div>
          )}

          {item.website && (
            <div className="flex items-center gap-2.5 text-slate-650">
              <span className="material-symbols-outlined text-base text-indigo-500 font-bold">language</span>
              <span className="font-bold text-slate-500">Website:</span>
              <a href={item.website.startsWith("http") ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-bold" onClick={(e) => e.stopPropagation()}>
                {item.website}
              </a>
            </div>
          )}

          {item.address && (
            <div className="flex items-center gap-2.5 text-slate-650">
              <span className="material-symbols-outlined text-base text-rose-500 font-bold">location_on</span>
              <span className="font-bold text-slate-500">Địa chỉ:</span>
              <span className="font-bold text-slate-800">{item.address}</span>
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="flex flex-col justify-between gap-4">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Giới thiệu & Năng lực giao dịch</span>
            <p className="leading-relaxed text-slate-700 whitespace-pre-line">
              {item.desc}
            </p>
          </div>

          <div className="text-right" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleDelete(item.id, item.name)}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 hover:text-red-700 font-extrabold text-[10px] uppercase py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 ml-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Thu hồi chứng chỉ & Gỡ thương nhân</span>
            </button>
          </div>
        </div>

      </div>
    );
  };

  // Define Bulk Actions
  const bulkActions: BulkAction<LegitProfile>[] = [
    {
      label: "Thu hồi đã chọn",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      variant: "danger",
      onClick: async (items) => {
        if (confirm(`Bạn có chắc chắn muốn THU HỒI chứng chỉ ký quỹ & GỠ BỎ ${items.length} thương nhân đã chọn?`)) {
          for (const item of items) {
            await deleteLegitProfile(item.id);
          }
          setSuccessNotif(`Đã thu hồi thành công ${items.length} thương nhân.`);
        }
      }
    }
  ];

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản lý danh sách uy tín</h1>
          <p className="text-xs text-slate-500 mt-1">Hệ thống quản trị và kiểm duyệt hồ sơ thương nhân</p>
        </div>
        <span className="bg-[#2e7d32] text-white px-4 py-2 rounded-full font-mono text-xs font-bold shadow-sm">
          {legitList.length} Thương nhân hợp tác
        </span>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <section className="xl:col-span-2 space-y-6">
          <form onSubmit={handleCreate} className="space-y-6">

            {/* Card 1: Thông tin cơ bản */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#2e7d32] mb-4 flex items-center gap-2">
                <span className="bg-green-100 p-1.5 rounded-lg text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                {editingId !== null ? "Cập nhật hồ sơ" : "Thông tin thương hiệu"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Tên thương hiệu / Người bán *</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#2e7d32] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    placeholder="Ví dụ: Tech Global Store"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Đường dẫn tùy chỉnh (Slug)</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-600 focus:border-[#2e7d32] focus:ring-2 focus:ring-green-100 outline-none transition-all bg-slate-50"
                    placeholder="Ví dụ: topzone_shop"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Lĩnh vực hoạt động *</label>
                  <input
                    list="business-types"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-[#2e7d32] outline-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <datalist id="business-types">
                    {PREDEFINED_SECTORS.map((sector, i) => <option key={i} value={sector} />)}
                  </datalist>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Mô tả / Hồ sơ năng lực kinh doanh *</label>
                  <textarea
                    rows={4}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none"
                    placeholder="Mô tả các sản phẩm kinh doanh chính và cam kết bảo hành..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Tài chính & Xác thực ngân hàng */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-emerald-700 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                Tài chính &amp; Xác thực ngân hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-emerald-800 text-xs mb-1.5">Ký quỹ bảo lãnh (VNĐ) *</label>
                  <input
                    type="number"
                    className="w-full border-2 border-emerald-200 bg-emerald-50 rounded-xl px-4 py-3 text-lg font-mono font-black text-emerald-700 focus:border-emerald-500 outline-none"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    Bậc duyệt tự động:
                    <span className={`px-2 py-1 rounded font-bold ${liveTier?.className || ''}`}>
                      {liveTier?.label || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Số tài khoản đã xác thực</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:border-emerald-500 outline-none"
                    placeholder="Ví dụ: 190382918390"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Ngân hàng đã xác thực</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none"
                    placeholder="Ví dụ: MB Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>
            </div>

          </form>
        </section>

        {/* CỘT PHẢI: ẢNH + LIÊN HỆ + ACTION */}
        <section className="xl:col-span-1 space-y-6">

          {/* Card 3: Ảnh đại diện */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="block font-bold text-slate-700 text-xs mb-3">Ảnh đại diện / Logo thương nhân *</label>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                {imgUrl ? (
                  <img src={imgUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-xs text-center">Chưa có<br />ảnh</span>
                )}
              </div>
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg w-full text-center transition-colors">
                {isUploadingAvatar ? "Đang tải lên..." : "Tải ảnh từ máy tính"}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarFileChange} disabled={isUploadingAvatar} />
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 outline-none focus:border-[#2e7d32]"
                placeholder="Hoặc dán URL ảnh vào đây..."
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Card 4: Thông tin liên hệ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-700 text-sm mb-4 border-b border-slate-100 pb-2">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Hotline / Zalo *</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                  placeholder="Ví dụ: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Telegram liên hệ</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                  placeholder="Ví dụ: @techglobal"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Website</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                  placeholder="Ví dụ: techglobal.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Facebook URL</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                  placeholder="Ví dụ: https://facebook.com/techglobal"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Địa chỉ trụ sở</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                  placeholder="Ví dụ: Hà Nội, Việt Nam"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nút Submit */}
          <button
            onClick={handleCreate}
            className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white text-sm py-4 rounded-xl font-extrabold uppercase tracking-wide shadow-lg shadow-green-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              {editingId !== null ? "save" : "verified_user"}
            </span>
            {editingId !== null ? "Lưu cập nhật hồ sơ" : "Xác nhận cấp hồ sơ uy tín"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full text-xs text-slate-500 font-bold hover:text-red-500 transition-colors text-center"
            >
              Hủy chỉnh sửa
            </button>
          )}

          {alertMsg && <div className="text-red-500 text-xs font-bold text-center bg-red-50 rounded-lg p-2">{alertMsg}</div>}
          {successNotif && <div className="text-[#2e7d32] text-xs font-bold text-center bg-green-50 rounded-lg p-2">{successNotif}</div>}

        </section>
      </div>

      {/* Bảng danh sách thương nhân */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-[#2e7d32] fill-1">verified_user</span>
              Cơ sở thương nhân ký quỹ vận hành
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Danh sách các hồ sơ an toàn đã đóng gói quỹ bảo hộ rủi ro giao dịch.</p>
          </div>
          <AnimatedTable
            data={legitList}
            columns={columns}
            searchPlaceholder="Tìm tên thương nhân, lĩnh vực, số điện thoại..."
            searchKeys={["name", "role", "telegram", "phone", "desc"]}
            expandableRender={renderExpandableLegit}
            bulkActions={bulkActions}
            rowKey={(item) => item.id}
          />
        </div>
      </div>

    </div>
  );
}
