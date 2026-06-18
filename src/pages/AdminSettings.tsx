import React, { useState } from "react";
import { useApp } from "../context/AppContext";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  slug: string;
  status: "Đã đăng" | "Bản nháp";
}

interface PolicyArticle {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  active: boolean;
}

export function AdminSettings() {
  const [requireEvidence, setRequireEvidence] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [minInsurance, setMinInsurance] = useState("10000000");
  const [adminName, setAdminName] = useState("Ban điều hành Check Zone Việt Nam");
  const [adminEmail, setAdminEmail] = useState("support@checkzone.vn");
  const [botToken, setBotToken] = useState("5394883:AAEeB8hFm3z...");
  const [isSaved, setIsSaved] = useState(false);

  // Active Tab for Settings Sub-Modules
  const [activeTab, setActiveTab] = useState<"general" | "blog" | "policy">("general");

  // CMS: Interactive list for Blog/SEO warning articles
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([
    { id: "ART-01", title: "Cảnh báo khẩn cấp chiêu trò giả mạo shipper gọi điện nhận hàng", category: "Cảnh báo phổ thông", date: "16 thg 6, 2026", slug: "canh-bao-gia-mao-shipper-giao-hang", status: "Đã đăng" },
    { id: "ART-02", title: "Nhận biết sàn đầu tư phái sinh lừa đảo cam kết lãi 300%", category: "Đầu tư ảo", date: "12 thg 6, 2026", slug: "dau-tu-singapore-lua-dao-moi", status: "Đã đăng" },
    { id: "ART-03", title: "An toàn giao dịch trung gian khi mua bán tài khoản MMO trên Facebook", category: "Thủ thuật", date: "08 thg 6, 2026", slug: "huong-dan-trung-gian-truc-tuyen", status: "Bản nháp" },
  ]);

  // CMS: Blog Form States
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Cảnh báo phổ thông");
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const [blogNotif, setBlogNotif] = useState("");

  // CMS: Interactive list for policies/terms
  const [policies, setPolicies] = useState<PolicyArticle[]>([
    { id: "POL-01", name: "Quy tắc kiểm duyệt bằng chứng nộp tố cáo", type: "Thẩm định", lastUpdated: "15 thg 6, 2026", active: true },
    { id: "POL-02", name: "Điều khoản bồi hoàn quỹ ký quỹ tiểu thương", type: "Giao dịch", lastUpdated: "10 thg 6, 2026", active: true },
    { id: "POL-03", name: "Chính sách bảo mật danh tính nguồn tố giác", type: "Bảo mật", lastUpdated: "02 thg 6, 2026", active: true },
  ]);

  // CMS: Policy Form states
  const [newPolName, setNewPolName] = useState("");
  const [newPolType, setNewPolType] = useState("Thẩm định");
  const [policyNotif, setPolicyNotif] = useState("");

  // Local storage reset handler
  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ hệ thống Check Zone về ban đầu? Mọi tài khoản, tố cáo mới tự tạo sẽ bị gỡ bỏ để phục hồi dữ liệu mẫu gốc.")) {
      localStorage.removeItem("check_legit_scams");
      localStorage.removeItem("check_legit_legit");
      alert("Đã xóa bộ nhớ đệm thành công! Hệ thống sẽ reload tự động.");
      window.location.reload();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Blog creation action
  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) {
      alert("Vui lòng bổ sung tiêu đề bài viết.");
      return;
    }
    const slug = newBlogSlug.trim() || newBlogTitle.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const newArt: BlogArticle = {
      id: `ART-${Math.floor(10 + Math.random() * 90)}`,
      title: newBlogTitle,
      category: newBlogCategory,
      date: new Date().toLocaleDateString("vi-VN"),
      slug: slug,
      status: "Đã đăng",
    };
    setBlogArticles([newArt, ...blogArticles]);
    setNewBlogTitle("");
    setNewBlogSlug("");
    setBlogNotif(`Đã xuất bản thành công bài viết Tin tức/SEO: "${newArt.title}"`);
    setTimeout(() => setBlogNotif(""), 3500);
  };

  // Policy creation action
  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolName.trim()) {
      alert("Vui lòng điền tên điều khoản.");
      return;
    }
    const newPol: PolicyArticle = {
      id: `POL-${Math.floor(10 + Math.random() * 90)}`,
      name: newPolName,
      type: newPolType,
      lastUpdated: new Date().toLocaleDateString("vi-VN"),
      active: true,
    };
    setPolicies([newPol, ...policies]);
    setNewPolName("");
    setPolicyNotif(`Đã cập nhật chính sách hệ thống mới: "${newPol.name}"`);
    setTimeout(() => setPolicyNotif(""), 3500);
  };

  const handleTogglePolicy = (id: string) => {
    setPolicies(policies.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      {/* Page Header */}
      <header className="bg-white border-b border-outline-variant px-6 py-6 md:px-margin-desktop sticky top-0 z-10 shadow-sm shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#2e7d32] text-xs font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3.5 py-1 rounded-full inline-block mb-1.5">
              Bảng điều khiển máy chủ
            </span>
            <h1 className="text-2xl md:text-3.5xl font-black text-on-surface tracking-tight">
              Cài đặt & Quản lý CMS
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant font-mono font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 uppercase self-start sm:self-auto">
            v1.4.0 • Live production
          </p>
        </div>
      </header>

      {/* Settings Navigation Tabs */}
      <div className="bg-white border-b border-outline-variant px-6 md:px-margin-desktop shrink-0">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-4 px-2 font-bold text-xs uppercase tracking-wider relative cursor-pointer flex items-center gap-1.5 transition-all text-stone-700 ${
              activeTab === "general" ? "text-[#2e7d32] font-black border-b-4 border-b-[#2e7d32]" : "hover:text-[#2e7d32]"
            }`}
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Cấu hình hệ thống
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`py-4 px-2 font-bold text-xs uppercase tracking-wider relative cursor-pointer flex items-center gap-1.5 transition-all text-stone-700 ${
              activeTab === "blog" ? "text-[#2e7d32] font-black border-b-4 border-b-[#2e7d32]" : "hover:text-[#2e7d32]"
            }`}
          >
            <span className="material-symbols-outlined text-base">newspaper</span>
            Bài viết & Tin tức SEO
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`py-4 px-2 font-bold text-xs uppercase tracking-wider relative cursor-pointer flex items-center gap-1.5 transition-all text-stone-700 ${
              activeTab === "policy" ? "text-[#2e7d32] font-black border-b-4 border-b-[#2e7d32]" : "hover:text-[#2e7d32]"
            }`}
          >
            <span className="material-symbols-outlined text-base">policy</span>
            Quản lý Chính sách
          </button>
        </div>
      </div>

      {/* Main Settings Content Form/CMS Panels */}
      <div className="max-w-4xl mx-auto w-full px-6 md:px-margin-desktop py-8 flex-1 space-y-6">
        
        {/* TAB 1: General configuration and system info */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fade-in">
            {isSaved && (
              <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-950 p-4 rounded-2xl flex items-center gap-3 animate-pulse shadow-sm text-xs sm:text-sm font-bold">
                <span className="material-symbols-outlined text-[#2e7d32] font-bold">check_circle</span>
                Cập nhật các thống số cấu hình máy chủ Check Zone thành công!
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6 text-sm">
              
              {/* Box 1: Moderation controls */}
              <div className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                <h3 className="font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">security</span>
                  Cơ chế kiểm soát bài nộp
                </h3>

                <div className="flex items-center justify-between py-1.5">
                  <div className="max-w-[80%]">
                    <p className="font-extrabold text-on-surface text-sm sm:text-base">Yêu cầu hình ảnh bằng chứng số buộc phải tải kèm</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Không cho phép nộp đơn tố cáo nếu không gắn hóa đơn ngân hàng hoặc biên lai chat chứng minh hành vi lừa đảo.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireEvidence}
                      onChange={(e) => setRequireEvidence(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2e7d32]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-slate-100/80">
                  <div className="max-w-[80%]">
                    <p className="font-extrabold text-on-surface text-sm sm:text-base">Tự động xuất bản tố cáo khi nộp thành công</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Cho phép ghi nhận trực tiếp vào cơ sở dữ liệu tra cứu cộng đồng mà không cần Mod duyệt hậu kiểm trước.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={(e) => setAutoApprove(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2e7d32]"></div>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100/80">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Giới hạn tối thiểu ký quỹ thương nhân (VNĐ)</label>
                  <input
                    type="number"
                    className="w-full sm:w-1/2 border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none font-mono font-bold"
                    value={minInsurance}
                    onChange={(e) => setMinInsurance(e.target.value)}
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1.5">Tiền ký quỹ đóng băng thấp nhất nhằm tránh hiện tượng hồ sơ rác trong danh sách uy tín.</p>
                </div>
              </div>

              {/* Box 2: Administrative info */}
              <div className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">contact_mail</span>
                  Thông tin cơ quan liên lạc chính chủ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tên cơ quan / Ban điều hành</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none font-extrabold"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Hộp thư hỗ trợ giải đáp khiếu nại</label>
                    <input
                      type="email"
                      className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none font-mono font-bold"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Telegram bot integration */}
              <div className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">robot_2</span>
                  Liên thông ứng dụng (Telegram Webhook Bot)
                </h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Telegram Bot API Token</label>
                  <input
                    type="password"
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none font-mono"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1.5">
                    Hỗ trợ đẩy thông báo ngay lập tức về nhóm chat chung hoặc kênh cảnh báo an ninh nội bộ khi có báo cáo lừa đảo mới từ Check Zone.
                  </p>
                </div>
              </div>

              {/* Box 4: Danger Zone */}
              <div className="bg-red-50/40 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-black text-red-650 text-xs uppercase tracking-widest text-red-650">Vùng hệ thống nhạy cảm</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-medium text-slate-600">Xoá toàn bộ cấu hình, hoàn tác trạng thái cơ sở dữ liệu về mặc định ban sơ.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-5 py-3 bg-white hover:bg-red-50 border border-red-300 hover:border-red-400 text-red-600 hover:text-red-700 font-extrabold rounded-xl text-xs cursor-pointer uppercase transition-all shadow-sm active:scale-95 shrink-0"
                >
                  Xoá bộ nhớ đệm mẫu
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#2e7d32] hover:bg-[#205c22] text-white font-black px-8 py-4 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  Ghi nhận cấu hình máy chủ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SEO and Blog warn list CMS */}
        {activeTab === "blog" && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            {blogNotif && (
              <div className="bg-emerald-50 border border-[#2e7d32]/30 text-emerald-950 p-4 rounded-xl flex items-center gap-2.5 font-bold">
                <span className="material-symbols-outlined text-[#2e7d32]">check_circle</span>
                <span>{blogNotif}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Content Form Creator (5/12) */}
              <div className="md:col-span-5 bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 h-fit">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5 border-b pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">post_add</span>
                  Soạn tin cảnh bạo mới
                </h3>

                <form onSubmit={handleCreateBlog} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 text-slate-600 mb-1">Tiêu đề bài viết SEO *</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                      placeholder="e.g. Cảnh báo hình thức scam thẻ nạp"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 text-slate-600 mb-1">Thể loại bài viết</label>
                    <select
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none bg-white text-slate-800"
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                    >
                      <option value="Cảnh báo phổ thông">Cảnh báo phổ thông</option>
                      <option value="Đầu tư ảo">Đầu tư ảo</option>
                      <option value="Thủ thuật bảo mật">Thủ thuật bảo mật</option>
                      <option value="Cẩm nang an toàn">Cẩm nang an toàn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 text-slate-600 mb-1">Đường dẫn thân thiện (Slug)</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none font-mono"
                      placeholder="e.g. canh-bao-luong-thuong-gia"
                      value={newBlogSlug}
                      onChange={(e) => setNewBlogSlug(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white font-extrabold text-[11px] uppercase py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Đăng tin SEO & Công bố
                  </button>
                </form>
              </div>

              {/* Content List Table (7/12) */}
              <div className="md:col-span-7 bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 border-b bg-slate-50/50">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">Kho lưu trữ bài viết & Cảnh bạo</h4>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-outline-variant text-[10px] uppercase font-bold text-slate-600 opacity-75">
                        <th className="p-4">Bài viết</th>
                        <th className="p-4 text-center">Trạng thái</th>
                        <th className="p-4 text-right">Khởi tạo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {blogArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-800 line-clamp-2 leading-tight">{art.title}</p>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block capitalize">{art.category}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                              art.status === "Đã đăng" ? "bg-emerald-50 text-[#2e7d32] border-emerald-200" : "bg-slate-100 text-slate-650 border-slate-3 * border-slate-200"
                            }`}>
                              {art.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-400 text-[10px]">
                            {art.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Policy CMS Management */}
        {activeTab === "policy" && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            {policyNotif && (
              <div className="bg-emerald-50 border border-[#2e7d32]/30 text-emerald-950 p-4 rounded-xl flex items-center gap-2.5 font-bold">
                <span className="material-symbols-outlined text-[#2e7d32]">check_circle</span>
                <span>{policyNotif}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Form: New policy section (5/12) */}
              <div className="md:col-span-5 bg-white border border-outline-variant p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 h-fit">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5 border-b pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">shield</span>
                  Tạo văn bản pháp lý mới
                </h3>

                <form onSubmit={handleCreatePolicy} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 text-slate-600 mb-1">Tên văn bản chính sách *</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                      placeholder="e.g. Cơ chế giải quyết hoàn trả"
                      value={newPolName}
                      onChange={(e) => setNewPolName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-650 text-slate-600 mb-1">Danh mục chính sách</label>
                    <select
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none bg-white text-slate-800"
                      value={newPolType}
                      onChange={(e) => setNewPolType(e.target.value)}
                    >
                      <option value="Thẩm định">Thẩm định</option>
                      <option value="Giao dịch">Giao dịch</option>
                      <option value="Bảo mật">Bảo mật</option>
                      <option value="Khiếu nại">Khiếu nại</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white font-extrabold text-[11px] uppercase py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Đưa vào văn bản pháp lý
                  </button>
                </form>
              </div>

              {/* Right List: Active policies lists (7/12) */}
              <div className="md:col-span-7 bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 border-b bg-slate-50/50">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">Điều khoản hệ thống hoạt động</h4>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-outline-variant text-[10px] uppercase font-bold text-slate-600 opacity-75">
                        <th className="p-4">Chính sách</th>
                        <th className="p-4 text-center">Áp dụng</th>
                        <th className="p-4 text-right">Ngày cập nhật</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {policies.map((pol) => (
                        <tr key={pol.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-800 leading-tight">{pol.name}</p>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">{pol.type}</span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePolicy(pol.id)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                pol.active ? "bg-emerald-50 text-[#2e7d32] border-emerald-250 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {pol.active ? "ON" : "OFF"}
                            </button>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-400 text-[10px]">
                            {pol.lastUpdated}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
