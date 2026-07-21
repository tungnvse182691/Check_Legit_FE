import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../context/AppContext";

interface BlogArticleDetail {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  slug: string;
  status: string;
  content: string;
  thumbnail: string;
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/public/blogs/${slug}`);
        if (response.ok) {
          const data = await response.json();
          const parsedDate = data.createdAt ? new Date(data.createdAt.endsWith("Z") ? data.createdAt : data.createdAt + "Z") : new Date();
          setArticle({
            ...data,
            createdAt: parsedDate.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "long", day: "numeric" }),
            thumbnail: data.thumbnail || data.thumbnailUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
          });
        } else {
          setError("Không tìm thấy bài viết hoặc bài viết đã bị gỡ bỏ.");
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài viết:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-500">
        <svg className="animate-spin h-8 w-8 text-[#2e7d32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-bold text-sm">Đang tải thông tin bài viết...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <span className="material-symbols-outlined text-6xl text-slate-300">article_shortcut</span>
        <h2 className="text-2xl font-extrabold text-slate-800">{error || "Bài viết không tồn tại"}</h2>
        <p className="text-sm text-slate-500 max-w-md">Bài viết này có thể đã bị xóa hoặc đường dẫn truy cập không chính xác.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#2e7d32] hover:bg-[#205c22] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const categoryLower = (article.category || "").toLowerCase();
  const isUrgent = categoryLower.includes("khẩn");
  const isGuide = categoryLower.includes("hướng dẫn") || categoryLower.includes("thủ thuật");
  const isFinance = categoryLower.includes("tài chính") || categoryLower.includes("đầu tư");

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-margin-desktop py-10 min-h-screen space-y-8 animate-fade-in">
      {/* Back button link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2e7d32] hover:text-[#205c22] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-all shadow-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại trang chủ
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 text-left border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md shadow-sm text-white tracking-wider ${
            isUrgent ? "bg-red-600" :
            isGuide ? "bg-emerald-600" :
            isFinance ? "bg-amber-600" : "bg-emerald-700"
          }`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-500 font-mono font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
            {article.createdAt}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>
      </header>

      {/* Article Thumbnail */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-outline-variant shadow-sm bg-slate-100">
        <img
          src={article.thumbnail || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Article Main Content Body */}
      <article className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-10 shadow-sm text-left leading-relaxed text-slate-800 font-normal space-y-4">
        {article.content ? (
          article.content.includes("<p>") || article.content.includes("<div>") || article.content.includes("<br>") ? (
            <div
              className="prose max-w-none text-slate-800 leading-relaxed space-y-4 font-sans text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-sans">
              {article.content}
            </div>
          )
        ) : (
          <p className="text-slate-500 italic text-sm">Nội dung chi tiết bài viết đang được ban biên tập hoàn thiện.</p>
        )}
      </article>

      {/* Article Footer & Disclaimer */}
      <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-[#2e7d32] font-bold">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Nội dung đã được thẩm định an toàn bởi Ban biên tập Check Zone.</span>
        </div>
        <Link
          to="/"
          className="text-[#2e7d32] font-extrabold hover:underline uppercase tracking-wider whitespace-nowrap"
        >
          Trang chủ →
        </Link>
      </div>
    </div>
  );
}
