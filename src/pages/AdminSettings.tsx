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
  const { systemSettings, fetchSystemSettings, updateSystemSettings, blogs, addBlogArticle, updateBlogArticle, deleteBlogArticle, fetchBlogs } = useApp();

  const [requireEvidence, setRequireEvidence] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [minInsurance, setMinInsurance] = useState("10000000");
  const [adminName, setAdminName] = useState("Ban điều hành Check Zone Việt Nam");
  const [adminEmail, setAdminEmail] = useState("support@checkzone.vn");
  const [botToken, setBotToken] = useState("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    fetchSystemSettings();
    fetchBlogs();
  }, []);

  React.useEffect(() => {
    if (systemSettings) {
      setRequireEvidence(systemSettings.requireEvidence);
      setAutoApprove(systemSettings.autoApprove);
      setMinInsurance(systemSettings.minInsurance.toString());
      setAdminName(systemSettings.adminName);
      setAdminEmail(systemSettings.adminEmail);
      setBotToken(systemSettings.telegramBotToken || "");
      setDiscordWebhookUrl(systemSettings.discordWebhookUrl || "");
    }
  }, [systemSettings]);

  // Active Tab for Settings Sub-Modules
  const [activeTab, setActiveTab] = useState<"general" | "blog" | "policy">("general");

  // CMS: Blog Form States
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Cảnh báo khẩn cấp");
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogThumbnail, setNewBlogThumbnail] = useState("");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [blogNotif, setBlogNotif] = useState("");

  const thumbnailFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chỉ chọn định dạng hình ảnh (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng file tối đa là 5MB.");
      return;
    }

    setIsUploadingThumbnail(true);
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
        setNewBlogThumbnail(data.data.url);
      } else {
        alert("Không thể tải ảnh lên ImgBB. Vui lòng kiểm tra lại kết nối.");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Lỗi khi tải ảnh lên ImgBB.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // Blog creation / update action
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) {
      alert("Vui lòng bổ sung tiêu đề bài viết.");
      return;
    }
    const slug = newBlogSlug.trim() || newBlogTitle.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    if (editingBlogId) {
      const success = await updateBlogArticle(editingBlogId, {
        title: newBlogTitle,
        category: newBlogCategory,
        slug,
        status: "Đã đăng",
        content: newBlogContent,
        thumbnail: newBlogThumbnail
      });
      if (success) {
        setBlogNotif(`Đã cập nhật bài viết: "${newBlogTitle}" thành công!`);
        resetBlogForm();
      } else {
        alert("Cập nhật bài viết thất bại.");
      }
    } else {
      const success = await addBlogArticle({
        title: newBlogTitle,
        category: newBlogCategory,
        slug,
        status: "Đã đăng",
        content: newBlogContent,
        thumbnail: newBlogThumbnail
      });
      if (success) {
        setBlogNotif(`Đã xuất bản bài viết SEO: "${newBlogTitle}" thành công!`);
        resetBlogForm();
      } else {
        alert("Tạo bài viết mới thất bại.");
      }
    }
    setTimeout(() => setBlogNotif(""), 3500);
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setNewBlogTitle("");
    setNewBlogCategory("Cảnh báo khẩn cấp");
    setNewBlogSlug("");
    setNewBlogContent("");
    setNewBlogThumbnail("");
  };

  const handleEditBlog = (art: any) => {
    setEditingBlogId(art.id);
    setNewBlogTitle(art.title);
    setNewBlogCategory(art.category);
    setNewBlogSlug(art.slug);
    setNewBlogContent(art.content || "");
    setNewBlogThumbnail(art.thumbnail || "");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      const success = await deleteBlogArticle(id);
      if (success) {
        setBlogNotif(`Đã xóa thành công bài viết.`);
        setTimeout(() => setBlogNotif(""), 3500);
      } else {
        alert("Xóa bài viết thất bại.");
      }
    }
  };

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

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSystemSettings({
      requireEvidence,
      autoApprove,
      minInsurance: parseFloat(minInsurance),
      adminName,
      adminEmail,
      telegramBotToken: botToken || null,
      discordWebhookUrl: discordWebhookUrl || null
    });
    if (success) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
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
      lastUpdated: new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
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

              {/* Box 3: Discord Webhook integration */}
              <div className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-xl text-[#2e7d32]">webhook</span>
                  Discord Webhook (Thông báo đơn tố cáo mới)
                </h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Discord Webhook URL</label>
                  <input
                    type="password"
                    className="w-full border-2 border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-[#2e7d32] outline-none font-mono"
                    value={discordWebhookUrl}
                    onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1.5">
                    Hỗ trợ đẩy thông báo dạng nhúng (embed) đẹp mắt ngay lập tức về kênh Discord khi có đơn tố cáo lừa đảo mới được tạo thành công trên hệ thống.
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
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xl text-[#2e7d32]">post_add</span>
                    {editingBlogId ? "Hiệu chỉnh bài viết" : "Soạn tin cảnh báo mới"}
                  </h3>
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Hủy sửa
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveBlog} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Tiêu đề bài viết SEO *</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                      placeholder="e.g. Cảnh báo hình thức scam shipper gọi điện"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Thể loại bài viết</label>
                    <select
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none bg-white text-slate-800"
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                    >
                      <option value="Cảnh báo khẩn cấp">Cảnh báo khẩn cấp (Badge Đỏ)</option>
                      <option value="HƯỚNG DẪN & THỦ THUẬT">HƯỚNG DẪN & THỦ THUẬT (Badge Xanh)</option>
                      <option value="Cảnh báo tài chính">Cảnh báo tài chính (Badge Cam)</option>
                      <option value="Cảnh báo phổ thông">Cảnh báo phổ thông</option>
                    </select>
                  </div>

                  {/* Thumbnail Input (File Upload via ImgBB OR URL string input) */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Ảnh đại diện (Thumbnail)</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                          placeholder="Dán URL ảnh hoặc tải từ máy..."
                          value={newBlogThumbnail}
                          onChange={(e) => setNewBlogThumbnail(e.target.value)}
                        />
                        <input
                          type="file"
                          ref={thumbnailFileInputRef}
                          onChange={handleThumbnailFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => thumbnailFileInputRef.current?.click()}
                          disabled={isUploadingThumbnail}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">cloud_upload</span>
                          <span>{isUploadingThumbnail ? "Đang tải..." : "Tải ảnh"}</span>
                        </button>
                      </div>

                      {/* Thumbnail Preview */}
                      {newBlogThumbnail && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mt-2">
                          <img
                            src={newBlogThumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Đường dẫn thân thiện (Slug)</label>
                    <input
                      type="text"
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none font-mono"
                      placeholder="Tự động tạo từ tiêu đề nếu để trống"
                      value={newBlogSlug}
                      onChange={(e) => setNewBlogSlug(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Nội dung tóm tắt / Chi tiết</label>
                    <textarea
                      rows={4}
                      className="w-full border-2 border-outline-variant rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                      placeholder="Nhập nội dung ngắn mô tả chi tiết bài viết..."
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2e7d32] hover:bg-[#205c22] text-white font-extrabold text-[11px] uppercase py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    {editingBlogId ? "Lưu thay đổi bài viết" : "Đăng tin SEO & Công bố"}
                  </button>
                </form>
              </div>

              {/* Content List Table (7/12) */}
              <div className="md:col-span-7 bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 border-b bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">Kho lưu trữ bài viết & Cảnh báo ({blogs.length})</h4>
                  <button
                    onClick={() => fetchBlogs()}
                    className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">refresh</span> Tải lại
                  </button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-outline-variant text-[10px] uppercase font-bold text-slate-600 opacity-75 whitespace-nowrap">
                        <th className="p-4 whitespace-nowrap">Hình ảnh</th>
                        <th className="p-4 whitespace-nowrap">Bài viết</th>
                        <th className="p-4 text-center whitespace-nowrap">Trạng thái</th>
                        <th className="p-4 text-right whitespace-nowrap">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {blogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400 font-bold">Chưa có bài viết nào. Hãy soạn bài viết đầu tiên bên trái!</td>
                        </tr>
                      ) : (
                        blogs.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 w-16">
                              <img
                                src={art.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"}
                                alt={art.title}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <p className="font-bold text-slate-800 line-clamp-2 leading-tight">{art.title}</p>
                              <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block capitalize">{art.category}</span>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                art.status === "Đã đăng" ? "bg-emerald-50 text-[#2e7d32] border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {art.status}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditBlog(art)}
                                  className="p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Chỉnh sửa bài viết"
                                >
                                  <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(art.id, art.title)}
                                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa bài viết"
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                      <tr className="bg-slate-50 border-b border-outline-variant text-[10px] uppercase font-bold text-slate-600 opacity-75 whitespace-nowrap">
                        <th className="p-4 whitespace-nowrap">Chính sách</th>
                        <th className="p-4 text-center whitespace-nowrap">Áp dụng</th>
                        <th className="p-4 text-right whitespace-nowrap">Ngày cập nhật</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant font-medium">
                      {policies.map((pol) => (
                        <tr key={pol.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-800 leading-tight">{pol.name}</p>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">{pol.type}</span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePolicy(pol.id)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                pol.active ? "bg-emerald-50 text-[#2e7d32] border-emerald-250 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {pol.active ? "ON" : "OFF"}
                            </button>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-400 text-[10px] whitespace-nowrap">
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
