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
  metaDescription?: string;
  metaKeywords?: string;
  author?: string;
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

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
          const mappedArticle = {
            ...data,
            createdAt: parsedDate.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "long", day: "numeric" }),
            thumbnail: data.thumbnail || data.thumbnailUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
          };
          setArticle(mappedArticle);

          // Update Document Title & SEO Meta Tags
          document.title = `${mappedArticle.title} | Check Zone`;

          // Inject Meta Description
          const metaDescText = mappedArticle.metaDescription || mappedArticle.content?.replace(/<[^>]*>?/gm, "").slice(0, 160) || "Tin tức cảnh báo an toàn giao dịch từ Check Zone.";
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute("content", metaDescText);

          // Inject Meta Keywords
          if (mappedArticle.metaKeywords) {
            let metaKw = document.querySelector('meta[name="keywords"]');
            if (!metaKw) {
              metaKw = document.createElement("meta");
              metaKw.setAttribute("name", "keywords");
              document.head.appendChild(metaKw);
            }
            metaKw.setAttribute("content", mappedArticle.metaKeywords);
          }

          // Inject JSON-LD Schema Markup for Google NewsArticle
          const schemaData = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": mappedArticle.title,
            "image": [mappedArticle.thumbnail],
            "datePublished": parsedDate.toISOString(),
            "dateModified": parsedDate.toISOString(),
            "author": {
              "@type": "Organization",
              "name": mappedArticle.author || "Ban Biên Tập Check Zone"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Check Zone",
              "logo": {
                "@type": "ImageObject",
                "url": "https://checkzone.vn/favicon.ico"
              }
            },
            "description": metaDescText
          };

          let schemaScript = document.getElementById("article-schema-jsonld");
          if (!schemaScript) {
            schemaScript = document.createElement("script");
            schemaScript.id = "article-schema-jsonld";
            schemaScript.setAttribute("type", "application/ld+json");
            document.head.appendChild(schemaScript);
          }
          schemaScript.textContent = JSON.stringify(schemaData);

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

    return () => {
      // Clean up Schema on unmount
      const schemaScript = document.getElementById("article-schema-jsonld");
      if (schemaScript) schemaScript.remove();
    };
  }, [slug]);

  const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-500">
        <svg className="animate-spin h-8 w-8 text-[#2e7d32]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-bold text-sm">Đang tải thông tin bài viết SEO...</span>
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
          to="/news"
          className="inline-flex items-center gap-2 bg-[#2e7d32] hover:bg-[#205c22] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Xem tất cả bài viết
        </Link>
      </div>
    );
  }

  const categoryLower = (article.category || "").toLowerCase();
  const isUrgent = categoryLower.includes("khẩn");
  const isGuide = categoryLower.includes("hướng dẫn") || categoryLower.includes("thủ thuật");
  const isFinance = categoryLower.includes("tài chính") || categoryLower.includes("đầu tư");

  // Clean non-breaking spaces from rich-text editor content to prevent horizontal overflow
  const cleanContent = (article.content || "")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 min-h-screen space-y-8 animate-fade-in text-left">
      {/* Breadcrumbs SEO */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link to="/news" className="hover:text-primary transition-colors">Tin tức</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-[250px] sm:max-w-none">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200/80 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-[11px] font-black uppercase px-3.5 py-1.5 rounded-lg shadow-sm text-white tracking-wider ${
              isUrgent ? "bg-red-600" :
              isGuide ? "bg-emerald-600" :
              isFinance ? "bg-amber-600" : "bg-emerald-700"
            }`}>
              {article.category}
            </span>
            <time className="text-xs text-slate-500 font-mono font-medium">
              📅 {article.createdAt}
            </time>
          </div>

          <div className="text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            ✍️ Tác giả: <strong className="text-slate-900">{article.author || "Ban Biên Tập Check Zone"}</strong>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
          {article.title}
        </h1>

        {article.metaDescription && (
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed italic bg-emerald-50/60 border-l-4 border-emerald-600 p-4 rounded-r-xl">
            "{article.metaDescription}"
          </p>
        )}
      </header>

      {/* Article Thumbnail */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
        <img
          src={article.thumbnail || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Article Main Content Body - Clean, spacious reading flow */}
      <main className="py-4 space-y-6">
        {cleanContent ? (
          <div
            className="prose max-w-none text-slate-800 leading-relaxed space-y-5 font-sans text-base sm:text-lg [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-black [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-slate-900 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-extrabold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:leading-relaxed [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-emerald-700 [&_a]:font-bold [&_a]:underline [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        ) : (
          <p className="text-slate-500 italic text-sm">Nội dung chi tiết bài viết đang được ban biên tập hoàn thiện.</p>
        )}
      </main>

      {/* Social Share & Disclaimer */}
      <footer className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mt-12">
        <div className="text-emerald-800 font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
          <span>Nội dung đã được thẩm định an toàn bởi Ban biên tập Check Zone.</span>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-4 py-2 rounded-xl font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            <span>{copiedLink ? "Đã sao chép!" : "Chia sẻ bài viết"}</span>
          </button>
          <Link
            to="/news"
            className="text-emerald-700 font-extrabold hover:underline uppercase tracking-wider whitespace-nowrap flex items-center gap-1"
          >
            Tất cả tin tức <span className="text-sm">→</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
