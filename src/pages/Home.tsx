import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp, API_BASE_URL } from "../context/AppContext";
import { useDebounce } from "../hooks/useDebounce";

export function Home() {
  const { scams, legitList } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLiveResults = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setLiveResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);

      try {
        const response = await fetch(`${API_BASE_URL}/public/reports/search?query=${encodeURIComponent(debouncedSearchTerm.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setLiveResults(data);
        } else {
          console.error("Failed to fetch live search results");
          setLiveResults([]);
        }
      } catch (error) {
        console.error("Error in live search:", error);
        setLiveResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchLiveResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setShowDropdown(false);
    const term = searchTerm.trim().replace(/\s+/g, "").toLowerCase();

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
        searchedTerm: searchTerm,
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
        searchedTerm: searchTerm,
      });
      return;
    }

    // If nothing found
    setSearchResult({
      status: "not_found",
      searchedTerm: searchTerm,
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 text-on-surface font-extrabold tracking-tight leading-tight">
            Tra cứu thông tin tin cậy & phòng chống lừa đảo
          </h1>
          <p className="text-sm sm:text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Hệ thống xác minh danh tính hàng đầu, giúp bạn dễ dàng kiểm tra lịch sử uy tín hoặc tố cáo các hành vi gian lận trực tuyển.
          </p>

          {/* Central Search Bar */}
          <div ref={searchContainerRef} className="max-w-3xl mx-auto relative mb-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border-2 border-primary/80 p-2 rounded-2xl shadow-md focus-within:ring-4 focus-within:ring-primary/15 gap-2 transition-all duration-300">
              <div className="flex items-center flex-grow py-1 sm:py-0">
                <span className="material-symbols-outlined px-3 text-emerald-700">search</span>
                <input
                  className="w-full border-none focus:ring-0 font-body-md py-2.5 outline-none text-sm sm:text-base text-on-surface"
                  placeholder="Nhập số điện thoại, zalo, số tài khoản hoặc tên để tra cứu..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Dropdown gợi ý tìm kiếm (Live Search Suggestions) */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 flex items-center justify-center gap-3 text-slate-500 font-medium">
                    <svg className="animate-spin h-5 w-5 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Đang tìm kiếm dữ liệu...</span>
                  </div>
                ) : liveResults.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-bold text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">search_off</span>
                    Không tìm thấy kết quả phù hợp
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="bg-slate-50/80 px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider text-left">
                      Kết quả tìm kiếm ({liveResults.length})
                    </div>
                    {liveResults.map((item) => {
                      const isWarning = item.category === 1 || item.category === "Cảnh báo hành vi";
                      const statusText = item.status === "Đã phê duyệt" ? "Đã duyệt" : item.status;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            navigate(`/reports/${item.id}`);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 border-l-4 border-transparent hover:border-emerald-600"
                        >
                          <div className="flex flex-col text-left min-w-0">
                            <span className="font-extrabold text-sm text-slate-800 truncate capitalize">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-500 font-mono mt-0.5">
                              {item.accountNumber ? `STK: ${item.accountNumber}` : ""}
                              {item.accountNumber && item.phone ? " | " : ""}
                              {item.phone ? `SĐT: ${item.phone}` : ""}
                              {item.bankName ? ` (${item.bankName})` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              isWarning
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}>
                              {item.type || (isWarning ? "Cảnh báo" : "Lừa đảo")}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              item.status === "Đã phê duyệt"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-250"
                                : "bg-amber-50 text-amber-850 border-amber-200"
                            }`}>
                              {statusText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
      <section className="max-w-[1400px] mx-auto px-6 py-12 space-y-16">
        
        {/* Recent Reports Block - Upgraded to match new mockup layout */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 border border-slate-200">
          <div className="flex justify-between items-center border-b-2 border-red-50 pb-4 mb-5">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#dc2626]">
              <span className="material-symbols-outlined text-[24px]">gpp_bad</span> Báo cáo & Cảnh báo mới nhất
            </h2>
            <Link to="/reports" className="text-slate-550 text-slate-500 hover:text-[#dc2626] text-sm font-medium flex items-center gap-1 transition-colors duration-200">
              Xem tất cả <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            {latestScams.map((report) => {
              const isReportWarning = report.category === "Cảnh báo hành vi";
              return (
                <div 
                  key={report.id} 
                  className={`flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 ${
                    isReportWarning 
                      ? "before:bg-amber-500 hover:border-amber-300 hover:shadow-[0_6px_15px_rgba(245,158,11,0.08)]" 
                      : "before:bg-[#dc2626] hover:border-red-300 hover:shadow-[0_6px_15px_rgba(220,38,38,0.08)]"
                  } hover:-translate-y-0.5`}
                >
                  {/* Top content split: Split into Left and Right */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-dashed border-slate-100 pb-4 pl-2">
                    {/* Left: Target details */}
                    <div className="flex flex-col gap-2.5 flex-grow min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-800 leading-tight">{report.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          isReportWarning 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {report.type}
                        </span>
                      </div>
                      
                      {/* Box riêng biệt chứa SĐT & Số tài khoản */}
                      <div className="text-[12px] text-slate-600 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg flex flex-col gap-1 w-full max-w-sm font-medium shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-slate-400">phone_iphone</span>
                          <span>SĐT: <strong className="text-slate-700 font-semibold">{report.phone || "---"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-slate-400">account_balance_wallet</span>
                          <span className="truncate">STK: <strong className="text-slate-700 font-semibold">{report.accountNumber} ({report.bankName})</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Detail link */}
                    <div className="flex flex-col items-start sm:items-end text-left sm:text-right shrink-0">
                      {isReportWarning ? (
                        <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200/50">Phi tài sản (0đ)</span>
                      ) : (
                        <span className="text-lg sm:text-xl font-extrabold text-[#dc2626] tracking-tight">
                          {Number(report.amount).toLocaleString("vi-VN")} đ
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium mt-1">
                        {report.time}
                      </span>
                      <Link 
                        to={`/reports/${report.id}`} 
                        className="mt-3.5 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 hover:text-slate-900 rounded-lg transition-all border border-slate-200/60"
                      >
                        <span>Chi tiết</span>
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom section: Short description */}
                  <div className="pt-3 pl-2">
                    <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      {report.desc || "Không có mô tả chi tiết vụ việc."}
                    </p>
                  </div>
                </div>
              );
            })}
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

            {/* Grid display for legit merchants */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
              {topLegit.map((legit) => (
                <Link 
                  to={`/legit/${legit.id}`} 
                  key={legit.id} 
                  className="p-6 flex items-center gap-4 hover:bg-emerald-50/40 hover:scale-[1.02] transition-all duration-300 block"
                >
                  <img src={legit.img} alt="Avatar" className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-emerald-100 shadow-sm" />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-800 text-sm truncate">{legit.name}</span>
                      <span className="material-symbols-outlined text-primary text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{legit.role}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#2e7d32] font-black text-sm">{legit.score}/100</div>
                    <div className="text-[9px] text-[#2e7d32] font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {(legit.insurance).toLocaleString("vi-VN")}đ Quỹ
                    </div>
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
      <section className="max-w-[1400px] mx-auto px-6 mb-16">
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
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
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
