import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FileText, ShieldCheck, Search, CloudUpload } from "lucide-react";

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

const slugifyVietnamese = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"]
  ]
};

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
  const [newMetaDescription, setNewMetaDescription] = useState("");
  const [newMetaKeywords, setNewMetaKeywords] = useState("");
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
    const slug = newBlogSlug.trim() ? slugifyVietnamese(newBlogSlug) : slugifyVietnamese(newBlogTitle);
    
    if (editingBlogId) {
      const success = await updateBlogArticle(editingBlogId, {
        title: newBlogTitle,
        category: newBlogCategory,
        slug,
        status: "Đã đăng",
        content: newBlogContent,
        thumbnail: newBlogThumbnail,
        metaDescription: newMetaDescription,
        metaKeywords: newMetaKeywords
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
        thumbnail: newBlogThumbnail,
        metaDescription: newMetaDescription,
        metaKeywords: newMetaKeywords
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
    setNewMetaDescription("");
    setNewMetaKeywords("");
  };

  const handleEditBlog = (art: any) => {
    setEditingBlogId(art.id);
    setNewBlogTitle(art.title);
    setNewBlogCategory(art.category);
    setNewBlogSlug(art.slug);
    setNewBlogContent(art.content || "");
    setNewBlogThumbnail(art.thumbnail || "");
    setNewMetaDescription(art.metaDescription || art.meta_description || "");
    setNewMetaKeywords(art.metaKeywords || art.meta_keywords || "");
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="max-w-7xl mx-auto flex gap-4">
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
      <div className="max-w-7xl mx-auto w-full px-6 md:px-margin-desktop py-8 flex-1 space-y-6">
        
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
              <div className="bg-emerald-50 border border-[#2e7d32]/30 text-emerald-950 p-4 rounded-xl flex items-center gap-2.5 font-bold shadow-sm">
                <span className="material-symbols-outlined text-[#2e7d32]">check_circle</span>
                <span>{blogNotif}</span>
              </div>
            )}

            <form onSubmit={handleSaveBlog} className="space-y-6">
              {/* CMS Top Header Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2e7d32] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      {editingBlogId ? "Hiệu chỉnh bài viết" : "Trình soạn thảo CMS & SEO"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {editingBlogId ? "Đang cập nhật bài viết sẵn có trên hệ thống" : "Tạo bài viết mới tối ưu chuẩn Google Search"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Hủy chỉnh sửa
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2e7d32] hover:bg-[#205c22] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {editingBlogId ? "Lưu thay đổi" : "Xuất bản bài viết"}
                  </button>
                </div>
              </div>

              {/* Main Content Grid: 8 Cols Editor / 4 Cols Sidebar */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* CỘT TRÁI (8/12): SOẠN THẢO NỘI DUNG */}
                <div className="xl:col-span-8 space-y-6">
                  
                  {/* Card 1: Title & Slug */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Tiêu đề bài viết *
                      </label>
                      <input
                        required
                        className="w-full border-b-2 border-slate-200 py-2 text-xl sm:text-2xl font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#2e7d32] transition-colors"
                        placeholder="Nhập tiêu đề bài viết..."
                        value={newBlogTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewBlogTitle(val);
                          if (!editingBlogId) {
                            setNewBlogSlug(slugifyVietnamese(val));
                          }
                        }}
                      />
                    </div>

                    {/* Clean Permalink Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 text-xs">
                      <span className="text-slate-500 font-medium shrink-0">Đường dẫn thân thiện (URL):</span>
                      <div className="flex items-center flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-[#2e7d32] transition-colors">
                        <span className="font-mono text-slate-400 text-[11px] shrink-0">checkzone.vn/news/</span>
                        <input
                          className="flex-1 bg-transparent outline-none font-mono text-slate-800 text-[11px] font-bold px-1"
                          placeholder="duong-dan-bai-viet"
                          value={newBlogSlug}
                          onChange={(e) => setNewBlogSlug(slugifyVietnamese(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Rich Text Editor */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
                        Nội dung chi tiết bài viết
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">Soạn thảo Rich Text</span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={newBlogContent}
                        onChange={setNewBlogContent}
                        modules={quillModules}
                        placeholder="Bắt đầu viết nội dung bài viết..."
                        className="bg-white [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-slate-50/80 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-none [&_.ql-container]:min-h-[520px] [&_.ql-editor]:min-h-[520px] [&_.ql-editor]:text-sm [&_.ql-editor]:leading-relaxed [&_.ql-editor]:p-5"
                      />
                    </div>
                  </div>

                </div>

                {/* CỘT PHẢI (4/12): SEO & METADATA */}
                <div className="xl:col-span-4 space-y-6">
                  
                  {/* Card 1: Category & Thumbnail */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                      Phân loại & Ảnh đại diện
                    </h3>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                        Thể loại bài viết
                      </label>
                      <select
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none bg-white font-medium text-slate-800"
                        value={newBlogCategory}
                        onChange={(e) => setNewBlogCategory(e.target.value)}
                      >
                        <option value="Cảnh báo khẩn cấp">Cảnh báo khẩn cấp (Badge Đỏ)</option>
                        <option value="HƯỚNG DẪN & THỦ THUẬT">HƯỚNG DẪN & THỦ THUẬT (Badge Xanh)</option>
                        <option value="Cảnh báo tài chính">Cảnh báo tài chính (Badge Cam)</option>
                        <option value="Cảnh báo phổ thông">Cảnh báo phổ thông</option>
                        <option value="Quy chế & Chính sách">Quy chế & Chính sách (Ẩn tin mới)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                        Ảnh Thumbnail Cover
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#2e7d32] outline-none"
                          placeholder="Dán URL ảnh đại diện..."
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
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                          <span>{isUploadingThumbnail ? "..." : "Tải ảnh"}</span>
                        </button>
                      </div>

                      {newBlogThumbnail ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                          <img
                            src={newBlogThumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-1 p-4 text-center">
                          <span className="material-symbols-outlined text-2xl">image</span>
                          <span className="text-[11px] font-medium">Chưa có ảnh bìa. Hãy chọn ảnh tải lên hoặc dán URL.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Meta SEO Config */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-500" /> Tối ưu Meta SEO
                    </h3>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                        Từ khóa chính (Focus Keywords)
                      </label>
                      <input
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none"
                        placeholder="VD: lừa đảo chuyển khoản, check zone"
                        value={newMetaKeywords}
                        onChange={(e) => setNewMetaKeywords(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">
                          Thẻ mô tả (Meta Description)
                        </label>
                        <span className={`text-[10px] font-mono font-bold ${newMetaDescription.length > 160 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {newMetaDescription.length} / 160
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#2e7d32] outline-none resize-none leading-relaxed"
                        placeholder="Mô tả tóm tắt 150-160 ký tự giúp Google trích dẫn bài viết của bạn..."
                        value={newMetaDescription}
                        onChange={(e) => setNewMetaDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Card 3: Google SERP Preview */}
                  <div className="bg-slate-900 text-white border border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                      <span>Xem trước trên Google</span>
                      <span className="text-[9px] text-slate-500 font-normal">Mobile Preview</span>
                    </div>

                    <div className="bg-white text-slate-900 p-3.5 rounded-xl shadow-md border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 bg-[#2e7d32] text-white rounded-full flex items-center justify-center text-[8px] font-black shrink-0">
                          CZ
                        </div>
                        <div className="leading-tight overflow-hidden">
                          <p className="text-[11px] text-slate-800 font-bold">Check Zone</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                            https://checkzone.vn/news/{newBlogSlug || 'bai-viet-moi'}
                          </p>
                        </div>
                      </div>
                      <h4 className="text-[#1a0dab] text-[14px] font-medium hover:underline truncate leading-snug">
                        {newBlogTitle || 'Tiêu đề bài viết sẽ hiển thị ở đây'}
                      </h4>
                      <p className="text-[12px] text-[#4d5156] line-clamp-2 mt-1 leading-normal">
                        {newMetaDescription || 'Vui lòng cung cấp thẻ mô tả (Meta description). Thẻ này rất quan trọng để Google và người dùng hiểu nội dung bài viết của bạn...'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </form>

            {/* BẢNG KHO LƯU TRỮ BÀI VIẾT (Archive Table) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-wide">
                    Kho lưu trữ bài viết & Cảnh báo ({blogs.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Danh sách các bài viết đã xuất bản trên hệ thống</p>
                </div>
                <button
                  onClick={() => fetchBlogs()}
                  className="text-xs text-[#2e7d32] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span> Tải lại
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">
                      <th className="p-4 w-16">Hình ảnh</th>
                      <th className="p-4">Tiêu đề bài viết</th>
                      <th className="p-4 text-center">Thể loại</th>
                      <th className="p-4 text-center">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                          Chưa có bài viết nào. Hãy soạn bài viết đầu tiên bên trên!
                        </td>
                      </tr>
                    ) : (
                      blogs.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4">
                            <img
                              src={art.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"}
                              alt={art.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
                              }}
                            />
                          </td>
                          <td className="p-4 min-w-[240px]">
                            <p className="font-bold text-slate-900 line-clamp-2 leading-snug">{art.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">/news/{art.slug}</p>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                              art.status === "Đã đăng"
                                ? "bg-emerald-50 text-[#2e7d32] border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {art.status}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditBlog(art)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-[#2e7d32] hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(art.id, art.title)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Xóa
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
