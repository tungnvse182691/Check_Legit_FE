import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BlogArticle } from "../context/AppContext";

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

const MOCK_ARTICLES = [
  {
    id: "mock-1",
    title: "Thủ đoạn dán đè mã QR lừa đảo tại các điểm quét thanh toán",
    category: "Cảnh báo khẩn",
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
    category: "Hướng dẫn",
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
    category: "Chiêu trò mới",
    date: "12/06/2026",
    content: "Hình thức kẻ gian tìm thông tin đơn hàng rò rỉ rồi gọi điện giả dạng shipper, bắt chuyển khoản thanh toán khi nạn nhân không trực tiếp nhận hàng.",
    thumbnail: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&w=600&q=80",
    slug: "gia-mao-shipper-cod",
    status: "Đã đăng",
    createdAt: "12/06/2026",
  },
];

interface Props {
  blogs: BlogArticle[];
}

function getCategoryColor(category: string) {
  const c = category.toLowerCase();
  if (c.includes("khẩn") || c.includes("cảnh báo")) return "bg-red-600";
  if (c.includes("hướng dẫn") || c.includes("thủ thuật")) return "bg-emerald-600";
  if (c.includes("tài chính") || c.includes("đầu tư")) return "bg-amber-600";
  return "bg-emerald-700";
}

export function NewsCarousel({ blogs }: Props) {
  const publicBlogs = (blogs || [])
    .filter((b: any) => b.status !== "Bản nháp" && (b.category || "") !== POLICY_CATEGORY)
    .slice(0, 9);

  const ARTICLES_PER_SLIDE = 3;
  const totalSlides = Math.max(1, Math.ceil(publicBlogs.length / ARTICLES_PER_SLIDE));
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSlides]);

  const handleDotClick = (idx: number) => {
    setCurrentSlide(idx);
    startAutoPlay();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    startAutoPlay();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    startAutoPlay();
  };

  const visibleArticles = publicBlogs.slice(
    currentSlide * ARTICLES_PER_SLIDE,
    currentSlide * ARTICLES_PER_SLIDE + ARTICLES_PER_SLIDE
  );

  if (publicBlogs.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-6 mb-24">
      <div className="flex items-center justify-between mb-8">
        <Link to="/news" className="flex items-center gap-3 group">
          <span className="material-symbols-outlined text-primary text-3xl font-bold group-hover:scale-110 transition-transform">newspaper</span>
          <h2 className="text-2xl font-extrabold text-on-surface group-hover:text-primary transition-colors">Tin tức mới</h2>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full border border-outline-variant bg-white hover:bg-emerald-50 hover:border-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Bài trước"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_left</span>
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full border border-outline-variant bg-white hover:bg-emerald-50 hover:border-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Bài tiếp theo"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[360px]">
        {visibleArticles.map((article: any) => {
          const thumbnail = article.thumbnail || article.thumbnailUrl || FALLBACK_IMAGE;
          return (
            <article
              key={article.id}
              className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col justify-between animate-fade-in"
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

      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? "w-6 h-2.5 bg-primary"
                  : "w-2.5 h-2.5 bg-outline-variant hover:bg-primary/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 hover:shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-base">article</span>
          Xem tất cả tin tức
        </Link>
      </div>
    </section>
  );
}
