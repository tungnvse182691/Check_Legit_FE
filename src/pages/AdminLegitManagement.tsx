import React, { useState } from "react";
import { useApp } from "../context/AppContext";

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

  // Realtime tier detection for UX
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
        className: "bg-slate-50 text-slate-705 border border-slate-300 text-slate-700",
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg("");
    setSuccessNotif("");

    if (!name.trim()) {
      setAlertMsg("Vui lòng nhập tên thương hiệu / tiểu thương.");
      return;
    }

    if (!desc.trim()) {
      setAlertMsg("Vui lòng bổ sung phần mô tả tóm tắt năng lực kinh doanh.");
      return;
    }

    if (isNaN(insuranceValue) || insuranceValue <= 0) {
      setAlertMsg("Số tiền ký quỹ quỹ bảo hiểm phải là số dương hợp lệ.");
      return;
    }

    // Default high-quality placeholder image if none is provided
    const defaultPlaceholder = "https://lh3.googleusercontent.com/aida-public/AB6AXuDKJ968Ro0Hzvi8zHp06GmLG63LozZe4NRvKhYCn5yYkPBsnsqfkGxNSYIVzs4lS-POI9dJ6jAkQf6sD-vfdHIDtRjTZt5qxga6QElHZZi8hh14MMbRsMjcPQ6I8mJBxflquF_-Day2hvABActcMHynjkDfrGLqrV2kTspaYVY23YkiaipC_0TeFQOxHxl9LM4TE-dbgwMegvZlElmVN3pqZPFObemSNzfEp9wu0_tgVPRuCXFTUY4UCprdbpksNSqX8bEQ7xrBNGdH";
    const finalImg = imgUrl.trim() || defaultPlaceholder;

    addLegitProfile({
      name: name.trim(),
      role: role.trim(),
      desc: desc.trim(),
      insurance: insuranceValue,
      score: 100,
      successTrans: 1,
      telegram: telegram.trim() ? (telegram.startsWith("@") ? telegram.trim() : `@${telegram.trim()}`) : "@verified_merchant",
      phone: phone.trim() || "09x xxx xxxx",
      img: finalImg,
      joinDate: new Date().toLocaleDateString("vi-VN").substring(3),
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

  const handleDelete = (id: string | number, merchantName: string) => {
    if (confirm(`Bạn có chắc chắn muốn THU HỒI hồ sơ & GỠ BỎ mọi chứng nhận uy tín của tiểu thương: "${merchantName}" khỏi hệ thống?`)) {
      deleteLegitProfile(id);
      setSuccessNotif(`Đã gỡ bỏ chứng chỉ ký quỹ của "${merchantName}".`);
    }
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <header className="bg-white border-b border-outline-variant px-6 py-6 md:px-margin-desktop sticky top-0 z-10 shadow-sm shrink-0">
        <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      <div className="max-w-[1300px] mx-auto w-full px-6 md:px-margin-desktop py-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Creation Form Column (5/12 width) */}
        <section className="col-span-12 lg:col-span-5">
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
              <div className="p-4 bg-emerald-54 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2.5">
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

                {/* Real-time calculated Tier badge info preview for UX! */}
                <div className="mt-2.5 p-3 rounded-xl flex items-center justify-between text-[11px] font-bold shadow-sm transition-all duration-300 bg-slate-50/50 border border-slate-100">
                  <span className="text-slate-650 text-slate-500 font-semibold">Bậc ký duyệt tự động:</span>
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
                    onChange={(e) => setPhone(e.target.value)}
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
        <section className="col-span-12 lg:col-span-7">
          <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm animate-fade-in flex flex-col h-full">
            <div className="p-6 border-b border-outline-variant bg-slate-50/50">
              <h3 className="text-base font-black text-on-surface uppercase tracking-tight flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl text-[#2e7d32] fill-1">verified_user</span>
                Cơ sở thương nhân ký quỹ vận hành
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Danh sách các hồ sơ an toàn đã đóng gói quỹ bảo hộ rủi ro giao dịch của bạn.</p>
            </div>
            
            <div className="overflow-x-auto text-xs flex-1">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-outline-variant uppercase font-bold text-[10px] tracking-widest opacity-80 whitespace-nowrap">
                    <th className="px-6 py-4 whitespace-nowrap">Nhãn thương nhân</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">Xếp hạng bảo chứng</th>
                    <th className="px-6 py-4 text-right whitespace-nowrap">Phí gửi quỹ</th>
                    <th className="px-6 py-4 text-right pr-6 whitespace-nowrap">Tuỳ chọn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {legitList.map((item) => {
                    const profileTier = getLiveTier(item.insurance);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-extrabold text-[13px] text-slate-900 leading-tight whitespace-nowrap">{item.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">{item.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide whitespace-nowrap ${profileTier.className}`}>
                            <span className="material-symbols-outlined text-[10px] align-middle">{profileTier.icon}</span>
                            {profileTier.label.split(" (")[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-black text-slate-700 whitespace-nowrap">
                          {item.insurance.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-6 py-4 text-right pr-6 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer whitespace-nowrap"
                          >
                            Thu hồi
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
