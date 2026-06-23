import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function Home() {
  const { scams, legitList } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    status: "scam" | "warning" | "legit" | "not_found";
    item?: any;
    searchedTerm: string;
  } | null>(null);

  // Newest 4 approved scams
  const latestScams = scams
    .filter((s) => s.status === "Đã phê duyệt")
    .slice(0, 4);

  // Top 3 legit sellers
  const topLegit = legitList.slice(0, 3);

  const handleSearch = () => {
    if (!query.trim()) return;

    const term = query.trim().replace(/\s+/g, "").toLowerCase();

    // Check scam database
    const foundScam = scams.find((s) => {
      if (s.status !== "Đã phê duyệt") return false;
      const matchPhone = s.phone?.replace(/\s+/g, "").toLowerCase() === term;
      const matchAccountNumber = s.accountNumber?.replace(/\s+/g, "").toLowerCase() === term;
      const matchName = s.name.replace(/\s+/g, "").toLowerCase().includes(term);
      return matchPhone || matchAccountNumber || matchName;
    });

    if (foundScam) {
      setSearchResult({
        status: foundScam.category === "Cảnh báo hành vi" ? "warning" : "scam",
        item: foundScam,
        searchedTerm: query,
      });
      return;
    }

    // Check legit database
    const foundLegit = legitList.find((l) => {
      const matchPhone = l.phone?.replace(/\s+/g, "").toLowerCase() === term;
      const matchTelegram = l.telegram?.replace(/\s+/g, "").toLowerCase() === term;
      const matchName = l.name.replace(/\s+/g, "").toLowerCase().includes(term);
      return matchPhone || matchTelegram || matchName;
    });

    if (foundLegit) {
      setSearchResult({
        status: "legit",
        item: foundLegit,
        searchedTerm: query,
      });
      return;
    }

    // If nothing found
    setSearchResult({
      status: "not_found",
      searchedTerm: query,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pt-4">
      {/* Hero Section - Shrunk to 70% width */}
      <section className="relative py-20 bg-surface-container-lowest overflow-hidden border-b border-outline-variant">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#2e7d32_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
            HỆ THỐNG AN NINH CHỐNG SCAM 24/7
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 text-on-surface font-extrabold tracking-tight leading-tight">
            Tra cứu thông tin tin cậy & phòng chống lừa đảo
          </h1>
          <p className="text-sm sm:text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Hệ thống xác minh danh tính hàng đầu, giúp bạn dễ dàng kiểm tra lịch sử uy tín hoặc tố cáo các hành vi gian lận trực tuyến.
          </p>
          
          {/* Central Search Bar */}
          <div className="max-w-3xl mx-auto relative mb-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border-2 border-primary/80 p-2 rounded-2xl shadow-md focus-within:ring-4 focus-within:ring-primary/15 gap-2 transition-all duration-300">
              <div className="flex items-center flex-grow py-1 sm:py-0">
                <span className="material-symbols-outlined px-3 text-emerald-700">search</span>
                <input 
                  className="w-full border-none focus:ring-0 font-body-md py-2.5 outline-none text-sm sm:text-base text-on-surface" 
                  placeholder="Nhập số điện thoại, zalo, số tài khoản hoặc tên để tra cứu..." 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-primary text-white cursor-pointer px-8 py-3.5 rounded-xl font-bold hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-base shrink-0 uppercase tracking-wider"
              >
                KIỂM TRA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Action Buttons Container (Replaced Statistics Area) */}
      <section className="bg-white py-12 border-b border-outline-variant">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-outline-variant flex flex-col sm:flex-row gap-6 justify-center items-stretch">
            <Link 
              to="/legit" 
              className="w-full sm:w-1/2 flex items-center justify-center gap-3 bg-primary text-white hover:bg-emerald-800 py-4.5 px-6 rounded-2xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 text-center shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">verified</span>
              <span>XEM DANH SÁCH LEGIT</span>
            </Link>
            <Link 
              to="/report" 
              state={{ defaultCategory: "Lừa đảo tài chính" }}
              className="w-full sm:w-1/2 flex items-center justify-center gap-3 bg-red-600 text-white hover:bg-red-700 py-4.5 px-6 rounded-2xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 text-center shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">gpp_bad</span>
              <span>BÁO CÁO LỪA ĐẢO</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Result Box Panel (if active) */}
      {searchResult && (
        <section className="max-w-4xl mx-auto px-6 py-4 mt-6 animate-fade-in">
          {searchResult.status === "scam" && (
            <div className="bg-red-50 border-4 border-red-500 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="material-symbols-outlined text-red-600 text-5xl shrink-0">gpp_bad</span>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-headline-md font-extrabold text-red-600 uppercase">XÁC ĐỊNH LỪA ĐẢO TRÙNG KHỚP!</h3>
                  <p className="text-xs sm:text-body-md text-red-950 font-semibold mt-1">
                    Thông tin "<span className="underline font-bold">{searchResult.searchedTerm}</span>" trùng khớp với hồ sơ lừa đảo đã xác thực của <span className="font-extrabold text-red-700">{searchResult.item.name}</span>!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-4 bg-white/80 p-4 rounded-2xl text-xs sm:text-sm border border-red-200 shadow-inner">
                    <div><strong className="text-on-surface-variant">Số tài khoản:</strong> {searchResult.item.accountNumber} ({searchResult.item.bankName})</div>
                    <div><strong className="text-on-surface-variant">SĐT / Zalo:</strong> {searchResult.item.phone || "Không có"}</div>
                    <div className="md:col-span-2"><strong className="text-on-surface-variant">Mô tả vụ việc:</strong> {searchResult.item.desc}</div>
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <Link 
                    to={`/reports/${searchResult.item.id}`} 
                    className="block text-center bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-label-sm hover:scale-[1.05] hover:shadow-md transition-all uppercase whitespace-nowrap"
                  >
                    XEM BẰNG CHỨNG
                  </Link>
                </div>
              </div>
            </div>
          )}

          {searchResult.status === "warning" && (
            <div className="bg-amber-50 border-4 border-amber-500 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="material-symbols-outlined text-amber-600 text-5xl shrink-0">warning</span>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-headline-md font-extrabold text-amber-700 uppercase">PHÁT HIỆN CẢNH BÁO HÀNH VI XẤU!</h3>
                  <p className="text-xs sm:text-body-md text-amber-955 font-semibold mt-1">
                    Thông tin "<span className="underline font-bold">{searchResult.searchedTerm}</span>" trùng khớp với hồ sơ cảnh báo hành vi vi phạm uy tín của <span className="font-extrabold text-amber-700">{searchResult.item.name}</span>!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-4 bg-white/80 p-4 rounded-2xl text-xs sm:text-sm border border-amber-200 shadow-inner">
                    <div><strong className="text-on-surface-variant">Kênh nhận diện / Tài khoản:</strong> {searchResult.item.accountNumber} ({searchResult.item.bankName})</div>
                    <div><strong className="text-on-surface-variant">SĐT / Zalo:</strong> {searchResult.item.phone || "Không có"}</div>
                    <div className="md:col-span-2"><strong className="text-on-surface-variant">Mô tả hành vi:</strong> {searchResult.item.desc}</div>
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-2 sm:mt-0">
                  <Link 
                    to={`/reports/${searchResult.item.id}`} 
                    className="block text-center bg-amber-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-label-sm hover:scale-[1.05] hover:shadow-md transition-all uppercase whitespace-nowrap"
                  >
                    XEM CHI TIẾT
                  </Link>
                </div>
              </div>
            </div>
          )}

          {searchResult.status === "legit" && (
            <div className="bg-emerald-50 border-4 border-emerald-500 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="material-symbols-outlined text-emerald-600 text-5xl shrink-0">verified</span>
                <div className="flex-grow">
                  <h3 className="text-headline-md font-extrabold text-emerald-800 uppercase">THƯƠNG HIỆU UY TÍN ĐÃ XÁC MINH!</h3>
                  <p className="text-body-md text-emerald-950 font-semibold mt-1">
                    Đối tượng "<span className="underline">{searchResult.searchedTerm}</span>" là <span className="font-extrabold">{searchResult.item.name}</span>, đối tác uy tín được ký quỹ bảo hiểm giao dịch thành công.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-4 bg-white/80 p-4 rounded-2xl text-xs text-emerald-900 text-center border border-emerald-200">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase">Quỹ Ký quỹ</p>
                      <p className="font-bold text-sm text-emerald-700">{(searchResult.item.insurance).toLocaleString("vi-VN")}đ</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase">Điểm tín nhiệm</p>
                      <p className="font-bold text-sm text-emerald-700">{searchResult.item.score}/100</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase">Giao dịch</p>
                      <p className="font-bold text-sm text-emerald-700">{searchResult.item.successTrans} GD</p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <Link 
                    to={`/legit/${searchResult.item.id}`} 
                    className="block text-center bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-label-sm hover:scale-[1.05] hover:shadow-md transition-all whitespace-nowrap"
                  >
                    XEM CỬA HÀNG
                  </Link>
                </div>
              </div>
            </div>
          )}

          {searchResult.status === "not_found" && (
            <div className="bg-slate-50 border-4 border-slate-400 p-5 sm:p-6 rounded-3xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="material-symbols-outlined text-slate-500 text-5xl shrink-0">gpp_maybe</span>
                <div className="flex-grow">
                  <h3 className="text-headline-md font-bold text-slate-700 uppercase">CHƯA CÓ BÁO CÁO VI PHẠM</h3>
                  <p className="text-body-md text-slate-600 mt-1">
                    Hệ thống hiện chưa thấy báo cáo lừa đảo hoặc thông tin tín nhiệm đã đăng ký nào trùng khớp với "<span className="underline">{searchResult.searchedTerm}</span>".
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    *Lưu ý: Việc chưa có báo cáo không đồng nghĩa đối tượng an toàn 100%. Luôn thực hiện giao dịch trung gian hoặc kiểm tra kỹ lưỡng trước khi chuyển khoản.
                  </p>
                </div>
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <button 
                    onClick={() => setSearchResult(null)}
                    className="block w-full text-center bg-slate-600 text-white font-bold px-6 py-3 rounded-xl text-label-sm hover:opacity-90 transition-all cursor-pointer"
                  >
                    ĐÓNG
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Content Area - Dropping recent reports and legit database into separate sequential full-width layout lines */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Recent Reports Block - Full Width on a layout line */}
        <div className="bg-red-50/25 border border-red-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm">
          <div>
            <div className="bg-red-100/60 p-6 flex items-center justify-between border-b border-red-200">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-650 text-red-600 font-bold">gpp_bad</span>
                <h2 className="text-xl sm:text-headline-md font-extrabold text-red-900">Báo cáo & Cảnh báo mới nhất</h2>
              </div>
              <Link to="/reports" className="text-red-700 hover:text-red-900 underline text-label-sm font-bold">Xem tất cả</Link>
            </div>
            
            {/* List of reports with deep rounded cards, smooth hover scaling effects */}
            <div className="p-6 space-y-4">
              {latestScams.map((report) => {
                const isReportWarning = report.category === "Cảnh báo hành vi";
                return (
                  <div 
                    key={report.id} 
                    className={`bg-white p-5 border-l-4 ${isReportWarning ? "border-amber-500" : "border-red-600"} rounded-2xl shadow-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
                  >
                    <div className="flex-grow pr-2 w-full">
                      <div className="font-extrabold text-body-md mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="text-on-surface text-base">{report.name}</span>
                        <span className={`${isReportWarning ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-red-50 text-red-800 border-red-100"} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border`}>
                          {report.type}
                        </span>
                      </div>
                      <div className="text-on-surface-variant text-xs font-mono mb-2 bg-slate-50 py-1.5 px-3 rounded-lg inline-block">
                        SĐT: {report.phone || "---"} | {isReportWarning ? "Kênh nhận diện / Tài khoản" : "TK"}: {report.accountNumber} ({report.bankName})
                      </div>
                      <div className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">{report.desc}</div>
                    </div>
                    <div className="text-left md:text-right shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-dashed border-slate-200 flex md:flex-col justify-between items-center md:items-end">
                      <div>
                        {isReportWarning ? (
                          <div className="font-label-numeric text-amber-600 font-extrabold text-xs sm:text-sm">Phi tài sản (0đ)</div>
                        ) : (
                          <div className="font-label-numeric text-red-600 font-extrabold text-base sm:text-lg">{(report.amount).toLocaleString("vi-VN")}đ</div>
                        )}
                        <div className="text-[10px] text-on-surface-variant font-bold uppercase">{report.time}</div>
                      </div>
                      <Link 
                        to={`/reports/${report.id}`} 
                        className={`inline-block ${isReportWarning ? "bg-amber-50 hover:bg-amber-100 text-amber-800" : "bg-red-50 hover:bg-red-100 text-red-800"} px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors mt-2`}
                      >
                        Chi tiết →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legit List Block - Sequential full-width section */}
        <div className="bg-slate-50 border border-outline-variant rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-emerald-50 p-6 flex items-center justify-between border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary font-bold">verified</span>
                <h2 className="text-xl sm:text-headline-md font-extrabold text-emerald-950">Danh sách uy tín đã ký quỹ</h2>
              </div>
              <span className="text-primary text-label-sm font-extrabold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-emerald-100">Uy tín</span>
            </div>
            
            {/* List with hover scaling */}
            <div className="divide-y divide-outline-variant bg-white">
              {topLegit.map((legit) => (
                <Link 
                  to={`/legit/${legit.id}`} 
                  key={legit.id} 
                  className="p-6 flex items-center gap-4 hover:bg-emerald-50/40 hover:scale-[1.01] transition-all duration-300 block"
                >
                  <img src={legit.img} alt="Avatar" className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-emerald-100 shadow-sm"/>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold font-body-md text-on-surface text-base">{legit.name}</span>
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5 font-medium">{legit.role}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-primary font-extrabold font-label-numeric text-base">{legit.score}/100</div>
                    <div className="text-[10px] text-on-surface-variant bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">{(legit.insurance).toLocaleString("vi-VN")}đ Quỹ</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-6 bg-slate-50 text-center border-t border-outline-variant">
            <Link to="/legit" className="text-primary hover:text-emerald-800 font-extrabold text-label-sm uppercase tracking-wider block hover:underline">XEM DANH SÁCH UY TÍN ĐẦY ĐỦ</Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Replaced banner with new text and Forest Green scheme */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-primary hover:scale-[1.01] transition-all duration-300 text-on-primary rounded-3xl p-10 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="relative z-10 text-center md:text-left">
            <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block mb-3 border border-white/10">Hồ sơ tín nhiệm</span>
            <h2 className="text-2xl sm:text-headline-lg font-extrabold mb-4 leading-snug">
              Hãy tạo hồ sơ để tăng độ tin cậy với khách hàng và cộng đồng
            </h2>
            <p className="text-body-md opacity-90 max-w-xl leading-relaxed">
              Tích lũy quỹ bảo hiểm giao dịch, nâng cao điểm tín nhiệm, khẳng định uy tín thương hiệu số để phát triển kinh doanh vững vàng.
            </p>
          </div>
          <Link 
            to="/legit" 
            className="relative z-10 bg-white text-primary px-8 py-4.5 rounded-2xl font-bold hover:scale-[1.05] hover:shadow-xl active:scale-95 transition-all duration-300 inline-block text-center whitespace-nowrap"
          >
            Tạo Hồ Sơ Legit Ngay
          </Link>
          <div className="absolute right-0 top-0 opacity-10 scale-150 translate-x-1/4 -translate-y-1/4">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>
      </section>

      {/* News/Blog Section Placeholder - Grid of 3 minimal card placeholders */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">newspaper</span>
          <h2 className="text-2xl font-extrabold text-on-surface">Tin tức cảnh báo mới</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article Card 1 */}
          <article className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.03] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-50 text-red-850 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">CẢNH BÁO khẩn</span>
                <span className="text-[10px] text-on-surface-variant font-bold">18/06/2026</span>
              </div>
              <h3 className="text-base font-extrabold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors">
                Thủ đoạn dán đè mã QR lừa đảo tại các điểm quét thanh toán
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                Cảnh giác chiêu trò các đối tượng lợi dụng sơ hở d dán đè mã QR nhận tiền tại quầy, khiến tiền của khách hàng bị chuyển nhầm vào tài khoản kẻ gian.
              </p>
            </div>
            <div className="p-5 pt-0">
              <span className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                Đọc bài viết <span className="text-sm">→</span>
              </span>
            </div>
          </article>

          {/* Article Card 2 */}
          <article className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.03] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-50 text-emerald-850 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">HƯỚNG DẪN</span>
                <span className="text-[10px] text-on-surface-variant font-bold">15/06/2026</span>
              </div>
              <h3 className="text-base font-extrabold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors">
                Quy trình 3 bước chuyển trung gian an toàn tránh bùng cọc
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                Chi tiết về cơ chế giao dịch có đặt cọc có ký quỹ bảo lãnh, giúp cả người mua và người bán an tâm tuyệt đối khi lần đầu giao dịch trực tuyến.
              </p>
            </div>
            <div className="p-5 pt-0">
              <span className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                Đọc bài viết <span className="text-sm">→</span>
              </span>
            </div>
          </article>

          {/* Article Card 3 */}
          <article className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:scale-[1.03] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-50 text-amber-850 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">CHIÊU TRÒ MỚI</span>
                <span className="text-[10px] text-on-surface-variant font-bold">12/06/2026</span>
              </div>
              <h3 className="text-base font-extrabold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors">
                Giả mạo nhân viên shipper gọi điện đòi tiền thu hộ COD
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                Hình thức kẻ gian tìm thông tin đơn hàng rò rỉ rồi gọi điện giả dạng shipper, bắt chuyển khoản thanh toán khi nạn nhân không trực tiếp nhận hàng.
              </p>
            </div>
            <div className="p-5 pt-0">
              <span className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                Đọc bài viết <span className="text-sm">→</span>
              </span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
