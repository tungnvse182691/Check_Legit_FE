import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp, BlogArticle } from "../context/AppContext";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const POLICY_CATEGORY = "Quy chế & Chính sách";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";

const MOCK_ARTICLES: BlogArticle[] = [
  {
    id: "mock-1",
    title: "Thủ đoạn dán đè mã QR lừa đảo tại các điểm quét thanh toán",
    category: "Cảnh báo khẩn cấp",
    date: "18/06/2026",
    content: "Cảnh giác chiêu trò các đối tượng lợi dụng sơ hở dán đè mã QR nhận tiền tại quầy, khiến tiền của khách hàng bị chuyển nhầm vào tài khoản kẻ gian.",
    thumbnail: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=600&q=80",
    slug: "thu-doan-dan-de-ma-qr",
    status: "Đã đăng",
    createdAt: "18/06/2026",
  },
  {
    id: "mock-2",
    title: "Quy trình 3 bước chuyển trung gian an toàn tránh bùng cọc",
    category: "HƯỚNG DẪN & THỦ THUẬT",
    date: "15/06/2026",
    content: "Chi tiết về cơ chế giao dịch có đặt cọc có ký quỹ bảo lãnh, giúp cả người mua và người bán an tâm khi giao dịch trực tuyến.",
    thumbnail: FALLBACK_IMAGE,
    slug: "quy-trinh-3-buoc-chuyen-trung-gian",
    status: "Đã đăng",
    createdAt: "15/06/2026",
  },
  {
    id: "mock-3",
    title: "Giả mạo nhân viên shipper gọi điện đòi tiền thu hộ COD",
    category: "Cảnh báo phổ thông",
    date: "12/06/2026",
    content: "Hình thức kẻ gian tìm thông tin đơn hàng rò rỉ rồi gọi điện giả dạng shipper, bắt chuyển khoản thanh toán khi nạn nhân không trực tiếp nhận hàng.",
    thumbnail: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&w=600&q=80",
    slug: "gia-mao-shipper-cod",
    status: "Đã đăng",
    createdAt: "12/06/2026",
  },
];

function getCategoryColor(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("khẩn") || c.includes("cảnh báo")) return "bg-red-600";
  if (c.includes("hướng dẫn") || c.includes("thủ thuật")) return "bg-emerald-600";
  if (c.includes("tài chính") || c.includes("đầu tư")) return "bg-amber-600";
  return "bg-emerald-700";
}

export function NewsList() {
  const { blogs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const allArticles = (blogs || [])
    .filter((b) => b.status !== "Bản nháp" && (b.category || "") !== POLICY_CATEGORY);

  const categories = ["Tất cả", ...Array.from(new Set(allArticles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === "Tất cả" || article.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-margin-desktop py-12 min-h-screen space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
          Tin tức & Cảnh báo an toàn
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-3xl">
          Cập nhật những thủ đoạn lừa đảo mới nhất, hướng dẫn giao dịch an toàn và thông tin cảnh báo từ hệ thống Check Zone.
        </p>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const thumbnail = article.thumbnail || article.thumbnailUrl || FALLBACK_IMAGE;
            return (
              <article
                key={article.id}
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <Link to={`/news/${article.slug || article.id}`} className="block">
                  <div className="aspect-video w-full bg-slate-100 border-b border-slate-100 overflow-hidden relative">
                    <img
                      src={thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm text-white ${getCategoryColor(article.category || "")}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold block mb-2 font-mono">
                      {article.createdAt || article.date || "Mới đăng"}
                    </span>
                    <Link to={`/news/${article.slug || article.id}`}>
                      <h3 className="text-base font-extrabold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors text-left leading-snug">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed text-left opacity-90">
                      {article.metaDescription || (article.content ? stripHtml(article.content) : '') || "Chi tiết thông tin cảnh báo từ hệ thống giám sát an toàn giao dịch Check Zone."}
                    </p>
                  </div>
                  <div className="pt-4 text-left border-t border-slate-100 mt-4">
                    <Link
                      to={`/news/${article.slug || article.id}`}
                      className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 inline-flex"
                    >
                      Đọc bài viết <span className="text-sm">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">search_off</span>
          <p className="font-bold text-base">Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      )}
    </div>
  );
}
