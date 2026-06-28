import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useApp } from "../context/AppContext";

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { addScamReport, addLegitProfile, logout } = useApp();

  // Modal display states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"scam" | "legit">("scam");

  // Scam Form States
  const [scamName, setScamName] = useState("");
  const [scamPhone, setScamPhone] = useState("");
  const [scamBank, setScamBank] = useState("");
  const [scamAccount, setScamAccount] = useState("");
  const [scamDesc, setScamDesc] = useState("");
  const [scamType, setScamType] = useState("Mua bán online");
  const [scamAmount, setScamAmount] = useState("");
  const [scamVictim, setScamVictim] = useState("Ẩn danh");
  const [scamFb, setScamFb] = useState("");

  // Legit Form States
  const [legitName, setLegitName] = useState("");
  const [legitRole, setLegitRole] = useState("Thương mại điện tử");
  const [legitInsurance, setLegitInsurance] = useState("50000000");
  const [legitDesc, setLegitDesc] = useState("");
  const [legitTelegram, setLegitTelegram] = useState("");
  const [legitPhone, setLegitPhone] = useState("");

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));
    return isActive 
      ? "bg-emerald-50 text-[#2e7d32] font-black rounded-xl flex items-center gap-4 px-4 py-3 transition-all border-l-4 border-l-[#2e7d32]"
      : "text-slate-600 hover:text-[#2e7d32] flex items-center gap-4 px-4 py-3 transition-all rounded-xl hover:bg-slate-50";
  };

  const handleScamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scamName.trim()) {
      alert("Vui lòng nhập họ tên đối tượng bị tố cáo.");
      return;
    }
    if (!scamAccount.trim()) {
      alert("Vui lòng nhập số tài khoản ngân hàng gian lận.");
      return;
    }
    if (!scamDesc.trim()) {
      alert("Vui lòng nhập mô tả hành vi lừa đảo.");
      return;
    }

    addScamReport({
      name: scamName.trim().toUpperCase(),
      phone: scamPhone.trim(),
      bankName: scamBank.trim() || "Vietcombank",
      accountNumber: scamAccount.trim(),
      desc: scamDesc.trim(),
      type: scamType,
      amount: scamAmount ? Number(scamAmount) : 0,
      victim: scamVictim.trim() || "Ẩn danh",
      facebook: scamFb.trim(),
      images: []
    });

    // Reset states
    setScamName("");
    setScamPhone("");
    setScamBank("");
    setScamAccount("");
    setScamDesc("");
    setScamAmount("");
    setScamFb("");
    setIsModalOpen(false);
    alert("Đã tạo hồ sơ tố cáo thành công ở trạng thái chờ kiểm duyệt!");
  };

  const handleLegitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legitName.trim()) {
      alert("Vui lòng nhập tên thương hiệu / tiểu thương uy tín.");
      return;
    }
    if (!legitDesc.trim()) {
      alert("Vui lòng nhập mô tả tóm tắt hoạt động.");
      return;
    }

    const val = Number(legitInsurance);
    if (isNaN(val) || val <= 0) {
      alert("Số tiền quỹ bảo hiểm ký quỹ phải là chữ số và lớn hơn 0.");
      return;
    }

    addLegitProfile({
      name: legitName.trim(),
      role: legitRole + " đã xác minh",
      desc: legitDesc.trim(),
      insurance: val,
      telegram: legitTelegram.trim() || "@verified_merchant",
      phone: legitPhone.trim() || "09x xxx xxxx",
      businessType: legitRole
    });

    // Reset states
    setLegitName("");
    setLegitDesc("");
    setLegitTelegram("");
    setLegitPhone("");
    setLegitInsurance("50000000");
    setIsModalOpen(false);
    alert("Đã cấp duyệt và phát hành hồ sơ uy tín thành công!");
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 selection:bg-[#2e7d32] selection:text-white overflow-hidden h-screen flex font-sans">
      {/* SideNavBar Component */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-white border-r border-outline-variant py-8 shadow-sm shrink-0">
        <div className="px-6 mb-10">
          <Link to="/admin">
            <h1 className="text-2xl font-black text-[#2e7d32] tracking-tight uppercase">CHECK ZONE</h1>
            <p className="text-slate-550 text-slate-500 text-xs mt-1">Hệ thống quản trị và kiểm duyệt</p>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1.5">
          <Link to="/admin" className={navItemClass("/admin")}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-xs font-bold uppercase tracking-wider">Tổng quan</span>
          </Link>
          <Link to="/admin/scams" className={navItemClass("/admin/scams")}>
            <span className="material-symbols-outlined">gpp_bad</span>
            <span className="text-xs font-bold uppercase tracking-wider">Quản lý tố cáo</span>
          </Link>
          <Link to="/admin/legit" className={navItemClass("/admin/legit")}>
            <span className="material-symbols-outlined">verified_user</span>
            <span className="text-xs font-bold uppercase tracking-wider">Quản lý uy tín</span>
          </Link>
        </nav>
        <div className="px-4 mt-auto space-y-1.5">
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white text-xs font-extrabold uppercase tracking-wide py-3.5 rounded-xl transition-all duration-300 mb-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Thêm mới
          </button>
          <Link to="/admin/settings" className={navItemClass("/admin/settings")}>
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs font-bold uppercase tracking-wider">Cài đặt</span>
          </Link>
          <Link to="/" onClick={logout} className="text-slate-600 hover:text-[#2e7d32] flex items-center gap-4 px-4 py-3 transition-all rounded-xl hover:bg-slate-50">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-xs font-bold uppercase tracking-wider">Đăng xuất / Quay lại</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50 relative text-slate-800">
        {children}
      </main>

      {/* Mobile Navigation (Responsive Pivot) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant px-4 py-3 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] text-xs font-semibold">
        <Link to="/admin" className={`flex flex-col items-center gap-1 ${location.pathname === '/admin' ? 'text-[#2e7d32]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[9px] uppercase font-bold">Tổng quan</span>
        </Link>
        <Link to="/admin/scams" className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/scams' ? 'text-[#2e7d32]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">gpp_bad</span>
          <span className="text-[9px] uppercase font-bold">Tố cáo</span>
        </Link>
        <Link to="/admin/legit" className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/legit' ? 'text-[#2e7d32]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-[9px] uppercase font-bold">Uy tín</span>
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[#2e7d32] animate-pulse"
        >
          <span className="material-symbols-outlined font-bold">add_circle</span>
          <span className="text-[9px] uppercase font-extrabold text-[#2e7d32]">Thêm mới</span>
        </button>
        <Link to="/admin/settings" className={`flex flex-col items-center gap-1 ${location.pathname === '/admin/settings' ? 'text-[#2e7d32]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[9px] uppercase font-bold">Cài đặt</span>
        </Link>
      </nav>

      {/* Quick Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] text-slate-800 font-sans">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-fade-in text-slate-900 border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Tạo dữ liệu quản lý mới</h3>
                <p className="text-xs text-slate-500">Khởi tạo nhanh bản ghi cảnh giác & uy tín.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Quick Switch Switcher Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5">
              <button 
                type="button"
                onClick={() => setActiveTab("scam")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'scam' ? 'bg-red-650 bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                🚨 Tố cáo lừa đảo mới
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("legit")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'legit' ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                🛡️ Tiểu thương uy tín mới
              </button>
            </div>

            {/* Form Container */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4 max-h-[60vh] text-xs">
              {activeTab === "scam" ? (
                <form id="quick-scam-form" onSubmit={handleScamSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ tên đối tượng lừa đảo *</label>
                    <input 
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                      placeholder="Ví dụ: NGUYEN VAN GIU"
                      value={scamName}
                      onChange={(e) => setScamName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 font-mono">Tên Ngân hàng</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                        placeholder="Ví dụ: Vietcombank, Momo..."
                        value={scamBank}
                        onChange={(e) => setScamBank(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 font-mono">Số tài khoản *</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none font-bold"
                        placeholder="Số thẻ / Số tài khoản"
                        value={scamAccount}
                        onChange={(e) => setScamAccount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                        placeholder="09xx..."
                        value={scamPhone}
                        onChange={(e) => setScamPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                        placeholder="https://facebook.com/..."
                        value={scamFb}
                        onChange={(e) => setScamFb(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mức thiệt hại (VNĐ)</label>
                      <input 
                        type="number"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none font-mono"
                        placeholder="Nhập số tiền ước tính"
                        value={scamAmount}
                        onChange={(e) => setScamAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Loại hình lừa đảo</label>
                      <select 
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none bg-white"
                        value={scamType}
                        onChange={(e) => setScamType(e.target.value)}
                      >
                        <option value="Mua bán online">Mua bán online</option>
                        <option value="Đầu tư tài chính">Đầu tư ảo / Nhận hoa hồng</option>
                        <option value="Giả danh cơ quan nhà nước">Giả danh nhà nước / Công an</option>
                        <option value="Tuyển cộng tác viên">Tuyển cộng tác viên làm việc nhẹ</option>
                        <option value="Khác">Lừa đảo hình thức khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mô tả hành vi cụ thể *</label>
                    <textarea 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none resize-none"
                      placeholder="Nêu rõ thủ đoạn, thời gian và bằng chứng giao dịch..."
                      rows={3}
                      value={scamDesc}
                      onChange={(e) => setScamDesc(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Biệt danh nạn nhân tố cáo (Ẩn danh)</label>
                    <input 
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-red-600 outline-none"
                      placeholder="Nếu muốn ẩn danh hãy để trống"
                      value={scamVictim}
                      onChange={(e) => setScamVictim(e.target.value)}
                    />
                  </div>
                </form>
              ) : (
                <form id="quick-legit-form" onSubmit={handleLegitSubmit} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tên thương hiệu / Người bán uy tín *</label>
                    <input 
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                      placeholder="Ví dụ: Tech Global Store"
                      value={legitName}
                      onChange={(e) => setLegitName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lĩnh vực hoạt động</label>
                    <select 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none bg-white"
                      value={legitRole}
                      onChange={(e) => setLegitRole(e.target.value)}
                    >
                      <option value="Thương mại điện tử">Thương mại điện tử & Order</option>
                      <option value="Công nghệ & Đồ điện tử">Công nghệ & Đồ điện tử</option>
                      <option value="Freelancer & Sáng tạo">Freelancer & Sáng tạo nội dung</option>
                      <option value="Dịch vụ & Tư vấn chuyên nghiệp">Dịch vụ & Tư vấn chuyên nghiệp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2e7d32] mb-1">Quỹ nộp bảo lãnh bảo hiểm (VNĐ)</label>
                    <input 
                      type="number"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none font-bold"
                      placeholder="Ví dụ: 50000000"
                      value={legitInsurance}
                      onChange={(e) => setLegitInsurance(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Liên hệ Telegram</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                        placeholder="Ví dụ: @merchant_official"
                        value={legitTelegram}
                        onChange={(e) => setLegitTelegram(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Zalo / SĐT liên hệ</label>
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none"
                        placeholder="Ví dụ: 0901234567"
                        value={legitPhone}
                        onChange={(e) => setLegitPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn hoạt động *</label>
                    <textarea 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2e7d32] outline-none resize-none"
                      placeholder="Tóm tắt về dịch vụ và cam kết bảo hành của cửa hàng..."
                      rows={3}
                      value={legitDesc}
                      onChange={(e) => setLegitDesc(e.target.value)}
                      required
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors font-semibold"
              >
                Hủy bỏ
              </button>
              {activeTab === "scam" ? (
                <button 
                  type="submit"
                  form="quick-scam-form"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold uppercase tracking-wide cursor-pointer text-xs"
                >
                  Tạo tố cáo lừa đảo
                </button>
              ) : (
                <button 
                  type="submit"
                  form="quick-legit-form"
                  className="px-6 py-2 bg-[#2e7d32] hover:bg-[#205c22] text-white rounded-lg transition-colors font-bold uppercase tracking-wide cursor-pointer text-xs"
                >
                  Cấp duyệt hồ sơ uy tín
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
