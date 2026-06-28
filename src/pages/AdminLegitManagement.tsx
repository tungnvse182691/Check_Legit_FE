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
  const { legitList, addLegitProfile, deleteLegitProfile } = useApp();

  const [name, setName] = useState("");
  const [role, setRole] = useState("Thương mại điện tử & Đồ công nghệ");
  const [insurance, setInsurance] = useState("50000000");
  const [desc, setDesc] = useState("");
  const [telegram, setTelegram] = useState("");
  const [phone, setPhone] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [successNotif, setSuccessNotif] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

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

    await addLegitProfile({
      name: name.trim(),
      role: role.trim(),
      desc: desc.trim(),
      insurance: insuranceValue,
      score: 100,
      successTrans: 1,
      telegram: telegram.trim() ? (telegram.startsWith("@") ? telegram.trim() : `@${telegram.trim()}`) : "@verified_merchant",
      phone: phone.trim() || "09x xxx xxxx",
      img: finalImg,
      joinDate: new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).substring(3),
      businessType: role.trim()
    });

    setName("");
    setDesc("");
    setTelegram("");
    setPhone("");
    setImgUrl("");
    setInsurance("50000000");
    setSuccessNotif(`Đã cấp hồ sơ ký quỹ uy tín thành công cho đơn vị: "${name.trim()}".`);
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
      className: "w-24 min-w-[90px] text-right",
      cell: (item) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer whitespace-nowrap flex items-center gap-1 ml-auto"
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
      <header className="bg-white border-b border-outline-variant px-6 py-6 md:px-6 sticky top-0 z-10 shadow-sm shrink-0">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#2e7d32] text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full inline-block mb-1.5">
              Chứng thực chất lượng giao dịch
            </span>
            <h1 className="text-2xl md:text-3.5xl font-black text-on-surface tracking-tight">
              Quản lý danh sách uy tín
            </h1>
          </div>
          <span className="bg-[#2e7d32] text-white px-4 py-2 rounded-2xl font-mono text-xs font-bold shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto uppercase">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            {legitList.length} Thương nhân hợp tác
          </span>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="w-full px-6 md:px-6 py-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Creation Form Column (5/12 width) */}
        <section className="col-span-12 lg:col-span-4">
          <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6 sticky top-28 animate-fade-in">
            <div>
              <h2 className="text-xl font-black text-[#2e7d32] flex items-center gap-2">
                <span className="material-symbols-outlined font-bold text-xl">add_circle</span>
                Cấp hồ sơ Legit mới
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">Đăng ký mới một thương nhân đã được bộ phận rà soát thực tế ký quỹ giao dịch.</p>
            </div>

            {alertMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-pulse">
                <span className="material-symbols-outlined text-red-650 font-bold text-sm">warning</span>
                <span>{alertMsg}</span>
              </div>
            )}

            {successNotif && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-955 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#2e7d32] font-bold text-sm">check_circle</span>
                <span>{successNotif}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Tên thương hiệu / Người bán *</label>
                <input
                  className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50"
                  placeholder="Ví dụ: Tech Global Store"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Lĩnh vực hoạt động *</label>
                <input
                  type="text"
                  list="business-types"
                  className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none bg-white shadow-sm transition-all text-slate-800 focus:ring-4 focus:ring-emerald-50"
                  placeholder="Chọn từ gợi ý hoặc tự nhập lĩnh vực khác"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <datalist id="business-types">
                  {PREDEFINED_SECTORS.map((sector, index) => (
                    <option key={index} value={sector} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-[#2e7d32] uppercase tracking-wider text-[10px] mb-1.5">Ký quỹ tiền bảo lãnh thương mại (VNĐ) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-[#2e7d32] font-bold">đ</span>
                  <input
                    className="w-full border-2 border-[#2e7d32]/30 rounded-xl pl-9 pr-4 py-3 font-mono font-black text-sm text-[#2e7d32] focus:border-[#2e7d32] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50"
                    placeholder="e.g. 100000000"
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </div>

                <div className="mt-2.5 p-3 rounded-xl flex items-center justify-between text-[11px] font-bold shadow-sm transition-all duration-300 bg-slate-50/50 border border-slate-100">
                  <span className="text-slate-500 font-semibold">Bậc ký duyệt tự động:</span>
                  <div className={`px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wide text-[10px] ${liveTier.className}`}>
                    <span className="material-symbols-outlined text-xs align-middle">{liveTier.icon}</span>
                    {liveTier.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Telegram liên hệ</label>
                  <input
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50"
                    placeholder="Ví dụ: @techglobal"
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Hotline / Zalo *</label>
                  <input
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50"
                    placeholder="Ví dụ: 0912345678"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Ảnh logo thương nhân URL (Tuyển Chọn)</label>
                <input
                  className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50"
                  placeholder="https://images.unsplash.com/photo-..."
                  type="text"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">Giới thiệu ngắn & năng lực giao dịch *</label>
                <textarea
                  className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none resize-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-50 text-slate-800"
                  placeholder="Mô tả các sản phẩm kinh doanh chính và cam kết bảo hành..."
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white text-xs py-3.5 rounded-xl mt-4 transition-all duration-300 font-extrabold uppercase tracking-widest shadow-md cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Ký duyệt cấp bảo hộ uy tín
              </button>
            </form>
          </div>
        </section>

        {/* Verified Businesses Dashboard List (7/12 width) */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl text-[#2e7d32] fill-1">verified_user</span>
                Cơ sở thương nhân ký quỹ vận hành
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Danh sách các hồ sơ an toàn đã đóng gói quỹ bảo hộ rủi ro giao dịch.</p>
            </div>

            <div className="flex-1">
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
        </section>

      </div>
    </div>
  );
}
